import { React, useState, useEffect, useRef, Fragment } from 'react'
import '../App.css'

const arr = [ 'Telephone ', 'Muffler ', 'Spring Feedback ', 'Crazy Echo ' ]

export default function Room({context, volume}){

    const [impulseArr, setImpulseArr] = useState([]); 
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [convolv, setConvolver] = useState(null);

    const handleChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setSelectedIndex(value);
    }

    const handleClick = (e) => {
        const value = parseInt(e.target.value, 10);

        if(volume.currentBuffer !== null && volume.currentBuffer !== undefined){ // 클릭시 현재버퍼가 있으면

            if (selectedIndex === value) {
                // 이미 선택된 항목을 다시 클릭하면 선택을 취소합니다.
                setSelectedIndex(null);
                // volume.source.disconnect();
                convolv.disconnect();
            } else {

                const convolver = context.createConvolver(); // 오디오 컨텍스트에 컨볼버 함수 실행

                const impulseResponseBuffer = impulseArr[e.target.value]; // 클릭한 라디오 인풋의 밸류(인덱스와 같음)값으로 임펄스어레이 선택(버퍼)

                convolver.buffer = impulseResponseBuffer; // 컨볼버노드에 버퍼 할당
                volume.source.connect(convolver); // 볼륨 객체의 현재 소스에 커넥트
                convolver.connect(context.destination); // 맨날 하는 새로 컴포넌트에서 생성한 노드에 컨텍스트 연결

                setConvolver(convolver);

                volume.convolver = convolver; // 다른 컴포넌트를 위해 볼륨 객체에 컨볼버 노드 저장?? 이게 되냐
            }
        }
    }

    useEffect(()=>{

        const timer = setTimeout(()=>{

            const impulseResponses = volume.bufferList.slice(5,volume.bufferList.length); // 컴포넌트 로드 후 버퍼리스트 인덱스 5 부터(사운드샘플) 잘라서 임펄스반응 배열로    
            setImpulseArr([...impulseResponses]); // 해당 배열 스테이트 저장
            
            clearTimeout(timer)
        }, 700)
    },[])

    return(
        <>  
            {arr.map((e,i)=>(
                <Fragment key={i}>
                    <input 
                        key={e+i}
                        type="radio" 
                        name="effectRadio"
                        value={i} 
                        className="effect"
                        checked={ selectedIndex === i }
                        onChange={handleChange}
                        onClick={handleClick}
                    >
                    </input>
                    {e}
                </Fragment>
            ))}
        </>
    )
}