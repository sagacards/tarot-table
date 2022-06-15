import React from 'react';
import { useConnect } from '@opentarot/connect';
import useCardStore from '../../store/cards';
import Button from '../button';
import Styles from './styles.module.css';
import { useOwnedDecks } from '@opentarot/react';

export default function Aside() {

    const { setDeck, saveImage } = useCardStore();
    const { connection, disconnect, connectStoic, connectPlug } = useConnect();

    const [open, setOpen] = React.useState<Boolean>(false);
    const decks = useOwnedDecks(connection?.principal)

    return <div className={[Styles.root, open ? Styles.active : ''].join(' ')}>
        <div className={Styles.backdrop} onClick={() => setOpen(!open)}></div>
        <div className={[Styles.toggle].join(' ')} onClick={() => setOpen(!open)}>
            <div className={[Styles.toggleIcon, Styles.on].join(' ')}>💭</div>
            <div className={[Styles.toggleIcon, Styles.off].join(' ')}>🐊</div>
        </div>
        <div className={Styles.panel}>
            {
                connection
                    ? <div className={Styles.section}>
                        <div>{connection.wallet}: {connection.principal.toText()}</div>
                        <Button onClick={() => disconnect()}>Disconnect</Button>
                        <div>Decks</div>
                        {decks && decks.map(d => <div style={{ cursor: 'pointer' }} key={`decks${d}`} onClick={() => console.log('set deck', d)}>
                            {d?.deck?.name} (#{d.token})
                        </div>)}
                    </div>
                    : <div className={Styles.section}>
                        <div className={Styles.stoic}>
                            <Button onClick={() => connectStoic()}>Connect Stoic</Button>
                        </div>
                        <div className={Styles.plug}>
                            <Button onClick={() => connectPlug()}>Connect Plug</Button>
                        </div>
                    </div>
            }
            <div className={Styles.section}>
                <Button onClick={() => { saveImage && saveImage(`Tarot Table Reading (${new Date().toLocaleString()})`) }}>📸 Capture</Button>
            </div>
        </div>
    </div>
}