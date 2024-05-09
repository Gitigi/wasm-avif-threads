use js_sys::Array;
use wasm_bindgen::prelude::*;
use web_sys::{Blob, BlobPropertyBag, Url, Worker};
use base64::{engine::general_purpose::STANDARD, Engine as _};

mod utils;

#[wasm_bindgen]
pub struct AvifWorker {}

#[wasm_bindgen]
impl AvifWorker {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Worker {
        utils::set_panic_hook();
        
        let wasm = format!("data:application/wasm;base64,{}", STANDARD.encode(WASM).as_str());
        let worker = format!("let __wasm = '{}'\n{}", wasm, WORKER);

        let a = Array::new();
        a.push(&JsValue::from_str(&worker));

        let mut blob_prop = BlobPropertyBag::new();
        blob_prop.type_("text/text/javascript;charset=utf-8");
        let blob = Blob::new_with_str_sequence_and_options(&a, &blob_prop).unwrap();

        let url = Url::create_object_url_with_blob(&blob).unwrap();
        Worker::new(&url).unwrap()
    }
}

const WASM: &[u8] = include_bytes!("../../pkg/wasm_avif_threads_bg.wasm");

const WORKER: &str = {
    const BINDGEN: &str = include_str!("../../pkg/wasm_avif_threads.js");
    const WORKER: &str = r#"
        let Encoder;
        let initialised = wasm_bindgen(__wasm).then(() => {
            Encoder = new wasm_bindgen.AvifEncoder(navigator.hardwareConcurrency);
        });

        self.onmessage = async event => {
            // This will queue further commands up until the module is fully initialised:
            await initialised;
            const res = await Encoder.encode(event.data.data.buffer, event.data.data.width, event.data.data.height, event.data.data.speed);
            postMessage({id: event.data.id, data: res});
        };
    "#;
    const_format::formatcp!("{}\n{}", BINDGEN, WORKER)
};
