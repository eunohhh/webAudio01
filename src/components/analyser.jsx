import { React, useState, useEffect, useRef } from 'react'
import '../App.css'

export default function Analyser({context, volume, play}){

    // const [freqs, setFreq] = useState(null);
    // const [times, setTime] = useState(null);
    const canvasRef = useRef();

    // useEffect(()=>{
    //     // Create the filter.
    //     if(volume.source !== null && volume.source !== undefined){ // 클릭시 현재버퍼가 있으면
    //         const analyserr = context.createAnalyser();

    //         analyserr.connect(context.destination);
    //         analyserr.minDecibels = -140;
    //         analyserr.maxDecibels = 0;

    //         const freq = new Uint8Array(analyserr.frequencyBinCount);
    //         const time = new Uint8Array(analyserr.frequencyBinCount);

    //         setFreq(freq);
    //         setTime(time);


    //         console.log(analyserr)

    //     }
    // },[volume])

    useEffect(()=>{
        let SMOOTHING = 0.8;
        let FFT_SIZE = 2048;
        const HEIGHT = 360;
        const WIDTH = 640;

        if(volume.source !== null && volume.source !== undefined){
            if(play){

                const analyser = context.createAnalyser();

                analyser.connect(context.destination);
                analyser.minDecibels = -140;
                analyser.maxDecibels = 0;

                const freqs = new Uint8Array(analyser.frequencyBinCount);
                const times = new Uint8Array(analyser.frequencyBinCount);

                volume.startTime = context.currentTime;
                console.log('started at', volume.offset);
                // Connect graph
                requestAnimationFrame(draw);

                function draw(){
                    volume.source.connect(analyser);
        
                    analyser.smoothingTimeConstant = SMOOTHING;
                    analyser.fftSize = FFT_SIZE;
        
                    // Get the frequency data from the currently playing music
                    analyser.getByteFrequencyData(freqs);
                    analyser.getByteTimeDomainData(times);
        
                    const width = Math.floor( 1 / freqs.length, 10);
        
                    const canvas = canvasRef.current;
                    const drawContext = canvas.getContext('2d');
                    canvas.width = WIDTH;
                    canvas.height = HEIGHT;
                    // Draw the frequency domain chart.
                    for (let i = 0; i < analyser.frequencyBinCount; i++) {
                        let value = freqs[i];
                        let percent = value / 256;
                        let height = HEIGHT * percent;
                        let offset = HEIGHT - height - 1;
                        let barWidth = WIDTH / analyser.frequencyBinCount;
                        let hue = i / analyser.frequencyBinCount * 360;
                        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
                        drawContext.fillRect(i * barWidth, offset, barWidth, height);
                    }
        
                    // Draw the time domain chart.
                    for (let i = 0; i < analyser.frequencyBinCount; i++) {
                        let value = times[i];
                        let percent = value / 256;
                        let height = HEIGHT * percent;
                        let offset = HEIGHT - height - 1;
                        let barWidth = WIDTH / analyser.frequencyBinCount;
                        drawContext.fillStyle = 'white';
                        drawContext.fillRect(i * barWidth, offset, 1, 2);
                    }
                };
            } else {
                // Stop playback
                // volume.source.stop(0);
                volume.offset += context.currentTime - volume.startTime;
                console.log('paused at', volume.Offset);
                // Save the position of the play head.
            }
        }

    },[play])

    return(
        <div>
            <h2>Visualizer</h2>
            <canvas
                ref={canvasRef}
            ></canvas>
        </div>
    
    )
}