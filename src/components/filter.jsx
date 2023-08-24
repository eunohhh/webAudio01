import { React, useState, useEffect } from 'react'
import '../App.css'

export default function Filter({context, volume, play}){

    const [filterSet, setFilterSet] = useState(null); 
    const [checked, setChecked] = useState(false);
    const [valueF, setValueF] = useState(1);
    const [valueQ, setValueQ] = useState(0);

    const handleCheckChange = (e) => {
        setChecked(!checked);
        // Check if we want to enable the filter.
        if (e.currentTarget.checked) {
            // filterSet.type = filterSet.LOWPASS;
            filterSet.frequency.value = 5000;
            // Connect through the filter.
            volume.source.connect(filterSet);
            filterSet.connect(context.destination);
        } else {
            if(filterSet){
                filterSet.disconnect(0);
            }
        }
    };


    const handleChangeF = (e) => {
        setValueF(e.currentTarget.value);
        if(volume.currentBuffer !== null && volume.currentBuffer !== undefined){ // 클릭시 현재버퍼가 있으면

            // Clamp the frequency between the minimum value (40 Hz) and half of the
            // sampling rate.
            const minValue = 40;
            const maxValue = context.sampleRate / 2;
            // Logarithm (base 2) to compute how many octaves fall in the range.
            const numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
            // Compute a multiplier from 0 to 1 based on an exponential scale.
            let multiplier = Math.pow(2, numberOfOctaves * (e.currentTarget.value - 1.0));

            // Get back to the frequency value between min and max.
            filterSet.frequency.value = maxValue * multiplier; 

        }
    };

    const handleChangeQ = (e) => {
        setValueQ(e.currentTarget.value);
        if(filterSet){
            const qualityMultify = 30;
            filterSet.Q.value = e.currentTarget.value * qualityMultify;
        }  
    };

    useEffect(()=>{
        // Create the filter.
        if(volume.source !== null && volume.source !== undefined){ // 클릭시 현재버퍼가 있으면
            const filter = context.createBiquadFilter();
            setFilterSet(filter);
        }
    },[play])

    return(
        <div> 
            <div>
                <input 
                    type="checkbox" 
                    id="c1" 
                    checked={checked} 
                    onChange={handleCheckChange}
                    >
                </input>
                <label htmlFor="c1">Enable filter</label>
            </div>
            <div>
                <input 
                    type="range"
                    min={0}
                    max={1}
                    value={valueF} 
                    step={0.01}
                    onChange={handleChangeF}
                >
                </input>Frequency
            </div>
            <div>
            <input 
                type="range"
                min={0}
                max={1}
                value={valueQ} 
                step={0.01}
                onChange={handleChangeQ}
            >
            </input>Quality
            </div>
        </div>
    )
}