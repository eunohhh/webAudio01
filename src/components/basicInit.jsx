import { React, useState, useEffect, useRef } from 'react'
import { Button } from '@mui/material'
import VolumeSample from '../utils/volume-sample';
import { loadSounds, playSound } from '../utils/shared';
import Volume from './volume';
import '../App.css'

export default function BasicInit(){

    const [ suspended, setSuspended ] = useState(true);
    const [ myAudioContext, setMyAudioContext ] = useState(null);
    const [ volume, setVolume ] = useState(null);

    const overlayRef = useRef();
    const playBttnRef = useRef();

    const handleClick = () => {
        if(volume !== undefined && volume !== null){
            volume.toggle();
        }
    };

    const handleOverlayClick = () => {    
        setSuspended(false);
    };

    useEffect(()=>{
        if(suspended === false){
            const context = new AudioContext();
            setMyAudioContext(context);

            if (context.state === 'suspended') setSuspended(true);
            if (!context.createGain) context.createGain = context.createGainNode;
            if (!context.createDelay) context.createDelay = context.createDelayNode;

            context.resume()
            .then(()=>{
                setVolume(() => new VolumeSample(context, loadSounds, playBttnRef.current));
            })
        }
    },[overlayRef.current])

    return(
        <>
            <div 
                id="overlay"
                ref={overlayRef}
                className={ suspended ? 'visible' : 'hidden' }
                onClick={handleOverlayClick}
                >Click to play
            </div>

            <Button 
                onClick={handleClick}
                variant="contained"
                ref={playBttnRef}
                style={{ marginBottom : '1.5rem' }}
            >
                Play / Pause
            </Button>

            <Volume context={myAudioContext} volume={volume} />
                
            
        </>

    )
}