import React from 'react';
import * as THREE from 'three';
// @ts-ignore
import structuredClone from '@ungap/structured-clone';
import { GroupProps, ThreeEvent, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { animated, useSprings } from '@react-spring/three';
import { useGesture } from '@use-gesture/react';
import BaseCard from '../card';
import { cardThickeness } from '../primitives/geometry';;
import useDeck, { url } from '../primitives/textures';
import useCardStore from '../../store/cards';



/////////////////////
// The Scene Root //
///////////////////


export default function CardsScene (props: GroupProps) {

    // Utilize data store.
    const { deck : _deck, cards, drawn, draw, reset, renoise, chaos, setChaos, updateCard, bump } = useCardStore();

    const deck = useDeck(_deck);
    const textures = deck ? useLoader(THREE.TextureLoader, deck.map(x => x.image)) : [];

    // Admin UI things.
    useControls({
        chaos: {
            value: globalChaos,
            step: .1,
            min: 0,
            max: 1,
            onChange: v => {
                setChaos(v)
                renoise(v)
            }
        }
    });

    // Setup animation springs.
    const [springs, springApi] = useSprings(cards.length, i => {
        const card = cards[i];
        if (drawn.includes(card)) {
            return layoutCard(card, cards, drawn, chaos);
        } else {
            return layoutDeck(card, cards, drawn, chaos);
        }
    });

    // Refs.
    const drag = newDragRef();
    const mouse = newMouseRef();
    
    const { camera } = useThree();

    // Imperative animation loop
    useFrame(state => {

        // Update mouse position
        mouse.current.position.x = state.mouse.x;
        mouse.current.position.y = state.mouse.y;

        // Interpolate standard card positions
        springApi.start(i => {
            const card = cards[i];
            if (drawn.includes(card)) {
                return layoutCard(card, cards, drawn, chaos);
            } else {
                return layoutDeck(card, cards, drawn, chaos);
            }
        })

        // Make an object being dragged follow the mouse
        if (drag.current.dragging) {
            springApi.start((i) => {
                if (i === drag.current.i) {
                    return {
                        position: [
                            (state.mouse.x * state.viewport.width) / 3,
                            (state.mouse.y * state.viewport.height) / 3,
                            .125
                        ],
                        rotation: dragTilt([0, 0, 0], drag.current),
                        // config: cardMovementSpringConf
                    };
                }
            });
        }
    });

    // TODO: Cards should be an instanced mesh. I need to learn how to use instanced mesh first.

    return <group {...props}>
        {cards.map((card, i) => {
            // @ts-ignore: spring / gesture interop
            return <animated.group
                key={`keygroup${i}`}
                name={`keygroup${i}`}
                {...bindGestures(drag.current, (x, y) => updateCard(i, mouseToWorld(x, y, camera)))(i)}
            >
                <BaseCard
                    key={`card${card.index}`}
                    scale={cardScale}
                    {...springs[i]}
                    onClick={e => onCardClick(e, card, cards, drawn, draw, renoise, bump, reset)}
                    materials={<>
                        <meshStandardMaterial attachArray='material' map={textures[78]} />
                        <meshStandardMaterial attachArray='material' color={'#999'} />
                        <meshStandardMaterial attachArray='material' map={textures[card.index]} />
                    </>}
                />
            </animated.group>
        })}
    </group>
}


///////////////////
// Scene Config //
/////////////////


export const cardScale = 0.5;
export const tableMargin = 0.1;
export const globalChaos = 0.2;
export const initialCardPosition = [1.2, -1, 0.01] as [number, number, number];
export const deckLayout = {
    position: [2.8, -1, 0] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
};


//////////////////////////////////
// Imperative Layout Functions //
////////////////////////////////


// Display cards in a tidy-ish deck
function layoutDeck (
    card : Card,
    cards : Card[],
    drawn : Card[],
    chaos : number = .1
) {
    const index = cards.indexOf(card);

    if (drawn.includes(card)) {
        throw new Error('A drawn card cannot be part of the deck.');
    } else if (index < 0) {
        throw new Error('Cannot layout a card which does not appear in the deck.');
    };

    // Start with default deck position
    let layout = structuredClone(deckLayout);

    // Raise the card above others below it
    layout.position[2] += index * cardThickeness;

    // Add noise
    layout.rotation = layout.rotation.map((v: number, i: number) => v + card.noise.rotation[i])
    layout.position = layout.position.map((v: number, i: number) => v + card.noise.position[i])
    
    return layout;
};

// Display drawn cards
function layoutCard (
    card : Card,
    cards : Card[],
    drawn : Card[],
    chaos : number = .1
) {
    return {
        position: [
            card.tablePosition[0],
            card.tablePosition[1],
            card.tablePosition[2] + cardThickeness * drawn.indexOf(card),
        ] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
    };
};


///////////////////////
// Gesture Handlers //
/////////////////////


function onCardClick (
    event   : ThreeEvent<MouseEvent>,
    card    : Card,
    cards   : Card[],
    drawn   : Card[],
    draw    : () => void,
    renoise : () => void,
    bump    : (i : number) => void,
    reset   : () => void,
) {
    console.log(event.sourceEvent.type)
    event.stopPropagation();
    const isDrawn = drawn.includes(card);
    switch (event.sourceEvent.type) {
        case 'click':
            if (!isDrawn) {
                // TODO: This doesn't work
                // bump(drawn.length);
                draw();
                renoise();
            }
            break;
        case 'contextmenu':
            if (!isDrawn) {
                reset();
            }
            break;
    }
};

function bindGestures (
    dragRef : DragRef,
    drop : (x: number, y: number) => void,
) {
    return useGesture(
        {
            // Capture mouse pos and velocity while dragging
            onDrag: ({
                velocity: [vX, vY],
                direction: [dX, dY],
                event
            }) => {
                const e = (event as unknown) as ThreeEvent<MouseEvent>;
                event.stopPropagation();
                dragRef.x = e.point.x; // threejs units
                dragRef.y = e.point.y; // threejs units
                dragRef.vX = vX; // px / ms
                dragRef.vY = vY; // px / ms
                dragRef.dX = dX;
                dragRef.dY = dY;
            },
            // Track an object being dragged
            onDragStart({ args: [i] }) {
                if (dragRef.dragging) return;
                dragRef.i = i;
                dragRef.dragging = true;
                dragRef.dragged = true;
            },
            // Track an object being dropped
            onDragEnd({ xy: [x, y] }) {
                drop(x, y);
                dragRef.dragging = false;
                dragRef.i = undefined;
            },
        },
        {
            drag: {
                threshold: [10, 10],
                pointer: {
                    touch: true
                }
            }
        }
    );
}


/////////////////
// Data Types //
///////////////


export interface Card {
    index: number;
    tablePosition: [number, number, number];
    noise: {
        position: [number, number, number];
        rotation: [number, number, number];
    };
};

// An object for tracking drag and drop
interface DragRef {
    x: number;
    y: number;
    vX: number; // velocity in px / ms
    vY: number; // velocity in px / ms
    dX: number; // direction
    dY: number; // direction
    i?: number;
    dragging: boolean;
    dragged: boolean;
    object?: THREE.Object3D;
}

// Am object for tracking mouse position
interface MouseRef {
    position: {
        x: number;
        y: number;
    };
    hoverPosition: {
        x: number;
        y: number;
    };
    object?: THREE.Object3D;
}


////////////
// Utils //
//////////

// Create a react drag ref
function newDragRef () {
    return React.useRef<DragRef>({
        x: 0,
        y: 0,
        vX: 0,
        vY: 0,
        dX: 0,
        dY: 0,
        object: undefined,
        dragging: false,
        dragged: false
    });
};

// Create a react mosue ref
function newMouseRef () {
    return React.useRef<MouseRef>({
        hoverPosition: { x: 0, y: 0 },
        position: { x: 0, y: 0 },
        object: undefined
    });
}

// Augment rotation based on drag velocity
function dragTilt(
    baseRotation: [number, number, number],
    drag: DragRef,
    factor = 1,
    rangeFactor = .25,
) {
    const { vX, vY, dX, dY } = drag;
    return [
        THREE.MathUtils.clamp(
            baseRotation[0] + vY * dY * factor,
            -0.25 * rangeFactor,
            0.25 * rangeFactor
        ),
        THREE.MathUtils.clamp(
            baseRotation[1] + (vX * dX * factor),
            (-0.25 + baseRotation[1]) * rangeFactor,
            (0.25 + baseRotation[1]) * rangeFactor
        ),
        baseRotation[2]
    ];
}

// Transform mouse coordinates into world coordinates
const vec = new THREE.Vector3(); // create once and reuse
const pos = new THREE.Vector3(); // create once and reuse
function mouseToWorld (x : number, y : number, camera : THREE.Camera) {

    vec.set(
        ( x / window.innerWidth ) * 2 - 1,
        - ( y / window.innerHeight ) * 2 + 1,
        0.5
    );
    vec.unproject(camera);
    vec.sub(camera.position).normalize();

    const distance = (1.5 - camera.position.z) / vec.z;

    pos.copy(camera.position).add(vec.multiplyScalar(distance));
    return [pos.x, pos.y, .01] as [number, number, number];
};