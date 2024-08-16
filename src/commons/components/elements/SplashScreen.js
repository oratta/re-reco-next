import React from 'react';
import Image from "next/legacy/image";
import styles from './SplashScreen.module.css';

export default function SplashScreen() {
    return (
        <div className={styles.splashContainer}>
            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="/logo.png"
                        alt="logo image"
                        width={256}
                        height={256}
                        className={styles.rotatingImage}
                    />
                </div>
                <h1 className={styles.title}>re-reco</h1>
                <p className={styles.loadingText}>
                    Loading<span className={styles.dot1}>.</span><span className={styles.dot2}>.</span><span
                    className={styles.dot3}>.</span>
                </p>
            </div>
        </div>
    );
};