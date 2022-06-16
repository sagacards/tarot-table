import { AnimatePresence } from 'framer-motion';
import React from 'react';
import LoadScreen from 'screens/load';
import { Page } from 'screens/wrapper';
import useCardStore from 'src/store/cards';
import useStore from 'src/store/main';
import Game from 'three/game';
import CardDetail from 'ui/card-detail';
import GlobalLoader from 'ui/global-loader';
import Styles from './styles.module.css';

export default function GameScreen() {
    const { hasFocus } = useCardStore();
    const { loadingProgress } = useStore();
    const isLocal = window.location.host.includes('localhost');

    return <Page className={Styles.root}>
        {!isLocal && <LoadScreen progress={loadingProgress} />}
        <GlobalLoader />
        <AnimatePresence>
            {hasFocus && <CardDetail />}
        </AnimatePresence>
        <Game />
    </Page>
}