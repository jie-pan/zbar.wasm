import Scanner from 'zbar.wasm';

const QRSCAN_WIDTH = 300;
const SCAN_PROID = 600;

const handleCanvasResize = () => {
  const canvas = document.getElementsByTagName('canvas')[0];
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  const origWidth = canvas.width;
  const origHeight = canvas.height;
  if (!origHeight || !origWidth || !newHeight || !newWidth)
    return;
  if (origWidth * (newHeight / origHeight) <= newWidth) {
    canvas.height = newHeight;
    canvas.width = origWidth * (newHeight / origHeight);
  } else {
    canvas.height = origHeight * (newWidth / origWidth);
    canvas.width = newWidth;
  }
};

window.onresize = handleCanvasResize;

const main = async () => {
  navigator.getMedia = (
    navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia);

  const scanner = await Scanner({locateFile: file => ('data/' + file)});

  navigator.getMedia(
    {video:true, audio:false},
    (mediaStream) => {
      const video = document.createElement('video');
      video.srcObject = mediaStream;
      const canvas = document.getElementsByTagName('canvas')[0];
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log('video init');
        handleCanvasResize();
      };
      video.play();
      const ctx = canvas.getContext('2d');
      let fps = 0;
      let frameCount = 0;
      let lastTimeStamp = Date.now();
      let lastScanTimeStamp = Date.now();
      const update = () => {
        const now = Date.now();
        if (now - lastTimeStamp > 1000) {
          lastTimeStamp = now;
          fps = frameCount;
          frameCount = 0;
        }
        ++ frameCount;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const offsetX = (canvas.width - QRSCAN_WIDTH) / 2;
        const offsetY = (canvas.height - QRSCAN_WIDTH) / 2;
        const scanImageData =
          ctx.getImageData(offsetX, offsetY, QRSCAN_WIDTH, QRSCAN_WIDTH);
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 6;
        ctx.strokeRect(offsetX, offsetY, QRSCAN_WIDTH, QRSCAN_WIDTH);
        ctx.font = '16px serif';
        ctx.fillText('FPS: ' + fps, 10, 30);

        if (now - lastScanTimeStamp > SCAN_PROID) {
          lastScanTimeStamp = now;
          const scanRes =
            scanner.scanQrcode(scanImageData.data, QRSCAN_WIDTH, QRSCAN_WIDTH);

          if (scanRes.length) {
            alert("Get Qrcode: " + scanRes);
            // console.log(scanRes);
          };
        }

        setTimeout(update, 50);
        // requestAnimationFrame(update);
      };
      update();
    },
    (error) => {
      const h1 = document.createElement('h1');
      h1.style = 'position: absolute; top: 20px; left: 20px';
      h1.innerText = 'Cannot get cammera: ' + error;
      document.body.appendChild(h1);
      console.log(error);
    });
};

main();