import React from 'react';
import styles from './DownLoad.module.css';
import downloadIcon from '../images/download.png';

const DownLoadButton = props => <a href={props.src} download><img src={downloadIcon} className={styles.icon} alt='icon' /></a>;

export default DownLoadButton;