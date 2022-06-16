import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Page } from 'screens/wrapper';
import useCardStore from 'src/store/cards';
import Game from 'three/game';
import CardDetail from 'ui/card-detail';
import GlobalLoader from 'ui/global-loader';
import Styles from './styles.module.css';

export default function GameScreen() {
    const { reset, hasFocus } = useCardStore();

    return <Page className={Styles.root}>
        <GlobalLoader />
        <AnimatePresence>
            {hasFocus && <CardDetail />}
        </AnimatePresence>
        <Game />
    </Page>
}