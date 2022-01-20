import React from 'react';
import Styles from './styles.module.css';

interface Props {
    children?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    size?: "lg";
};

export default function Button ({
    children,
    size,
    ...props
} : Props) {
    return <div className={[Styles.root, size ? Styles[`size-${size}`] : ''].join(' ')} {...props}>
        {children}
    </div>
};