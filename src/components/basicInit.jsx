import { React, useState, useEffect, useRef } from 'react'
import { Button } from '@mui/material'
import '../App.css'

export default function Volume(){

    const [ volume, setVolume ] = useState(null);
    const [ value , setValue ] = useState(100);
    const inputRef = useRef();

    const handleClick = () => {
        if(volume !== undefined && volume !== null){
            volume.toggle();
        }
    };

    const handleChange = (e) => {
        if(volume !== undefined && volume !== null){
            volume.changeVolume(e.currentTarget);
            setValue(e.currentTarget.value);
        }
    }

    useEffect(()=>{
        const context = new AudioContext();

        function playSound(buffer) {
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source[source.start ? 'start' : 'noteOn'](time);
        }

        function loadSounds(obj, soundMap, callback) {
            // Array-ify
            var names = [];
            var paths = [];
            for (var name in soundMap) {
                var path = soundMap[name];
                names.push(name);
                paths.push(path);
            }
            let bufferLoader = new BufferLoader(context, paths, function(bufferList) {
                for (var i = 0; i < bufferList.length; i++) {
                    var buffer = bufferList[i];
                    var name = names[i];
                    obj[name] = buffer;
                }
                if (callback) {
                    callback();
                }
            });
            bufferLoader.load();
        }

        function initVolumeSample(){
            if (context.state === 'suspended') {
                const overlay = document.getElementById('overlay');
                overlay.className = 'visible';
                document.addEventListener('click', () => {
                    context.resume().then(() => {
                    overlay.className = 'hidden';
                    });
                }, {once: true});
                }

            if (!context.createGain)
                context.createGain = context.createGainNode;
            if (!context.createDelay)
                context.createDelay = context.createDelayNode;
        }

    },[])

    return(
        <>
            <div id="overlay">Click to play</div>
            <Button 
                onClick={handleClick}
                className='bttn01'
                variant="contained" 
                style={{ marginBottom : '3rem' }}
            >Play / Pause</Button>
            {/* <audio 
                src='./music/00_windy soul.mp3'
                controls
            ></audio> */}
            <input 
                type="range"
                ref={inputRef}
                min={0}
                max={100}
                step={0.02}
                value={value}
                onMouseUp={()=>setValue(inputRef.current.value)}
                onTouchEnd={()=>setValue(inputRef.current.value)}
                onChange={handleChange}
            />
        </>

    )
}