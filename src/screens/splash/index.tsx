import React from 'react';
import Button from 'ui/button';
import Styles from './styles.module.css';

interface Props { }

export default function SplashScreen(props: Props) {
    return <div className={Styles.root}>
        <div className={Styles.title}>
            <div>Tarot</div>
            <div>Table</div>
        </div>
        <div className={Styles.menu}>
            <Button size='large'>Begin</Button>
            <Button size='large'>My Decks</Button>
            <Button size='large'>Tutorial</Button>
        </div>
    </div>
}