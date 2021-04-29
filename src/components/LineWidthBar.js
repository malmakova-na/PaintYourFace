import React from 'react';


import styles from '../components/graficEditor/gallery/Gallery.module.css';
const LineWidthBar = props => {
    return(
        <div>
            <header className={styles.lineBarHeader}>Line Width</header>
            <input type='range' step='1' min='2' max='20' value={props.value} onChange={event => props.onChangeLineWidth(event.target.value)} />
        </div>
    );
};
export default LineWidthBar;