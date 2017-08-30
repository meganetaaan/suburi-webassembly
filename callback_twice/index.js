const namePrefix = "callback_twice";
var Module = {
  preRun: [],
  postRun: [],
  wasmBinaryFile: `${namePrefix}.wasm`,
  noInitialRun: true,
  print: text => {
    console.log(text);
  },
  printErr: text => {
    console.warn(text);
  }
};
fetch(`${namePrefix}.wasm`).then(resp => resp.arrayBuffer()).then(ab => {
  Module.wasmBinary = ab;
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = `${namePrefix}.js`;
    script.addEventListener("load", resolve);
    document.body.appendChild(script);
  });
}).then;
const callbackTwice = () => {
  const rustFunc = Module.cwrap(`${namePrefix}_c`, void 0, [
    "string",
    "number"
  ]);
  return (v, callback) => {
    let funcPtr;
    let counter = 0;
    const wrapper = ptr => {
      const str = Module.Pointer_stringify(ptr);
      callback(str);

      counter += 1;
      if (counter === 2) {
        Runtime.removeFunction(funcPtr);
      }

      // emscriptenに関数を渡し、ポインタを得る
      funcPtr = Runtime.addFunction(wrapper);
      rustFunc(v, funcPtr);
    };
  };
};
