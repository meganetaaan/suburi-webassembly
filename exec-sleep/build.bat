rustc --target wasm32-unknown-emscripten -Clink_args="-s ASYNCIFY=1 -s ASYNCIFY_FUNCTIONS=['emscripten_sleep'] -s RESERVED_FUNCTION_POINTERS=20" emscripten_sleep.rs
