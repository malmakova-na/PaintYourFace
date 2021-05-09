import React, { Fragment } from 'react';
import Button from './Button';

import styles from './LoadImage.module.css';

function load(props, event) {
    event.preventDefault();
    let files = event.target.files;
    let fr = new FileReader();
    fr.onloadend = () => {
        props.addNewImg(fr.result);
    }
    fr.readAsDataURL(files[0]);
}
function upload() {
    document.getElementById('input__file').click();
}
const LoadImage = props => {
    return <Fragment>
        <Button id={'loadImg'} text={'download image'} onClick={() => upload()} />
        <input type='file' className={styles.input__file} id='input__file' accept='image/*' onChange={event => load(props, event)} />
    </Fragment>
}

export default LoadImage;
