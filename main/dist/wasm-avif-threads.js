var h = Object.defineProperty;
var m = (t, e, s) => e in t ? h(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var o = (t, e, s) => (m(t, typeof e != "symbol" ? e + "" : e, s), s);
import * as c from "./e086f99a232670d1.wasm";
import { __wbg_set_wasm as q, AvifWorker as w } from "./worker_threads_bg.js";
q(c);
class d {
  constructor() {
    o(this, "onComplete", ({ data: { id: e, data: s } }) => {
      typeof this.requests[e] == "function" && (this.requests[e](s), delete this.requests[e]);
    });
    this.requests = {}, this.requestsCounter = 0, this.worker = new w(), this.worker.onmessage = this.onComplete;
  }
  /**
  * @param {Uint8Array} buffer
  * @param {number} width
  * @param {number} height
  * @param {number} speed
  * @returns {Promise<Uint8Array>}
  */
  async encode(e, s, i, n = 4) {
    const r = `request-${this.requestsCounter++}`;
    return new Promise((u) => {
      this.requests[r] = (a) => {
        u(a);
      }, this.worker.postMessage({ id: r, data: { buffer: e, width: s, height: i, speed: n } });
    });
  }
}
export {
  d as Encoder
};
