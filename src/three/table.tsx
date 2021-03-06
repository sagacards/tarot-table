import { GroupProps } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';

export const tableDimensions = [8, 5, 3] as [number, number, number];

export default function Table(props: GroupProps) {
    return <>
        <mesh>
            <boxGeometry args={tableDimensions} />
            <meshStandardMaterial color={'#444'} />
        </mesh>
    </>
};