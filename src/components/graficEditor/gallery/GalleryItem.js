import React from 'react';
import classnames from 'classnames';

const GalleryItem = props => {
    return <img alt='img' className={classnames('picture', { 'selected': props.active })}
        onClick={() => props.onClick(props.src)} src={props.src} />
};
export default GalleryItem;