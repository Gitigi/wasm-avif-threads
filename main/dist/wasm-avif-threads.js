var W = Object.defineProperty;
var S = (F, U, Q) => U in F ? W(F, U, { enumerable: !0, configurable: !0, writable: !0, value: Q }) : F[U] = Q;
var R = (F, U, Q) => (S(F, typeof U != "symbol" ? U + "" : U, Q), Q);
function E(F) {
  let U;
  try {
    if (U = V && (window.URL || window.webkitURL).createObjectURL(V), !U)
      throw "";
    const Q = new Worker(U, {
      name: F == null ? void 0 : F.name
    });
    return Q.addEventListener("error", () => {
      (window.URL || window.webkitURL).revokeObjectURL(U);
    }), Q;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + J,
      {
        name: F == null ? void 0 : F.name
      }
    );
  } finally {
    U && (window.URL || window.webkitURL).revokeObjectURL(U);
  }
}
class k {
  constructor() {
    R(this, "onComplete", ({ data: { id: U, data: Q } }) => {
      typeof this.requests[U] == "function" && (this.requests[U](Q), delete this.requests[U]);
    });
    this.requests = {}, this.requestsCounter = 0, this.worker = new E(), this.worker.onmessage = this.onComplete;
  }
  /**
  * @param {Uint8Array} buffer
  * @param {number} width
  * @param {number} height
  * @returns {Promise<Uint8Array>}
  */
  async encode(U, Q, l) {
    const B = `request-${this.requestsCounter++}`;
    return new Promise((d) => {
      this.requests[B] = (Z) => {
        d(Z);
      }, this.worker.postMessage({ id: B, data: { buffer: U, width: Q, height: l } });
    });
  }
}
export {
  k as Encoder
};