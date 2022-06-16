import { useConnect } from '@opentarot/connect'
import { TarotNftCollection } from '@opentarot/core'
import { useOwnedDecks } from '@opentarot/react'
import { encodeTokenIdentifier } from 'ictool'
import React from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { useQuery } from 'react-query'
import useCardStore from 'src/store/cards'
import Button from 'ui/button'
import ScrollRow from 'ui/scroll-row'
import Styles from './styles.module.css'
import Card1 from 'assets/deck/0.webp'
import Card2 from 'assets/deck/1.webp'
import Card3 from 'assets/deck/2.webp'

export interface Props { }

export default function Decks(props: Props) {
    const { connection } = useConnect()
    const owned = useOwnedDecks(connection?.principal);
    return <div className={[Styles.root].join(' ')}>
        <ScrollRow>
            <div className={Styles.scroller}>
                <DefaultDeck />
                {owned.map(d => <Deck key={`deck-${d.canister}-${d.token}`} deck={d} />)}
            </div>
        </ScrollRow>
    </div>
}


interface DeckProps {
    deck: {
        canister?: string
        token?: number;
        owner?: string;
        deck?: TarotNftCollection;
    }
}

const url = 'https://6e6eb-piaaa-aaaaj-qal6a-cai.raw.ic0.app';

function Deck(props: DeckProps) {
    const { deck, setDeck } = useCardStore();
    const cards = useQuery(
        `decks/manifest/${props.deck.canister}/${props.deck.token}`,
        () => fetch(`${url}/manifest/${props.deck.token}`)
            .then(res => res.json())
            .then(x => x.map((y: any) => `${url}/${y.image}`)
                .slice(0, 3) as string[]
            )
    )
    const identifier = React.useMemo(() => encodeTokenIdentifier(props.deck.canister as string, props.deck.token as number), [props.deck])
    const active = React.useMemo(() => identifier === deck, [deck, identifier])
    return <div className={[Styles.deck, active ? Styles.active : ''].join(' ')} onClick={() => setDeck(identifier)}>
        <figure>
            {cards.data && cards.data.map((img, i) => <img key={`img${i}`} src={img} />)}
        </figure>
        <figcaption>{props.deck.deck?.name} #{props.deck.token} {active && <BsFillCheckCircleFill />}</figcaption>
    </div>
}

function DefaultDeck() {
    const { deck, setDeck } = useCardStore();
    const active = React.useMemo(() => !deck, [deck])
    return <div className={[Styles.deck, active ? Styles.active : ''].join(' ')} onClick={() => setDeck(undefined)}>
        <figure>
            <img src={Card1} />
            <img src={Card2} />
            <img src={Card3} />
        </figure>
        <figcaption>Default Deck {active && <BsFillCheckCircleFill />}</figcaption>
    </div>
}