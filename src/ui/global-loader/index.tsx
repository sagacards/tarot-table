import React from 'react';
import Styles from './styles.module.css';
import useStore from '../../store/main';

export default function GlobalLoader () {
    const { loading } = useStore();
    return <>
        {loading && <div className={Styles.root}>
            <div className={Styles.spinner}>Loading...</div>
        </div>}
    </>
};