import React from 'react'
import { motion } from 'framer-motion'
import { getCardData } from '@opentarot/core/dist/deck-data'
import useCardStore from 'src/store/cards'
import Button from 'ui/button'
import Styles from './styles.module.css'

export interface Props {
}

export default function CardDetail(props: Props) {
    const { cards, hasFocus, focus } = useCardStore()
    const data = React.useMemo(() => hasFocus ? getCardData(cards[hasFocus].index) : undefined, [hasFocus, cards]);
    return <motion.div
        className={[Styles.root].join(' ')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
    >
        <h1 className={Styles.title}>{data?.name}</h1>
        <div className={Styles.keywords}>{data?.keywords.join(', ')}</div>
        <ul className={Styles.list}>
            {data?.meanings.light.map((x, i) => <li key={`meaning-${i}`}>{x}</li>)}
        </ul>
        <Button onClick={() => focus(undefined)}>Close</Button>
    </motion.div>
}