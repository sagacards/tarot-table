import React from 'react';
import * as THREE from 'three';
// @ts-ignore
import structuredClone from '@ungap/structured-clone';
import { GroupProps, Size, ThreeEvent, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { animated, useSprings } from '@react-spring/three';
import { useGesture } from '@use-gesture/react';
import BaseCard from '../card';
import { cardThickeness } from '../primitives/geometry';
import useDeck from '../primitives/textures';
import useCardStore from '../../store/cards';
import { Text } from '@react-three/drei';



/////////////////////
// The Scene Root //
///////////////////


export default function CardsScene(props: GroupProps) {

    // Utilize data store.
    const { deck: _deck, cards, drawn, draw, reset, renoise, chaos, setChaos, updateCard, bump, turn, flip, hasFocus } = useCardStore();

    // I load my textures here... which means that this whole scene will suspend 🤔. I wonder why it flickers though.
    const deck = useDeck(_deck);

    // Admin UI things.
    const { debug } = useControls({
        chaos: {
            value: globalChaos,
            step: .1,
            min: 0,
            max: 1,
            onChange: v => {
                setChaos(v)
                renoise(v)
            }
        },
        debug: false,
    });

    // Setup animation springs.
    const [springs, springApi] = useSprings(cards.length, i => {
        if (drawn.includes(cards[i])) {
            return layoutCard(cards[i], cards, drawn, chaos);
        } else {
            return layoutDeck(cards[i], cards, drawn, chaos);
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
        springApi.start((i: number) => {
            if (hasFocus === i) {
                return layoutFocus(cards[i])
            } else if (drawn.includes(cards[i])) {
                return layoutCard(cards[i], cards, drawn, chaos);
            } else {
                return layoutDeck(cards[i], cards, drawn, chaos);
            }
        })

        // Make an object being dragged follow the mouse
        if (drag.current.dragging) {
            springApi.start((i: number) => {
                if (i === drag.current.i) {
                    return layoutDragged(i, state.mouse, state.viewport, cards[i], drag.current, hasFocus);
                }
            });
        }
    });

    // TODO: Cards should be an instanced mesh. I need to learn how to use instanced mesh first.

    const gestureBindings: any[] = [];
    cards.forEach((_, i) => {
        gestureBindings.push(bindGestures(drag.current, (x, y, i) => updateCard(i, mouseToWorld(x, y, camera)))(i));
    });

    if (!deck.length) return <></>
    return <group {...props}>
        {cards.map((card, i) => {
            // @ts-ignore: spring / gesture interop
            return <animated.group
                key={`keygroup${i}`}
                name={`keygroup${i}`}
                {...gestureBindings[i]}
            >
                <BaseCard
                    key={`card${i}`}
                    scale={cardScale}
                    {...springs[i]}
                    materials={<>
                        <meshStandardMaterial attachArray='material' map={deck[78].texture} />
                        <meshStandardMaterial attachArray='material' color={'#999'} />
                        <meshStandardMaterial attachArray='material' map={deck[cards[i].index].texture} />
                        {debug && <group position={[0, 0, -.01]} rotation={[0, Math.PI, 0]}><Text scale={[20, 20, 20]} color={'#AA2288'}>{card.index}</Text></group>}
                    </>}
                />
            </animated.group>
        })}
    </group>
}


///////////////////
// Scene Config //
/////////////////


export const cardScale = 0.3;
export const tableMargin = 0.1;
export const globalChaos = 0.2;
export const initialCardPosition = [2, -1.5, 0.01] as [number, number, number];
export const deckLayout = {
    position: [3, -1.5, 0] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
};


//////////////////////////////////
// Imperative Layout Functions //
////////////////////////////////


// Display cards in a tidy-ish deck
function layoutDeck(
    card: Card,
    cards: Card[],
    drawn: Card[],
    chaos: number = .1
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
    layout.position = layout.position.map((v: number, i: number) => v + card.shufflePosition[i] + card.noise.position[i])

    return layout;
};

// Display drawn cards
function layoutCard(
    card: Card,
    cards: Card[],
    drawn: Card[],
    chaos: number = .1
) {
    return {
        position: [
            card.tablePosition[0],
            card.tablePosition[1],
            card.tablePosition[2] + cardThickeness * drawn.indexOf(card),
        ] as [number, number, number],
        rotation: [0, card.flip ? 0 : Math.PI, card.turn ? Math.PI / 2 : 0] as [number, number, number],
    };
};

// Display focused card
function layoutFocus(
    card: Card
) {
    return {
        position: [
            -.5,
            -.7,
            2.25,
        ] as [number, number, number],
        rotation: [Math.PI * .05, 0, 0] as [number, number, number],
    };
};

// Position of a card being dragged
function layoutDragged(
    i: number,
    mouse: THREE.Vector2,
    viewport: Size,
    card: Card,
    drag: DragRef,
    hasFocus?: number,
) {
    const isFocus = hasFocus === i;
    const { position, rotation } = isFocus ? layoutFocus(card) : {
        position: [0, 0, (drag.z || 0) + .05] as [number, number, number],
        rotation: [0, card.flip ? 0 : Math.PI, card.turn ? Math.PI / 2 : 0] as [number, number, number]
    };
    const factor = isFocus ? .1 : 1
    return {
        position: [
            position[0] + (mouse.x * viewport.width) / 3 * factor,
            position[1] + (mouse.y * viewport.height) / 3 * factor,
            position[2]
        ],
        rotation: dragTilt(rotation, drag),
        // config: cardMovementSpringConf
    };
}


///////////////////////
// Gesture Handlers //
/////////////////////


function onCardClick(
    i: number,
    card: Card,
    drawn: Card[],
    draw: () => void,
    renoise: () => void,
    bump: (i: number) => void,
    drag: DragRef,
    flip: (i: number) => void,
    focus: (i?: number) => void,
    hasFocus?: number,
) {
    const isDrawn = drawn.includes(card);
    if (!isDrawn) {
        draw();
        renoise();
    } else {
        if (drag.dragged) {
            drag.dragged = false;
            return;
        }
        if (!card.flip) {
            flip(i);
            bump(i);
        } else {
            if (hasFocus === i) {
                focus(undefined)
            } else {
                focus(i)
            }
        }
    }
};

function bindGestures(
    dragRef: DragRef,
    drop: (x: number, y: number, i: number) => void,
) {
    const { deck: _deck, cards, drawn, draw, reset, renoise, bump, turn, flip, hasFocus, focus } = useCardStore();
    return useGesture(
        {
            // Capture mouse pos and velocity while dragging
            onDrag: ({
                velocity: [vX, vY],
                direction: [dX, dY],
                event,
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
                if (!drawn.includes(cards[i])) {
                    const card = draw()
                    dragRef.i = card;
                    dragRef.z = cardThickeness * card;
                } else {
                    dragRef.i = i;
                }
                dragRef.dragging = true;
                dragRef.dragged = true;
            },
            // Track an object being dropped
            onDragEnd({ xy: [x, y], args: [i] }) {
                if (hasFocus !== i) drop(x, y, dragRef.i as number);
                dragRef.dragging = false;
                dragRef.i = undefined;
                dragRef.z = undefined;
            },
            // Show a card in detail on right click
            onContextMenu({ event, args: [i] }) {
                event?.stopPropagation()
                if (!cards[i].flip) return;
                turn(i)
            },
            onClick({ event, args: [i] }) {
                event.stopPropagation();
                const card = cards[i]
                onCardClick(
                    i, card, drawn, draw, renoise, bump, dragRef, flip, focus, hasFocus
                )
            },
            onPointerDown({ event }) {
                event.stopPropagation()
            }
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
    order: number;
    tablePosition: [number, number, number];
    shufflePosition: [number, number, number];
    noise: {
        position: [number, number, number];
        rotation: [number, number, number];
    };
    turn: boolean;
    flip: boolean;
};

// An object for tracking drag and drop
interface DragRef {
    x: number;
    y: number;
    z?: number;
    vX: number; // velocity in px / ms
    vY: number; // velocity in px / ms
    dX: number; // direction
    dY: number; // direction
    i?: number;
    dragging: boolean;
    dragged: boolean;
    object?: THREE.Object3D;
}

// An object for tracking mouse position
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
function newDragRef() {
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

// Create a react mouse ref
function newMouseRef() {
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
        baseRotation[0] + THREE.MathUtils.clamp(
            vY * dY * factor,
            -0.25 * rangeFactor,
            0.25 * rangeFactor
        ),
        baseRotation[1] + THREE.MathUtils.clamp(
            vX * dX * factor,
            -0.25 * rangeFactor,
            0.25 * rangeFactor
        ),
        baseRotation[2]
    ];
}

// Augment rotation based on hover position
function hoverTilt(
    baseRotation: [number, number, number],
    mouse: MouseRef,
    xMax: 1,
    yMax: 1,
) {
    const { x, y } = mouse.hoverPosition;
    return [
        baseRotation[0] + x * xMax,
        baseRotation[1] + y * yMax,
        baseRotation[2],
    ]
}

// Transform mouse coordinates into world coordinates
const vec = new THREE.Vector3(); // create once and reuse
const pos = new THREE.Vector3(); // create once and reuse
function mouseToWorld(x: number, y: number, camera: THREE.Camera) {

    vec.set(
        (x / window.innerWidth) * 2 - 1,
        - (y / window.innerHeight) * 2 + 1,
        0.5
    );
    vec.unproject(camera);
    vec.sub(camera.position).normalize();

    const distance = (1.5 - camera.position.z) / vec.z;

    pos.copy(camera.position).add(vec.multiplyScalar(distance));
    return [pos.x, pos.y, .01] as [number, number, number];
};