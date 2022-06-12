import React from 'react';
import * as THREE from 'three';
import { useSpringRef } from '@react-spring/core';
import { animated, useSpring } from '@react-spring/three';
import { GroupProps, useFrame } from '@react-three/fiber';
import { cardSpringConf } from './primitives/springs';

//

interface Props extends GroupProps { }

export default function Overlay(props: Props) {

    const spring = useSpringRef();

    // Initialize spring animated parameters
    // We start the card transparent and down a little bit
    const springProps = useSpring({
        ref: spring,
        opacity: 0,
        config: cardSpringConf
    });

    // Loading animation when component mounts
    React.useEffect(() => {
        spring.start({
            from: { opacity: 0 },
            to: { opacity: .8 },
            config: cardSpringConf
        });
    }, [spring]);

    return <>
        {/* @ts-ignore */}
        <mesh
            // {...springProps}
            {...props}
            position={[0, 0, 2]}
        >
            <planeGeometry
                args={[10, 10]}
            />
            {/* @ts-ignore */}
            <animated.meshStandardMaterial
                transparent
                opacity={springProps.opacity as unknown as number}
                color='black'
            />
        </mesh>
    </>
};