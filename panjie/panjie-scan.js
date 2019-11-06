
if (arguments.length == 0) {
    load("./zbar.js");
    console.log("scalar");
} else {
    load("./zbar-simd.js");
    console.log("simd");
}

Module['onRuntimeInitialized'] = onRuntimeInitialized;

const utf8BufferToString = (buffer, addr) => {
  let end = addr;
  while (buffer[end]) {
    ++end;
  }
  const str = new Uint8Array(buffer.slice(addr, end));
  const encodedString = String.fromCharCode.apply(null, str);
  const decodedString = decodeURIComponent(escape(encodedString));
  return decodedString;
};

function scanQrcode(filename, width, height)
{

    //console.log(filename + ', ' + width + ', ' + height);
    var imgAsArray = new Uint8Array(readbuffer(filename));
    const buf = Module._createBuffer(width * height * 4);
    Module.HEAPU8.set(imgAsArray, buf);

    const results = [];
    if (Module._scanQrcode(buf, width, height)) {
        const res_addr = Module._getScanResults();
        results.push(utf8BufferToString(Module.HEAPU8, res_addr));
        Module._deleteBuffer(res_addr);
    }
    return results;

}

const IMAGE_URLS = [
    { name: 'test.rgba' , 
      width: 1920,
      height:1080
    },
    { name: 'test2.rgba' , 
      width: 220,
      height:213
    },
    { name: 'test3.rgba' , 
      width: 198,
      height: 192
    },
];
 
function onRuntimeInitialized() {

    var dirname="images/"
    
    var start = performance.now();
    //console.log(IMAGE_URLS.length);
    for (var i = 0; i < IMAGE_URLS.length; i++) {
        filename = dirname + IMAGE_URLS[i].name;
        width = IMAGE_URLS[i].width;
        height = IMAGE_URLS[i].height;

        /*
        var imgAsArray = new Uint8Array(readbuffer(filename));
        const buf = Module._createBuffer(width * height * 4);
        Module.HEAPU8.set(imgAsArray, buf);

        for (var j = 0; j < 50; j++)
        {
            if (Module._scanQrcode(buf, width, height)) {
                const res_addr = Module._getScanResults();
                results.push(utf8BufferToString(Module.HEAPU8, res_addr));
                Module._deleteBuffer(res_addr);
            }
        }
        */

        
        for (var j = 0; j < 50; j++)
        {
           ret =  scanQrcode(filename, width, height);
           //console.log(ret);
        }
        
    }
    var timeused = performance.now() - start;

    console.log(timeused);

}

