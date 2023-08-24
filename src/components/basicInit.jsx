import { React, useState, useEffect, useRef } from 'react'
import { Button } from '@mui/material'
import VolumeSample from '../utils/volume-sample';
import { loadSounds, playSound } from '../utils/shared';
import Volume from './volume';
import Room from './room';
import Filter from './filter';
import Analyser from './analyser';
import '../App.css'

export default function BasicInit(){

    const [ play, setPlay ] = useState(false);
    const [ suspended, setSuspended ] = useState(true);
    const [ myAudioContext, setMyAudioContext ] = useState(null);
    const [ volume, setVolume ] = useState(null);

    const overlayRef = useRef();
    const playBttnRef = useRef();

    const handleClick = () => {
        if(volume !== undefined && volume !== null){
            volume.toggle();
            setPlay(!play);
        }
    };

    const handleOverlayClick = () => {    
        setSuspended(false);
    };

    useEffect(()=>{
        if(suspended === false){
            const context = new AudioContext();

            if (context.state === 'suspended') setSuspended(true);
            if (!context.createGain) context.createGain = context.createGainNode;
            if (!context.createDelay) context.createDelay = context.createDelayNode;

            setMyAudioContext(context);

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

            {volume && myAudioContext && (
                <>
                    <Volume context={myAudioContext} volume={volume} />
                    <Room context={myAudioContext} volume={volume} />
                    <Filter context={myAudioContext} volume={volume} play={play}/>
                    <Analyser context={myAudioContext} volume={volume} play={play} />
                </>
            )}       
        </>

    )
}