import { React, useState, useEffect, useRef } from 'react'
import { Button } from '@mui/material'
import useScript from './usescript'
import VolumeSample from '../utils/volume-sample'
import { initVolumeSample, context } from '../utils/shared'
import '../App.css'

export default function Volume(){

    const shared = '/shared.js'
    const [ volume, setVolume ] = useState(null);
    const [ value , setValue ] = useState(100);
    const inputRef = useRef();
    // const [ loading, error ] = useScript(shared, 'afterbegin');

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
            initVolumeSample();
            if(context.state !== 'suspended'){

        }
        setVolume(() => new VolumeSample());

        console.log(volume)
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