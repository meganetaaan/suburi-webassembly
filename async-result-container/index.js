"use strict";

const namePrefix = "async_result_container";
var Module = {
  preRun: [],
  postRun: [],
  wasmBinaryFile: `${namePrefix}.wasm`,
  noInitialRun: true, // don't run `fn main()`. but we can call `pub fn add(a: i32, b: i32) -> i32`.
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
    const execAsync = Module.cwrap("exec_async_c", void 0, ["number"]);

    const buttonEl = document.querySelector("#execBtn");
    const resultEl = document.querySelector("#result");

    buttonEl.addEventListener("click", () => {
      const funcRef = Runtime.addFunction(ptr => {
        const str = Module.Pointer_stringify(ptr);
        resultEl.innerText = str;
        Runtime.removeFunction(funcRef);
      });
      execAsync(funcRef);
    });
  });
