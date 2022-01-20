import React from 'react';
import useStore from '../../store/main';
import Styles from './styles.module.css';

export default function Aside () {
    const [open, setOpen] = React.useState<Boolean>(false);
    const { stoicConnect, plugConnect, connection, disconnect } = useStore();
    return <div className={[Styles.root, open ? Styles.active : ''].join(' ')}>
        <div className={Styles.backdrop}></div>
        <div className={[Styles.toggle].join(' ')} onClick={() => setOpen(!open)}>
            <div className={[Styles.toggleIcon, Styles.on].join(' ')}>💭</div>
            <div className={[Styles.toggleIcon, Styles.off].join(' ')}>🐊</div>
        </div>
        <div className={Styles.panel}>
            <div>{connection?.wallet}: {connection?.principal.toText()}</div>
            <div className={Styles.stoic}>
                <button onClick={() => stoicConnect()}>Connect Stoic</button>
            </div>
            <div className={Styles.plug}>
            <button onClick={() => plugConnect()}>Connect Plug</button>
            </div>
            <button onClick={() => disconnect()}>Disconnect</button>
        </div>
    </div>
}