import { Leva } from 'leva';
import Game from './three/game';
import Aside from './ui/aside';
import NoMobile from './ui/no-mobile';
import Splash from './ui/splash';
import Toast from './ui/toast';

function App() {
    return <>
        <Toast>⚠️ Pre Alpha Release</Toast>
        <Game />
        <Aside />
        <Splash />
        <NoMobile />
        <Leva
            flat
            hidden
        />
    </>
}

export default App
