import { React, useState, useEffect, useRef } from 'react'
import RoomEffectsSample from '../utils/roomEffect';
import '../App.css'

const arr = [ 'Telephone ', 'Muffler ', 'Spring Feedback ', 'Crazy Echo ' ]

export default function Room(){

    // const [roomEffect, setRoomEffect] = useState(null);
    const [value, setValue] = useState(null);

    const handleChange = (e) => {
        let value = e.target.value;
        setValue(value);
    };

    useEffect(()=>{

        new RoomEffectsSample(value);
        // setRoomEffect(() => new RoomEffectsSample())

        // return () => {

        // }

    },[value])

    return(
        <>  
            {arr.map((e,i)=>(
                <input 
                    type="radio" 
                    name="ir" 
                    value={i} 
                    className="effect" 
                    checked=""
                >
                {e}
                </input>
            ))}
        </>
    )
}