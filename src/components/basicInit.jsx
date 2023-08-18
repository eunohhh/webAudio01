import { React, useState, useEffect, useRef } from 'react'
import Volume from './volume';
import '../App.css'

export default function BasicInit(){

    const [ suspended, setSuspended ] = useState(true);
    const [ myAudioContext, setMyAudioContext ] = useState(null);
    const overlayRef = useRef();

    const handleOverlayClick = () => {    
        setSuspended(!suspended);
    }

    useEffect(()=>{
        if(suspended === false){
            const context = new AudioContext();
            setMyAudioContext(context);

            if (context.state === 'suspended') setSuspended(true);
            if (!context.createGain) context.createGain = context.createGainNode;
            if (!context.createDelay) context.createDelay = context.createDelayNode;

            context.resume()
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
            { myAudioContext && (
                <>
                    <Volume context={myAudioContext}  />
                </>
            )}
        </>

    )
}