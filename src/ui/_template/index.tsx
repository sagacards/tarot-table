import React from 'react'
import Styles from './styles.module.css'

export interface Props { }

export default function NewComponent(props: Props) {
    return <div className={[Styles.root].join(' ')}>
        ...
    </div>
}