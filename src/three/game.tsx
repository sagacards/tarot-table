import React from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { OrbitControls } from '@react-three/drei';
import Styles from './styles.module.css';
import DefaultLightingRig from './primitives/lights';
import Table from './table';
import CardsScene from './scenes/cards';

export default function Game () {

    return <div className={Styles.root}>
        <Canvas dpr={window.devicePixelRatio}>
            <React.Suspense fallback={<></>}>
                <RootScene />
            </React.Suspense>
        </Canvas>
    </div>
};

function RootScene () {
    const { controls } = useControls({
        controls: false,
    })
    const { camera } = useThree();
    React.useEffect(() => {
        camera.position.set(0, -1, 5);
        camera.lookAt(0, 0, 0);
    }, []);
    return <>
        <CardsScene position={[0, 0, 1.5]} />
        <Table />
        <DefaultLightingRig />
        {controls && <OrbitControls />}
    </>
};