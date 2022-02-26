import create from 'zustand';
import * as THREE from 'three';
import { Card, cardScale, globalChaos, initialCardPosition, tableMargin } from '../three/scenes/cards';
import { tableDimensions } from '../three/table';
import { cardDimensions } from '../three/primitives/geometry';


const deck = shuffle(createDeck(globalChaos));

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
    turn: (i: number) => void,
    flip: (i: number) => void,
    saveImage?: (n : string) => void,
    setSaveImage: (f : (n : string) => void) => void,
}>(set => ({
    saveImage: undefined,
    setSaveImage: (f) => set(state => ({ saveImage: f })),
    deck: undefined,
    setDeck: (i) => set(state => ({ deck : i })),
    chaos: globalChaos,
    setChaos: (chaos) => set(state => ({ chaos })),
    cards: deck,
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
    shuffle: () => set(state => ({ cards: shuffleLayout(shuffle(state.cards)) })),
    reset: () => set(state => ({ drawn: [], cards: shuffleLayout(shuffle(resetDeck(state.cards, state.chaos))) })),
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
        let prev : number;
        set(state => {
            const cards = state.cards;
            prev = cards[i].tablePosition[2];
            cards[i].tablePosition[2] = prev + 1;
        });
        setTimeout(
            () =>
                set(state => {
                    const cards = state.cards;
                    cards[i].tablePosition[2] = prev;
                }),
            100
        );
    },
    turn: (i) => set(state => {
        const cards = state.cards;
        cards[i].turn = !cards[i].turn;
    }),
    flip: (i) => set(state => {
        const cards = state.cards;
        cards[i].flip = !cards[i].flip;
    }),
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
            order: cards.length,
            tablePosition: initialCardPosition,
            shufflePosition: [0, 0, 0] as [number, number, number],
            noise: makeNoise(chaos),
            turn: false,
            flip: false,
        });
    }
    return cards;
};

// Puts cards back in the deck.
function resetDeck (deck : Card[], chaos : number) {
    for (const card of deck) {
        card.tablePosition = initialCardPosition;
        card.noise = makeNoise(chaos);
        card.turn = false;
        card.flip = false;
    };
    return deck;
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

// Fisher-Yates shuffled with some layout values.
function shuffle (array : Card[]) : Card[] {

    for (let i = 0; i < array.length; i++) {
        const card = array[i];
        const newIndex = Math.floor(Math.random() * array.length);
        const temp = array[newIndex];
        card.order = newIndex;
        temp.order = i;
    };

    array.sort((a, b) => b.order - a.order);

    return array;
}

function shuffleLayout (array : Card[]) {
    // Delay between moving each card.
    const delay = 5;

    // Move each card into its pile
    for (let i = 0; i < array.length; i++) {
        const card = array[i];
        setTimeout(() => {
            card.shufflePosition = [1 * (Math.random() > .5 ? 1 : -1), 0, 0];
        }, i * delay);
    };

    // Move each card into its new order
    for (let i = 0; i < array.length; i++) {
        setTimeout(() => {
            array.sort((a, b) => b.order - a.order);

            // Move each card into the pile
            for (let i = 0; i < array.length; i++) {
                const card = array[i];
                setTimeout(() => {
                    card.shufflePosition = [0, 0, 0];
                }, i * delay);
            };
        }, array.length * delay);
    }

    return array;
};

export default useCardStore;