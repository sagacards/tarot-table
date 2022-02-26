import React from 'react';
import useCardStore from 'src/store/cards';
import Styles from './styles.module.css';

export default function Reset (props : { reset : () => void }) {
    const { reset, shuffle } = useCardStore()
    return <>
        <div className={Styles.toggle} onClick={reset}>
            <div className={Styles.toggleIcon}>🔄</div>
        </div>
        <div className={Styles.toggle} style={{ transform: 'translateX(60px)' }} onClick={shuffle}>
            <div className={Styles.toggleIcon}>🔀</div>
        </div>
    </>
};