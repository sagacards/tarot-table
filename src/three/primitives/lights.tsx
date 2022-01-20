import React from 'react';
import * as THREE from 'three';

const atmospheres = [
    <hemisphereLight args={["#D29B36", "#E8D66B"]} intensity={1} />,
    <hemisphereLight args={["#8FDFEC", "#AFEFEF"]} intensity={1} />,
    <hemisphereLight args={["#713463", "#B3465D"]} intensity={1} />,
    <hemisphereLight args={["#853AFF", "#0098ED"]} intensity={1} />
];

const center = new THREE.Object3D();
center.position.x = 0;
center.position.y = 0;
center.position.z = 0;

export default function DefaultLightingRig () {
    const atmosphere = React.useMemo(() => {
        return atmospheres[Math.floor(atmospheres.length * Math.random())];
    }, []);
    return <>
        <directionalLight
            position={[0, 5, 5]}
            target={center}
            intensity={1}
        />
        {atmosphere}
    </>
};