export default class RoomEffectsSample {
    constructor(value, buffers) {
        let ctx = this;
        // for (let i = 0; i < inputs.length; i++) {
        //     inputs[i].addEventListener('change', function (e) {
        //         let value = e.target.value;
                ctx.setImpulseResponse(value);
        //     });
        // }

        this.impulseResponses = [];
        this.buffer = null;

        // Load all of the needed impulse responses and the actual sample.
        // let loader = new BufferLoader(context, [
        //     "sounds/speech.mp3",
        //     "sounds/impulse-response/telephone.wav",
        //     "sounds/impulse-response/muffler.wav",
        //     "sounds/impulse-response/spring.wav",
        //     "sounds/impulse-response/echo.wav"
        // ], onLoaded);

        // function onLoaded(buffers) {
            ctx.buffer = buffers[0];
            ctx.impulseResponses = buffers.splice(1);
            ctx.impulseResponseBuffer = ctx.impulseResponses[0];

            // let button = document.querySelector('button');
            // button.removeAttribute('disabled');
            // button.innerHTML = 'Play/pause';
        // }
        // loader.load();
    }
    setImpulseResponse(index) {
        this.impulseResponseBuffer = this.impulseResponses[index];
        // Change the impulse response buffer.
        this.convolver.buffer = this.impulseResponseBuffer;
    }
    playPause() {
        if (!this.isPlaying) {
            // Make a source node for the sample.
            let source = context.createBufferSource();
            source.buffer = this.buffer;
            // Make a convolver node for the impulse response.
            let convolver = context.createConvolver();
            convolver.buffer = this.impulseResponseBuffer;
            // Connect the graph.
            source.connect(convolver);
            convolver.connect(context.destination);
            // Save references to important nodes.
            this.source = source;
            this.convolver = convolver;
            // Start playback.
            this.source[this.source.start ? 'start' : 'noteOn'](0);
        } else {
            this.source[this.source.stop ? 'stop' : 'noteOff'](0);
        }
        this.isPlaying = !this.isPlaying;
    }
}
