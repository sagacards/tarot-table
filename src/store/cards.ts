import create from 'zustand';
import * as THREE from 'three';
import { Card, cardScale, globalChaos, initialCardPosition, tableMargin } from '../three/scenes/cards';
import { tableDimensions } from '../three/table';
import { cardDimensions } from '../three/primitives/geometry';


// TODO: Flipped cards.
// TODO: Bumping.

const useCardStore = create<{
    deck?: number,
    setDeck: (i: number) => void,
    chaos: number,
    setChaos: (chaos : number) => void,
    cards: Card[],
    updateCard: (i : number, tablePosition: Card['tablePosition']) => void,
    drawn: Card[],
    draw: () => void,
    shuffle: () => void,
    reset: () => void,
    renoise: (all? : false) => void,
    bump: (i: number) => void,
    saveImage?: (n : string) => void,
    setSaveImage: (f : (n : string) => void) => void,
}>(set => ({
    saveImage: undefined,
    setSaveImage: (f) => set(state => ({ saveImage: f })),
    deck: undefined,
    setDeck: (i) => set(state => ({ deck : i })),
    chaos: globalChaos,
    setChaos: (chaos) => set(state => ({ chaos })),
    cards: shuffle(createDeck(globalChaos)),
    updateCard: (i, pos) => set(state => {
        const cards = state.cards;
        const bounds = [
            tableDimensions[0] / 2 - (cardDimensions[0] * cardScale) / 2 - tableMargin,
            tableDimensions[1] / 2 - (cardDimensions[1] * cardScale) / 2 - tableMargin,
        ];
        cards[i].tablePosition = [
            THREE.MathUtils.clamp(pos[0], -bounds[0], bounds[0]),
            THREE.MathUtils.clamp(pos[1], -bounds[1], bounds[1]),
            pos[2],
        ];
        return { cards };
    }),
    drawn: [],
    draw: () => set(state => ({
        drawn: [...state.drawn, state.cards[(state.cards.length - 1) - state.drawn.length]],
    })),
    shuffle: () => set(state => ({ cards: shuffle(state.cards) })),
    reset: () => set(state => ({ drawn: [], cards: shuffle(createDeck(state.chaos)) })),
    renoise: (all) => set(state => {
        const cards = state.cards;
        for (let i = state.cards.length - 1; i >= 0; i--) {
            if (all || i >= cards.length - state.drawn.length - 5) {
                cards[i].noise = makeNoise(state.chaos)
            }
        }
        return {
            cards: cards,
        }
    }),
    bump: (i) => {
        set(state => {
            console.log('bump');
            const cards = state.cards;
            cards[i].tablePosition[2] = .5;
        });
        setTimeout(
            () =>
                set(state => {
                    console.log('reset');
                    const cards = state.cards;
                    cards[i].tablePosition[2] = 0;
                }),
            100
        );
    },
}));


/////////////////////
// Deck Functions //
///////////////////


// Generate a deck of 78 tarot cards.
function createDeck (chaos : number) : Card[] {
    const cards = [];
    while (cards.length < 78) {
        cards.push({
            index: cards.length,
            tablePosition: initialCardPosition,
            noise: makeNoise(chaos),
        });
    }
    return cards;
};

// Adds minor variation to card properies for a more natural feeling.
function makeNoise (chaos : number) {
    return {
        position : [
            (.075 * chaos) * (Math.random() * 2 - 1),
            (.075 * chaos) * (Math.random() * 2 - 1),
            0,
        ] as [number, number, number],
        rotation : [
            0,
            0,
            (.075 * chaos) * (Math.random() * 2 - 1)
        ] as [number, number, number],
    };
};

// A Fisher-Yates shuffle.
function shuffle<T> (array : T[]) : T[] {
    for (let i = array.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * array.length);
        const card = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = card;
    };
    return array;
}

export default useCardStore;