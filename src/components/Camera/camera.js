import { Fragment, useEffect, useState } from "react";
import React, { useRef } from 'react';
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import FacePaint from '../FaceMash/FacePaint';
import emptyMask from '../images/emptyMask.png';
import Canvas from '../graficEditor/GraficEditor';
import Loader from "react-loader-spinner";

import styles from './Camera.module.css';

export const Camera = props => {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const [predictions, setPredictions] = useState(null);
    useEffect(() => {
        let model, w, h;
        let faceCanvas;
        const video = videoRef.current;
        async function renderPredictions(t) {
            requestAnimationFrame(renderPredictions);
            const predictions = await model.estimateFaces(video);
            if (predictions.length > 0) {
                for (let i = 0; i < predictions.length; i++) {
                    const positionBufferData = predictions[0].scaledMesh.reduce((acc, pos) => acc.concat(pos), []);
                    if (!faceCanvas) {
                        const props = {
                            id: 'faceCanvas',
                            textureFilePath: emptyMask,
                            w,
                            h
                        }
                        faceCanvas = new FacePaint(props);
                        return faceCanvas;
                    }
                    faceCanvas.render(positionBufferData);
                }
            }
        }
        async function fetchCam() {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });
            video.srcObject = stream;
            await new Promise(function (res) {
                video.onloadedmetadata = function () {
                    w = video.videoWidth;
                    h = video.videoHeight;
                    res();
                }
            });
            model = await facemesh.load({
                maxContinuousChecks: 5,
                detectionConfidence: 0.9,
                maxFaces: 1,
                iouThreshold: 0.3,
                scoreThreshold: 0.75
            });
            let data = await renderPredictions();
            setPredictions(data)
            video.height = h;
            video.width = w;
            return data;
        }
        if (predictions !== null) {
            video.play();
            tf.env().set('WEBGL_CPU_FORWARD', false);
        } else {
            fetchCam();
        }
    }, [predictions]);
    return <Fragment>
        <div className={styles.camera}>
            <video ref={videoRef} muted={true} playsInline={true} className={styles.webcam} autoPlay={true} ></video>
            <canvas id='faceCanvas' className={styles.faceCanvas} ref={canvasRef} {...props}></canvas>
        </div>
        {predictions !== null ? <Canvas p={predictions} /> :
            <div id='loader'>
                <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100} />
            </div>}
    </Fragment>
};