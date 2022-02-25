import React from 'react';
import { Navigate } from 'react-router-dom';
import Styles from './Styles.module.css';
import Splash from 'ui/splash';
import { loadDeck, loadProgress, useRWS } from 'three/primitives/textures';
import useStore from 'src/store/main';

// Provides a nice full-page splash screen with a loading bar.
interface Props {
    progress : number;
};


function Preload (props : {
    progress : (p: number) => void,
    complete : () => void,
}) {
    const { setLoading } = useStore();
    React.useEffect(() => {
        setLoading(true);
        useRWS()
        .then(d => {
            return loadProgress<THREE.Texture>(loadDeck(d), props.progress)
        })
        .then(d => {
            setLoading(false);
            props.complete();
        })
    }, []);
    return <></>
};

export default function LoadScreen (props : Props) {
    const [progress, setProgress] = React.useState(props.progress);
    const [complete, setComplete] = React.useState(false);
    const [hide, setHide] = React.useState(false);
    const [message, setMessage] = React.useState<string>();

    return <div className={[Styles.root, complete ? Styles.done : '', hide ? Styles.hide : ''].join(' ')}>
        <Preload progress={setProgress} complete={() => {
            setProgress(100);
            setMessage("Initializing a single-player table...");
            setTimeout(() => setComplete(true), 3000);
            setTimeout(() => setHide(true), 6000);
        }} />
        <Splash />
        <div className={Styles.load}>
            <div className={Styles.bar} style={{ transform: `translateX(${progress - 100}%)` }} />
        </div>
        <div className={[Styles.message, message ? Styles.messageShow : ''].join(' ')}>{message}</div>
    </div>

};