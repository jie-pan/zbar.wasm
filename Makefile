ZBAR_NAME = zbar-0.10

#all: data/zbar.js
all: test

debug: .emmake src/api.cpp
	em++ -g2 -s WASM=1 -Wc++11-extensions -o data/zbar.js \
		src/api.cpp -I ${ZBAR_NAME}/include/ \
		${ZBAR_NAME}/zbar/*.o ${ZBAR_NAME}/zbar/*/*.o \
		-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
		-s "BINARYEN_METHOD='native-wasm'" \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s MODULARIZE=1 \
		-s ASSERTIONS=1 -s SAFE_HEAP=1 -s STACK_OVERFLOW_CHECK=1

data/zbar.js: .emmake src/api.cpp
	em++ -s WASM=1 -Wc++11-extensions -o data/zbar.js \
		src/api.cpp -I ${ZBAR_NAME}/include/ \
		${ZBAR_NAME}/zbar/*.o ${ZBAR_NAME}/zbar/*/*.o \
		#-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' 
		-s EXPORTED_FUNCTIONS="['_createBuffer', 'deleteBuffer', '_scanQrcode', '_getScanResults']" \
		-s "BINARYEN_METHOD='native-wasm'" \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s MODULARIZE=1	\
		-O3 -g

.emmake: ${ZBAR_NAME}/Makefile
	cd ${ZBAR_NAME} && emmake make CFLAGS='-g -O2' CXXFLAGS='-g -O2'


${ZBAR_NAME}/Makefile: ${ZBAR_NAME}.tar.gz
	tar zxvf ${ZBAR_NAME}.tar.gz
	cd ${ZBAR_NAME} && emconfigure ./configure --without-x --without-jpeg \
		--without-imagemagick --without-npapi --without-gtk \
		--without-python --without-qt --without-xshm --disable-video \
		--disable-pthread

test: data/zbar.js
	webpack --config ./webpack.config.js
	cp data/zbar.* test/build/data/
	cp data/zbar.*  panjie/

run: 
	cd ./test/build
	node --experimental-wasm-threads --experimental-wasm-simd ./build.js
	cd ../../

clean:
	rm -rf ${ZBAR_NAME}
	rm data/zbar.*