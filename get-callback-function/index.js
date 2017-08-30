const namePrefix = "get_callback_func";
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
fetch(`${namePrefix}.wasm`)
  .then(resp => resp.arrayBuffer())
  .then(ab => {
    Module.wasmBinary = ab;
    return new Promise(resolve => {
      const script = document.createElement("script");
      script.src = `${namePrefix}.js`;
      script.addEventListener("load", resolve);
      document.body.appendChild(script);
    });
  })
  .then(() => {
    const rustFunc = (() => {
      const getCallbackFunc = Module.cwrap(namePrefix, 'number', [])
      return str => {
        const fPtr = getCallbackFunc()
        const strPtr = Module.allocate(intArrayFromString(str), 'i8', ALLOC_NORMAL)
        // ii means return value is integer, argument is single integer
        const ptr = Runtime.dynCall('ii', fPtr, [strPtr])
        Module._free(strPtr)
        return Module.Pointer_stringify(ptr)
      }
    })()
    const callback = () => {
      const text = document.querySelector('#textInput').value
      const str = rustFunc(text)
      document.querySelector('#result').innerText = str
    };
    const execButton = document.querySelector('#execButton')
    execButton.addEventListener("click", callback)
  });
