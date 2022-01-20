import { ActorSubclass } from '@dfinity/agent';
import React from 'react';
import { InternetComputerNFTCanister } from '../../ic/canisters/chaos-decks/chaos-decks.did';
import useCardStore from '../../store/cards';
import useStore from '../../store/main';
import Button from '../button';
import Styles from './styles.module.css';

export default function Aside () {
    const { stoicConnect, plugConnect, connection, disconnect, actors : { chaos } } = useStore();
    const { setDeck } = useCardStore();

    const [open, setOpen] = React.useState<Boolean>(false);
    const [decks, setDecks] = React.useState<number[]>();

    React.useEffect(() => {
        if (!chaos) {
            setDecks([]);
            return;
        };
        const c = chaos as ActorSubclass<InternetComputerNFTCanister>;
        c.decks().then(setDecks);
    }, [chaos]);
    
    return <div className={[Styles.root, open ? Styles.active : ''].join(' ')}>
        <div className={Styles.backdrop} onClick={() => setOpen(!open)}></div>
        <div className={[Styles.toggle].join(' ')} onClick={() => setOpen(!open)}>
            <div className={[Styles.toggleIcon, Styles.on].join(' ')}>💭</div>
            <div className={[Styles.toggleIcon, Styles.off].join(' ')}>🐊</div>
        </div>
        <div className={Styles.panel}>
            {
                connection
                    ? <div className={Styles.section}>
                        <div>{connection.wallet}: {connection.principal.toText()}</div>
                        <Button onClick={() => disconnect()}>Disconnect</Button>
                        <div>Decks</div>
                        {decks && decks.map(d => <div style={{cursor: 'pointer'}} key={`decks${d}`} onClick={() => setDeck(d)}>
                            Chaos Deck (#{d + 1})
                        </div>)}
                    </div>
                    : <div className={Styles.section}>
                        <div className={Styles.stoic}>
                            <Button onClick={() => stoicConnect()}>Connect Stoic</Button>
                        </div>
                        <div className={Styles.plug}>
                            <Button onClick={() => plugConnect()}>Connect Plug</Button>
                        </div>
                    </div>
            }
        </div>
    </div>
}