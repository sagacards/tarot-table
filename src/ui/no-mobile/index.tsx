import React from 'react';
import Styles from './styles.module.css';

export default function NoMobile () {
    return <div className={Styles.root}>
        😣 Sorry about this, but we haven't built a mobile version yet.<br />
        🙇‍♂️ If you like the app, we will make it mobile friendly soon!
    </div>
};