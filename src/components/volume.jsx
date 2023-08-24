import { React, useState, useEffect, useRef } from 'react'
import '../App.css'

export default function Volume({context, volume}){

    const [ value , setValue ] = useState(100);
    const inputRef = useRef();

    const handleChange = (e) => {
        if(volume !== undefined && volume !== null){
            setValue(e.currentTarget.value);
            volume.changeVolume(e.currentTarget);
        }
    };

    return(
        <>
            <h3 
                className='my-3'
                style={{ marginBottom : "1.5rem" }}
            >볼륨 컨트롤러</h3>
            <input 
                type="range"
                ref={inputRef}
                min="0"
                max="100"
                // step={0.02}
                value={value}
                style={{ display : "block", margin : '0 auto' }}
                // onMouseUp={()=>setValue(inputRef.current.value)}
                // onTouchEnd={()=>setValue(inputRef.current.value)}
                onChange={handleChange}
            />
        </>

    )
}