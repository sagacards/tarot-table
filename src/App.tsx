import React from 'react';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@opentarot/react';
import { Leva } from 'leva';
import { useConnect } from '@opentarot/connect';
import NoMobile from 'ui/no-mobile';
import Connect from 'ui/connect';
import Modal from 'ui/modal';
import { useTopScreen } from './machines';
import { AnimatePresence } from 'framer-motion';

function App() {
    const { reconnect } = useConnect()
    React.useEffect(() => reconnect(), []);
    const { Screen } = useTopScreen();

    return <>
        {/* <Toast>⚠️ Hackathon Release</Toast> */}
        <NoMobile />
        <QueryClientProvider client={queryClient}>
            <AnimatePresence
                exitBeforeEnter
                children={<Screen />}
            />
        </QueryClientProvider>
        <Connect />
        <Modal />
        <Leva
            flat
            hidden={true}
            // hidden={!isLocal}
            collapsed
        />
    </>
}

export default App
