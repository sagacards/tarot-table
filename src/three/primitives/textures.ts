import { decodeTokenIdentifier } from 'ictool';
import React from 'react';
import useStore from 'src/store/main';
import * as THREE from 'three';

const isLocal = false;
const protocol = isLocal ? 'http://' : 'https://';
const host = isLocal ? 'localhost:8000' : 'raw.ic0.app';

export const loader = new THREE.TextureLoader();
export const textures: THREE.Texture[] = [];

export function loadDeck(cardURIs: string[]) {
    const promises: Promise<THREE.Texture>[] = [];
    let i = 0;
    for (const uri of cardURIs) {
        promises.push(
            new Promise(resolve => {
                textures[i] = loader.load(uri, resolve);
            })
        );
        i++;
    }
    return promises;
}

export function loadProgress<T>(
    promises: Promise<T>[],
    callback: (percent: number) => void
) {
    let d = 0;
    callback(0);
    for (const p of promises) {
        p.then(() => {
            d++;
            callback((d * 100) / promises.length);
        });
    }
    return Promise.all(promises);
}

export default function useDeck(identifier?: string) {
    const token = React.useMemo(
        () =>
            identifier !== undefined
                ? decodeTokenIdentifier(identifier)
                : undefined,
        []
    );
    const [cards, setCards] = React.useState<Card[]>([]);
    const { setLoading, setLoadingProgress } = useStore();
    React.useEffect(() => {
        setLoading(true);
        const rws = useRWS();
        const deck: Promise<string[]> =
            token?.index !== undefined
                ? fetch(
                      `${protocol}${token?.canister}.${host}/manifest/${token?.index}`
                  )
                      .then(res => res.json())
                      .then(x => {
                          return x.map(
                              (y: any) =>
                                  `${protocol}${token?.canister}.${host}/${y.image}`
                          );
                      })
                : rws;
        deck.then(d => {
            return loadProgress<THREE.Texture>(loadDeck(d), setLoadingProgress);
        }).then(d => {
            setLoading(false);
            setCards(
                d.map((c, i) => ({
                    name: '',
                    suit: 'trump',
                    number: 0,
                    index: i,
                    image: '',
                    texture: textures[i],
                }))
            );
        });
    }, [token]);
    return cards;
}

export async function useRWS() {
    const rws: string[] = [];
    for (let i = 0; i < 80; i++) {
        rws.push((await import(`../../assets/deck/${i}.webp`)).default);
    }
    return rws;
}

interface Card {
    index: number;
    number: number;
    suit: 'trump' | 'wands' | 'swords' | 'cups' | 'pentacles';
    name: string;
    image: string;
    texture: THREE.Texture;
}
