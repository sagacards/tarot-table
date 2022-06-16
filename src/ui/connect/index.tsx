import { useConnect } from '@opentarot/connect';
import { TbPlugConnected, TbPlugConnectedX } from 'react-icons/tb';
import { BsCamera } from 'react-icons/bs';
import { GiCardPick, GiCardExchange } from 'react-icons/gi';
import Button from 'ui/button';
import Styles from './styles.module.css';
import Spinner from 'ui/spinner';
import useModalStore from 'ui/modal/store';
import ConnectModal from 'ui/modal/modals/connect';
import useCardStore from 'src/store/cards';
import { useTopScreen } from 'src/machines';

export interface Props { }

export default function Connect(props: Props) {
    const { reset, saveImage } = useCardStore()
    const { navigate } = useTopScreen();
    const { connection, pendingConnection, disconnect } = useConnect()
    const { open } = useModalStore();
    const connectIcon = pendingConnection ? <Spinner size='small' /> : connection ? <TbPlugConnectedX size='20px' /> : <TbPlugConnected size='20px' />;
    return <div className={[Styles.root].join(' ')}>
        <Button flush children={connectIcon} onClick={() => connection ? disconnect() : open('Connect Wallet', <ConnectModal />)} />
        <Button flush children={<GiCardPick size='20px' />} onClick={() => navigate('DECKS')} />
        <Button flush children={<BsCamera size='20px' />} onClick={() => saveImage && saveImage(`Tarot Table Reading (${new Date().toLocaleString()})`)} />
        <Button flush children={<GiCardExchange size='20px' />} onClick={() => reset()} />
    </div>
}