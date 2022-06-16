import { useConnect } from '@opentarot/connect'
import React from 'react'
import Button from 'ui/button'
import useModalStore from 'ui/modal/store'
import Styles from './styles.module.css'

export interface Props { }

export default function ConnectModal(props: Props) {
    const { connection, connectPlug, connectStoic, pendingConnection } = useConnect()
    const { close } = useModalStore()
    React.useEffect(() => connection && close(), [connection])
    return <div className={[Styles.root].join(' ')}>
        <Button
            size='large'
            onClick={connectPlug}
            disabled={pendingConnection}
            loading={pendingConnection}
        >Connect Plug</Button>
        <Button
            size='large'
            onClick={connectStoic}
            disabled={pendingConnection}
            loading={pendingConnection}
        >Connect Stoic</Button>
    </div>
}