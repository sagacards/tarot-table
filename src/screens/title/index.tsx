import React from 'react';
import { Page } from 'screens/wrapper';
import { useTopScreen } from 'src/machines';
import Button from 'ui/button';
import Styles from './styles.module.css';

interface Props { }

export default function TitleScreen() {
    const { navigate } = useTopScreen();
    return <Page className={Styles.root}>
        <div className={Styles.title}>
            <div>Tarot</div>
            <div>Table</div>
        </div>
        <div className={Styles.menu}>
            <Button size='large' onClick={() => navigate('GAME')}>Begin</Button>
            {/* <Button size='large' onClick={() => navigate('DECKS')}>My Decks</Button> */}
            {/* <Button size='large'>Tutorial</Button> */}
        </div>
    </Page>
}