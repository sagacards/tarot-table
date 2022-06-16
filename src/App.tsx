import React from 'react';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { queryClient } from '@opentarot/react';
import { Leva } from 'leva';
import { useConnect } from '@opentarot/connect';
import useStore from './store/main';
import GameScreen from 'screens/game';
import LoadScreen from 'screens/load';
import SplashScreen from 'screens/title';
import DeckScreen from 'screens/decks';
import NoMobile from 'ui/no-mobile';
import Toast from 'ui/toast';
import Connect from 'ui/connect';
import Modal from 'ui/modal';
import { useTopScreen } from './machines';
import { AnimatePresence } from 'framer-motion';

function App() {
    const { loadingProgress } = useStore();
    const { reconnect } = useConnect()
    const isLocal = window.location.host.includes('localhost');
    React.useEffect(() => reconnect(), []);
    const { Screen } = useTopScreen();

    return <>
        {!isLocal && <LoadScreen progress={loadingProgress} />}
        {/* <Toast>⚠️ Hackathon Release</Toast> */}
        <NoMobile />
        <QueryClientProvider client={queryClient}>
            <AnimatePresence
                exitBeforeEnter
                children={<Screen />}
            />
        </QueryClientProvider>
        <Connect />
        <Modal />
        <Leva
            flat
            hidden={true}
            // hidden={!isLocal}
            collapsed
        />
    </>
}

export default App
