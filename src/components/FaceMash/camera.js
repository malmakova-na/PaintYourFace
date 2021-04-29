import { Fragment, useEffect, useState } from "react";
import React, { useRef} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import FacePaint from './FacePaint';
import styles from './Camera.module.css';
import emptyMask from '../images/emptyMask.png';
import Canvas from '../graficEditor/GraficEditor';
import Loader from "react-loader-spinner";



export const Camera = props => {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const [p, setP]=useState(null);
    //let faceCanvas;
    useEffect(()=>{
        let model, w, h;
        let faceCanvas;
        const video = videoRef.current;
        async function renderPredictions(t) {
            requestAnimationFrame(renderPredictions);
            const predictions = await model.estimateFaces(video);
        
            if (predictions.length > 0) {
                for	(let i = 0; i < predictions.length; i++) {
                    const positionBufferData = predictions[0].scaledMesh.reduce((acc, pos) => acc.concat(pos), []);
                    if (!faceCanvas) {
                        const props = {
                            id: 'faceCanvas',
                            textureFilePath: emptyMask,
                            w,
                            h
                        }
                        faceCanvas =  new FacePaint(props);
                        //setP(faceCanvas);
                        return faceCanvas;
                    }
                    faceCanvas.render(positionBufferData);
        
                }
            }
        }
        async function fetchCam () {
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
            let g = await renderPredictions();
            setP(g)
            video.height = h;
			video.width = w;
            return g;
        }
        if(p !== null){
            video.play();
            tf.env().set('WEBGL_CPU_FORWARD', false);
        }else{
            fetchCam();
        }
        

    }, [p]);
    return <Fragment> 
    <div className={styles.camera}>
        <video ref={videoRef} muted={true} playsInline={true}  className={styles.webcam} autoPlay={true} ></video>
         <canvas id='faceCanvas' className={styles.faceCanvas}  ref={canvasRef} {...props}></canvas>
    </div>
    {p !== null? <Canvas p ={p}/>: <div id='loader'>
        <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}

        /></div>}
    </Fragment>
};
