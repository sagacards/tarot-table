import React from 'react';
import Logo from '../../assets/logo.svg';
import Styles from './styles.module.css';

export default function Splash () {
    return <div className={Styles.root}>
        <img className={Styles.logo} src={Logo} />
        <div className={Styles.titleGroup}>
            <h1 className={Styles.title}>Tarot Table</h1>
            <div className={Styles.titleTag}>Pre-Alpha</div>
        </div>
    </div>
};