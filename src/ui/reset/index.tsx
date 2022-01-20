import React from 'react';
import Styles from './styles.module.css';

export default function Reset (props : { reset : () => void }) {
    return <div className={Styles.toggle} onClick={props.reset}>
        <div className={Styles.toggleIcon}>🔄</div>
    </div>
};