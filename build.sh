mkdir -p pkg && touch pkg/wasm_avif_threads.js

RUSTFLAGS='-C target-feature=+simd128,+atomics,+bulk-memory,+mutable-globals' rustup run nightly wasm-pack build --target no-modules . -- -Z build-std=std,panic_abort,core,alloc -Z build-std-features=panic_immediate_abort

RUSTFLAGS='-C target-feature=+simd128,+atomics,+bulk-memory,+mutable-globals' rustup run nightly wasm-pack build --target web . -- -Z build-std=std,panic_abort,core,alloc -Z build-std-features=panic_immediate_abort

pushd main && npm run build && popd
