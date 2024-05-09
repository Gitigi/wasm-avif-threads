import wasm_bindgen, { AvifEncoder } from "../../pkg/wasm_avif_threads"

let initialized = false;
let Encoder;

onmessage = async ({data: {id, data}}) => {
  if(!initialized) {
    await wasm_bindgen()
    Encoder = new AvifEncoder(navigator.hardwareConcurrency)
    initialized = true
  }

  const res = await Encoder.encode(data.buffer, data.width, data.height, data.speed)
  postMessage({id, data: res});
};
