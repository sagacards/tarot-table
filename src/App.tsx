import { Leva } from 'leva';
import useCardStore from './store/cards';
import useStore from './store/main';
import Game from './three/game';
import Aside from './ui/aside';
import GlobalLoader from './ui/global-loader';
import NoMobile from './ui/no-mobile';
import Reset from './ui/reset';
import Splash from './ui/splash';
import Toast from './ui/toast';

function App() {
    const { reset } = useCardStore();
    return <>
        <Toast>⚠️ Alpha Release</Toast>
        <GlobalLoader />
        <Game />
        <Aside />
        <Splash />
        <NoMobile />
        <Reset reset={reset} />
        <Leva
            flat
            hidden
        />
    </>
}

export default App
