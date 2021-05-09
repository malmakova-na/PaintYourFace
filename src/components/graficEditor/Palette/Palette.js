import React from 'react'
import styles from '../Palette/Palette.module.css'
const generatePalette = () => {
    let palette = [];
    for (var r = 0, max = 4; r <= max; r++) {
        for (var g = 0; g <= max; g++) {
            for (var b = 0; b <= max; b++) {
                palette.push(
                    'rgb(' + Math.round(r * 255 / max) + ", "
                    + Math.round(g * 255 / max) + ", "
                    + Math.round(b * 255 / max) + ")"
                );
            }
        }
    }
    return palette;
};
const Palette = props => {
    return <div className={styles.palette}>{generatePalette().map(color => <div key={color} style={{ backgroundColor: color }}
        className={styles.colorButton} onClick={() => props.onChangeColor(color)} />)}</div>;

};
export default Palette;