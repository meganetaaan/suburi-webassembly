const namePrefix = "string_container";
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
    const newStringContainer = Module.cwrap(
      "new_string_container",
      "number",
      []
    );
    const stringContainerAppend = Module.cwrap(
      "string_container_append",
      void 0,
      ["number", "string"]
    );
    const stringContainerConcatWith = Module.cwrap(
      "string_container_concat_with",
      "string",
      ["number"]
    );
    const dropStringContainer = Module.cwrap("drop_string_container", void 0, [
      "number"
    ]);

    class RustStringContainer {
      constructor() {
        this.ptr = newStringContainer();
      }
      append(str) {
        stringContainerAppend(this.ptr, str);
      }
      concatWith() {
        return stringContainerConcatWith(this.ptr);
      }
      drop() {
        dropStringContainer(this.ptr);
      }
    }

    container = new RustStringContainer();

    const appendBtn = document.querySelector("#appendBtn");
    appendBtn.addEventListener("click", () => {
      const textInput = document.querySelector("#textInput");
      if (textInput.value != "") {
        container.append(textInput.value);
        textInput.value = "";
      }
    });
    const concatBtn = document.querySelector("#concatBtn");
    concatBtn.addEventListener("click", () => {
      const text = container.concatWith();
      document.querySelector("#result").innerText = text;
    });
    const dropBtn = document.querySelector("#dropBtn");
    dropBtn.addEventListener("drop", container.drop);
  });
