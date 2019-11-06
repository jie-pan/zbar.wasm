import Scanner from 'index';
import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

const {
  performance
} = require('perf_hooks');


console.log('performance', performance.now());
console.log(Scanner);

const readFile = async path => {
  fs.open(path, 'r');
};

// const loadImage = async src => {
//   // Load image
//   const imgBlob = await fetch(src).then(resp => resp.blob());
//   const img = await createImageBitmap(imgBlob);
//   // Make canvas same size as image
//   const canvas = document.createElement('canvas');
//   canvas.width = img.width;
//   canvas.height = img.height;
//   // Draw image onto canvas
//   const ctx = canvas.getContext('2d');
//   ctx.drawImage(img, 0, 0);
//   return ctx.getImageData(0, 0, img.width, img.height);
// }

const loadImageData = async path => {
  const img = await loadImage(path);
  const canvas = createCanvas();
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return {
    data: canvas.toBuffer('raw'),
    height: img.height,
    width: img.width
  };
};

const scanImage = async (scanner, imagePath) => {
	const img = await loadImageData(imagePath);
    console.log(scanner.scanQrcode(img.data, img.width, img.height));
};

const main = async () => {
  try {
      const scanner = await Scanner({ locateFile: file => './data/' + file });

      var start = performance.now();
      //scanImage(scanner, './test/test.png');
      //scanImage(scanner, './test/test2.png');
      //scanImage(scanner, './test/test3.png');
      const img =await loadImageData('./test/test.png'); 
      const img2 =await loadImageData('./test/test2.png'); 
      const img3 =await loadImageData('./test/test3.png'); 
      for (var i = 0; i< 200; i++)
      {
          console.log(scanner.scanQrcode(img.data, img.width, img.height));
          console.log(scanner.scanQrcode(img2.data, img2.width, img2.height));
          console.log(scanner.scanQrcode(img3.data, img3.width, img3.height));

      }
      var realtime = performance.now() - start;
      console.log(realtime);
  } catch (e) {
    console.log(e);
  } finally {
  }
};

main();
