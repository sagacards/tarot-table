import React from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { OrbitControls } from '@react-three/drei';
import Styles from './styles.module.css';
import DefaultLightingRig from './primitives/lights';
import Table from './table';
import CardsScene from './scenes/cards';
import useCardStore from '../store/cards';
import Overlay from './overlay';

export default function Game() {
    return <div className={Styles.root}>
        <Canvas dpr={window.devicePixelRatio}>
            <React.Suspense fallback={<></>}>
                <RootScene />
            </React.Suspense>
        </Canvas>
    </div>
};

function RootScene() {
    const { controls } = useControls({
        controls: false,
    })
    const { gl, scene, camera } = useThree();
    const { setSaveImage, hasFocus, focus } = useCardStore();

    async function saveImage(name: string) {
        gl.domElement.getContext('webgl', { preserveDrawingBuffer: true });
        gl.render(scene, camera);
        await gl.domElement.toBlob(
            async function (blob) {
                if (!blob) return;
                var a = document.createElement('a');
                var url = await URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                await a.click();
            },
            'image/png',
            1.0
        )
        gl.domElement.getContext('webgl', { preserveDrawingBuffer: false });

    }

    React.useEffect(() => {
        camera.position.set(0, -1, 5);
        camera.lookAt(0, 0, 0);
        setSaveImage(saveImage);
        scene.background = null;
    }, []);

    return <>
        <CardsScene position={[0, 0, 1.51]} />
        {hasFocus && <Overlay onPointerDown={() => focus(undefined)} />}
        <Table />
        <DefaultLightingRig />
        <Skybox />
        {controls && <OrbitControls />}
    </>
};

function Skybox() {
    return <mesh>
        <sphereGeometry args={[100,]} />
        <meshStandardMaterial color={'#333'} side={THREE.BackSide} />
    </mesh>
};