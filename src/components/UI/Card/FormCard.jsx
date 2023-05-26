import React from 'react';
import styles from "./FormCard.module.css";

const FormCard = props => {
    return (
        <div className={`${styles.card} ${props.className}`}>
            {props.children}
        </div>
    );
    }

export default FormCard