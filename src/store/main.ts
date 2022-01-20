import create from 'zustand';
import { Actor, ActorConfig, ActorSubclass, HttpAgent, HttpAgentOptions } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { StoicIdentity } from 'ic-stoic-identity';

const isLocal = window.location.host.includes('localhost');
const host = isLocal ? `http://localhost:8000` : `https://raw.ic0.app`;
const whitelist = [
    '6e6eb-piaaa-aaaaj-qal6a-cai',
];

const useStore = create<Store>(set => ({

    // Conf

    isLocal,
    host,

    // Wallets

    connection: undefined,

    plugConnect () {
        set(state => {
            // If the user doesn't have plug, send them to get it!
            if (window?.ic?.plug === undefined) {
                window.open('https://plugwallet.ooo/', '_blank');
                return;
            }
            
            window.ic.plug.requestConnect({ whitelist, host })
            .then(async () => {
                if (!window?.ic?.plug?.agent) return;
                if (!window?.ic?.plug?.createActor) return;
                const agent = await window.ic.plug.agent;
                if (isLocal) agent.fetchRootKey();
                const principal = await agent.getPrincipal();
                console.log(principal);
                state.setConnection && state.setConnection({
                    wallet: 'plug',
                    principal: principal,
                });
                state.setNewActor(async function <T>(args : NewActorArgs) {
                    return await window?.ic?.plug?.createActor<T>({
                        canisterId: args.canisterId,
                        interfaceFactory: args.interfaceFactory,
                    });
                })
            })
            .catch(e => {
                console.error('Error connecting plug...');
                console.error(e);
                state.disconnect();
            });
        })
    },
    stoicConnect () {
        set(state => {
            StoicIdentity.load().then(async (identity: any) => {
                if (identity === false) {
                    identity = await StoicIdentity.connect();
                };
                state.setConnection && state.setConnection({
                    wallet: 'stoic',
                    principal: identity.getPrincipal(),
                });
                state.setNewActor(function <T>(args : NewActorArgs) {
                    const agent = new HttpAgent({
                        identity,
                        host: state.host,
                    });
                    if (isLocal) agent.fetchRootKey();
                    const options : {
                        agentOptions : HttpAgentOptions;
                        actorOptions : ActorConfig;
                    } = {
                        agentOptions: { host: state.host },
                        actorOptions: {
                            canisterId: args.canisterId
                        },
                    };
                    return new Promise<T>(resolve => resolve(
                        Actor.createActor<T>(args.interfaceFactory, {
                            agent : agent || new HttpAgent({ ...options?.agentOptions }),
                            ...options?.actorOptions,
                        })
                    ))
                })
            })
            .catch(() => {
                console.error('Error connecting plug');
                state.disconnect();
            });
        })
    },
    disconnect () {
        set(state => {
            window.ic?.plug?.deleteAgent();
            StoicIdentity.disconnect();
            state.setConnection && state.setConnection(undefined);
            state.setNewActor(
                function (a) {
                    return new Promise (res => res(undefined));
                }
            )
        })
    },
    newActor () {
        return new Promise (res => res(undefined));
    },

    // Wallet setters

    setConnection: (c) => set(state => ({ connection: c })),
    setNewActor: (f) => set(state => ({ newActor: f })),

}));

interface Store {
    isLocal         : boolean;
    host            : string;
    connection?     : Connection;
    setConnection?  : (c?: Connection) => void;
    plugConnect     : () => void;
    stoicConnect    : () => void;
    newActor        : ActorFactory;
    setNewActor     : (f: ActorFactory) => void;
    disconnect      : () => void;
};

interface Connection {
    wallet      : 'plug' | 'stoic',
    principal   : Principal,
};

interface NewActorArgs {
    canisterId          : string,
    interfaceFactory    : IDL.InterfaceFactory,
};

type ActorFactory = <T>(a : NewActorArgs) => Promise<ActorSubclass<T> | undefined>;


export default useStore;

// This is the stuff that plug wallet extension stuffs into the global window namespace.
// I stole this for Norton: https://github.com/FloorLamp/cubic/blob/3b9139b4f2d16bf142bf35f2efb4c29d6f637860/src/ui/components/Buttons/LoginButton.tsx#L59
declare global {
    interface Window {
        ic?: {
            plug?: {
                agent: any;
                createActor: <T>(args : {
                    canisterId          : string,
                    interfaceFactory    : IDL.InterfaceFactory,
                }) => ActorSubclass<T>,
                isConnected : () => Promise<boolean>;
                createAgent : (args?: {
                    whitelist   : string[];
                    host?       : string;
                }) => Promise<undefined>;
                requestBalance: () => Promise<
                    Array<{
                        amount      : number;
                        canisterId  : string | null;
                        image       : string;
                        name        : string;
                        symbol      : string;
                        value       : number | null;
                    }>
                >;
                requestTransfer: (arg: {
                    to      : string;
                    amount  : number;
                    opts?   : {
                        fee?            : number;
                        memo?           : number;
                        from_subaccount?: number;
                        created_at_time?: {
                            timestamp_nanos: number;
                        };
                    };
                }) => Promise<{ height: number }>;
                requestConnect: (opts: any) => Promise<'allowed' | 'denied'>;
                deleteAgent: () => Promise<void>;
            };
        };
    }
}