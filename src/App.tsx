import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Leva } from 'leva';
import useStore from './store/main';
import NoMobile from './ui/no-mobile';
import Toast from './ui/toast';
import GameScreen from './screens/game';
import LoadScreen from './screens/load';

function App() {
    const { loadingProgress } = useStore();

    return <>
        <LoadScreen progress={loadingProgress} />
        <Toast>⚠️ Pre-Alpha Release</Toast>
        <NoMobile />
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GameScreen />} />
            </Routes>
        </BrowserRouter>
        <Leva
            flat
            hidden
        />
    </>
}

export default App
