use imgref::{Img, ImgVec};
use js_sys::{Promise, Uint8Array, WebAssembly};
use pool::WorkerPool;
use wasm_bindgen::prelude::*;
use ravif::*;
use rayon::prelude::*;
use futures_channel::oneshot;

macro_rules! console_log {
    ($($t:tt)*) => (crate::log(&format_args!($($t)*).to_string()))
}

mod utils;
mod pool;


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logv(x: &JsValue);
}

#[wasm_bindgen]
pub struct AvifEncoder {
    pool: WorkerPool,
    pool_size: usize,
}

#[wasm_bindgen]
impl AvifEncoder {
    #[wasm_bindgen(constructor)]
    pub fn new(initial: usize) -> Self {
        utils::set_panic_hook();
        let pool = pool::WorkerPool::new(initial).unwrap();
        AvifEncoder{pool, pool_size: initial}
    }

    #[wasm_bindgen]
    pub fn encode(&self, buffer: Vec<u8>, width: usize, height: usize, speed: u8) -> Result<Promise, JsValue> {
        let thread_pool = rayon::ThreadPoolBuilder::new()
                .num_threads(self.pool_size)
                .spawn_handler(|thread| {
                    console_log!("executing task");
                    self.pool.run(|| thread.run()).unwrap();
                    Ok(())
                })
                .build()
                .unwrap();
        console_log!("after start thread");
        let (tx, rx) = oneshot::channel();
        self.pool.run(move || {
            thread_pool.install(|| {
                let a: Vec<RGBA8>  = buffer.par_chunks(4).map(|p| RGBA8::new(p[0], p[1], p[2], p[3])).collect();
                // let a: Vec<RGBA8>  = buffer.chunks(4).map(|p| RGBA8::new(p[0], p[1], p[2], p[3])).collect();
                let img: ImgVec<RGBA8> = Img::new(a, width, height);
                let res = Encoder::new()
                    .with_quality(50.)
                    .with_speed(speed)
                    // .with_num_threads(Some(16))
                    .encode_rgba(img.as_ref()).unwrap();
                drop(tx.send(res.avif_file));
            })
        })?;

        let done = async move {
            match rx.await {
                Ok(data) => {
                    let mem = wasm_bindgen::memory().unchecked_into::<WebAssembly::Memory>();
                    let ptr = data.as_ptr() as u32;
                    let mem = Uint8Array::new(&mem.buffer()).slice(ptr, (ptr + data.len() as u32) as u32);
                    Ok(mem.into())
                },
                Err(_) => Err(JsValue::undefined()),
            }
        };
        Ok(wasm_bindgen_futures::future_to_promise(done))
    }
}

#[wasm_bindgen]
pub fn encode(buffer: Vec<u8>, width: usize, height: usize, speed: u8) -> Result<Promise, JsValue> {
    utils::set_panic_hook();
    console_log!("building thread");
    let pool = pool::WorkerPool::new(16)?;
    let thread_pool = rayon::ThreadPoolBuilder::new()
            .num_threads(16)
            .spawn_handler(|thread| {
                console_log!("executing task");
                pool.run(|| thread.run()).unwrap();
                Ok(())
            })
            .build()
            .unwrap();
    console_log!("after start thread");
    let (tx, rx) = oneshot::channel();
    pool.run(move || {
        thread_pool.install(|| {
            let a: Vec<RGBA8>  = buffer.par_chunks(4).map(|p| RGBA8::new(p[0], p[1], p[2], p[3])).collect();
            // let a: Vec<RGBA8>  = buffer.chunks(4).map(|p| RGBA8::new(p[0], p[1], p[2], p[3])).collect();
            let img: ImgVec<RGBA8> = Img::new(a, width, height);
            let res = Encoder::new()
                .with_quality(50.)
                .with_speed(speed)
                // .with_num_threads(Some(16))
                .encode_rgba(img.as_ref()).unwrap();
            drop(tx.send(res.avif_file));
        })
    })?;

    let done = async move {
        match rx.await {
            Ok(data) => {
                let mem = wasm_bindgen::memory().unchecked_into::<WebAssembly::Memory>();
                let ptr = data.as_ptr() as u32;
                let mem = Uint8Array::new(&mem.buffer()).slice(ptr, (ptr + data.len() as u32) as u32);
                drop(pool);
                Ok(mem.into())
            },
            Err(_) => Err(JsValue::undefined()),
        }
    };
    Ok(wasm_bindgen_futures::future_to_promise(done))
}
