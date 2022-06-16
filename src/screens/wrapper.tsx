import React from 'react';
import { motion } from 'framer-motion'

interface Props { className?: string, children?: React.ReactNode }

export function Page(props: Props) {
    return <motion.div
        {...props}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    />
}