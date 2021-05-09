import React, { useRef, useEffect, useState, useCallback } from 'react';
import Palette from './Palette/Palette';
import Button from '../Buttons/Button';
import LineWidthBar from './LineWidthBar/LineWidthBar';
import GalleryItem from './gallery/GalleryItem';
import DeleteButton from '../Buttons/DeleteButton';
import LoadImage from '../Buttons/LoadImage';
import DownLoadButton from '../Buttons/DownLoad';

import face from '../images/face.png'

import stylesGallery from './gallery/Gallery.module.css';
import styles from '../graficEditor/GraficEditor.module.css';

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });
    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    };
    return [storedValue, setValue];
};

const Canvas = props => {
    let [color, setColor] = useState('black');
    let [gallery, setImage] = useLocalStorage('gallery', []);
    let [paths, setPath] = useState([]);
    let [lineWidth, setLineWidth] = useState(2);
    let [modeCanvas, setMode] = useState('line');
    let [toggleItem, setToggle] = useState([]);
    const canvasRef = useRef(null);
    const draw = useCallback((canvas, colorItem, mode) => {
        let rememberPath = false;
        let points = [];
        let context = canvas.getContext('2d');
        setMode(mode);
        setColor(colorItem)
        context.globalCompositeOperation = modeCanvas === 'line' ? "source-over" : "destination-out";
        canvas.onmousemove = function drawIfPressed(e) {
            let x = e.offsetX;
            let y = e.offsetY;
            let dx = e.movementX;
            let dy = e.movementY;
            context.lineCap = "round";
            context.lineWidth = lineWidth;
            if (e.buttons > 0) {
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x - dx, y - dy);
                context.strokeStyle = colorItem;
                context.stroke();
                context.closePath();
            }
            if (rememberPath) {
                points.push({ x: x - dx, y: y - dy, color: colorItem, lineWidth: lineWidth, mode: modeCanvas })
            }
            canvas.onmouseup = (e) => {
                setPath([...paths, points])
                rememberPath = false;
            };
            canvas.onmousedown = (e) => {
                let x = e.offsetX;
                let y = e.offsetY;
                let dx = e.movementX;
                let dy = e.movementY;
                points = [];
                rememberPath = true;
                points.push({ x: x - dx, y: y - dy })
            };
        }
    }, [lineWidth, modeCanvas, paths]);


    const drawPaths = (canvas) => {
        let context = canvas.getContext('2d');
        context.lineCap = "round";
        context.clearRect(0, 0, canvas.width, canvas.height);
        paths.forEach(path => {
            context.beginPath();
            context.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
                context.lineTo(path[i].x, path[i].y);
                context.strokeStyle = path[i].color;
                context.lineWidth = path[i].lineWidth;
                context.globalCompositeOperation = path[i].mode === 'line' ? "source-over" : "destination-out";
            }
            context.stroke();
            context.closePath();
        })
    };

    const onChangeLineWidth = width => setLineWidth(width);
    const onChangeColor = color => {
        setColor(color);
        setMode('line');
    };
    const save = () => {
        const canvas = canvasRef.current;
        let dataURL = canvas.toDataURL("image/png", 1.0);
        if (localStorage.getItem('gallery') === null || localStorage.getItem('gallery').includes(dataURL) !== true) {//картинку сохраняем один раз
            setImage([...gallery, dataURL]);
        }

    };
    const clear = () => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        setPath([]);
    };
    const eraser = () => {
        console.log('eraser')
        const canvas = canvasRef.current
        draw(canvas, "rgb(255, 255, 255, 1)", 'eraser');
    };
    const undo = () => {
        const canvas = canvasRef.current;
        paths.splice(-1, 1);
        drawPaths(canvas);
    }
    const toggleStyle = (value) => {
        setToggle(value);
        props.p.updateTexture(value);
    };

    const addNewImg = (dataURL) => setImage([...gallery, dataURL]);

    const onDelete = (item) => {
        setImage(prevActions => (
            prevActions.filter(value => value !== item)
        ));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        draw(canvas, color, modeCanvas);

    }, [draw, color, gallery, modeCanvas]);

    return <section className={styles.paintWrapper}>
        <div className={stylesGallery.galleryWrapper}>
            <header className={stylesGallery.gallery__heading}>Gallery</header>
            <div className={stylesGallery.gallery}>{
                gallery.map((item, index) =>
                    <div className={stylesGallery.block} key={item}>
                        <GalleryItem key={index} src={item} onClick={toggleStyle} active={(item) === toggleItem} />
                        <div className={stylesGallery.imageTools}>
                            <DeleteButton id={item} onClick={onDelete} />
                            <DownLoadButton src={item} />
                        </div>
                    </div>)
            }</div>
            <LoadImage addNewImg={addNewImg} />
        </div>
        <div className={styles.canvasWrapper}>
            <header className={styles.canvas__heading}>Grafic Editor</header>
            <div className={styles.graficEditor}>
                <div className={styles.canvasTools}>
                    <LineWidthBar onChangeLineWidth={onChangeLineWidth} value={lineWidth} />
                    <Button onClick={eraser} id={'eraser'} text={'eraser'} />
                    <Button onClick={clear} id={'clear'} text={'clear'} />
                    <Button onClick={undo} id={'undo'} text={'undo'} />
                    <Button onClick={save} id={'save'} text={'save'} />
                </div>
                <img src={face} alt='face' className={styles.facePattern} />
                <canvas width="450" height="450" className={styles.painter} ref={canvasRef} {...props} />
                <Palette onChangeColor={onChangeColor}></Palette>
            </div>
        </div>
    </section>;
}
export default Canvas;