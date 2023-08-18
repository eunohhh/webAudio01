import { React, useState, useEffect, useRef } from 'react'
import { Button } from '@mui/material'
import VolumeSample from '../utils/volume-sample';
import { loadSounds, playSound } from '../utils/shared';
import '../App.css'

export default function Volume({context}){

    const [ volume, setVolume ] = useState(null);
    const [ value , setValue ] = useState(100);
    const inputRef = useRef();
    const bttnRef = useRef();

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

        setVolume(() => new VolumeSample(context, loadSounds, bttnRef.current));

    },[])

    return(
        <>
            <h3 
                className='my-3'
                style={{ marginBottom : "1.5rem" }}
            >볼륨 컨트롤러</h3>
            <Button 
                onClick={handleClick}
                variant="contained"
                ref={bttnRef}
                style={{ marginBottom : '1.5rem' }}
            >Play / Pause</Button>

            <input 
                type="range"
                ref={inputRef}
                min={0}
                max={100}
                step={0.02}
                value={value}
                style={{ display : "block", margin : '0 auto' }}
                onMouseUp={()=>setValue(inputRef.current.value)}
                onTouchEnd={()=>setValue(inputRef.current.value)}
                onChange={handleChange}
            />
        </>

    )
}