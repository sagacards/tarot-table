import React from 'react';
import * as THREE from 'three';
import useStore from '../../store/main';

const isLocal = false;
const protocol = isLocal ? 'http://' : 'https://';
const host = isLocal ? 'localhost:8000' : 'raw.ic0.app';
const canister = '6e6eb-piaaa-aaaaj-qal6a-cai';
export const url = `${protocol}${canister}.${host}`;

export default function useDeck (index = 1) {
    const [cards, setCards] = React.useState<Card[]>();
    React.useEffect(() => {
        fetch(`${url}/manifest/${index}`).then(res =>
            res.json() as unknown as Card[]
        ).then(d => {
            setCards(d);
        });
    }, [index]);
    return cards;
}

interface Card {
    index   : number;
    number  : number;
    suit    : 'trump' | 'wands' | 'swords' | 'cups' | 'pentacles';
    name    : string;
    image   : string;
};