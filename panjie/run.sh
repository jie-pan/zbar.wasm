for i in 1 2 3
do
    time ~/web/src/v8/v8/out.gn/x64.release/d8  --experimental-wasm-simd  ./panjie-scan.js 
    time ~/web/src/v8/v8/out.gn/x64.release/d8  --experimental-wasm-simd  ./panjie-scan.js -- simd
done
