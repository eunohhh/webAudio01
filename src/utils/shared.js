function playSound(context, buffer, time) {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source[source.start ? 'start' : 'noteOn'](time);
};

function loadSounds(context, obj, soundMap, callback) {
  // Array-ify
  let names = [];
  let paths = [];
  for (let name in soundMap) {
      let path = soundMap[name];
      names.push(name);
      paths.push(path);
  }
  let bufferLoader = new BufferLoader(context, paths, function(bufferList) { // bufferList = this.onLoad 39번 라인
      for (let i = 0; i < bufferList.length; i++) {
          let buffer = bufferList[i];
          let name = names[i];
          obj[name] = buffer; // obj === this
      }
      if (callback) {
          callback();
      }
  });
  bufferLoader.load();

  console.log(bufferLoader.bufferList)
  return bufferLoader.bufferList;
};

    class BufferLoader {
      constructor(context, urlList, callback) {

        console.log(urlList)

          this.context = context;
          this.urlList = urlList;
          this.onload = callback;
          this.bufferList = [];
          this.loadCount = 0;
      }

      loadBuffer(url, index) {
          // Load buffer asynchronously
          let request = new XMLHttpRequest();
          request.open("GET", url, true);
          request.responseType = "arraybuffer";

          request.onload = () => {
              // Asynchronously decode the audio file data in request.response
              this.context.decodeAudioData(
                  request.response,
                  (buffer) => {
                      if (!buffer) {
                          alert('error decoding file data: ' + url);
                          return;
                      }
                      this.bufferList[index] = buffer;

                      // console.log(buffer)

                      if (++this.loadCount === this.urlList.length)
                          this.onload(this.bufferList); // constructor 3번째 callback 에 파라미터로 bufferlist 전달
                  },
                  (error) => {
                      console.error('decodeAudioData error', error);
                  }
              );
          };

          request.onerror = () => {
              alert('BufferLoader: XHR error');
          };

          request.send();
      }

      load() {
          for (let i = 0; i < this.urlList.length; ++i) {
              this.loadBuffer(this.urlList[i], i);
          }
      }
    };

export { loadSounds, playSound, BufferLoader }
