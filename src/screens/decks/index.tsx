import { useConnect } from '@opentarot/connect';
import { useOwnedDecks } from '@opentarot/react';
import Styles from './styles.module.css';
import Decks from 'ui/decks';
import Button from 'ui/button';
import useModalStore from 'ui/modal/store';
import ConnectModal from 'ui/modal/modals/connect';
import { useTopScreen } from 'src/machines';
import { Page } from 'screens/wrapper';

interface Props { }

export default function DeckScreen() {
    const { connection } = useConnect()
    const { open } = useModalStore();
    const { navigate } = useTopScreen();
    const owned = useOwnedDecks(connection?.principal);
    return <Page className={Styles.root}>
        <div className={Styles.title}>My Decks <div className={Styles.count}>({owned.length + 1})</div></div>
        <div className={Styles.decks}>
            <Decks />
        </div>
        <div className={Styles.actions}>
            {!connection && <div>
                To use more decks <Button size='small' onClick={() => open('Connect wallet', <ConnectModal />)}>Connect your wallet</Button>
            </div>}
            <Button onClick={() => navigate('DONE')}>Done</Button>
        </div>
    </Page>
}