import React from 'react';
import * as THREE from 'three';

const isLocal = false;
const protocol = isLocal ? 'http://' : 'https://';
const host = isLocal ? 'localhost:8000' : 'raw.ic0.app';
const canister = '6e6eb-piaaa-aaaaj-qal6a-cai';
export const url = `${protocol}${canister}.${host}`;

export default function useDeck (index?: number ) {
    const [cards, setCards] = React.useState<Card[]>([]);
    React.useEffect(() => {
        if (index) {
            fetch(`${url}/manifest/${index}`).then(res =>
                res.json() as unknown as Card[]
            ).then(d => {
                setCards(d.map(x => ({
                    name: x.name,
                    suit: x.suit,
                    number: x.number,
                    index: x.index,
                    image: `${url}${x.image}`,
                })));
            });
        } else {
            useRWS().then(d => {
                setCards(d.map((c, i) => ({
                    name: '',
                    suit: 'trump',
                    number: 0,
                    image: c,
                    index: i,
                })))
            })
        }
    }, [index]);
    return cards;
}

export async function useRWS () {
    const rws : string[] = [];
    for (let i = 0; i < 80; i++) {
        rws.push((await import(`../../assets/deck/${i}.webp`)).default)
    }
    return rws;
};

interface Card {
    index   : number;
    number  : number;
    suit    : 'trump' | 'wands' | 'swords' | 'cups' | 'pentacles';
    name    : string;
    image   : string;
};