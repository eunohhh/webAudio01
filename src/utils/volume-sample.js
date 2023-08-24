export default class VolumeSample {
    constructor(context, loadSounds, button) {
        this.context = context;
        this.bufferList = [];
        this.final = [];
        loadSounds(
            context,
            this,
            { 
                // buffer : [ '/music/00_windy soul.mp3', '/music/00_windy soul.mp3' ],
                buffer1 : '/music/00_windy soul.mp3',
                buffer2 : '/music/01_beautiful, cruel.mp3',
                buffer3 : '/music/02_aoi bossa.mp3',
                buffer4 : '/music/03_espana.mp3',
                buffer5 : '/music/04_spill.mp3',
                telephone : '/music/impulse/telephone.wav',
                muffler : '/music/impulse/muffler.wav',
                spring : 'music/impulse/spring.wav',
                echo : 'music/impulse/echo.wav'
            }, 
            this.onLoaded(button)
        )        
        this.isPlaying = false;
        this.currentBuffer = null;
        this.source = null;
        this.currIndex = 0;
        this.startTime = 0;
        this.pauseTime = 0;
        this.offset = 0;  // 이 변수에는 일시정지된 시간을 저장합니다.
    }

    onLoaded(button) {
        button.removeAttribute('disabled');
    }

    playNextTrack(index = 0) {
        if (index >= this.bufferList.length) {
            return; // 모든 트랙을 재생했다면 종료
        }
    
        const buffer = this.bufferList[index];
        const source = this.context.createBufferSource();
            source.buffer = buffer;
        this.currentBuffer = buffer; // 다른 컴포넌트를 위해 buffer 할당
        this.source = source; // 다른 컴포넌트를 위해 source 도 할당

        // 다른 연결 설정 (예: gainNode 등)은 여기서 수행...
        // Crossfade Gain Node 생성
        this.crossfadeGainNode = this.context.createGain();
        // Volume Control Gain Node 생성
        this.volumeControlGainNode = this.context.createGain();

        // 노드 연결, 연결을 어떤식으로 하고 체인을 만드냐에 따라 결과가 달라질 수 있음
        source.connect(this.crossfadeGainNode);
        this.crossfadeGainNode.connect(this.volumeControlGainNode);
        this.volumeControlGainNode.connect(this.context.destination);
        
        let currTime = this.context.currentTime;
        this.startTime = currTime; // 시작 시간 기록
        let duration = buffer.duration;
        let fadeTime = 3;

        this.crossfadeGainNode.gain.linearRampToValueAtTime(0, currTime);
        this.crossfadeGainNode.gain.linearRampToValueAtTime(1, currTime + fadeTime);
        // Then fade it out.
        this.crossfadeGainNode.gain.linearRampToValueAtTime(1, currTime + duration - fadeTime);
        this.crossfadeGainNode.gain.linearRampToValueAtTime(0, currTime + duration);
        
        source.onended = () => {
            let nextIndex = index + 1
            this.playNextTrack(nextIndex); // 현재 트랙이 끝나면 다음 트랙 재생
            this.currIndex = nextIndex; // 바뀐 인덱스 저장
        };
        
        source.start(index, this.offset);

        currTime += duration - fadeTime;  // 1 is fadetime, start() 이후에 수행?      

        this.currentSource = source; // 현재 재생 중인 source를 저장
        this.isPlaying = true;

        // console.log(source)
    }

    stop() {
        if (this.currentSource) {

            // 일시정지 시간 기록
            this.pauseTime = this.context.currentTime;
            // 얼마나 재생되었는지 계산하여 오프셋에 저장
            this.offset += this.pauseTime - this.startTime;

            this.currentSource.onended = null; // stop() 함수는 onEnded 콜백도 트리거할 수 있으므로, 이를 방지히기위해 null 설정
            this.currentSource.stop();
            this.currentSource = null;
        }
        this.isPlaying = false;
    }

    toggle() {
        if (this.isPlaying) {
            console.log('playing?')
            this.stop();
            this.isPlaying = false; 
        } else {
            console.log('stoped')
            this.playNextTrack(this.currIndex);
            this.isPlaying = true; 
        }
    }

    play() {
        function createSource(buffer, context) {
            let source = context.createBufferSource();
            let gainNode = context.createGain();
            source.buffer = buffer;
            // Connect source to gain.
            source.connect(gainNode);
            // Connect gain to destination.
            gainNode.connect(context.destination);
        
            return {
                source: source,
                gainNode: gainNode
            };
        }
        
        let currTime = this.context.currentTime;
        for(let i = 0; i < this.bufferList.length; i++){
            let buffer = this.bufferList[i];
            let duration = buffer.duration;
            let fadeTime = 3;
            let info = createSource(buffer, this.context);
            let source = info.source;
            let gainNode = info.gainNode;

                gainNode.gain.linearRampToValueAtTime(0, currTime);
                gainNode.gain.linearRampToValueAtTime(1, currTime + fadeTime);
                // Then fade it out.
                gainNode.gain.linearRampToValueAtTime(1, currTime + duration - fadeTime);
                gainNode.gain.linearRampToValueAtTime(0, currTime + duration);

            this.source = source;

                source[source.start ? 'start' : 'noteOn'](currTime);

                // Increment time for the next iteration.
                currTime += duration - fadeTime;  // 1 is fadetime        
        }
        
        this.currTime = currTime;
    }

    changeVolume(element) {
        const fraction = parseInt(element.value) / parseInt(element.max);
        // Let's use an x*x curve (x-squared) since simple linear (x) does not
        // sound as good.
        this.volumeControlGainNode.gain.value = fraction * fraction;
    }
}