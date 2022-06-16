import React from 'react';
import { createMachine } from 'xstate';
import TopMachine from './top.json';
import GameScreen from 'screens/game';
import DecksScreen from 'screens/decks';
import TitleScreen from 'screens/title';
import { useAtom } from 'jotai';
import { atomWithMachine } from 'jotai/xstate';

const screenState = atomWithMachine(() => createMachine(TopMachine));

const topMap = {
    TitleScreen,
    DecksScreen,
    GameScreen,
};

export function useTopScreen() {
    const [state, set] = useAtom(screenState);
    const Screen = React.useMemo(() => topMap[state.value], [state.value]);
    function navigate(event: string) {
        set(event);
    }
    return {
        Screen,
        navigate,
    };
}
