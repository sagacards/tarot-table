import { AnimatePresence } from 'framer-motion';
import React from 'react';
import useCardStore from 'src/store/cards';
import Game from 'three/game';
import Aside from 'ui/aside';
import CardDetail from 'ui/card-detail';
import GlobalLoader from 'ui/global-loader';
import Reset from 'ui/reset';
import Styles from './styles.module.css';

export default function GameScreen() {
    const { reset, hasFocus } = useCardStore();

    return <div className={Styles.root}>
        <GlobalLoader />
        <AnimatePresence>
            {hasFocus && <CardDetail />}
        </AnimatePresence>
        <Game />
        <Aside />
        <Reset reset={reset} />
    </div>
}