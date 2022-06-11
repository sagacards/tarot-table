import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Leva } from 'leva';
import useStore from './store/main';
import NoMobile from './ui/no-mobile';
import Toast from './ui/toast';
import GameScreen from './screens/game';
import LoadScreen from './screens/load';
import SplashScreen from './screens/splash';

function App() {
    const { loadingProgress } = useStore();
    const isLocal = window.location.host.includes('localhost');

    return <>
        {!isLocal && <LoadScreen progress={loadingProgress} />}
        <Toast>⚠️ Hackathon Release</Toast>
        <NoMobile />
        <BrowserRouter>
            <Routes>
                <Route path="/splash" element={<SplashScreen />} />
                <Route path="/" element={<GameScreen />} />
            </Routes>
        </BrowserRouter>
        <Leva
            flat
            hidden={!isLocal}
            collapsed
        />
    </>
}

export default App
