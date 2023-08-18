export default class VolumeSample {
    constructor(context, loadSounds, button) {
        this.context = context;
        loadSounds(
            context,
            this,
            { buffer: '/music/00_windy soul.mp3' }, 
            this.onLoaded(button)
            );
        this.isPlaying = false;
    }

    onLoaded(button) {
        button.removeAttribute('disabled');
    }

    play() {
        this.gainNode = this.context.createGain();
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;

        // Connect source to a gain node
        this.source.connect(this.gainNode);
        // Connect gain node to destination
        this.gainNode.connect(this.context.destination);
        // Start playback in a loop
        this.source.loop = true;
        this.source[this.source.start ? 'start' : 'noteOn'](0);
    }

    changeVolume(element) {
        const volume = element.value;
        const fraction = parseInt(volume) / parseInt(element.max);
        // Let's use an x*x curve (x-squared) since simple linear (x) does not
        // sound as good.
        this.gainNode.gain.value = fraction * fraction;
    }

    stop() {
        this.source[this.source.stop ? 'stop' : 'noteOff'](0);
    }

    toggle() {
        if (this.isPlaying) {
        this.stop();
        } else {
        this.play();
        }
        this.isPlaying = !this.isPlaying;
    }
}
