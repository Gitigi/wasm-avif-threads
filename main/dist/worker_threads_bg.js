let _;
function L(e) {
  _ = e;
}
const f = new Array(128).fill(void 0);
f.push(void 0, null, !0, !1);
function i(e) {
  return f[e];
}
let a = f.length;
function O(e) {
  e < 132 || (f[e] = a, a = e);
}
function x(e) {
  const n = i(e);
  return O(e), n;
}
const j = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
let T = new j("utf-8", { ignoreBOM: !0, fatal: !0 });
T.decode();
let l = null;
function b() {
  return (l === null || l.byteLength === 0) && (l = new Uint8Array(_.memory.buffer)), l;
}
function p(e, n) {
  return e = e >>> 0, T.decode(b().subarray(e, e + n));
}
function s(e) {
  a === f.length && f.push(f.length + 1);
  const n = a;
  return a = f[n], f[n] = e, n;
}
let h = 0;
const A = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
let g = new A("utf-8");
const R = typeof g.encodeInto == "function" ? function(e, n) {
  return g.encodeInto(e, n);
} : function(e, n) {
  const t = g.encode(e);
  return n.set(t), {
    read: e.length,
    written: t.length
  };
};
function k(e, n, t) {
  if (t === void 0) {
    const u = g.encode(e), d = n(u.length, 1) >>> 0;
    return b().subarray(d, d + u.length).set(u), h = u.length, d;
  }
  let r = e.length, o = n(r, 1) >>> 0;
  const E = b();
  let c = 0;
  for (; c < r; c++) {
    const u = e.charCodeAt(c);
    if (u > 127)
      break;
    E[o + c] = u;
  }
  if (c !== r) {
    c !== 0 && (e = e.slice(c)), o = t(o, r, r = c + e.length * 3, 1) >>> 0;
    const u = b().subarray(o + c, o + r), d = R(e, u);
    c += d.written, o = t(o, r, c, 1) >>> 0;
  }
  return h = c, o;
}
let w = null;
function y() {
  return (w === null || w.byteLength === 0) && (w = new Int32Array(_.memory.buffer)), w;
}
function m(e, n) {
  try {
    return e.apply(this, n);
  } catch (t) {
    _.__wbindgen_exn_store(s(t));
  }
}
const v = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e) => _.__wbg_avifworker_free(e >>> 0));
class M {
  __destroy_into_raw() {
    const n = this.__wbg_ptr;
    return this.__wbg_ptr = 0, v.unregister(this), n;
  }
  free() {
    const n = this.__destroy_into_raw();
    _.__wbg_avifworker_free(n);
  }
  /**
  */
  constructor() {
    const n = _.avifworker_new();
    return x(n);
  }
}
function U(e) {
  x(e);
}
function W(e, n) {
  const t = p(e, n);
  return s(t);
}
function D() {
  const e = new Error();
  return s(e);
}
function F(e, n) {
  const t = i(n).stack, r = k(t, _.__wbindgen_malloc, _.__wbindgen_realloc), o = h;
  y()[e / 4 + 1] = o, y()[e / 4 + 0] = r;
}
function I(e, n) {
  let t, r;
  try {
    t = e, r = n, console.error(p(e, n));
  } finally {
    _.__wbindgen_free(t, r, 1);
  }
}
function S() {
  return m(function(e, n) {
    const t = new Blob(i(e), i(n));
    return s(t);
  }, arguments);
}
function q() {
  return m(function(e, n) {
    const t = URL.createObjectURL(i(n)), r = k(t, _.__wbindgen_malloc, _.__wbindgen_realloc), o = h;
    y()[e / 4 + 1] = o, y()[e / 4 + 0] = r;
  }, arguments);
}
function z() {
  return m(function(e, n) {
    const t = new Worker(p(e, n));
    return s(t);
  }, arguments);
}
function B() {
  const e = new Array();
  return s(e);
}
function C() {
  const e = new Object();
  return s(e);
}
function H(e, n) {
  return i(e).push(i(n));
}
function N() {
  return m(function(e, n, t) {
    return Reflect.set(i(e), i(n), i(t));
  }, arguments);
}
function V(e, n) {
  throw new Error(p(e, n));
}
export {
  M as AvifWorker,
  q as __wbg_createObjectURL_ad8244759309f204,
  I as __wbg_error_f851667af71bcfc6,
  B as __wbg_new_16b304a2cfa7ff4a,
  C as __wbg_new_72fb9a18b5ae2624,
  D as __wbg_new_abda76e883ba8a5f,
  z as __wbg_new_d1187ae36d662ef9,
  S as __wbg_newwithstrsequenceandoptions_ce1f1ca2d522b8aa,
  H as __wbg_push_a5b05aedc7234f9f,
  N as __wbg_set_1f9b04f170055d33,
  L as __wbg_set_wasm,
  F as __wbg_stack_658279fe44541cf6,
  U as __wbindgen_object_drop_ref,
  W as __wbindgen_string_new,
  V as __wbindgen_throw
};
