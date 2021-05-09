import React from 'react';
import GalleryItem from './GalleryItem';

import styles from '../gallery/Gallery.module.css';

const Gallery = props => <div className={styles.gallery - wrapper}>
    <div class="paint__heading">Grafic Editor</div>
    <div className={styles.gallery}>{
        props.gallery.map((item, index) =>
            <div className={styles.block} key={item}>
                <GalleryItem key={index} src={item} onClick={toggleStyle} active={(item) === toggleItem} />
                <DeleteButton id={item} onClick={onDelete} className={styles.deleteButton} />
            </div>)
    }</div>
    <LoadImage addNewImg={props.addNewImg} />
</div>

export default Gallery;