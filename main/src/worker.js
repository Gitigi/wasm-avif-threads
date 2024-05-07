import wasm_bindgen, { encode } from "../../pkg/wasm_avif_threads"

let initialized = false;

onmessage = async ({data: {id, data}}) => {
  if(!initialized) {
    await wasm_bindgen()
    initialized = true
  }

  const res = await encode(data.buffer, data.width, data.height)
  postMessage({id, data: res});
};
