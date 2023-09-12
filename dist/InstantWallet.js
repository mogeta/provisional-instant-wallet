var Ou = Object.defineProperty;
var Tu = (r, e, t) => e in r ? Ou(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var g = (r, e, t) => (Tu(r, typeof e != "symbol" ? e + "" : e, t), t), nc = (r, e, t) => {
  if (!e.has(r))
    throw TypeError("Cannot " + t);
};
var l = (r, e, t) => (nc(r, e, "read from private field"), t ? t.call(r) : e.get(r)), y = (r, e, t) => {
  if (e.has(r))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(r) : e.set(r, t);
}, x = (r, e, t, n) => (nc(r, e, "write to private field"), n ? n.call(r, t) : e.set(r, t), t);
var Ss = (r, e, t, n) => ({
  set _(s) {
    x(r, e, s, t);
  },
  get _() {
    return l(r, e, n);
  }
}), P = (r, e, t) => (nc(r, e, "access private method"), t);
const of = "6.7.1";
function Ru(r, e, t) {
  const n = e.split("|").map((i) => i.trim());
  for (let i = 0; i < n.length; i++)
    switch (e) {
      case "any":
        return;
      case "bigint":
      case "boolean":
      case "number":
      case "string":
        if (typeof r === e)
          return;
    }
  const s = new Error(`invalid value for type ${e}`);
  throw s.code = "INVALID_ARGUMENT", s.argument = `value.${t}`, s.value = r, s;
}
async function he(r) {
  const e = Object.keys(r);
  return (await Promise.all(e.map((n) => Promise.resolve(r[n])))).reduce((n, s, i) => (n[e[i]] = s, n), {});
}
function T(r, e, t) {
  for (let n in e) {
    let s = e[n];
    const i = t ? t[n] : null;
    i && Ru(s, i, n), Object.defineProperty(r, n, { enumerable: !0, value: s, writable: !1 });
  }
}
function Ar(r) {
  if (r == null)
    return "null";
  if (Array.isArray(r))
    return "[ " + r.map(Ar).join(", ") + " ]";
  if (r instanceof Uint8Array) {
    const e = "0123456789abcdef";
    let t = "0x";
    for (let n = 0; n < r.length; n++)
      t += e[r[n] >> 4], t += e[r[n] & 15];
    return t;
  }
  if (typeof r == "object" && typeof r.toJSON == "function")
    return Ar(r.toJSON());
  switch (typeof r) {
    case "boolean":
    case "symbol":
      return r.toString();
    case "bigint":
      return BigInt(r).toString();
    case "number":
      return r.toString();
    case "string":
      return JSON.stringify(r);
    case "object": {
      const e = Object.keys(r);
      return e.sort(), "{ " + e.map((t) => `${Ar(t)}: ${Ar(r[t])}`).join(", ") + " }";
    }
  }
  return "[ COULD NOT SERIALIZE ]";
}
function je(r, e) {
  return r && r.code === e;
}
function so(r) {
  return je(r, "CALL_EXCEPTION");
}
function ne(r, e, t) {
  {
    const s = [];
    if (t) {
      if ("message" in t || "code" in t || "name" in t)
        throw new Error(`value will overwrite populated values: ${Ar(t)}`);
      for (const i in t) {
        const a = t[i];
        s.push(i + "=" + Ar(a));
      }
    }
    s.push(`code=${e}`), s.push(`version=${of}`), s.length && (r += " (" + s.join(", ") + ")");
  }
  let n;
  switch (e) {
    case "INVALID_ARGUMENT":
      n = new TypeError(r);
      break;
    case "NUMERIC_FAULT":
    case "BUFFER_OVERRUN":
      n = new RangeError(r);
      break;
    default:
      n = new Error(r);
  }
  return T(n, { code: e }), t && Object.assign(n, t), n;
}
function A(r, e, t, n) {
  if (!r)
    throw ne(e, t, n);
}
function b(r, e, t, n) {
  A(r, e, "INVALID_ARGUMENT", { argument: t, value: n });
}
function ff(r, e, t) {
  t == null && (t = ""), t && (t = ": " + t), A(r >= e, "missing arguemnt" + t, "MISSING_ARGUMENT", {
    count: r,
    expectedCount: e
  }), A(r <= e, "too many arguemnts" + t, "UNEXPECTED_ARGUMENT", {
    count: r,
    expectedCount: e
  });
}
const Su = ["NFD", "NFC", "NFKD", "NFKC"].reduce((r, e) => {
  try {
    if ("test".normalize(e) !== "test")
      throw new Error("bad");
    if (e === "NFD") {
      const t = String.fromCharCode(233).normalize("NFD"), n = String.fromCharCode(101, 769);
      if (t !== n)
        throw new Error("broken");
    }
    r.push(e);
  } catch {
  }
  return r;
}, []);
function lf(r) {
  A(Su.indexOf(r) >= 0, "platform missing String.prototype.normalize", "UNSUPPORTED_OPERATION", {
    operation: "String.prototype.normalize",
    info: { form: r }
  });
}
function ur(r, e, t) {
  if (t == null && (t = ""), r !== e) {
    let n = t, s = "new";
    t && (n += ".", s += " " + t), A(!1, `private constructor; use ${n}from* methods`, "UNSUPPORTED_OPERATION", {
      operation: s
    });
  }
}
function uf(r, e, t) {
  if (r instanceof Uint8Array)
    return t ? new Uint8Array(r) : r;
  if (typeof r == "string" && r.match(/^0x([0-9a-f][0-9a-f])*$/i)) {
    const n = new Uint8Array((r.length - 2) / 2);
    let s = 2;
    for (let i = 0; i < n.length; i++)
      n[i] = parseInt(r.substring(s, s + 2), 16), s += 2;
    return n;
  }
  b(!1, "invalid BytesLike value", e || "value", r);
}
function O(r, e) {
  return uf(r, e, !1);
}
function be(r, e) {
  return uf(r, e, !0);
}
function q(r, e) {
  return !(typeof r != "string" || !r.match(/^0x[0-9A-Fa-f]*$/) || typeof e == "number" && r.length !== 2 + 2 * e || e === !0 && r.length % 2 !== 0);
}
function df(r) {
  return q(r, !0) || r instanceof Uint8Array;
}
const Fo = "0123456789abcdef";
function N(r) {
  const e = O(r);
  let t = "0x";
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    t += Fo[(s & 240) >> 4] + Fo[s & 15];
  }
  return t;
}
function _(r) {
  return "0x" + r.map((e) => N(e).substring(2)).join("");
}
function vr(r) {
  return q(r, !0) ? (r.length - 2) / 2 : O(r).length;
}
function W(r, e, t) {
  const n = O(r);
  return t != null && t > n.length && A(!1, "cannot slice beyond data bounds", "BUFFER_OVERRUN", {
    buffer: n,
    length: n.length,
    offset: t
  }), N(n.slice(e ?? 0, t ?? n.length));
}
function hf(r, e, t) {
  const n = O(r);
  A(e >= n.length, "padding exceeds data length", "BUFFER_OVERRUN", {
    buffer: new Uint8Array(n),
    length: e,
    offset: e + 1
  });
  const s = new Uint8Array(e);
  return s.fill(0), t ? s.set(n, e - n.length) : s.set(n, 0), N(s);
}
function ir(r, e) {
  return hf(r, e, !0);
}
function Bu(r, e) {
  return hf(r, e, !1);
}
const Ja = BigInt(0), rt = BigInt(1), Er = 9007199254740991;
function Uu(r, e) {
  const t = ja(r, "value"), n = BigInt(L(e, "width"));
  if (A(t >> n === Ja, "overflow", "NUMERIC_FAULT", {
    operation: "fromTwos",
    fault: "overflow",
    value: r
  }), t >> n - rt) {
    const s = (rt << n) - rt;
    return -((~t & s) + rt);
  }
  return t;
}
function xf(r, e) {
  let t = S(r, "value");
  const n = BigInt(L(e, "width")), s = rt << n - rt;
  if (t < Ja) {
    t = -t, A(t <= s, "too low", "NUMERIC_FAULT", {
      operation: "toTwos",
      fault: "overflow",
      value: r
    });
    const i = (rt << n) - rt;
    return (~t & i) + rt;
  } else
    A(t < s, "too high", "NUMERIC_FAULT", {
      operation: "toTwos",
      fault: "overflow",
      value: r
    });
  return t;
}
function Ds(r, e) {
  const t = ja(r, "value"), n = BigInt(L(e, "bits"));
  return t & (rt << n) - rt;
}
function S(r, e) {
  switch (typeof r) {
    case "bigint":
      return r;
    case "number":
      return b(Number.isInteger(r), "underflow", e || "value", r), b(r >= -Er && r <= Er, "overflow", e || "value", r), BigInt(r);
    case "string":
      try {
        if (r === "")
          throw new Error("empty string");
        return r[0] === "-" && r[1] !== "-" ? -BigInt(r.substring(1)) : BigInt(r);
      } catch (t) {
        b(!1, `invalid BigNumberish string: ${t.message}`, e || "value", r);
      }
  }
  b(!1, "invalid BigNumberish value", e || "value", r);
}
function ja(r, e) {
  const t = S(r, e);
  return A(t >= Ja, "unsigned value cannot be negative", "NUMERIC_FAULT", {
    fault: "overflow",
    operation: "getUint",
    value: r
  }), t;
}
const Do = "0123456789abcdef";
function Wa(r) {
  if (r instanceof Uint8Array) {
    let e = "0x0";
    for (const t of r)
      e += Do[t >> 4], e += Do[t & 15];
    return BigInt(e);
  }
  return S(r);
}
function L(r, e) {
  switch (typeof r) {
    case "bigint":
      return b(r >= -Er && r <= Er, "overflow", e || "value", r), Number(r);
    case "number":
      return b(Number.isInteger(r), "underflow", e || "value", r), b(r >= -Er && r <= Er, "overflow", e || "value", r), r;
    case "string":
      try {
        if (r === "")
          throw new Error("empty string");
        return L(BigInt(r), e);
      } catch (t) {
        b(!1, `invalid numeric string: ${t.message}`, e || "value", r);
      }
  }
  b(!1, "invalid numeric value", e || "value", r);
}
function Lu(r) {
  return L(Wa(r));
}
function zt(r, e) {
  let n = ja(r, "value").toString(16);
  if (e == null)
    n.length % 2 && (n = "0" + n);
  else {
    const s = L(e, "width");
    for (A(s * 2 >= n.length, `value exceeds width (${s} bits)`, "NUMERIC_FAULT", {
      operation: "toBeHex",
      fault: "overflow",
      value: r
    }); n.length < s * 2; )
      n = "0" + n;
  }
  return "0x" + n;
}
function me(r) {
  const e = ja(r, "value");
  if (e === Ja)
    return new Uint8Array([]);
  let t = e.toString(16);
  t.length % 2 && (t = "0" + t);
  const n = new Uint8Array(t.length / 2);
  for (let s = 0; s < n.length; s++) {
    const i = s * 2;
    n[s] = parseInt(t.substring(i, i + 2), 16);
  }
  return n;
}
function Cr(r) {
  let e = N(df(r) ? r : me(r)).substring(2);
  for (; e.startsWith("0"); )
    e = e.substring(1);
  return e === "" && (e = "0"), "0x" + e;
}
const Pc = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
let _i = null;
function Fu(r) {
  if (_i == null) {
    _i = {};
    for (let t = 0; t < Pc.length; t++)
      _i[Pc[t]] = BigInt(t);
  }
  const e = _i[r];
  return b(e != null, "invalid base58 value", "letter", r), e;
}
const Du = BigInt(0), Nc = BigInt(58);
function bf(r) {
  let e = Wa(O(r)), t = "";
  for (; e; )
    t = Pc[Number(e % Nc)] + t, e /= Nc;
  return t;
}
function Mu(r) {
  let e = Du;
  for (let t = 0; t < r.length; t++)
    e *= Nc, e += Fu(r[t]);
  return e;
}
function Gu(r) {
  r = atob(r);
  const e = new Uint8Array(r.length);
  for (let t = 0; t < r.length; t++)
    e[t] = r.charCodeAt(t);
  return O(e);
}
function Hu(r) {
  const e = O(r);
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += String.fromCharCode(e[n]);
  return btoa(t);
}
var Sr;
class pf {
  /**
   *  Create a new **EventPayload** for %%emitter%% with
   *  the %%listener%% and for %%filter%%.
   */
  constructor(e, t, n) {
    /**
     *  The event filter.
     */
    g(this, "filter");
    /**
     *  The **EventEmitterable**.
     */
    g(this, "emitter");
    y(this, Sr, void 0);
    x(this, Sr, t), T(this, { emitter: e, filter: n });
  }
  /**
   *  Unregister the triggered listener for future events.
   */
  async removeListener() {
    l(this, Sr) != null && await this.emitter.off(this.filter, l(this, Sr));
  }
}
Sr = new WeakMap();
function Ku(r, e, t, n, s) {
  b(!1, `invalid codepoint at offset ${e}; ${r}`, "bytes", t);
}
function gf(r, e, t, n, s) {
  if (r === "BAD_PREFIX" || r === "UNEXPECTED_CONTINUE") {
    let i = 0;
    for (let a = e + 1; a < t.length && t[a] >> 6 === 2; a++)
      i++;
    return i;
  }
  return r === "OVERRUN" ? t.length - e - 1 : 0;
}
function Vu(r, e, t, n, s) {
  return r === "OVERLONG" ? (b(typeof s == "number", "invalid bad code point for replacement", "badCodepoint", s), n.push(s), 0) : (n.push(65533), gf(r, e, t));
}
const _u = Object.freeze({
  error: Ku,
  ignore: gf,
  replace: Vu
});
function Qu(r, e) {
  e == null && (e = _u.error);
  const t = O(r, "bytes"), n = [];
  let s = 0;
  for (; s < t.length; ) {
    const i = t[s++];
    if (!(i >> 7)) {
      n.push(i);
      continue;
    }
    let a = null, c = null;
    if ((i & 224) === 192)
      a = 1, c = 127;
    else if ((i & 240) === 224)
      a = 2, c = 2047;
    else if ((i & 248) === 240)
      a = 3, c = 65535;
    else {
      (i & 192) === 128 ? s += e("UNEXPECTED_CONTINUE", s - 1, t, n) : s += e("BAD_PREFIX", s - 1, t, n);
      continue;
    }
    if (s - 1 + a >= t.length) {
      s += e("OVERRUN", s - 1, t, n);
      continue;
    }
    let o = i & (1 << 8 - a - 1) - 1;
    for (let f = 0; f < a; f++) {
      let u = t[s];
      if ((u & 192) != 128) {
        s += e("MISSING_CONTINUE", s, t, n), o = null;
        break;
      }
      o = o << 6 | u & 63, s++;
    }
    if (o !== null) {
      if (o > 1114111) {
        s += e("OUT_OF_RANGE", s - 1 - a, t, n, o);
        continue;
      }
      if (o >= 55296 && o <= 57343) {
        s += e("UTF16_SURROGATE", s - 1 - a, t, n, o);
        continue;
      }
      if (o <= c) {
        s += e("OVERLONG", s - 1 - a, t, n, o);
        continue;
      }
      n.push(o);
    }
  }
  return n;
}
function Ee(r, e) {
  e != null && (lf(e), r = r.normalize(e));
  let t = [];
  for (let n = 0; n < r.length; n++) {
    const s = r.charCodeAt(n);
    if (s < 128)
      t.push(s);
    else if (s < 2048)
      t.push(s >> 6 | 192), t.push(s & 63 | 128);
    else if ((s & 64512) == 55296) {
      n++;
      const i = r.charCodeAt(n);
      b(n < r.length && (i & 64512) === 56320, "invalid surrogate pair", "str", r);
      const a = 65536 + ((s & 1023) << 10) + (i & 1023);
      t.push(a >> 18 | 240), t.push(a >> 12 & 63 | 128), t.push(a >> 6 & 63 | 128), t.push(a & 63 | 128);
    } else
      t.push(s >> 12 | 224), t.push(s >> 6 & 63 | 128), t.push(s & 63 | 128);
  }
  return new Uint8Array(t);
}
function zu(r) {
  return r.map((e) => e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10 & 1023) + 55296, (e & 1023) + 56320))).join("");
}
function io(r, e) {
  return zu(Qu(r, e));
}
async function Ju(r, e) {
  const t = r.url.split(":")[0].toLowerCase();
  A(t === "http" || t === "https", `unsupported protocol ${t}`, "UNSUPPORTED_OPERATION", {
    info: { protocol: t },
    operation: "request"
  }), A(t === "https" || !r.credentials || r.allowInsecureAuthentication, "insecure authorized connections unsupported", "UNSUPPORTED_OPERATION", {
    operation: "request"
  });
  let n;
  if (e) {
    const f = new AbortController();
    n = f.signal, e.addListener(() => {
      f.abort();
    });
  }
  const s = {
    method: r.method,
    headers: new Headers(Array.from(r)),
    body: r.body || void 0,
    signal: n
  }, i = await fetch(r.url, s), a = {};
  i.headers.forEach((f, u) => {
    a[u.toLowerCase()] = f;
  });
  const c = await i.arrayBuffer(), o = c == null ? null : new Uint8Array(c);
  return {
    statusCode: i.status,
    statusMessage: i.statusText,
    headers: a,
    body: o
  };
}
const ju = 12, Wu = 250;
let Mo = Ju;
const Yu = new RegExp("^data:([^;:]*)?(;base64)?,(.*)$", "i"), Zu = new RegExp("^ipfs://(ipfs/)?(.*)$", "i");
let rc = !1;
async function yf(r, e) {
  try {
    const t = r.match(Yu);
    if (!t)
      throw new Error("invalid data");
    return new mn(200, "OK", {
      "content-type": t[1] || "text/plain"
    }, t[2] ? Gu(t[3]) : $u(t[3]));
  } catch {
    return new mn(599, "BAD REQUEST (invalid data: URI)", {}, null, new Jt(r));
  }
}
function mf(r) {
  async function e(t, n) {
    try {
      const s = t.match(Zu);
      if (!s)
        throw new Error("invalid link");
      return new Jt(`${r}${s[2]}`);
    } catch {
      return new mn(599, "BAD REQUEST (invalid IPFS URI)", {}, null, new Jt(t));
    }
  }
  return e;
}
const Qi = {
  data: yf,
  ipfs: mf("https://gateway.ipfs.io/ipfs/")
}, wf = /* @__PURE__ */ new WeakMap();
var Fn, nn;
class Xu {
  constructor(e) {
    y(this, Fn, void 0);
    y(this, nn, void 0);
    x(this, Fn, []), x(this, nn, !1), wf.set(e, () => {
      if (!l(this, nn)) {
        x(this, nn, !0);
        for (const t of l(this, Fn))
          setTimeout(() => {
            t();
          }, 0);
        x(this, Fn, []);
      }
    });
  }
  addListener(e) {
    A(!l(this, nn), "singal already cancelled", "UNSUPPORTED_OPERATION", {
      operation: "fetchCancelSignal.addCancelListener"
    }), l(this, Fn).push(e);
  }
  get cancelled() {
    return l(this, nn);
  }
  checkSignal() {
    A(!this.cancelled, "cancelled", "CANCELLED", {});
  }
}
Fn = new WeakMap(), nn = new WeakMap();
function zi(r) {
  if (r == null)
    throw new Error("missing signal; should not happen");
  return r.checkSignal(), r;
}
var Br, Ur, qe, kt, Lr, Fr, re, Te, Ot, Dn, Mn, Gn, ht, Tt, Hn, Ms;
const Ma = class Ma {
  /**
   *  Create a new FetchRequest instance with default values.
   *
   *  Once created, each property may be set before issuing a
   *  ``.send()`` to make the request.
   */
  constructor(e) {
    y(this, Hn);
    y(this, Br, void 0);
    y(this, Ur, void 0);
    y(this, qe, void 0);
    y(this, kt, void 0);
    y(this, Lr, void 0);
    y(this, Fr, void 0);
    y(this, re, void 0);
    y(this, Te, void 0);
    y(this, Ot, void 0);
    // Hooks
    y(this, Dn, void 0);
    y(this, Mn, void 0);
    y(this, Gn, void 0);
    y(this, ht, void 0);
    y(this, Tt, void 0);
    x(this, Fr, String(e)), x(this, Br, !1), x(this, Ur, !0), x(this, qe, {}), x(this, kt, ""), x(this, Lr, 3e5), x(this, Tt, {
      slotInterval: Wu,
      maxAttempts: ju
    });
  }
  /**
   *  The fetch URI to requrest.
   */
  get url() {
    return l(this, Fr);
  }
  set url(e) {
    x(this, Fr, String(e));
  }
  /**
   *  The fetch body, if any, to send as the request body. //(default: null)//
   *
   *  When setting a body, the intrinsic ``Content-Type`` is automatically
   *  set and will be used if **not overridden** by setting a custom
   *  header.
   *
   *  If %%body%% is null, the body is cleared (along with the
   *  intrinsic ``Content-Type``) and the .
   *
   *  If %%body%% is a string, the intrincis ``Content-Type`` is set to
   *  ``text/plain``.
   *
   *  If %%body%% is a Uint8Array, the intrincis ``Content-Type`` is set to
   *  ``application/octet-stream``.
   *
   *  If %%body%% is any other object, the intrincis ``Content-Type`` is
   *  set to ``application/json``.
   */
  get body() {
    return l(this, re) == null ? null : new Uint8Array(l(this, re));
  }
  set body(e) {
    if (e == null)
      x(this, re, void 0), x(this, Te, void 0);
    else if (typeof e == "string")
      x(this, re, Ee(e)), x(this, Te, "text/plain");
    else if (e instanceof Uint8Array)
      x(this, re, e), x(this, Te, "application/octet-stream");
    else if (typeof e == "object")
      x(this, re, Ee(JSON.stringify(e))), x(this, Te, "application/json");
    else
      throw new Error("invalid body");
  }
  /**
   *  Returns true if the request has a body.
   */
  hasBody() {
    return l(this, re) != null;
  }
  /**
   *  The HTTP method to use when requesting the URI. If no method
   *  has been explicitly set, then ``GET`` is used if the body is
   *  null and ``POST`` otherwise.
   */
  get method() {
    return l(this, kt) ? l(this, kt) : this.hasBody() ? "POST" : "GET";
  }
  set method(e) {
    e == null && (e = ""), x(this, kt, String(e).toUpperCase());
  }
  /**
   *  The headers that will be used when requesting the URI. All
   *  keys are lower-case.
   *
   *  This object is a copy, so any chnages will **NOT** be reflected
   *  in the ``FetchRequest``.
   *
   *  To set a header entry, use the ``setHeader`` method.
   */
  get headers() {
    const e = Object.assign({}, l(this, qe));
    return l(this, Ot) && (e.authorization = `Basic ${Hu(Ee(l(this, Ot)))}`), this.allowGzip && (e["accept-encoding"] = "gzip"), e["content-type"] == null && l(this, Te) && (e["content-type"] = l(this, Te)), this.body && (e["content-length"] = String(this.body.length)), e;
  }
  /**
   *  Get the header for %%key%%, ignoring case.
   */
  getHeader(e) {
    return this.headers[e.toLowerCase()];
  }
  /**
   *  Set the header for %%key%% to %%value%%. All values are coerced
   *  to a string.
   */
  setHeader(e, t) {
    l(this, qe)[String(e).toLowerCase()] = String(t);
  }
  /**
   *  Clear all headers, resetting all intrinsic headers.
   */
  clearHeaders() {
    x(this, qe, {});
  }
  [Symbol.iterator]() {
    const e = this.headers, t = Object.keys(e);
    let n = 0;
    return {
      next: () => {
        if (n < t.length) {
          const s = t[n++];
          return {
            value: [s, e[s]],
            done: !1
          };
        }
        return { value: void 0, done: !0 };
      }
    };
  }
  /**
   *  The value that will be sent for the ``Authorization`` header.
   *
   *  To set the credentials, use the ``setCredentials`` method.
   */
  get credentials() {
    return l(this, Ot) || null;
  }
  /**
   *  Sets an ``Authorization`` for %%username%% with %%password%%.
   */
  setCredentials(e, t) {
    b(!e.match(/:/), "invalid basic authentication username", "username", "[REDACTED]"), x(this, Ot, `${e}:${t}`);
  }
  /**
   *  Enable and request gzip-encoded responses. The response will
   *  automatically be decompressed. //(default: true)//
   */
  get allowGzip() {
    return l(this, Ur);
  }
  set allowGzip(e) {
    x(this, Ur, !!e);
  }
  /**
   *  Allow ``Authentication`` credentials to be sent over insecure
   *  channels. //(default: false)//
   */
  get allowInsecureAuthentication() {
    return !!l(this, Br);
  }
  set allowInsecureAuthentication(e) {
    x(this, Br, !!e);
  }
  /**
   *  The timeout (in milliseconds) to wait for a complere response.
   *  //(default: 5 minutes)//
   */
  get timeout() {
    return l(this, Lr);
  }
  set timeout(e) {
    b(e >= 0, "timeout must be non-zero", "timeout", e), x(this, Lr, e);
  }
  /**
   *  This function is called prior to each request, for example
   *  during a redirection or retry in case of server throttling.
   *
   *  This offers an opportunity to populate headers or update
   *  content before sending a request.
   */
  get preflightFunc() {
    return l(this, Dn) || null;
  }
  set preflightFunc(e) {
    x(this, Dn, e);
  }
  /**
   *  This function is called after each response, offering an
   *  opportunity to provide client-level throttling or updating
   *  response data.
   *
   *  Any error thrown in this causes the ``send()`` to throw.
   *
   *  To schedule a retry attempt (assuming the maximum retry limit
   *  has not been reached), use [[response.throwThrottleError]].
   */
  get processFunc() {
    return l(this, Mn) || null;
  }
  set processFunc(e) {
    x(this, Mn, e);
  }
  /**
   *  This function is called on each retry attempt.
   */
  get retryFunc() {
    return l(this, Gn) || null;
  }
  set retryFunc(e) {
    x(this, Gn, e);
  }
  toString() {
    return `<FetchRequest method=${JSON.stringify(this.method)} url=${JSON.stringify(this.url)} headers=${JSON.stringify(this.headers)} body=${l(this, re) ? N(l(this, re)) : "null"}>`;
  }
  /**
   *  Update the throttle parameters used to determine maximum
   *  attempts and exponential-backoff properties.
   */
  setThrottleParams(e) {
    e.slotInterval != null && (l(this, Tt).slotInterval = e.slotInterval), e.maxAttempts != null && (l(this, Tt).maxAttempts = e.maxAttempts);
  }
  /**
   *  Resolves to the response by sending the request.
   */
  send() {
    return A(l(this, ht) == null, "request already sent", "UNSUPPORTED_OPERATION", { operation: "fetchRequest.send" }), x(this, ht, new Xu(this)), P(this, Hn, Ms).call(this, 0, Go() + this.timeout, 0, this, new mn(0, "", {}, null, this));
  }
  /**
   *  Cancels the inflight response, causing a ``CANCELLED``
   *  error to be rejected from the [[send]].
   */
  cancel() {
    A(l(this, ht) != null, "request has not been sent", "UNSUPPORTED_OPERATION", { operation: "fetchRequest.cancel" });
    const e = wf.get(this);
    if (!e)
      throw new Error("missing signal; should not happen");
    e();
  }
  /**
   *  Returns a new [[FetchRequest]] that represents the redirection
   *  to %%location%%.
   */
  redirect(e) {
    const t = this.url.split(":")[0].toLowerCase(), n = e.split(":")[0].toLowerCase();
    A(this.method === "GET" && (t !== "https" || n !== "http") && e.match(/^https?:/), "unsupported redirect", "UNSUPPORTED_OPERATION", {
      operation: `redirect(${this.method} ${JSON.stringify(this.url)} => ${JSON.stringify(e)})`
    });
    const s = new Ma(e);
    return s.method = "GET", s.allowGzip = this.allowGzip, s.timeout = this.timeout, x(s, qe, Object.assign({}, l(this, qe))), l(this, re) && x(s, re, new Uint8Array(l(this, re))), x(s, Te, l(this, Te)), s;
  }
  /**
   *  Create a new copy of this request.
   */
  clone() {
    const e = new Ma(this.url);
    return x(e, kt, l(this, kt)), l(this, re) && x(e, re, l(this, re)), x(e, Te, l(this, Te)), x(e, qe, Object.assign({}, l(this, qe))), x(e, Ot, l(this, Ot)), this.allowGzip && (e.allowGzip = !0), e.timeout = this.timeout, this.allowInsecureAuthentication && (e.allowInsecureAuthentication = !0), x(e, Dn, l(this, Dn)), x(e, Mn, l(this, Mn)), x(e, Gn, l(this, Gn)), e;
  }
  /**
   *  Locks all static configuration for gateways and FetchGetUrlFunc
   *  registration.
   */
  static lockConfig() {
    rc = !0;
  }
  /**
   *  Get the current Gateway function for %%scheme%%.
   */
  static getGateway(e) {
    return Qi[e.toLowerCase()] || null;
  }
  /**
   *  Use the %%func%% when fetching URIs using %%scheme%%.
   *
   *  This method affects all requests globally.
   *
   *  If [[lockConfig]] has been called, no change is made and this
   *  throws.
   */
  static registerGateway(e, t) {
    if (e = e.toLowerCase(), e === "http" || e === "https")
      throw new Error(`cannot intercept ${e}; use registerGetUrl`);
    if (rc)
      throw new Error("gateways locked");
    Qi[e] = t;
  }
  /**
   *  Use %%getUrl%% when fetching URIs over HTTP and HTTPS requests.
   *
   *  This method affects all requests globally.
   *
   *  If [[lockConfig]] has been called, no change is made and this
   *  throws.
   */
  static registerGetUrl(e) {
    if (rc)
      throw new Error("gateways locked");
    Mo = e;
  }
  /**
   *  Creates a function that can "fetch" data URIs.
   *
   *  Note that this is automatically done internally to support
   *  data URIs, so it is not necessary to register it.
   *
   *  This is not generally something that is needed, but may
   *  be useful in a wrapper to perfom custom data URI functionality.
   */
  static createDataGateway() {
    return yf;
  }
  /**
   *  Creates a function that will fetch IPFS (unvalidated) from
   *  a custom gateway baseUrl.
   *
   *  The default IPFS gateway used internally is
   *  ``"https:/\/gateway.ipfs.io/ipfs/"``.
   */
  static createIpfsGatewayFunc(e) {
    return mf(e);
  }
};
Br = new WeakMap(), Ur = new WeakMap(), qe = new WeakMap(), kt = new WeakMap(), Lr = new WeakMap(), Fr = new WeakMap(), re = new WeakMap(), Te = new WeakMap(), Ot = new WeakMap(), Dn = new WeakMap(), Mn = new WeakMap(), Gn = new WeakMap(), ht = new WeakMap(), Tt = new WeakMap(), Hn = new WeakSet(), Ms = async function(e, t, n, s, i) {
  var u, d, h;
  if (e >= l(this, Tt).maxAttempts)
    return i.makeServerError("exceeded maximum retry limit");
  A(Go() <= t, "timeout", "TIMEOUT", {
    operation: "request.send",
    reason: "timeout",
    request: s
  }), n > 0 && await qu(n);
  let a = this.clone();
  const c = (a.url.split(":")[0] || "").toLowerCase();
  if (c in Qi) {
    const p = await Qi[c](a.url, zi(l(s, ht)));
    if (p instanceof mn) {
      let m = p;
      if (this.processFunc) {
        zi(l(s, ht));
        try {
          m = await this.processFunc(a, m);
        } catch (w) {
          (w.throttle == null || typeof w.stall != "number") && m.makeServerError("error in post-processing function", w).assertOk();
        }
      }
      return m;
    }
    a = p;
  }
  this.preflightFunc && (a = await this.preflightFunc(a));
  const o = await Mo(a, zi(l(s, ht)));
  let f = new mn(o.statusCode, o.statusMessage, o.headers, o.body, s);
  if (f.statusCode === 301 || f.statusCode === 302) {
    try {
      const p = f.headers.location || "";
      return P(u = a.redirect(p), Hn, Ms).call(u, e + 1, t, 0, s, f);
    } catch {
    }
    return f;
  } else if (f.statusCode === 429 && (this.retryFunc == null || await this.retryFunc(a, f, e))) {
    const p = f.headers["retry-after"];
    let m = l(this, Tt).slotInterval * Math.trunc(Math.random() * Math.pow(2, e));
    return typeof p == "string" && p.match(/^[1-9][0-9]*$/) && (m = parseInt(p)), P(d = a.clone(), Hn, Ms).call(d, e + 1, t, m, s, f);
  }
  if (this.processFunc) {
    zi(l(s, ht));
    try {
      f = await this.processFunc(a, f);
    } catch (p) {
      (p.throttle == null || typeof p.stall != "number") && f.makeServerError("error in post-processing function", p).assertOk();
      let m = l(this, Tt).slotInterval * Math.trunc(Math.random() * Math.pow(2, e));
      return p.stall >= 0 && (m = p.stall), P(h = a.clone(), Hn, Ms).call(h, e + 1, t, m, s, f);
    }
  }
  return f;
};
let Jt = Ma;
var bi, pi, gi, et, Dr, Kn;
const To = class To {
  constructor(e, t, n, s, i) {
    y(this, bi, void 0);
    y(this, pi, void 0);
    y(this, gi, void 0);
    y(this, et, void 0);
    y(this, Dr, void 0);
    y(this, Kn, void 0);
    x(this, bi, e), x(this, pi, t), x(this, gi, Object.keys(n).reduce((a, c) => (a[c.toLowerCase()] = String(n[c]), a), {})), x(this, et, s == null ? null : new Uint8Array(s)), x(this, Dr, i || null), x(this, Kn, { message: "" });
  }
  toString() {
    return `<FetchResponse status=${this.statusCode} body=${l(this, et) ? N(l(this, et)) : "null"}>`;
  }
  /**
   *  The response status code.
   */
  get statusCode() {
    return l(this, bi);
  }
  /**
   *  The response status message.
   */
  get statusMessage() {
    return l(this, pi);
  }
  /**
   *  The response headers. All keys are lower-case.
   */
  get headers() {
    return Object.assign({}, l(this, gi));
  }
  /**
   *  The response body, or ``null`` if there was no body.
   */
  get body() {
    return l(this, et) == null ? null : new Uint8Array(l(this, et));
  }
  /**
   *  The response body as a UTF-8 encoded string, or the empty
   *  string (i.e. ``""``) if there was no body.
   *
   *  An error is thrown if the body is invalid UTF-8 data.
   */
  get bodyText() {
    try {
      return l(this, et) == null ? "" : io(l(this, et));
    } catch {
      A(!1, "response body is not valid UTF-8 data", "UNSUPPORTED_OPERATION", {
        operation: "bodyText",
        info: { response: this }
      });
    }
  }
  /**
   *  The response body, decoded as JSON.
   *
   *  An error is thrown if the body is invalid JSON-encoded data
   *  or if there was no body.
   */
  get bodyJson() {
    try {
      return JSON.parse(this.bodyText);
    } catch {
      A(!1, "response body is not valid JSON", "UNSUPPORTED_OPERATION", {
        operation: "bodyJson",
        info: { response: this }
      });
    }
  }
  [Symbol.iterator]() {
    const e = this.headers, t = Object.keys(e);
    let n = 0;
    return {
      next: () => {
        if (n < t.length) {
          const s = t[n++];
          return {
            value: [s, e[s]],
            done: !1
          };
        }
        return { value: void 0, done: !0 };
      }
    };
  }
  /**
   *  Return a Response with matching headers and body, but with
   *  an error status code (i.e. 599) and %%message%% with an
   *  optional %%error%%.
   */
  makeServerError(e, t) {
    let n;
    e ? n = `CLIENT ESCALATED SERVER ERROR (${this.statusCode} ${this.statusMessage}; ${e})` : (e = `${this.statusCode} ${this.statusMessage}`, n = `CLIENT ESCALATED SERVER ERROR (${e})`);
    const s = new To(599, n, this.headers, this.body, l(this, Dr) || void 0);
    return x(s, Kn, { message: e, error: t }), s;
  }
  /**
   *  If called within a [request.processFunc](FetchRequest-processFunc)
   *  call, causes the request to retry as if throttled for %%stall%%
   *  milliseconds.
   */
  throwThrottleError(e, t) {
    t == null ? t = -1 : b(Number.isInteger(t) && t >= 0, "invalid stall timeout", "stall", t);
    const n = new Error(e || "throttling requests");
    throw T(n, { stall: t, throttle: !0 }), n;
  }
  /**
   *  Get the header value for %%key%%, ignoring case.
   */
  getHeader(e) {
    return this.headers[e.toLowerCase()];
  }
  /**
   *  Returns true of the response has a body.
   */
  hasBody() {
    return l(this, et) != null;
  }
  /**
   *  The request made for this response.
   */
  get request() {
    return l(this, Dr);
  }
  /**
   *  Returns true if this response was a success statusCode.
   */
  ok() {
    return l(this, Kn).message === "" && this.statusCode >= 200 && this.statusCode < 300;
  }
  /**
   *  Throws a ``SERVER_ERROR`` if this response is not ok.
   */
  assertOk() {
    if (this.ok())
      return;
    let { message: e, error: t } = l(this, Kn);
    e === "" && (e = `server response ${this.statusCode} ${this.statusMessage}`), A(!1, e, "SERVER_ERROR", {
      request: this.request || "unknown request",
      response: this,
      error: t
    });
  }
};
bi = new WeakMap(), pi = new WeakMap(), gi = new WeakMap(), et = new WeakMap(), Dr = new WeakMap(), Kn = new WeakMap();
let mn = To;
function Go() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function $u(r) {
  return Ee(r.replace(/%([0-9a-f][0-9a-f])/gi, (e, t) => String.fromCharCode(parseInt(t, 16))));
}
function qu(r) {
  return new Promise((e) => setTimeout(e, r));
}
function ed(r) {
  let e = r.toString(16);
  for (; e.length < 2; )
    e = "0" + e;
  return "0x" + e;
}
function Ho(r, e, t) {
  let n = 0;
  for (let s = 0; s < t; s++)
    n = n * 256 + r[e + s];
  return n;
}
function Ko(r, e, t, n) {
  const s = [];
  for (; t < e + 1 + n; ) {
    const i = Af(r, t);
    s.push(i.result), t += i.consumed, A(t <= e + 1 + n, "child data too short", "BUFFER_OVERRUN", {
      buffer: r,
      length: n,
      offset: e
    });
  }
  return { consumed: 1 + n, result: s };
}
function Af(r, e) {
  A(r.length !== 0, "data too short", "BUFFER_OVERRUN", {
    buffer: r,
    length: 0,
    offset: 1
  });
  const t = (n) => {
    A(n <= r.length, "data short segment too short", "BUFFER_OVERRUN", {
      buffer: r,
      length: r.length,
      offset: n
    });
  };
  if (r[e] >= 248) {
    const n = r[e] - 247;
    t(e + 1 + n);
    const s = Ho(r, e + 1, n);
    return t(e + 1 + n + s), Ko(r, e, e + 1 + n, n + s);
  } else if (r[e] >= 192) {
    const n = r[e] - 192;
    return t(e + 1 + n), Ko(r, e, e + 1, n);
  } else if (r[e] >= 184) {
    const n = r[e] - 183;
    t(e + 1 + n);
    const s = Ho(r, e + 1, n);
    t(e + 1 + n + s);
    const i = N(r.slice(e + 1 + n, e + 1 + n + s));
    return { consumed: 1 + n + s, result: i };
  } else if (r[e] >= 128) {
    const n = r[e] - 128;
    t(e + 1 + n);
    const s = N(r.slice(e + 1, e + 1 + n));
    return { consumed: 1 + n, result: s };
  }
  return { consumed: 1, result: ed(r[e]) };
}
function ao(r) {
  const e = O(r, "data"), t = Af(e, 0);
  return b(t.consumed === e.length, "unexpected junk after rlp payload", "data", r), t.result;
}
function Vo(r) {
  const e = [];
  for (; r; )
    e.unshift(r & 255), r >>= 8;
  return e;
}
function Ef(r) {
  if (Array.isArray(r)) {
    let n = [];
    if (r.forEach(function(i) {
      n = n.concat(Ef(i));
    }), n.length <= 55)
      return n.unshift(192 + n.length), n;
    const s = Vo(n.length);
    return s.unshift(247 + s.length), s.concat(n);
  }
  const e = Array.prototype.slice.call(O(r, "object"));
  if (e.length === 1 && e[0] <= 127)
    return e;
  if (e.length <= 55)
    return e.unshift(128 + e.length), e;
  const t = Vo(e.length);
  return t.unshift(183 + t.length), t.concat(e);
}
const _o = "0123456789abcdef";
function ei(r) {
  let e = "0x";
  for (const t of Ef(r))
    e += _o[t >> 4], e += _o[t & 15];
  return e;
}
function td(r) {
  const e = O(r, "randomBytes");
  e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
  const t = N(e);
  return [
    t.substring(2, 10),
    t.substring(10, 14),
    t.substring(14, 18),
    t.substring(18, 22),
    t.substring(22, 34)
  ].join("-");
}
const we = 32, Ic = new Uint8Array(we), nd = ["then"], Ji = {};
function Bs(r, e) {
  const t = new Error(`deferred error during ABI decoding triggered accessing ${r}`);
  throw t.error = e, t;
}
var rn;
const $s = class $s extends Array {
  /**
   *  @private
   */
  constructor(...t) {
    const n = t[0];
    let s = t[1], i = (t[2] || []).slice(), a = !0;
    n !== Ji && (s = t, i = [], a = !1);
    super(s.length);
    y(this, rn, void 0);
    s.forEach((o, f) => {
      this[f] = o;
    });
    const c = i.reduce((o, f) => (typeof f == "string" && o.set(f, (o.get(f) || 0) + 1), o), /* @__PURE__ */ new Map());
    if (x(this, rn, Object.freeze(s.map((o, f) => {
      const u = i[f];
      return u != null && c.get(u) === 1 ? u : null;
    }))), !!a)
      return Object.freeze(this), new Proxy(this, {
        get: (o, f, u) => {
          if (typeof f == "string") {
            if (f.match(/^[0-9]+$/)) {
              const h = L(f, "%index");
              if (h < 0 || h >= this.length)
                throw new RangeError("out of result range");
              const p = o[h];
              return p instanceof Error && Bs(`index ${h}`, p), p;
            }
            if (nd.indexOf(f) >= 0)
              return Reflect.get(o, f, u);
            const d = o[f];
            if (d instanceof Function)
              return function(...h) {
                return d.apply(this === u ? o : this, h);
              };
            if (!(f in o))
              return o.getValue.apply(this === u ? o : this, [f]);
          }
          return Reflect.get(o, f, u);
        }
      });
  }
  /**
   *  Returns the Result as a normal Array.
   *
   *  This will throw if there are any outstanding deferred
   *  errors.
   */
  toArray() {
    const t = [];
    return this.forEach((n, s) => {
      n instanceof Error && Bs(`index ${s}`, n), t.push(n);
    }), t;
  }
  /**
   *  Returns the Result as an Object with each name-value pair.
   *
   *  This will throw if any value is unnamed, or if there are
   *  any outstanding deferred errors.
   */
  toObject() {
    return l(this, rn).reduce((t, n, s) => (A(n != null, "value at index ${ index } unnamed", "UNSUPPORTED_OPERATION", {
      operation: "toObject()"
    }), n in t || (t[n] = this.getValue(n)), t), {});
  }
  /**
   *  @_ignore
   */
  slice(t, n) {
    t == null && (t = 0), t < 0 && (t += this.length, t < 0 && (t = 0)), n == null && (n = this.length), n < 0 && (n += this.length, n < 0 && (n = 0)), n > this.length && (n = this.length);
    const s = [], i = [];
    for (let a = t; a < n; a++)
      s.push(this[a]), i.push(l(this, rn)[a]);
    return new $s(Ji, s, i);
  }
  /**
   *  @_ignore
   */
  filter(t, n) {
    const s = [], i = [];
    for (let a = 0; a < this.length; a++) {
      const c = this[a];
      c instanceof Error && Bs(`index ${a}`, c), t.call(n, c, a, this) && (s.push(c), i.push(l(this, rn)[a]));
    }
    return new $s(Ji, s, i);
  }
  /**
   *  @_ignore
   */
  map(t, n) {
    const s = [];
    for (let i = 0; i < this.length; i++) {
      const a = this[i];
      a instanceof Error && Bs(`index ${i}`, a), s.push(t.call(n, a, i, this));
    }
    return s;
  }
  /**
   *  Returns the value for %%name%%.
   *
   *  Since it is possible to have a key whose name conflicts with
   *  a method on a [[Result]] or its superclass Array, or any
   *  JavaScript keyword, this ensures all named values are still
   *  accessible by name.
   */
  getValue(t) {
    const n = l(this, rn).indexOf(t);
    if (n === -1)
      return;
    const s = this[n];
    return s instanceof Error && Bs(`property ${JSON.stringify(t)}`, s.error), s;
  }
  /**
   *  Creates a new [[Result]] for %%items%% with each entry
   *  also accessible by its corresponding name in %%keys%%.
   */
  static fromItems(t, n) {
    return new $s(Ji, t, n);
  }
};
rn = new WeakMap();
let wa = $s;
function Qo(r) {
  let e = me(r);
  return A(e.length <= we, "value out-of-bounds", "BUFFER_OVERRUN", { buffer: e, length: we, offset: e.length }), e.length !== we && (e = be(_([Ic.slice(e.length % we), e]))), e;
}
class Yt {
  constructor(e, t, n, s) {
    // The coder name:
    //   - address, uint256, tuple, array, etc.
    g(this, "name");
    // The fully expanded type, including composite types:
    //   - address, uint256, tuple(address,bytes), uint256[3][4][],  etc.
    g(this, "type");
    // The localName bound in the signature, in this example it is "baz":
    //   - tuple(address foo, uint bar) baz
    g(this, "localName");
    // Whether this type is dynamic:
    //  - Dynamic: bytes, string, address[], tuple(boolean[]), etc.
    //  - Not Dynamic: address, uint256, boolean[3], tuple(address, uint8)
    g(this, "dynamic");
    T(this, { name: e, type: t, localName: n, dynamic: s }, {
      name: "string",
      type: "string",
      localName: "string",
      dynamic: "boolean"
    });
  }
  _throwError(e, t) {
    b(!1, e, this.localName, t);
  }
}
var Rt, Vn, Mr, ca;
class vc {
  constructor() {
    y(this, Mr);
    // An array of WordSize lengthed objects to concatenation
    y(this, Rt, void 0);
    y(this, Vn, void 0);
    x(this, Rt, []), x(this, Vn, 0);
  }
  get data() {
    return _(l(this, Rt));
  }
  get length() {
    return l(this, Vn);
  }
  appendWriter(e) {
    return P(this, Mr, ca).call(this, be(e.data));
  }
  // Arrayish item; pad on the right to *nearest* WordSize
  writeBytes(e) {
    let t = be(e);
    const n = t.length % we;
    return n && (t = be(_([t, Ic.slice(n)]))), P(this, Mr, ca).call(this, t);
  }
  // Numeric item; pad on the left *to* WordSize
  writeValue(e) {
    return P(this, Mr, ca).call(this, Qo(e));
  }
  // Inserts a numeric place-holder, returning a callback that can
  // be used to asjust the value later
  writeUpdatableValue() {
    const e = l(this, Rt).length;
    return l(this, Rt).push(Ic), x(this, Vn, l(this, Vn) + we), (t) => {
      l(this, Rt)[e] = Qo(t);
    };
  }
}
Rt = new WeakMap(), Vn = new WeakMap(), Mr = new WeakSet(), ca = function(e) {
  return l(this, Rt).push(e), x(this, Vn, l(this, Vn) + e.length), e.length;
};
var Re, _e, Ga, Cf;
const Ro = class Ro {
  constructor(e, t) {
    y(this, Ga);
    // Allows incomplete unpadded data to be read; otherwise an error
    // is raised if attempting to overrun the buffer. This is required
    // to deal with an old Solidity bug, in which event data for
    // external (not public thoguh) was tightly packed.
    g(this, "allowLoose");
    y(this, Re, void 0);
    y(this, _e, void 0);
    T(this, { allowLoose: !!t }), x(this, Re, be(e)), x(this, _e, 0);
  }
  get data() {
    return N(l(this, Re));
  }
  get dataLength() {
    return l(this, Re).length;
  }
  get consumed() {
    return l(this, _e);
  }
  get bytes() {
    return new Uint8Array(l(this, Re));
  }
  // Create a sub-reader with the same underlying data, but offset
  subReader(e) {
    return new Ro(l(this, Re).slice(l(this, _e) + e), this.allowLoose);
  }
  // Read bytes
  readBytes(e, t) {
    let n = P(this, Ga, Cf).call(this, 0, e, !!t);
    return x(this, _e, l(this, _e) + n.length), n.slice(0, e);
  }
  // Read a numeric values
  readValue() {
    return Wa(this.readBytes(we));
  }
  readIndex() {
    return Lu(this.readBytes(we));
  }
};
Re = new WeakMap(), _e = new WeakMap(), Ga = new WeakSet(), Cf = function(e, t, n) {
  let s = Math.ceil(t / we) * we;
  return l(this, _e) + s > l(this, Re).length && (this.allowLoose && n && l(this, _e) + t <= l(this, Re).length ? s = t : A(!1, "data out-of-bounds", "BUFFER_OVERRUN", {
    buffer: be(l(this, Re)),
    length: l(this, Re).length,
    offset: l(this, _e) + s
  })), l(this, Re).slice(l(this, _e), l(this, _e) + s);
};
let kc = Ro;
function Oc(r) {
  if (!Number.isSafeInteger(r) || r < 0)
    throw new Error(`Wrong positive integer: ${r}`);
}
function rd(r) {
  if (typeof r != "boolean")
    throw new Error(`Expected boolean, not ${r}`);
}
function Pf(r, ...e) {
  if (!(r instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(r.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${r.length}`);
}
function sd(r) {
  if (typeof r != "function" || typeof r.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Oc(r.outputLen), Oc(r.blockLen);
}
function id(r, e = !0) {
  if (r.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && r.finished)
    throw new Error("Hash#digest() has already been called");
}
function ad(r, e) {
  Pf(r);
  const t = e.outputLen;
  if (r.length < t)
    throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
const X = {
  number: Oc,
  bool: rd,
  bytes: Pf,
  hash: sd,
  exists: id,
  output: ad
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const oa = (r) => new Uint32Array(r.buffer, r.byteOffset, Math.floor(r.byteLength / 4)), fa = (r) => new DataView(r.buffer, r.byteOffset, r.byteLength), lt = (r, e) => r << 32 - e | r >>> e, cd = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!cd)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (r, e) => e.toString(16).padStart(2, "0"));
const od = async () => {
};
async function zo(r, e, t) {
  let n = Date.now();
  for (let s = 0; s < r; s++) {
    t(s);
    const i = Date.now() - n;
    i >= 0 && i < e || (await od(), n += i);
  }
}
function fd(r) {
  if (typeof r != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof r}`);
  return new TextEncoder().encode(r);
}
function ar(r) {
  if (typeof r == "string" && (r = fd(r)), !(r instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof r})`);
  return r;
}
class Aa {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
const ld = (r) => Object.prototype.toString.call(r) === "[object Object]" && r.constructor === Object;
function Nf(r, e) {
  if (e !== void 0 && (typeof e != "object" || !ld(e)))
    throw new TypeError("Options should be object or undefined");
  return Object.assign(r, e);
}
function vs(r) {
  const e = (n) => r().update(ar(n)).digest(), t = r();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => r(), e;
}
function ud(r) {
  const e = (n, s) => r(s).update(ar(n)).digest(), t = r({});
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (n) => r(n), e;
}
class If extends Aa {
  constructor(e, t) {
    super(), this.finished = !1, this.destroyed = !1, X.hash(e);
    const n = ar(t);
    if (this.iHash = e.create(), !(this.iHash instanceof Aa))
      throw new TypeError("Expected instance of class which extends utils.Hash");
    const s = this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const i = new Uint8Array(s);
    i.set(n.length > this.iHash.blockLen ? e.create().update(n).digest() : n);
    for (let a = 0; a < i.length; a++)
      i[a] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let a = 0; a < i.length; a++)
      i[a] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(e) {
    return X.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    X.exists(this), X.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: t, iHash: n, finished: s, destroyed: i, blockLen: a, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = a, e.outputLen = c, e.oHash = t._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const co = (r, e, t) => new If(r, e).update(t).digest();
co.create = (r, e) => new If(r, e);
function dd(r, e, t, n) {
  X.hash(r);
  const s = Nf({ dkLen: 32, asyncTick: 10 }, n), { c: i, dkLen: a, asyncTick: c } = s;
  if (X.number(i), X.number(a), X.number(c), i < 1)
    throw new Error("PBKDF2: iterations (c) should be >= 1");
  const o = ar(e), f = ar(t), u = new Uint8Array(a), d = co.create(r, o), h = d._cloneInto().update(f);
  return { c: i, dkLen: a, asyncTick: c, DK: u, PRF: d, PRFSalt: h };
}
function hd(r, e, t, n, s) {
  return r.destroy(), e.destroy(), n && n.destroy(), s.fill(0), t;
}
function oo(r, e, t, n) {
  const { c: s, dkLen: i, DK: a, PRF: c, PRFSalt: o } = dd(r, e, t, n);
  let f;
  const u = new Uint8Array(4), d = fa(u), h = new Uint8Array(c.outputLen);
  for (let p = 1, m = 0; m < i; p++, m += c.outputLen) {
    const w = a.subarray(m, m + c.outputLen);
    d.setInt32(0, p, !1), (f = o._cloneInto(f)).update(u).digestInto(h), w.set(h.subarray(0, w.length));
    for (let E = 1; E < s; E++) {
      c._cloneInto(f).update(h).digestInto(h);
      for (let C = 0; C < w.length; C++)
        w[C] ^= h[C];
    }
  }
  return hd(c, o, a, f, h);
}
function xd(r, e, t, n) {
  if (typeof r.setBigUint64 == "function")
    return r.setBigUint64(e, t, n);
  const s = BigInt(32), i = BigInt(4294967295), a = Number(t >> s & i), c = Number(t & i), o = n ? 4 : 0, f = n ? 0 : 4;
  r.setUint32(e + o, a, n), r.setUint32(e + f, c, n);
}
class fo extends Aa {
  constructor(e, t, n, s) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = fa(this.buffer);
  }
  update(e) {
    X.exists(this);
    const { view: t, buffer: n, blockLen: s } = this;
    e = ar(e);
    const i = e.length;
    for (let a = 0; a < i; ) {
      const c = Math.min(s - this.pos, i - a);
      if (c === s) {
        const o = fa(e);
        for (; s <= i - a; a += s)
          this.process(o, a);
        continue;
      }
      n.set(e.subarray(a, a + c), this.pos), this.pos += c, a += c, this.pos === s && (this.process(t, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    X.exists(this), X.output(e, this), this.finished = !0;
    const { buffer: t, view: n, blockLen: s, isLE: i } = this;
    let { pos: a } = this;
    t[a++] = 128, this.buffer.subarray(a).fill(0), this.padOffset > s - a && (this.process(n, 0), a = 0);
    for (let o = a; o < s; o++)
      t[o] = 0;
    xd(n, s - 8, BigInt(this.length * 8), i), this.process(n, 0);
    const c = fa(e);
    this.get().forEach((o, f) => c.setUint32(4 * f, o, i));
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const n = e.slice(0, t);
    return this.destroy(), n;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: t, buffer: n, length: s, finished: i, destroyed: a, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = a, s % t && e.buffer.set(n), e;
  }
}
const bd = (r, e, t) => r & e ^ ~r & t, pd = (r, e, t) => r & e ^ r & t ^ e & t, gd = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), Zt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xt = new Uint32Array(64);
class yd extends fo {
  constructor() {
    super(64, 32, 8, !1), this.A = Zt[0] | 0, this.B = Zt[1] | 0, this.C = Zt[2] | 0, this.D = Zt[3] | 0, this.E = Zt[4] | 0, this.F = Zt[5] | 0, this.G = Zt[6] | 0, this.H = Zt[7] | 0;
  }
  get() {
    const { A: e, B: t, C: n, D: s, E: i, F: a, G: c, H: o } = this;
    return [e, t, n, s, i, a, c, o];
  }
  // prettier-ignore
  set(e, t, n, s, i, a, c, o) {
    this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = s | 0, this.E = i | 0, this.F = a | 0, this.G = c | 0, this.H = o | 0;
  }
  process(e, t) {
    for (let d = 0; d < 16; d++, t += 4)
      Xt[d] = e.getUint32(t, !1);
    for (let d = 16; d < 64; d++) {
      const h = Xt[d - 15], p = Xt[d - 2], m = lt(h, 7) ^ lt(h, 18) ^ h >>> 3, w = lt(p, 17) ^ lt(p, 19) ^ p >>> 10;
      Xt[d] = w + Xt[d - 7] + m + Xt[d - 16] | 0;
    }
    let { A: n, B: s, C: i, D: a, E: c, F: o, G: f, H: u } = this;
    for (let d = 0; d < 64; d++) {
      const h = lt(c, 6) ^ lt(c, 11) ^ lt(c, 25), p = u + h + bd(c, o, f) + gd[d] + Xt[d] | 0, w = (lt(n, 2) ^ lt(n, 13) ^ lt(n, 22)) + pd(n, s, i) | 0;
      u = f, f = o, o = c, c = a + p | 0, a = i, i = s, s = n, n = p + w | 0;
    }
    n = n + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, c = c + this.E | 0, o = o + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(n, s, i, a, c, o, f, u);
  }
  roundClean() {
    Xt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
const Fi = vs(() => new yd()), ji = BigInt(2 ** 32 - 1), Tc = BigInt(32);
function vf(r, e = !1) {
  return e ? { h: Number(r & ji), l: Number(r >> Tc & ji) } : { h: Number(r >> Tc & ji) | 0, l: Number(r & ji) | 0 };
}
function md(r, e = !1) {
  let t = new Uint32Array(r.length), n = new Uint32Array(r.length);
  for (let s = 0; s < r.length; s++) {
    const { h: i, l: a } = vf(r[s], e);
    [t[s], n[s]] = [i, a];
  }
  return [t, n];
}
const wd = (r, e) => BigInt(r >>> 0) << Tc | BigInt(e >>> 0), Ad = (r, e, t) => r >>> t, Ed = (r, e, t) => r << 32 - t | e >>> t, Cd = (r, e, t) => r >>> t | e << 32 - t, Pd = (r, e, t) => r << 32 - t | e >>> t, Nd = (r, e, t) => r << 64 - t | e >>> t - 32, Id = (r, e, t) => r >>> t - 32 | e << 64 - t, vd = (r, e) => e, kd = (r, e) => r, Od = (r, e, t) => r << t | e >>> 32 - t, Td = (r, e, t) => e << t | r >>> 32 - t, Rd = (r, e, t) => e << t - 32 | r >>> 64 - t, Sd = (r, e, t) => r << t - 32 | e >>> 64 - t;
function Bd(r, e, t, n) {
  const s = (e >>> 0) + (n >>> 0);
  return { h: r + t + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ud = (r, e, t) => (r >>> 0) + (e >>> 0) + (t >>> 0), Ld = (r, e, t, n) => e + t + n + (r / 2 ** 32 | 0) | 0, Fd = (r, e, t, n) => (r >>> 0) + (e >>> 0) + (t >>> 0) + (n >>> 0), Dd = (r, e, t, n, s) => e + t + n + s + (r / 2 ** 32 | 0) | 0, Md = (r, e, t, n, s) => (r >>> 0) + (e >>> 0) + (t >>> 0) + (n >>> 0) + (s >>> 0), Gd = (r, e, t, n, s, i) => e + t + n + s + i + (r / 2 ** 32 | 0) | 0, U = {
  fromBig: vf,
  split: md,
  toBig: wd,
  shrSH: Ad,
  shrSL: Ed,
  rotrSH: Cd,
  rotrSL: Pd,
  rotrBH: Nd,
  rotrBL: Id,
  rotr32H: vd,
  rotr32L: kd,
  rotlSH: Od,
  rotlSL: Td,
  rotlBH: Rd,
  rotlBL: Sd,
  add: Bd,
  add3L: Ud,
  add3H: Ld,
  add4L: Fd,
  add4H: Dd,
  add5H: Gd,
  add5L: Md
}, [Hd, Kd] = U.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((r) => BigInt(r))), $t = new Uint32Array(80), qt = new Uint32Array(80);
class lo extends fo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: t, Bh: n, Bl: s, Ch: i, Cl: a, Dh: c, Dl: o, Eh: f, El: u, Fh: d, Fl: h, Gh: p, Gl: m, Hh: w, Hl: E } = this;
    return [e, t, n, s, i, a, c, o, f, u, d, h, p, m, w, E];
  }
  // prettier-ignore
  set(e, t, n, s, i, a, c, o, f, u, d, h, p, m, w, E) {
    this.Ah = e | 0, this.Al = t | 0, this.Bh = n | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = a | 0, this.Dh = c | 0, this.Dl = o | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = d | 0, this.Fl = h | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, t) {
    for (let I = 0; I < 16; I++, t += 4)
      $t[I] = e.getUint32(t), qt[I] = e.getUint32(t += 4);
    for (let I = 16; I < 80; I++) {
      const K = $t[I - 15] | 0, R = qt[I - 15] | 0, J = U.rotrSH(K, R, 1) ^ U.rotrSH(K, R, 8) ^ U.shrSH(K, R, 7), se = U.rotrSL(K, R, 1) ^ U.rotrSL(K, R, 8) ^ U.shrSL(K, R, 7), Q = $t[I - 2] | 0, j = qt[I - 2] | 0, fe = U.rotrSH(Q, j, 19) ^ U.rotrBH(Q, j, 61) ^ U.shrSH(Q, j, 6), Ye = U.rotrSL(Q, j, 19) ^ U.rotrBL(Q, j, 61) ^ U.shrSL(Q, j, 6), Ue = U.add4L(se, Ye, qt[I - 7], qt[I - 16]), Ze = U.add4H(Ue, J, fe, $t[I - 7], $t[I - 16]);
      $t[I] = Ze | 0, qt[I] = Ue | 0;
    }
    let { Ah: n, Al: s, Bh: i, Bl: a, Ch: c, Cl: o, Dh: f, Dl: u, Eh: d, El: h, Fh: p, Fl: m, Gh: w, Gl: E, Hh: C, Hl: B } = this;
    for (let I = 0; I < 80; I++) {
      const K = U.rotrSH(d, h, 14) ^ U.rotrSH(d, h, 18) ^ U.rotrBH(d, h, 41), R = U.rotrSL(d, h, 14) ^ U.rotrSL(d, h, 18) ^ U.rotrBL(d, h, 41), J = d & p ^ ~d & w, se = h & m ^ ~h & E, Q = U.add5L(B, R, se, Kd[I], qt[I]), j = U.add5H(Q, C, K, J, Hd[I], $t[I]), fe = Q | 0, Ye = U.rotrSH(n, s, 28) ^ U.rotrBH(n, s, 34) ^ U.rotrBH(n, s, 39), Ue = U.rotrSL(n, s, 28) ^ U.rotrBL(n, s, 34) ^ U.rotrBL(n, s, 39), Ze = n & i ^ n & c ^ i & c, Ct = s & a ^ s & o ^ a & o;
      C = w | 0, B = E | 0, w = p | 0, E = m | 0, p = d | 0, m = h | 0, { h: d, l: h } = U.add(f | 0, u | 0, j | 0, fe | 0), f = c | 0, u = o | 0, c = i | 0, o = a | 0, i = n | 0, a = s | 0;
      const ft = U.add3L(fe, Ue, Ct);
      n = U.add3H(ft, j, Ye, Ze), s = ft | 0;
    }
    ({ h: n, l: s } = U.add(this.Ah | 0, this.Al | 0, n | 0, s | 0)), { h: i, l: a } = U.add(this.Bh | 0, this.Bl | 0, i | 0, a | 0), { h: c, l: o } = U.add(this.Ch | 0, this.Cl | 0, c | 0, o | 0), { h: f, l: u } = U.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: d, l: h } = U.add(this.Eh | 0, this.El | 0, d | 0, h | 0), { h: p, l: m } = U.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: w, l: E } = U.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: C, l: B } = U.add(this.Hh | 0, this.Hl | 0, C | 0, B | 0), this.set(n, s, i, a, c, o, f, u, d, h, p, m, w, E, C, B);
  }
  roundClean() {
    $t.fill(0), qt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Vd extends lo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class _d extends lo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
const uo = vs(() => new lo());
vs(() => new Vd());
vs(() => new _d());
function Qd() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("unable to locate global object");
}
const Jo = Qd(), jo = Jo.crypto || Jo.msCrypto;
function zd(r) {
  switch (r) {
    case "sha256":
      return Fi.create();
    case "sha512":
      return uo.create();
  }
  b(!1, "invalid hashing algorithm name", "algorithm", r);
}
function Jd(r, e) {
  const t = { sha256: Fi, sha512: uo }[r];
  return b(t != null, "invalid hmac algorithm", "algorithm", r), co.create(t, e);
}
function jd(r, e, t, n, s) {
  const i = { sha256: Fi, sha512: uo }[s];
  return b(i != null, "invalid pbkdf2 algorithm", "algorithm", s), oo(i, r, e, { c: t, dkLen: n });
}
function Wd(r) {
  A(jo != null, "platform does not support secure random numbers", "UNSUPPORTED_OPERATION", {
    operation: "randomBytes"
  }), b(Number.isInteger(r) && r > 0 && r <= 1024, "invalid length", "length", r);
  const e = new Uint8Array(r);
  return jo.getRandomValues(e), e;
}
let kf = !1;
const Of = function(r, e, t) {
  return Jd(r, e).update(t).digest();
};
let Tf = Of;
function dr(r, e, t) {
  const n = O(e, "key"), s = O(t, "data");
  return N(Tf(r, n, s));
}
dr._ = Of;
dr.lock = function() {
  kf = !0;
};
dr.register = function(r) {
  if (kf)
    throw new Error("computeHmac is locked");
  Tf = r;
};
Object.freeze(dr);
const [Rf, Sf, Bf] = [[], [], []], Yd = BigInt(0), Us = BigInt(1), Zd = BigInt(2), Xd = BigInt(7), $d = BigInt(256), qd = BigInt(113);
for (let r = 0, e = Us, t = 1, n = 0; r < 24; r++) {
  [t, n] = [n, (2 * t + 3 * n) % 5], Rf.push(2 * (5 * n + t)), Sf.push((r + 1) * (r + 2) / 2 % 64);
  let s = Yd;
  for (let i = 0; i < 7; i++)
    e = (e << Us ^ (e >> Xd) * qd) % $d, e & Zd && (s ^= Us << (Us << BigInt(i)) - Us);
  Bf.push(s);
}
const [eh, th] = U.split(Bf, !0), Wo = (r, e, t) => t > 32 ? U.rotlBH(r, e, t) : U.rotlSH(r, e, t), Yo = (r, e, t) => t > 32 ? U.rotlBL(r, e, t) : U.rotlSL(r, e, t);
function nh(r, e = 24) {
  const t = new Uint32Array(10);
  for (let n = 24 - e; n < 24; n++) {
    for (let a = 0; a < 10; a++)
      t[a] = r[a] ^ r[a + 10] ^ r[a + 20] ^ r[a + 30] ^ r[a + 40];
    for (let a = 0; a < 10; a += 2) {
      const c = (a + 8) % 10, o = (a + 2) % 10, f = t[o], u = t[o + 1], d = Wo(f, u, 1) ^ t[c], h = Yo(f, u, 1) ^ t[c + 1];
      for (let p = 0; p < 50; p += 10)
        r[a + p] ^= d, r[a + p + 1] ^= h;
    }
    let s = r[2], i = r[3];
    for (let a = 0; a < 24; a++) {
      const c = Sf[a], o = Wo(s, i, c), f = Yo(s, i, c), u = Rf[a];
      s = r[u], i = r[u + 1], r[u] = o, r[u + 1] = f;
    }
    for (let a = 0; a < 50; a += 10) {
      for (let c = 0; c < 10; c++)
        t[c] = r[a + c];
      for (let c = 0; c < 10; c++)
        r[a + c] ^= ~t[(c + 2) % 10] & t[(c + 4) % 10];
    }
    r[0] ^= eh[n], r[1] ^= th[n];
  }
  t.fill(0);
}
class Ya extends Aa {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(e, t, n, s = !1, i = 24) {
    if (super(), this.blockLen = e, this.suffix = t, this.outputLen = n, this.enableXOF = s, this.rounds = i, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, X.number(n), 0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200), this.state32 = oa(this.state);
  }
  keccak() {
    nh(this.state32, this.rounds), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    X.exists(this);
    const { blockLen: t, state: n } = this;
    e = ar(e);
    const s = e.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(t - this.pos, s - i);
      for (let c = 0; c < a; c++)
        n[this.pos++] ^= e[i++];
      this.pos === t && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: e, suffix: t, pos: n, blockLen: s } = this;
    e[n] ^= t, t & 128 && n === s - 1 && this.keccak(), e[s - 1] ^= 128, this.keccak();
  }
  writeInto(e) {
    X.exists(this, !1), X.bytes(e), this.finish();
    const t = this.state, { blockLen: n } = this;
    for (let s = 0, i = e.length; s < i; ) {
      this.posOut >= n && this.keccak();
      const a = Math.min(n - this.posOut, i - s);
      e.set(t.subarray(this.posOut, this.posOut + a), s), this.posOut += a, s += a;
    }
    return e;
  }
  xofInto(e) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(e);
  }
  xof(e) {
    return X.number(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (X.output(e, this), this.finished)
      throw new Error("digest() was already called");
    return this.writeInto(e), this.destroy(), e;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = !0, this.state.fill(0);
  }
  _cloneInto(e) {
    const { blockLen: t, suffix: n, outputLen: s, rounds: i, enableXOF: a } = this;
    return e || (e = new Ya(t, n, s, a, i)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = i, e.suffix = n, e.outputLen = s, e.enableXOF = a, e.destroyed = this.destroyed, e;
  }
}
const Cn = (r, e, t) => vs(() => new Ya(e, r, t));
Cn(6, 144, 224 / 8);
Cn(6, 136, 256 / 8);
Cn(6, 104, 384 / 8);
Cn(6, 72, 512 / 8);
Cn(1, 144, 224 / 8);
const rh = Cn(1, 136, 256 / 8);
Cn(1, 104, 384 / 8);
Cn(1, 72, 512 / 8);
const Uf = (r, e, t) => ud((n = {}) => new Ya(e, r, n.dkLen === void 0 ? t : n.dkLen, !0));
Uf(31, 168, 128 / 8);
Uf(31, 136, 256 / 8);
let Lf = !1;
const Ff = function(r) {
  return rh(r);
};
let Df = Ff;
function z(r) {
  const e = O(r, "data");
  return N(Df(e));
}
z._ = Ff;
z.lock = function() {
  Lf = !0;
};
z.register = function(r) {
  if (Lf)
    throw new TypeError("keccak256 is locked");
  Df = r;
};
Object.freeze(z);
const sh = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Mf = Uint8Array.from({ length: 16 }, (r, e) => e), ih = Mf.map((r) => (9 * r + 5) % 16);
let ho = [Mf], xo = [ih];
for (let r = 0; r < 4; r++)
  for (let e of [ho, xo])
    e.push(e[r].map((t) => sh[t]));
const Gf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((r) => new Uint8Array(r)), ah = ho.map((r, e) => r.map((t) => Gf[e][t])), ch = xo.map((r, e) => r.map((t) => Gf[e][t])), oh = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), fh = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wi = (r, e) => r << e | r >>> 32 - e;
function Zo(r, e, t, n) {
  return r === 0 ? e ^ t ^ n : r === 1 ? e & t | ~e & n : r === 2 ? (e | ~t) ^ n : r === 3 ? e & n | t & ~n : e ^ (t | ~n);
}
const Yi = new Uint32Array(16);
class lh extends fo {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: t, h2: n, h3: s, h4: i } = this;
    return [e, t, n, s, i];
  }
  set(e, t, n, s, i) {
    this.h0 = e | 0, this.h1 = t | 0, this.h2 = n | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, t) {
    for (let p = 0; p < 16; p++, t += 4)
      Yi[p] = e.getUint32(t, !0);
    let n = this.h0 | 0, s = n, i = this.h1 | 0, a = i, c = this.h2 | 0, o = c, f = this.h3 | 0, u = f, d = this.h4 | 0, h = d;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, w = oh[p], E = fh[p], C = ho[p], B = xo[p], I = ah[p], K = ch[p];
      for (let R = 0; R < 16; R++) {
        const J = Wi(n + Zo(p, i, c, f) + Yi[C[R]] + w, I[R]) + d | 0;
        n = d, d = f, f = Wi(c, 10) | 0, c = i, i = J;
      }
      for (let R = 0; R < 16; R++) {
        const J = Wi(s + Zo(m, a, o, u) + Yi[B[R]] + E, K[R]) + h | 0;
        s = h, h = u, u = Wi(o, 10) | 0, o = a, a = J;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + h | 0, this.h3 + d + s | 0, this.h4 + n + a | 0, this.h0 + i + o | 0);
  }
  roundClean() {
    Yi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const uh = vs(() => new lh());
let Hf = !1;
const Kf = function(r) {
  return uh(r);
};
let Vf = Kf;
function ks(r) {
  const e = O(r, "data");
  return N(Vf(e));
}
ks._ = Kf;
ks.lock = function() {
  Hf = !0;
};
ks.register = function(r) {
  if (Hf)
    throw new TypeError("ripemd160 is locked");
  Vf = r;
};
Object.freeze(ks);
let _f = !1;
const Qf = function(r, e, t, n, s) {
  return jd(r, e, t, n, s);
};
let zf = Qf;
function Pn(r, e, t, n, s) {
  const i = O(r, "password"), a = O(e, "salt");
  return N(zf(i, a, t, n, s));
}
Pn._ = Qf;
Pn.lock = function() {
  _f = !0;
};
Pn.register = function(r) {
  if (_f)
    throw new Error("pbkdf2 is locked");
  zf = r;
};
Object.freeze(Pn);
let Jf = !1;
const jf = function(r) {
  return new Uint8Array(Wd(r));
};
let Wf = jf;
function _t(r) {
  return Wf(r);
}
_t._ = jf;
_t.lock = function() {
  Jf = !0;
};
_t.register = function(r) {
  if (Jf)
    throw new Error("randomBytes is locked");
  Wf = r;
};
Object.freeze(_t);
const M = (r, e) => r << e | r >>> 32 - e;
function Xo(r, e, t, n, s, i) {
  let a = r[e++] ^ t[n++], c = r[e++] ^ t[n++], o = r[e++] ^ t[n++], f = r[e++] ^ t[n++], u = r[e++] ^ t[n++], d = r[e++] ^ t[n++], h = r[e++] ^ t[n++], p = r[e++] ^ t[n++], m = r[e++] ^ t[n++], w = r[e++] ^ t[n++], E = r[e++] ^ t[n++], C = r[e++] ^ t[n++], B = r[e++] ^ t[n++], I = r[e++] ^ t[n++], K = r[e++] ^ t[n++], R = r[e++] ^ t[n++], J = a, se = c, Q = o, j = f, fe = u, Ye = d, Ue = h, Ze = p, Ct = m, ft = w, In = E, vn = C, kn = B, On = I, Tn = K, Rn = R;
  for (let Lo = 0; Lo < 8; Lo += 2)
    fe ^= M(J + kn | 0, 7), Ct ^= M(fe + J | 0, 9), kn ^= M(Ct + fe | 0, 13), J ^= M(kn + Ct | 0, 18), ft ^= M(Ye + se | 0, 7), On ^= M(ft + Ye | 0, 9), se ^= M(On + ft | 0, 13), Ye ^= M(se + On | 0, 18), Tn ^= M(In + Ue | 0, 7), Q ^= M(Tn + In | 0, 9), Ue ^= M(Q + Tn | 0, 13), In ^= M(Ue + Q | 0, 18), j ^= M(Rn + vn | 0, 7), Ze ^= M(j + Rn | 0, 9), vn ^= M(Ze + j | 0, 13), Rn ^= M(vn + Ze | 0, 18), se ^= M(J + j | 0, 7), Q ^= M(se + J | 0, 9), j ^= M(Q + se | 0, 13), J ^= M(j + Q | 0, 18), Ue ^= M(Ye + fe | 0, 7), Ze ^= M(Ue + Ye | 0, 9), fe ^= M(Ze + Ue | 0, 13), Ye ^= M(fe + Ze | 0, 18), vn ^= M(In + ft | 0, 7), Ct ^= M(vn + In | 0, 9), ft ^= M(Ct + vn | 0, 13), In ^= M(ft + Ct | 0, 18), kn ^= M(Rn + Tn | 0, 7), On ^= M(kn + Rn | 0, 9), Tn ^= M(On + kn | 0, 13), Rn ^= M(Tn + On | 0, 18);
  s[i++] = a + J | 0, s[i++] = c + se | 0, s[i++] = o + Q | 0, s[i++] = f + j | 0, s[i++] = u + fe | 0, s[i++] = d + Ye | 0, s[i++] = h + Ue | 0, s[i++] = p + Ze | 0, s[i++] = m + Ct | 0, s[i++] = w + ft | 0, s[i++] = E + In | 0, s[i++] = C + vn | 0, s[i++] = B + kn | 0, s[i++] = I + On | 0, s[i++] = K + Tn | 0, s[i++] = R + Rn | 0;
}
function kr(r, e, t, n, s) {
  let i = n + 0, a = n + 16 * s;
  for (let c = 0; c < 16; c++)
    t[a + c] = r[e + (2 * s - 1) * 16 + c];
  for (let c = 0; c < s; c++, i += 16, e += 16)
    Xo(t, a, r, e, t, i), c > 0 && (a += 16), Xo(t, i, r, e += 16, t, a);
}
function Yf(r, e, t) {
  const n = Nf({
    dkLen: 32,
    asyncTick: 10,
    maxmem: 1073742848
  }, t), { N: s, r: i, p: a, dkLen: c, asyncTick: o, maxmem: f, onProgress: u } = n;
  if (X.number(s), X.number(i), X.number(a), X.number(c), X.number(o), X.number(f), u !== void 0 && typeof u != "function")
    throw new Error("progressCb should be function");
  const d = 128 * i, h = d / 4;
  if (s <= 1 || s & s - 1 || s >= 2 ** (d / 8) || s > 2 ** 32)
    throw new Error("Scrypt: N must be larger than 1, a power of 2, less than 2^(128 * r / 8) and less than 2^32");
  if (a < 0 || a > (2 ** 32 - 1) * 32 / d)
    throw new Error("Scrypt: p must be a positive integer less than or equal to ((2^32 - 1) * 32) / (128 * r)");
  if (c < 0 || c > (2 ** 32 - 1) * 32)
    throw new Error("Scrypt: dkLen should be positive integer less than or equal to (2^32 - 1) * 32");
  const p = d * (s + a);
  if (p > f)
    throw new Error(`Scrypt: parameters too large, ${p} (128 * r * (N + p)) > ${f} (maxmem)`);
  const m = oo(Fi, r, e, { c: 1, dkLen: d * a }), w = oa(m), E = oa(new Uint8Array(d * s)), C = oa(new Uint8Array(d));
  let B = () => {
  };
  if (u) {
    const I = 2 * s * a, K = Math.max(Math.floor(I / 1e4), 1);
    let R = 0;
    B = () => {
      R++, u && (!(R % K) || R === I) && u(R / I);
    };
  }
  return { N: s, r: i, p: a, dkLen: c, blockSize32: h, V: E, B32: w, B: m, tmp: C, blockMixCb: B, asyncTick: o };
}
function Zf(r, e, t, n, s) {
  const i = oo(Fi, r, t, { c: 1, dkLen: e });
  return t.fill(0), n.fill(0), s.fill(0), i;
}
function dh(r, e, t) {
  const { N: n, r: s, p: i, dkLen: a, blockSize32: c, V: o, B32: f, B: u, tmp: d, blockMixCb: h } = Yf(r, e, t);
  for (let p = 0; p < i; p++) {
    const m = c * p;
    for (let w = 0; w < c; w++)
      o[w] = f[m + w];
    for (let w = 0, E = 0; w < n - 1; w++)
      kr(o, E, o, E += c, s), h();
    kr(o, (n - 1) * c, f, m, s), h();
    for (let w = 0; w < n; w++) {
      const E = f[m + c - 16] % n;
      for (let C = 0; C < c; C++)
        d[C] = f[m + C] ^ o[E * c + C];
      kr(d, 0, f, m, s), h();
    }
  }
  return Zf(r, a, u, o, d);
}
async function hh(r, e, t) {
  const { N: n, r: s, p: i, dkLen: a, blockSize32: c, V: o, B32: f, B: u, tmp: d, blockMixCb: h, asyncTick: p } = Yf(r, e, t);
  for (let m = 0; m < i; m++) {
    const w = c * m;
    for (let C = 0; C < c; C++)
      o[C] = f[w + C];
    let E = 0;
    await zo(n - 1, p, (C) => {
      kr(o, E, o, E += c, s), h();
    }), kr(o, (n - 1) * c, f, w, s), h(), await zo(n, p, (C) => {
      const B = f[w + c - 16] % n;
      for (let I = 0; I < c; I++)
        d[I] = f[w + I] ^ o[B * c + I];
      kr(d, 0, f, w, s), h();
    });
  }
  return Zf(r, a, u, o, d);
}
let Xf = !1, $f = !1;
const qf = async function(r, e, t, n, s, i, a) {
  return await hh(r, e, { N: t, r: n, p: s, dkLen: i, onProgress: a });
}, el = function(r, e, t, n, s, i) {
  return dh(r, e, { N: t, r: n, p: s, dkLen: i });
};
let tl = qf, nl = el;
async function Os(r, e, t, n, s, i, a) {
  const c = O(r, "passwd"), o = O(e, "salt");
  return N(await tl(c, o, t, n, s, i, a));
}
Os._ = qf;
Os.lock = function() {
  $f = !0;
};
Os.register = function(r) {
  if ($f)
    throw new Error("scrypt is locked");
  tl = r;
};
Object.freeze(Os);
function Ts(r, e, t, n, s, i) {
  const a = O(r, "passwd"), c = O(e, "salt");
  return N(nl(a, c, t, n, s, i));
}
Ts._ = el;
Ts.lock = function() {
  Xf = !0;
};
Ts.register = function(r) {
  if (Xf)
    throw new Error("scryptSync is locked");
  nl = r;
};
Object.freeze(Ts);
const rl = function(r) {
  return zd("sha256").update(r).digest();
};
let sl = rl, il = !1;
function it(r) {
  const e = O(r, "data");
  return N(sl(e));
}
it._ = rl;
it.lock = function() {
  il = !0;
};
it.register = function(r) {
  if (il)
    throw new Error("sha256 is locked");
  sl = r;
};
Object.freeze(it);
Object.freeze(it);
const xh = {}, bh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xh
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const D = BigInt(0), Y = BigInt(1), gn = BigInt(2), Js = BigInt(3), $o = BigInt(8), te = Object.freeze({
  a: D,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Y,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), qo = (r, e) => (r + e / gn) / e, Zi = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(r) {
    const { n: e } = te, t = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), n = -Y * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = t, a = BigInt("0x100000000000000000000000000000000"), c = qo(i * r, e), o = qo(-n * r, e);
    let f = k(r - c * t - o * s, e), u = k(-c * n - o * i, e);
    const d = f > a, h = u > a;
    if (d && (f = e - f), h && (u = e - u), f > a || u > a)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + r);
    return { k1neg: d, k1: f, k2neg: h, k2: u };
  }
}, st = 32, ws = 32, ph = 32, Ea = st + 1, Ca = 2 * st + 1;
function e0(r) {
  const { a: e, b: t } = te, n = k(r * r), s = k(n * r);
  return k(s + e * r + t);
}
const Xi = te.a === D;
class al extends Error {
  constructor(e) {
    super(e);
  }
}
function t0(r) {
  if (!(r instanceof H))
    throw new TypeError("JacobianPoint expected");
}
class H {
  constructor(e, t, n) {
    this.x = e, this.y = t, this.z = n;
  }
  static fromAffine(e) {
    if (!(e instanceof V))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(V.ZERO) ? H.ZERO : new H(e.x, e.y, Y);
  }
  static toAffineBatch(e) {
    const t = Ah(e.map((n) => n.z));
    return e.map((n, s) => n.toAffine(t[s]));
  }
  static normalizeZ(e) {
    return H.toAffineBatch(e).map(H.fromAffine);
  }
  equals(e) {
    t0(e);
    const { x: t, y: n, z: s } = this, { x: i, y: a, z: c } = e, o = k(s * s), f = k(c * c), u = k(t * f), d = k(i * o), h = k(k(n * c) * f), p = k(k(a * s) * o);
    return u === d && h === p;
  }
  negate() {
    return new H(this.x, k(-this.y), this.z);
  }
  double() {
    const { x: e, y: t, z: n } = this, s = k(e * e), i = k(t * t), a = k(i * i), c = e + i, o = k(gn * (k(c * c) - s - a)), f = k(Js * s), u = k(f * f), d = k(u - gn * o), h = k(f * (o - d) - $o * a), p = k(gn * t * n);
    return new H(d, h, p);
  }
  add(e) {
    t0(e);
    const { x: t, y: n, z: s } = this, { x: i, y: a, z: c } = e;
    if (i === D || a === D)
      return this;
    if (t === D || n === D)
      return e;
    const o = k(s * s), f = k(c * c), u = k(t * f), d = k(i * o), h = k(k(n * c) * f), p = k(k(a * s) * o), m = k(d - u), w = k(p - h);
    if (m === D)
      return w === D ? this.double() : H.ZERO;
    const E = k(m * m), C = k(m * E), B = k(u * E), I = k(w * w - C - gn * B), K = k(w * (B - I) - h * C), R = k(s * c * m);
    return new H(I, K, R);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const t = H.ZERO;
    if (typeof e == "bigint" && e === D)
      return t;
    let n = s0(e);
    if (n === Y)
      return this;
    if (!Xi) {
      let d = t, h = this;
      for (; n > D; )
        n & Y && (d = d.add(h)), h = h.double(), n >>= Y;
      return d;
    }
    let { k1neg: s, k1: i, k2neg: a, k2: c } = Zi.splitScalar(n), o = t, f = t, u = this;
    for (; i > D || c > D; )
      i & Y && (o = o.add(u)), c & Y && (f = f.add(u)), u = u.double(), i >>= Y, c >>= Y;
    return s && (o = o.negate()), a && (f = f.negate()), f = new H(k(f.x * Zi.beta), f.y, f.z), o.add(f);
  }
  precomputeWindow(e) {
    const t = Xi ? 128 / e + 1 : 256 / e + 1, n = [];
    let s = this, i = s;
    for (let a = 0; a < t; a++) {
      i = s, n.push(i);
      for (let c = 1; c < 2 ** (e - 1); c++)
        i = i.add(s), n.push(i);
      s = i.double();
    }
    return n;
  }
  wNAF(e, t) {
    !t && this.equals(H.BASE) && (t = V.BASE);
    const n = t && t._WINDOW_SIZE || 1;
    if (256 % n)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = t && Rc.get(t);
    s || (s = this.precomputeWindow(n), t && n !== 1 && (s = H.normalizeZ(s), Rc.set(t, s)));
    let i = H.ZERO, a = H.BASE;
    const c = 1 + (Xi ? 128 / n : 256 / n), o = 2 ** (n - 1), f = BigInt(2 ** n - 1), u = 2 ** n, d = BigInt(n);
    for (let h = 0; h < c; h++) {
      const p = h * o;
      let m = Number(e & f);
      e >>= d, m > o && (m -= u, e += Y);
      const w = p, E = p + Math.abs(m) - 1, C = h % 2 !== 0, B = m < 0;
      m === 0 ? a = a.add($i(C, s[w])) : i = i.add($i(B, s[E]));
    }
    return { p: i, f: a };
  }
  multiply(e, t) {
    let n = s0(e), s, i;
    if (Xi) {
      const { k1neg: a, k1: c, k2neg: o, k2: f } = Zi.splitScalar(n);
      let { p: u, f: d } = this.wNAF(c, t), { p: h, f: p } = this.wNAF(f, t);
      u = $i(a, u), h = $i(o, h), h = new H(k(h.x * Zi.beta), h.y, h.z), s = u.add(h), i = d.add(p);
    } else {
      const { p: a, f: c } = this.wNAF(n, t);
      s = a, i = c;
    }
    return H.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: t, y: n, z: s } = this, i = this.equals(H.ZERO);
    e == null && (e = i ? $o : Di(s));
    const a = e, c = k(a * a), o = k(c * a), f = k(t * c), u = k(n * o), d = k(s * a);
    if (i)
      return V.ZERO;
    if (d !== Y)
      throw new Error("invZ was invalid");
    return new V(f, u);
  }
}
H.BASE = new H(te.Gx, te.Gy, Y);
H.ZERO = new H(D, Y, D);
function $i(r, e) {
  const t = e.negate();
  return r ? t : e;
}
const Rc = /* @__PURE__ */ new WeakMap();
class V {
  constructor(e, t) {
    this.x = e, this.y = t;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Rc.delete(this);
  }
  hasEvenY() {
    return this.y % gn === D;
  }
  static fromCompressedHex(e) {
    const t = e.length === 32, n = wn(t ? e : e.subarray(1));
    if (!sc(n))
      throw new Error("Point is not on curve");
    const s = e0(n);
    let i = wh(s);
    const a = (i & Y) === Y;
    t ? a && (i = k(-i)) : (e[0] & 1) === 1 !== a && (i = k(-i));
    const c = new V(n, i);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const t = wn(e.subarray(1, st + 1)), n = wn(e.subarray(st + 1, st * 2 + 1)), s = new V(t, n);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const t = ti(e), n = t.length, s = t[0];
    if (n === st)
      return this.fromCompressedHex(t);
    if (n === Ea && (s === 2 || s === 3))
      return this.fromCompressedHex(t);
    if (n === Ca && s === 4)
      return this.fromUncompressedHex(t);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ea} compressed bytes or ${Ca} uncompressed bytes, not ${n}`);
  }
  static fromPrivateKey(e) {
    return V.BASE.multiply(ri(e));
  }
  static fromSignature(e, t, n) {
    const { r: s, s: i } = Ih(t);
    if (![0, 1, 2, 3].includes(n))
      throw new Error("Cannot recover: invalid recovery bit");
    const a = cl(ti(e)), { n: c } = te, o = n === 2 || n === 3 ? s + c : s, f = Di(o, c), u = k(-a * f, c), d = k(i * f, c), h = n & 1 ? "03" : "02", p = V.fromHex(h + Tr(o)), m = V.BASE.multiplyAndAddUnsafe(p, u, d);
    if (!m)
      throw new Error("Cannot recover signature: point at infinify");
    return m.assertValidity(), m;
  }
  toRawBytes(e = !1) {
    return rr(this.toHex(e));
  }
  toHex(e = !1) {
    const t = Tr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${t}` : `04${t}${Tr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: t, y: n } = this;
    if (!sc(t) || !sc(n))
      throw new Error(e);
    const s = k(n * n), i = e0(t);
    if (k(s - i) !== D)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new V(this.x, k(-this.y));
  }
  double() {
    return H.fromAffine(this).double().toAffine();
  }
  add(e) {
    return H.fromAffine(this).add(H.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return H.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, t, n) {
    const s = H.fromAffine(this), i = t === D || t === Y || this !== V.BASE ? s.multiplyUnsafe(t) : s.multiply(t), a = H.fromAffine(e).multiplyUnsafe(n), c = i.add(a);
    return c.equals(H.ZERO) ? void 0 : c.toAffine();
  }
}
V.BASE = new V(te.Gx, te.Gy);
V.ZERO = new V(D, D);
function n0(r) {
  return Number.parseInt(r[0], 16) >= 8 ? "00" + r : r;
}
function r0(r) {
  if (r.length < 2 || r[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${As(r)}`);
  const e = r[1], t = r.subarray(2, e + 2);
  if (!e || t.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (t[0] === 0 && t[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: wn(t), left: r.subarray(e + 2) };
}
function gh(r) {
  if (r.length < 2 || r[0] != 48)
    throw new Error(`Invalid signature tag: ${As(r)}`);
  if (r[1] !== r.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: t } = r0(r.subarray(2)), { data: n, left: s } = r0(t);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${As(s)}`);
  return { r: e, s: n };
}
let Or = class la {
  constructor(e, t) {
    this.r = e, this.s = t, this.assertValidity();
  }
  static fromCompact(e) {
    const t = e instanceof Uint8Array, n = "Signature.fromCompact";
    if (typeof e != "string" && !t)
      throw new TypeError(`${n}: Expected string or Uint8Array`);
    const s = t ? As(e) : e;
    if (s.length !== 128)
      throw new Error(`${n}: Expected 64-byte hex`);
    return new la(Pa(s.slice(0, 64)), Pa(s.slice(64, 128)));
  }
  static fromDER(e) {
    const t = e instanceof Uint8Array;
    if (typeof e != "string" && !t)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r: n, s } = gh(t ? e : rr(e));
    return new la(n, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: t } = this;
    if (!ni(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ni(t))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = te.n >> Y;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new la(this.r, k(-this.s, te.n)) : this;
  }
  toDERRawBytes() {
    return rr(this.toDERHex());
  }
  toDERHex() {
    const e = n0(Ls(this.s)), t = n0(Ls(this.r)), n = e.length / 2, s = t.length / 2, i = Ls(n), a = Ls(s);
    return `30${Ls(s + n + 4)}02${a}${t}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return rr(this.toCompactHex());
  }
  toCompactHex() {
    return Tr(this.r) + Tr(this.s);
  }
};
function tn(...r) {
  if (!r.every((n) => n instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (r.length === 1)
    return r[0];
  const e = r.reduce((n, s) => n + s.length, 0), t = new Uint8Array(e);
  for (let n = 0, s = 0; n < r.length; n++) {
    const i = r[n];
    t.set(i, s), s += i.length;
  }
  return t;
}
const yh = Array.from({ length: 256 }, (r, e) => e.toString(16).padStart(2, "0"));
function As(r) {
  if (!(r instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let t = 0; t < r.length; t++)
    e += yh[r[t]];
  return e;
}
const mh = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Tr(r) {
  if (typeof r != "bigint")
    throw new Error("Expected bigint");
  if (!(D <= r && r < mh))
    throw new Error("Expected number 0 <= n < 2^256");
  return r.toString(16).padStart(64, "0");
}
function Sc(r) {
  const e = rr(Tr(r));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Ls(r) {
  const e = r.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Pa(r) {
  if (typeof r != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof r);
  return BigInt(`0x${r}`);
}
function rr(r) {
  if (typeof r != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof r);
  if (r.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + r.length);
  const e = new Uint8Array(r.length / 2);
  for (let t = 0; t < e.length; t++) {
    const n = t * 2, s = r.slice(n, n + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[t] = i;
  }
  return e;
}
function wn(r) {
  return Pa(As(r));
}
function ti(r) {
  return r instanceof Uint8Array ? Uint8Array.from(r) : rr(r);
}
function s0(r) {
  if (typeof r == "number" && Number.isSafeInteger(r) && r > 0)
    return BigInt(r);
  if (typeof r == "bigint" && ni(r))
    return r;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function k(r, e = te.P) {
  const t = r % e;
  return t >= D ? t : e + t;
}
function Le(r, e) {
  const { P: t } = te;
  let n = r;
  for (; e-- > D; )
    n *= n, n %= t;
  return n;
}
function wh(r) {
  const { P: e } = te, t = BigInt(6), n = BigInt(11), s = BigInt(22), i = BigInt(23), a = BigInt(44), c = BigInt(88), o = r * r * r % e, f = o * o * r % e, u = Le(f, Js) * f % e, d = Le(u, Js) * f % e, h = Le(d, gn) * o % e, p = Le(h, n) * h % e, m = Le(p, s) * p % e, w = Le(m, a) * m % e, E = Le(w, c) * w % e, C = Le(E, a) * m % e, B = Le(C, Js) * f % e, I = Le(B, i) * p % e, K = Le(I, t) * o % e, R = Le(K, gn);
  if (R * R % e !== r)
    throw new Error("Cannot find square root");
  return R;
}
function Di(r, e = te.P) {
  if (r === D || e <= D)
    throw new Error(`invert: expected positive integers, got n=${r} mod=${e}`);
  let t = k(r, e), n = e, s = D, i = Y;
  for (; t !== D; ) {
    const c = n / t, o = n % t, f = s - i * c;
    n = t, t = o, s = i, i = f;
  }
  if (n !== Y)
    throw new Error("invert: does not exist");
  return k(s, e);
}
function Ah(r, e = te.P) {
  const t = new Array(r.length), n = r.reduce((i, a, c) => a === D ? i : (t[c] = i, k(i * a, e)), Y), s = Di(n, e);
  return r.reduceRight((i, a, c) => a === D ? i : (t[c] = k(i * t[c], e), k(i * a, e)), s), t;
}
function Eh(r) {
  const e = r.length * 8 - ws * 8, t = wn(r);
  return e > 0 ? t >> BigInt(e) : t;
}
function cl(r, e = !1) {
  const t = Eh(r);
  if (e)
    return t;
  const { n } = te;
  return t >= n ? t - n : t;
}
let Rr, js;
class Ch {
  constructor(e, t) {
    if (this.hashLen = e, this.qByteLen = t, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof t != "number" || t < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return yn.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return js(this.k, ...e);
  }
  checkSync() {
    if (typeof js != "function")
      throw new al("hmacSha256Sync needs to be set");
  }
  incr() {
    if (this.counter >= 1e3)
      throw new Error("Tried 1,000 k values for sign(), all were invalid");
    this.counter += 1;
  }
  async reseed(e = new Uint8Array()) {
    this.k = await this.hmac(this.v, Uint8Array.from([0]), e), this.v = await this.hmac(this.v), e.length !== 0 && (this.k = await this.hmac(this.v, Uint8Array.from([1]), e), this.v = await this.hmac(this.v));
  }
  reseedSync(e = new Uint8Array()) {
    this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([0]), e), this.v = this.hmacSync(this.v), e.length !== 0 && (this.k = this.hmacSync(this.v, Uint8Array.from([1]), e), this.v = this.hmacSync(this.v));
  }
  async generate() {
    this.incr();
    let e = 0;
    const t = [];
    for (; e < this.qByteLen; ) {
      this.v = await this.hmac(this.v);
      const n = this.v.slice();
      t.push(n), e += this.v.length;
    }
    return tn(...t);
  }
  generateSync() {
    this.checkSync(), this.incr();
    let e = 0;
    const t = [];
    for (; e < this.qByteLen; ) {
      this.v = this.hmacSync(this.v);
      const n = this.v.slice();
      t.push(n), e += this.v.length;
    }
    return tn(...t);
  }
}
function ni(r) {
  return D < r && r < te.n;
}
function sc(r) {
  return D < r && r < te.P;
}
function Ph(r, e, t, n = !0) {
  const { n: s } = te, i = cl(r, !0);
  if (!ni(i))
    return;
  const a = Di(i, s), c = V.BASE.multiply(i), o = k(c.x, s);
  if (o === D)
    return;
  const f = k(a * k(e + t * o, s), s);
  if (f === D)
    return;
  let u = new Or(o, f), d = (c.x === u.r ? 0 : 2) | Number(c.y & Y);
  return n && u.hasHighS() && (u = u.normalizeS(), d ^= 1), { sig: u, recovery: d };
}
function ri(r) {
  let e;
  if (typeof r == "bigint")
    e = r;
  else if (typeof r == "number" && Number.isSafeInteger(r) && r > 0)
    e = BigInt(r);
  else if (typeof r == "string") {
    if (r.length !== 2 * ws)
      throw new Error("Expected 32 bytes of private key");
    e = Pa(r);
  } else if (r instanceof Uint8Array) {
    if (r.length !== ws)
      throw new Error("Expected 32 bytes of private key");
    e = wn(r);
  } else
    throw new TypeError("Expected valid private key");
  if (!ni(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Nh(r) {
  return r instanceof V ? (r.assertValidity(), r) : V.fromHex(r);
}
function Ih(r) {
  if (r instanceof Or)
    return r.assertValidity(), r;
  try {
    return Or.fromDER(r);
  } catch {
    return Or.fromCompact(r);
  }
}
function vh(r, e = !1) {
  return V.fromPrivateKey(r).toRawBytes(e);
}
function kh(r, e, t, n = !1) {
  return V.fromSignature(r, e, t).toRawBytes(n);
}
function i0(r) {
  const e = r instanceof Uint8Array, t = typeof r == "string", n = (e || t) && r.length;
  return e ? n === Ea || n === Ca : t ? n === Ea * 2 || n === Ca * 2 : r instanceof V;
}
function Oh(r, e, t = !1) {
  if (i0(r))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!i0(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const n = Nh(e);
  return n.assertValidity(), n.multiply(ri(r)).toRawBytes(t);
}
function ol(r) {
  const e = r.length > st ? r.slice(0, st) : r;
  return wn(e);
}
function Th(r) {
  const e = ol(r), t = k(e, te.n);
  return fl(t < D ? e : t);
}
function fl(r) {
  return Sc(r);
}
function Rh(r, e, t) {
  if (r == null)
    throw new Error(`sign: expected valid message hash, not "${r}"`);
  const n = ti(r), s = ri(e), i = [fl(s), Th(n)];
  if (t != null) {
    t === !0 && (t = yn.randomBytes(st));
    const o = ti(t);
    if (o.length !== st)
      throw new Error(`sign: Expected ${st} bytes of extra data`);
    i.push(o);
  }
  const a = tn(...i), c = ol(n);
  return { seed: a, m: c, d: s };
}
function Sh(r, e) {
  const { sig: t, recovery: n } = r, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), a = s ? t.toDERRawBytes() : t.toCompactRawBytes();
  return i ? [a, n] : a;
}
function Bh(r, e, t = {}) {
  const { seed: n, m: s, d: i } = Rh(r, e, t.extraEntropy), a = new Ch(ph, ws);
  a.reseedSync(n);
  let c;
  for (; !(c = Ph(a.generateSync(), s, i, t.canonical)); )
    a.reseedSync();
  return Sh(c, t);
}
V.BASE._setWindowSize(8);
const ke = {
  node: bh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, qi = {}, yn = {
  bytesToHex: As,
  hexToBytes: rr,
  concatBytes: tn,
  mod: k,
  invert: Di,
  isValidPrivateKey(r) {
    try {
      return ri(r), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Sc,
  _normalizePrivateKey: ri,
  hashToPrivateKey: (r) => {
    r = ti(r);
    const e = ws + 8;
    if (r.length < e || r.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const t = k(wn(r), te.n - Y) + Y;
    return Sc(t);
  },
  randomBytes: (r = 32) => {
    if (ke.web)
      return ke.web.getRandomValues(new Uint8Array(r));
    if (ke.node) {
      const { randomBytes: e } = ke.node;
      return Uint8Array.from(e(r));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => yn.hashToPrivateKey(yn.randomBytes(ws + 8)),
  precompute(r = 8, e = V.BASE) {
    const t = e === V.BASE ? e : new V(e.x, e.y);
    return t._setWindowSize(r), t.multiply(Js), t;
  },
  sha256: async (...r) => {
    if (ke.web) {
      const e = await ke.web.subtle.digest("SHA-256", tn(...r));
      return new Uint8Array(e);
    } else if (ke.node) {
      const { createHash: e } = ke.node, t = e("sha256");
      return r.forEach((n) => t.update(n)), Uint8Array.from(t.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (r, ...e) => {
    if (ke.web) {
      const t = await ke.web.subtle.importKey("raw", r, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), n = tn(...e), s = await ke.web.subtle.sign("HMAC", t, n);
      return new Uint8Array(s);
    } else if (ke.node) {
      const { createHmac: t } = ke.node, n = t("sha256", r);
      return e.forEach((s) => n.update(s)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (r, ...e) => {
    let t = qi[r];
    if (t === void 0) {
      const n = await yn.sha256(Uint8Array.from(r, (s) => s.charCodeAt(0)));
      t = tn(n, n), qi[r] = t;
    }
    return yn.sha256(t, ...e);
  },
  taggedHashSync: (r, ...e) => {
    if (typeof Rr != "function")
      throw new al("sha256Sync is undefined, you need to set it");
    let t = qi[r];
    if (t === void 0) {
      const n = Rr(Uint8Array.from(r, (s) => s.charCodeAt(0)));
      t = tn(n, n), qi[r] = t;
    }
    return Rr(t, ...e);
  },
  _JacobianPoint: H
};
Object.defineProperties(yn, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Rr;
    },
    set(r) {
      Rr || (Rr = r);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return js;
    },
    set(r) {
      js || (js = r);
    }
  }
});
const Bc = "0x0000000000000000000000000000000000000000", a0 = "0x0000000000000000000000000000000000000000000000000000000000000000", Uh = `Ethereum Signed Message:
`, c0 = BigInt(0), o0 = BigInt(1), f0 = BigInt(2), l0 = BigInt(27), u0 = BigInt(28), ea = BigInt(35), xr = {};
function d0(r) {
  return ir(me(r), 32);
}
var Gr, Hr, Kr, _n;
const Xe = class Xe {
  /**
   *  @private
   */
  constructor(e, t, n, s) {
    y(this, Gr, void 0);
    y(this, Hr, void 0);
    y(this, Kr, void 0);
    y(this, _n, void 0);
    ur(e, xr, "Signature"), x(this, Gr, t), x(this, Hr, n), x(this, Kr, s), x(this, _n, null);
  }
  /**
   *  The ``r`` value for a signautre.
   *
   *  This represents the ``x`` coordinate of a "reference" or
   *  challenge point, from which the ``y`` can be computed.
   */
  get r() {
    return l(this, Gr);
  }
  set r(e) {
    b(vr(e) === 32, "invalid r", "value", e), x(this, Gr, N(e));
  }
  /**
   *  The ``s`` value for a signature.
   */
  get s() {
    return l(this, Hr);
  }
  set s(e) {
    b(vr(e) === 32, "invalid s", "value", e);
    const t = N(e);
    b(parseInt(t.substring(0, 3)) < 8, "non-canonical s", "value", t), x(this, Hr, t);
  }
  /**
   *  The ``v`` value for a signature.
   *
   *  Since a given ``x`` value for ``r`` has two possible values for
   *  its correspondin ``y``, the ``v`` indicates which of the two ``y``
   *  values to use.
   *
   *  It is normalized to the values ``27`` or ``28`` for legacy
   *  purposes.
   */
  get v() {
    return l(this, Kr);
  }
  set v(e) {
    const t = L(e, "value");
    b(t === 27 || t === 28, "invalid v", "v", e), x(this, Kr, t);
  }
  /**
   *  The EIP-155 ``v`` for legacy transactions. For non-legacy
   *  transactions, this value is ``null``.
   */
  get networkV() {
    return l(this, _n);
  }
  /**
   *  The chain ID for EIP-155 legacy transactions. For non-legacy
   *  transactions, this value is ``null``.
   */
  get legacyChainId() {
    const e = this.networkV;
    return e == null ? null : Xe.getChainId(e);
  }
  /**
   *  The ``yParity`` for the signature.
   *
   *  See ``v`` for more details on how this value is used.
   */
  get yParity() {
    return this.v === 27 ? 0 : 1;
  }
  /**
   *  The [[link-eip-2098]] compact representation of the ``yParity``
   *  and ``s`` compacted into a single ``bytes32``.
   */
  get yParityAndS() {
    const e = O(this.s);
    return this.yParity && (e[0] |= 128), N(e);
  }
  /**
   *  The [[link-eip-2098]] compact representation.
   */
  get compactSerialized() {
    return _([this.r, this.yParityAndS]);
  }
  /**
   *  The serialized representation.
   */
  get serialized() {
    return _([this.r, this.s, this.yParity ? "0x1c" : "0x1b"]);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `Signature { r: "${this.r}", s: "${this.s}", yParity: ${this.yParity}, networkV: ${this.networkV} }`;
  }
  /**
   *  Returns a new identical [[Signature]].
   */
  clone() {
    const e = new Xe(xr, this.r, this.s, this.v);
    return this.networkV && x(e, _n, this.networkV), e;
  }
  /**
   *  Returns a representation that is compatible with ``JSON.stringify``.
   */
  toJSON() {
    const e = this.networkV;
    return {
      _type: "signature",
      networkV: e != null ? e.toString() : null,
      r: this.r,
      s: this.s,
      v: this.v
    };
  }
  /**
   *  Compute the chain ID from the ``v`` in a legacy EIP-155 transactions.
   *
   *  @example:
   *    Signature.getChainId(45)
   *    //_result:
   *
   *    Signature.getChainId(46)
   *    //_result:
   */
  static getChainId(e) {
    const t = S(e, "v");
    return t == l0 || t == u0 ? c0 : (b(t >= ea, "invalid EIP-155 v", "v", e), (t - ea) / f0);
  }
  /**
   *  Compute the ``v`` for a chain ID for a legacy EIP-155 transactions.
   *
   *  Legacy transactions which use [[link-eip-155]] hijack the ``v``
   *  property to include the chain ID.
   *
   *  @example:
   *    Signature.getChainIdV(5, 27)
   *    //_result:
   *
   *    Signature.getChainIdV(5, 28)
   *    //_result:
   *
   */
  static getChainIdV(e, t) {
    return S(e) * f0 + BigInt(35 + t - 27);
  }
  /**
   *  Compute the normalized legacy transaction ``v`` from a ``yParirty``,
   *  a legacy transaction ``v`` or a legacy [[link-eip-155]] transaction.
   *
   *  @example:
   *    // The values 0 and 1 imply v is actually yParity
   *    Signature.getNormalizedV(0)
   *    //_result:
   *
   *    // Legacy non-EIP-1559 transaction (i.e. 27 or 28)
   *    Signature.getNormalizedV(27)
   *    //_result:
   *
   *    // Legacy EIP-155 transaction (i.e. >= 35)
   *    Signature.getNormalizedV(46)
   *    //_result:
   *
   *    // Invalid values throw
   *    Signature.getNormalizedV(5)
   *    //_error:
   */
  static getNormalizedV(e) {
    const t = S(e);
    return t === c0 || t === l0 ? 27 : t === o0 || t === u0 ? 28 : (b(t >= ea, "invalid v", "v", e), t & o0 ? 27 : 28);
  }
  /**
   *  Creates a new [[Signature]].
   *
   *  If no %%sig%% is provided, a new [[Signature]] is created
   *  with default values.
   *
   *  If %%sig%% is a string, it is parsed.
   */
  static from(e) {
    function t(f, u) {
      b(f, u, "signature", e);
    }
    if (e == null)
      return new Xe(xr, a0, a0, 27);
    if (typeof e == "string") {
      const f = O(e, "signature");
      if (f.length === 64) {
        const u = N(f.slice(0, 32)), d = f.slice(32, 64), h = d[0] & 128 ? 28 : 27;
        return d[0] &= 127, new Xe(xr, u, N(d), h);
      }
      if (f.length === 65) {
        const u = N(f.slice(0, 32)), d = f.slice(32, 64);
        t((d[0] & 128) === 0, "non-canonical s");
        const h = Xe.getNormalizedV(f[64]);
        return new Xe(xr, u, N(d), h);
      }
      t(!1, "invalid raw signature length");
    }
    if (e instanceof Xe)
      return e.clone();
    const n = e.r;
    t(n != null, "missing r");
    const s = d0(n), i = function(f, u) {
      if (f != null)
        return d0(f);
      if (u != null) {
        t(q(u, 32), "invalid yParityAndS");
        const d = O(u);
        return d[0] &= 127, N(d);
      }
      t(!1, "missing s");
    }(e.s, e.yParityAndS);
    t((O(i)[0] & 128) == 0, "non-canonical s");
    const { networkV: a, v: c } = function(f, u, d) {
      if (f != null) {
        const h = S(f);
        return {
          networkV: h >= ea ? h : void 0,
          v: Xe.getNormalizedV(h)
        };
      }
      if (u != null)
        return t(q(u, 32), "invalid yParityAndS"), { v: O(u)[0] & 128 ? 28 : 27 };
      if (d != null) {
        switch (L(d, "sig.yParity")) {
          case 0:
            return { v: 27 };
          case 1:
            return { v: 28 };
        }
        t(!1, "invalid yParity");
      }
      t(!1, "missing v");
    }(e.v, e.yParityAndS, e.yParity), o = new Xe(xr, s, i, c);
    return a && x(o, _n, a), t(e.yParity == null || L(e.yParity, "sig.yParity") === o.yParity, "yParity mismatch"), t(e.yParityAndS == null || e.yParityAndS === o.yParityAndS, "yParityAndS mismatch"), o;
  }
};
Gr = new WeakMap(), Hr = new WeakMap(), Kr = new WeakMap(), _n = new WeakMap();
let at = Xe;
yn.hmacSha256Sync = function(r, ...e) {
  return O(dr("sha256", r, _(e)));
};
var St;
const Bn = class Bn {
  /**
   *  Creates a new **SigningKey** for %%privateKey%%.
   */
  constructor(e) {
    y(this, St, void 0);
    b(vr(e) === 32, "invalid private key", "privateKey", "[REDACTED]"), x(this, St, N(e));
  }
  /**
   *  The private key.
   */
  get privateKey() {
    return l(this, St);
  }
  /**
   *  The uncompressed public key.
   *
   * This will always begin with the prefix ``0x04`` and be 132
   * characters long (the ``0x`` prefix and 130 hexadecimal nibbles).
   */
  get publicKey() {
    return Bn.computePublicKey(l(this, St));
  }
  /**
   *  The compressed public key.
   *
   *  This will always begin with either the prefix ``0x02`` or ``0x03``
   *  and be 68 characters long (the ``0x`` prefix and 33 hexadecimal
   *  nibbles)
   */
  get compressedPublicKey() {
    return Bn.computePublicKey(l(this, St), !0);
  }
  /**
   *  Return the signature of the signed %%digest%%.
   */
  sign(e) {
    b(vr(e) === 32, "invalid digest length", "digest", e);
    const [t, n] = Bh(be(e), be(l(this, St)), {
      recovered: !0,
      canonical: !0
    }), s = Or.fromHex(t);
    return at.from({
      r: zt("0x" + s.r.toString(16), 32),
      s: zt("0x" + s.s.toString(16), 32),
      v: n ? 28 : 27
    });
  }
  /**
   *  Returns the [[link-wiki-ecdh]] shared secret between this
   *  private key and the %%other%% key.
   *
   *  The %%other%% key may be any type of key, a raw public key,
   *  a compressed/uncompressed pubic key or aprivate key.
   *
   *  Best practice is usually to use a cryptographic hash on the
   *  returned value before using it as a symetric secret.
   *
   *  @example:
   *    sign1 = new SigningKey(id("some-secret-1"))
   *    sign2 = new SigningKey(id("some-secret-2"))
   *
   *    // Notice that privA.computeSharedSecret(pubB)...
   *    sign1.computeSharedSecret(sign2.publicKey)
   *    //_result:
   *
   *    // ...is equal to privB.computeSharedSecret(pubA).
   *    sign2.computeSharedSecret(sign1.publicKey)
   *    //_result:
   */
  computeSharedSecret(e) {
    const t = Bn.computePublicKey(e);
    return N(Oh(be(l(this, St)), O(t)));
  }
  /**
   *  Compute the public key for %%key%%, optionally %%compressed%%.
   *
   *  The %%key%% may be any type of key, a raw public key, a
   *  compressed/uncompressed public key or private key.
   *
   *  @example:
   *    sign = new SigningKey(id("some-secret"));
   *
   *    // Compute the uncompressed public key for a private key
   *    SigningKey.computePublicKey(sign.privateKey)
   *    //_result:
   *
   *    // Compute the compressed public key for a private key
   *    SigningKey.computePublicKey(sign.privateKey, true)
   *    //_result:
   *
   *    // Compute the uncompressed public key
   *    SigningKey.computePublicKey(sign.publicKey, false);
   *    //_result:
   *
   *    // Compute the Compressed a public key
   *    SigningKey.computePublicKey(sign.publicKey, true);
   *    //_result:
   */
  static computePublicKey(e, t) {
    let n = O(e, "key");
    if (n.length === 32) {
      const i = vh(n, !!t);
      return N(i);
    }
    if (n.length === 64) {
      const i = new Uint8Array(65);
      i[0] = 4, i.set(n, 1), n = i;
    }
    const s = V.fromHex(n);
    return N(s.toRawBytes(t));
  }
  /**
   *  Returns the public key for the private key which produced the
   *  %%signature%% for the given %%digest%%.
   *
   *  @example:
   *    key = new SigningKey(id("some-secret"))
   *    digest = id("hello world")
   *    sig = key.sign(digest)
   *
   *    // Notice the signer public key...
   *    key.publicKey
   *    //_result:
   *
   *    // ...is equal to the recovered public key
   *    SigningKey.recoverPublicKey(digest, sig)
   *    //_result:
   *
   */
  static recoverPublicKey(e, t) {
    b(vr(e) === 32, "invalid digest length", "digest", e);
    const n = at.from(t), s = Or.fromCompact(be(_([n.r, n.s]))).toDERRawBytes(), i = kh(be(e), s, n.yParity);
    return b(i != null, "invalid signature for digest", "signature", t), N(i);
  }
  /**
   *  Returns the point resulting from adding the ellipic curve points
   *  %%p0%% and %%p1%%.
   *
   *  This is not a common function most developers should require, but
   *  can be useful for certain privacy-specific techniques.
   *
   *  For example, it is used by [[HDNodeWallet]] to compute child
   *  addresses from parent public keys and chain codes.
   */
  static addPoints(e, t, n) {
    const s = V.fromHex(Bn.computePublicKey(e).substring(2)), i = V.fromHex(Bn.computePublicKey(t).substring(2));
    return "0x" + s.add(i).toHex(!!n);
  }
};
St = new WeakMap();
let Et = Bn;
const Lh = BigInt(0), Fh = BigInt(36);
function h0(r) {
  r = r.toLowerCase();
  const e = r.substring(2).split(""), t = new Uint8Array(40);
  for (let s = 0; s < 40; s++)
    t[s] = e[s].charCodeAt(0);
  const n = O(z(t));
  for (let s = 0; s < 40; s += 2)
    n[s >> 1] >> 4 >= 8 && (e[s] = e[s].toUpperCase()), (n[s >> 1] & 15) >= 8 && (e[s + 1] = e[s + 1].toUpperCase());
  return "0x" + e.join("");
}
const bo = {};
for (let r = 0; r < 10; r++)
  bo[String(r)] = String(r);
for (let r = 0; r < 26; r++)
  bo[String.fromCharCode(65 + r)] = String(10 + r);
const x0 = 15;
function Dh(r) {
  r = r.toUpperCase(), r = r.substring(4) + r.substring(0, 2) + "00";
  let e = r.split("").map((n) => bo[n]).join("");
  for (; e.length >= x0; ) {
    let n = e.substring(0, x0);
    e = parseInt(n, 10) % 97 + e.substring(n.length);
  }
  let t = String(98 - parseInt(e, 10) % 97);
  for (; t.length < 2; )
    t = "0" + t;
  return t;
}
const Mh = function() {
  const r = {};
  for (let e = 0; e < 36; e++) {
    const t = "0123456789abcdefghijklmnopqrstuvwxyz"[e];
    r[t] = BigInt(e);
  }
  return r;
}();
function Gh(r) {
  r = r.toLowerCase();
  let e = Lh;
  for (let t = 0; t < r.length; t++)
    e = e * Fh + Mh[r[t]];
  return e;
}
function F(r) {
  if (b(typeof r == "string", "invalid address", "address", r), r.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
    r.startsWith("0x") || (r = "0x" + r);
    const e = h0(r);
    return b(!r.match(/([A-F].*[a-f])|([a-f].*[A-F])/) || e === r, "bad address checksum", "address", r), e;
  }
  if (r.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
    b(r.substring(2, 4) === Dh(r), "bad icap checksum", "address", r);
    let e = Gh(r.substring(4)).toString(16);
    for (; e.length < 40; )
      e = "0" + e;
    return h0("0x" + e);
  }
  b(!1, "invalid address", "address", r);
}
function Hh(r) {
  const e = F(r.from);
  let n = S(r.nonce, "tx.nonce").toString(16);
  return n === "0" ? n = "0x" : n.length % 2 ? n = "0x0" + n : n = "0x" + n, F(W(z(ei([e, n])), 12));
}
function ll(r) {
  return r && typeof r.getAddress == "function";
}
async function ic(r, e) {
  const t = await e;
  return (t == null || t === "0x0000000000000000000000000000000000000000") && (A(typeof r != "string", "unconfigured name", "UNCONFIGURED_NAME", { value: r }), b(!1, "invalid AddressLike value; did not resolve to a value address", "target", r)), F(t);
}
function pe(r, e) {
  if (typeof r == "string")
    return r.match(/^0x[0-9a-f]{40}$/i) ? F(r) : (A(e != null, "ENS resolution requires a provider", "UNSUPPORTED_OPERATION", { operation: "resolveName" }), ic(r, e.resolveName(r)));
  if (ll(r))
    return ic(r, r.getAddress());
  if (r && typeof r.then == "function")
    return ic(r, r);
  b(!1, "unsupported addressable value", "target", r);
}
const Nt = {};
function v(r, e) {
  let t = !1;
  return e < 0 && (t = !0, e *= -1), new ge(Nt, `${t ? "" : "u"}int${e}`, r, { signed: t, width: e });
}
function G(r, e) {
  return new ge(Nt, `bytes${e || ""}`, r, { size: e });
}
const b0 = Symbol.for("_ethers_typed");
var Qn;
const It = class It {
  /**
   *  @_ignore:
   */
  constructor(e, t, n, s) {
    /**
     *  The type, as a Solidity-compatible type.
     */
    g(this, "type");
    /**
     *  The actual value.
     */
    g(this, "value");
    y(this, Qn, void 0);
    /**
     *  @_ignore:
     */
    g(this, "_typedSymbol");
    s == null && (s = null), ur(Nt, e, "Typed"), T(this, { _typedSymbol: b0, type: t, value: n }), x(this, Qn, s), this.format();
  }
  /**
   *  Format the type as a Human-Readable type.
   */
  format() {
    if (this.type === "array")
      throw new Error("");
    if (this.type === "dynamicArray")
      throw new Error("");
    return this.type === "tuple" ? `tuple(${this.value.map((e) => e.format()).join(",")})` : this.type;
  }
  /**
   *  The default value returned by this type.
   */
  defaultValue() {
    return 0;
  }
  /**
   *  The minimum value for numeric types.
   */
  minValue() {
    return 0;
  }
  /**
   *  The maximum value for numeric types.
   */
  maxValue() {
    return 0;
  }
  /**
   *  Returns ``true`` and provides a type guard is this is a [[TypedBigInt]].
   */
  isBigInt() {
    return !!this.type.match(/^u?int[0-9]+$/);
  }
  /**
   *  Returns ``true`` and provides a type guard is this is a [[TypedData]].
   */
  isData() {
    return this.type.startsWith("bytes");
  }
  /**
   *  Returns ``true`` and provides a type guard is this is a [[TypedString]].
   */
  isString() {
    return this.type === "string";
  }
  /**
   *  Returns the tuple name, if this is a tuple. Throws otherwise.
   */
  get tupleName() {
    if (this.type !== "tuple")
      throw TypeError("not a tuple");
    return l(this, Qn);
  }
  // Returns the length of this type as an array
  // - `null` indicates the length is unforced, it could be dynamic
  // - `-1` indicates the length is dynamic
  // - any other value indicates it is a static array and is its length
  /**
   *  Returns the length of the array type or ``-1`` if it is dynamic.
   *
   *  Throws if the type is not an array.
   */
  get arrayLength() {
    if (this.type !== "array")
      throw TypeError("not an array");
    return l(this, Qn) === !0 ? -1 : l(this, Qn) === !1 ? this.value.length : null;
  }
  /**
   *  Returns a new **Typed** of %%type%% with the %%value%%.
   */
  static from(e, t) {
    return new It(Nt, e, t);
  }
  /**
   *  Return a new ``uint8`` type for %%v%%.
   */
  static uint8(e) {
    return v(e, 8);
  }
  /**
   *  Return a new ``uint16`` type for %%v%%.
   */
  static uint16(e) {
    return v(e, 16);
  }
  /**
   *  Return a new ``uint24`` type for %%v%%.
   */
  static uint24(e) {
    return v(e, 24);
  }
  /**
   *  Return a new ``uint32`` type for %%v%%.
   */
  static uint32(e) {
    return v(e, 32);
  }
  /**
   *  Return a new ``uint40`` type for %%v%%.
   */
  static uint40(e) {
    return v(e, 40);
  }
  /**
   *  Return a new ``uint48`` type for %%v%%.
   */
  static uint48(e) {
    return v(e, 48);
  }
  /**
   *  Return a new ``uint56`` type for %%v%%.
   */
  static uint56(e) {
    return v(e, 56);
  }
  /**
   *  Return a new ``uint64`` type for %%v%%.
   */
  static uint64(e) {
    return v(e, 64);
  }
  /**
   *  Return a new ``uint72`` type for %%v%%.
   */
  static uint72(e) {
    return v(e, 72);
  }
  /**
   *  Return a new ``uint80`` type for %%v%%.
   */
  static uint80(e) {
    return v(e, 80);
  }
  /**
   *  Return a new ``uint88`` type for %%v%%.
   */
  static uint88(e) {
    return v(e, 88);
  }
  /**
   *  Return a new ``uint96`` type for %%v%%.
   */
  static uint96(e) {
    return v(e, 96);
  }
  /**
   *  Return a new ``uint104`` type for %%v%%.
   */
  static uint104(e) {
    return v(e, 104);
  }
  /**
   *  Return a new ``uint112`` type for %%v%%.
   */
  static uint112(e) {
    return v(e, 112);
  }
  /**
   *  Return a new ``uint120`` type for %%v%%.
   */
  static uint120(e) {
    return v(e, 120);
  }
  /**
   *  Return a new ``uint128`` type for %%v%%.
   */
  static uint128(e) {
    return v(e, 128);
  }
  /**
   *  Return a new ``uint136`` type for %%v%%.
   */
  static uint136(e) {
    return v(e, 136);
  }
  /**
   *  Return a new ``uint144`` type for %%v%%.
   */
  static uint144(e) {
    return v(e, 144);
  }
  /**
   *  Return a new ``uint152`` type for %%v%%.
   */
  static uint152(e) {
    return v(e, 152);
  }
  /**
   *  Return a new ``uint160`` type for %%v%%.
   */
  static uint160(e) {
    return v(e, 160);
  }
  /**
   *  Return a new ``uint168`` type for %%v%%.
   */
  static uint168(e) {
    return v(e, 168);
  }
  /**
   *  Return a new ``uint176`` type for %%v%%.
   */
  static uint176(e) {
    return v(e, 176);
  }
  /**
   *  Return a new ``uint184`` type for %%v%%.
   */
  static uint184(e) {
    return v(e, 184);
  }
  /**
   *  Return a new ``uint192`` type for %%v%%.
   */
  static uint192(e) {
    return v(e, 192);
  }
  /**
   *  Return a new ``uint200`` type for %%v%%.
   */
  static uint200(e) {
    return v(e, 200);
  }
  /**
   *  Return a new ``uint208`` type for %%v%%.
   */
  static uint208(e) {
    return v(e, 208);
  }
  /**
   *  Return a new ``uint216`` type for %%v%%.
   */
  static uint216(e) {
    return v(e, 216);
  }
  /**
   *  Return a new ``uint224`` type for %%v%%.
   */
  static uint224(e) {
    return v(e, 224);
  }
  /**
   *  Return a new ``uint232`` type for %%v%%.
   */
  static uint232(e) {
    return v(e, 232);
  }
  /**
   *  Return a new ``uint240`` type for %%v%%.
   */
  static uint240(e) {
    return v(e, 240);
  }
  /**
   *  Return a new ``uint248`` type for %%v%%.
   */
  static uint248(e) {
    return v(e, 248);
  }
  /**
   *  Return a new ``uint256`` type for %%v%%.
   */
  static uint256(e) {
    return v(e, 256);
  }
  /**
   *  Return a new ``uint256`` type for %%v%%.
   */
  static uint(e) {
    return v(e, 256);
  }
  /**
   *  Return a new ``int8`` type for %%v%%.
   */
  static int8(e) {
    return v(e, -8);
  }
  /**
   *  Return a new ``int16`` type for %%v%%.
   */
  static int16(e) {
    return v(e, -16);
  }
  /**
   *  Return a new ``int24`` type for %%v%%.
   */
  static int24(e) {
    return v(e, -24);
  }
  /**
   *  Return a new ``int32`` type for %%v%%.
   */
  static int32(e) {
    return v(e, -32);
  }
  /**
   *  Return a new ``int40`` type for %%v%%.
   */
  static int40(e) {
    return v(e, -40);
  }
  /**
   *  Return a new ``int48`` type for %%v%%.
   */
  static int48(e) {
    return v(e, -48);
  }
  /**
   *  Return a new ``int56`` type for %%v%%.
   */
  static int56(e) {
    return v(e, -56);
  }
  /**
   *  Return a new ``int64`` type for %%v%%.
   */
  static int64(e) {
    return v(e, -64);
  }
  /**
   *  Return a new ``int72`` type for %%v%%.
   */
  static int72(e) {
    return v(e, -72);
  }
  /**
   *  Return a new ``int80`` type for %%v%%.
   */
  static int80(e) {
    return v(e, -80);
  }
  /**
   *  Return a new ``int88`` type for %%v%%.
   */
  static int88(e) {
    return v(e, -88);
  }
  /**
   *  Return a new ``int96`` type for %%v%%.
   */
  static int96(e) {
    return v(e, -96);
  }
  /**
   *  Return a new ``int104`` type for %%v%%.
   */
  static int104(e) {
    return v(e, -104);
  }
  /**
   *  Return a new ``int112`` type for %%v%%.
   */
  static int112(e) {
    return v(e, -112);
  }
  /**
   *  Return a new ``int120`` type for %%v%%.
   */
  static int120(e) {
    return v(e, -120);
  }
  /**
   *  Return a new ``int128`` type for %%v%%.
   */
  static int128(e) {
    return v(e, -128);
  }
  /**
   *  Return a new ``int136`` type for %%v%%.
   */
  static int136(e) {
    return v(e, -136);
  }
  /**
   *  Return a new ``int144`` type for %%v%%.
   */
  static int144(e) {
    return v(e, -144);
  }
  /**
   *  Return a new ``int52`` type for %%v%%.
   */
  static int152(e) {
    return v(e, -152);
  }
  /**
   *  Return a new ``int160`` type for %%v%%.
   */
  static int160(e) {
    return v(e, -160);
  }
  /**
   *  Return a new ``int168`` type for %%v%%.
   */
  static int168(e) {
    return v(e, -168);
  }
  /**
   *  Return a new ``int176`` type for %%v%%.
   */
  static int176(e) {
    return v(e, -176);
  }
  /**
   *  Return a new ``int184`` type for %%v%%.
   */
  static int184(e) {
    return v(e, -184);
  }
  /**
   *  Return a new ``int92`` type for %%v%%.
   */
  static int192(e) {
    return v(e, -192);
  }
  /**
   *  Return a new ``int200`` type for %%v%%.
   */
  static int200(e) {
    return v(e, -200);
  }
  /**
   *  Return a new ``int208`` type for %%v%%.
   */
  static int208(e) {
    return v(e, -208);
  }
  /**
   *  Return a new ``int216`` type for %%v%%.
   */
  static int216(e) {
    return v(e, -216);
  }
  /**
   *  Return a new ``int224`` type for %%v%%.
   */
  static int224(e) {
    return v(e, -224);
  }
  /**
   *  Return a new ``int232`` type for %%v%%.
   */
  static int232(e) {
    return v(e, -232);
  }
  /**
   *  Return a new ``int240`` type for %%v%%.
   */
  static int240(e) {
    return v(e, -240);
  }
  /**
   *  Return a new ``int248`` type for %%v%%.
   */
  static int248(e) {
    return v(e, -248);
  }
  /**
   *  Return a new ``int256`` type for %%v%%.
   */
  static int256(e) {
    return v(e, -256);
  }
  /**
   *  Return a new ``int256`` type for %%v%%.
   */
  static int(e) {
    return v(e, -256);
  }
  /**
   *  Return a new ``bytes1`` type for %%v%%.
   */
  static bytes1(e) {
    return G(e, 1);
  }
  /**
   *  Return a new ``bytes2`` type for %%v%%.
   */
  static bytes2(e) {
    return G(e, 2);
  }
  /**
   *  Return a new ``bytes3`` type for %%v%%.
   */
  static bytes3(e) {
    return G(e, 3);
  }
  /**
   *  Return a new ``bytes4`` type for %%v%%.
   */
  static bytes4(e) {
    return G(e, 4);
  }
  /**
   *  Return a new ``bytes5`` type for %%v%%.
   */
  static bytes5(e) {
    return G(e, 5);
  }
  /**
   *  Return a new ``bytes6`` type for %%v%%.
   */
  static bytes6(e) {
    return G(e, 6);
  }
  /**
   *  Return a new ``bytes7`` type for %%v%%.
   */
  static bytes7(e) {
    return G(e, 7);
  }
  /**
   *  Return a new ``bytes8`` type for %%v%%.
   */
  static bytes8(e) {
    return G(e, 8);
  }
  /**
   *  Return a new ``bytes9`` type for %%v%%.
   */
  static bytes9(e) {
    return G(e, 9);
  }
  /**
   *  Return a new ``bytes10`` type for %%v%%.
   */
  static bytes10(e) {
    return G(e, 10);
  }
  /**
   *  Return a new ``bytes11`` type for %%v%%.
   */
  static bytes11(e) {
    return G(e, 11);
  }
  /**
   *  Return a new ``bytes12`` type for %%v%%.
   */
  static bytes12(e) {
    return G(e, 12);
  }
  /**
   *  Return a new ``bytes13`` type for %%v%%.
   */
  static bytes13(e) {
    return G(e, 13);
  }
  /**
   *  Return a new ``bytes14`` type for %%v%%.
   */
  static bytes14(e) {
    return G(e, 14);
  }
  /**
   *  Return a new ``bytes15`` type for %%v%%.
   */
  static bytes15(e) {
    return G(e, 15);
  }
  /**
   *  Return a new ``bytes16`` type for %%v%%.
   */
  static bytes16(e) {
    return G(e, 16);
  }
  /**
   *  Return a new ``bytes17`` type for %%v%%.
   */
  static bytes17(e) {
    return G(e, 17);
  }
  /**
   *  Return a new ``bytes18`` type for %%v%%.
   */
  static bytes18(e) {
    return G(e, 18);
  }
  /**
   *  Return a new ``bytes19`` type for %%v%%.
   */
  static bytes19(e) {
    return G(e, 19);
  }
  /**
   *  Return a new ``bytes20`` type for %%v%%.
   */
  static bytes20(e) {
    return G(e, 20);
  }
  /**
   *  Return a new ``bytes21`` type for %%v%%.
   */
  static bytes21(e) {
    return G(e, 21);
  }
  /**
   *  Return a new ``bytes22`` type for %%v%%.
   */
  static bytes22(e) {
    return G(e, 22);
  }
  /**
   *  Return a new ``bytes23`` type for %%v%%.
   */
  static bytes23(e) {
    return G(e, 23);
  }
  /**
   *  Return a new ``bytes24`` type for %%v%%.
   */
  static bytes24(e) {
    return G(e, 24);
  }
  /**
   *  Return a new ``bytes25`` type for %%v%%.
   */
  static bytes25(e) {
    return G(e, 25);
  }
  /**
   *  Return a new ``bytes26`` type for %%v%%.
   */
  static bytes26(e) {
    return G(e, 26);
  }
  /**
   *  Return a new ``bytes27`` type for %%v%%.
   */
  static bytes27(e) {
    return G(e, 27);
  }
  /**
   *  Return a new ``bytes28`` type for %%v%%.
   */
  static bytes28(e) {
    return G(e, 28);
  }
  /**
   *  Return a new ``bytes29`` type for %%v%%.
   */
  static bytes29(e) {
    return G(e, 29);
  }
  /**
   *  Return a new ``bytes30`` type for %%v%%.
   */
  static bytes30(e) {
    return G(e, 30);
  }
  /**
   *  Return a new ``bytes31`` type for %%v%%.
   */
  static bytes31(e) {
    return G(e, 31);
  }
  /**
   *  Return a new ``bytes32`` type for %%v%%.
   */
  static bytes32(e) {
    return G(e, 32);
  }
  /**
   *  Return a new ``address`` type for %%v%%.
   */
  static address(e) {
    return new It(Nt, "address", e);
  }
  /**
   *  Return a new ``bool`` type for %%v%%.
   */
  static bool(e) {
    return new It(Nt, "bool", !!e);
  }
  /**
   *  Return a new ``bytes`` type for %%v%%.
   */
  static bytes(e) {
    return new It(Nt, "bytes", e);
  }
  /**
   *  Return a new ``string`` type for %%v%%.
   */
  static string(e) {
    return new It(Nt, "string", e);
  }
  /**
   *  Return a new ``array`` type for %%v%%, allowing %%dynamic%% length.
   */
  static array(e, t) {
    throw new Error("not implemented yet");
  }
  /**
   *  Return a new ``tuple`` type for %%v%%, with the optional %%name%%.
   */
  static tuple(e, t) {
    throw new Error("not implemented yet");
  }
  /**
   *  Return a new ``uint8`` type for %%v%%.
   */
  static overrides(e) {
    return new It(Nt, "overrides", Object.assign({}, e));
  }
  /**
   *  Returns true only if %%value%% is a [[Typed]] instance.
   */
  static isTyped(e) {
    return e && typeof e == "object" && "_typedSymbol" in e && e._typedSymbol === b0;
  }
  /**
   *  If the value is a [[Typed]] instance, validates the underlying value
   *  and returns it, otherwise returns value directly.
   *
   *  This is useful for functions that with to accept either a [[Typed]]
   *  object or values.
   */
  static dereference(e, t) {
    if (It.isTyped(e)) {
      if (e.type !== t)
        throw new Error(`invalid type: expecetd ${t}, got ${e.type}`);
      return e.value;
    }
    return e;
  }
};
Qn = new WeakMap();
let ge = It;
class Kh extends Yt {
  constructor(e) {
    super("address", "address", e, !1);
  }
  defaultValue() {
    return "0x0000000000000000000000000000000000000000";
  }
  encode(e, t) {
    let n = ge.dereference(t, "string");
    try {
      n = F(n);
    } catch (s) {
      return this._throwError(s.message, t);
    }
    return e.writeValue(n);
  }
  decode(e) {
    return F(zt(e.readValue(), 20));
  }
}
class Vh extends Yt {
  constructor(t) {
    super(t.name, t.type, "_", t.dynamic);
    g(this, "coder");
    this.coder = t;
  }
  defaultValue() {
    return this.coder.defaultValue();
  }
  encode(t, n) {
    return this.coder.encode(t, n);
  }
  decode(t) {
    return this.coder.decode(t);
  }
}
function ul(r, e, t) {
  let n = [];
  if (Array.isArray(t))
    n = t;
  else if (t && typeof t == "object") {
    let o = {};
    n = e.map((f) => {
      const u = f.localName;
      return A(u, "cannot encode object for signature with missing names", "INVALID_ARGUMENT", { argument: "values", info: { coder: f }, value: t }), A(!o[u], "cannot encode object for signature with duplicate names", "INVALID_ARGUMENT", { argument: "values", info: { coder: f }, value: t }), o[u] = !0, t[u];
    });
  } else
    b(!1, "invalid tuple value", "tuple", t);
  b(e.length === n.length, "types/value length mismatch", "tuple", t);
  let s = new vc(), i = new vc(), a = [];
  e.forEach((o, f) => {
    let u = n[f];
    if (o.dynamic) {
      let d = i.length;
      o.encode(i, u);
      let h = s.writeUpdatableValue();
      a.push((p) => {
        h(p + d);
      });
    } else
      o.encode(s, u);
  }), a.forEach((o) => {
    o(s.length);
  });
  let c = r.appendWriter(s);
  return c += r.appendWriter(i), c;
}
function dl(r, e) {
  let t = [], n = [], s = r.subReader(0);
  return e.forEach((i) => {
    let a = null;
    if (i.dynamic) {
      let c = r.readIndex(), o = s.subReader(c);
      try {
        a = i.decode(o);
      } catch (f) {
        if (je(f, "BUFFER_OVERRUN"))
          throw f;
        a = f, a.baseType = i.name, a.name = i.localName, a.type = i.type;
      }
    } else
      try {
        a = i.decode(r);
      } catch (c) {
        if (je(c, "BUFFER_OVERRUN"))
          throw c;
        a = c, a.baseType = i.name, a.name = i.localName, a.type = i.type;
      }
    if (a == null)
      throw new Error("investigate");
    t.push(a), n.push(i.localName || null);
  }), wa.fromItems(t, n);
}
class _h extends Yt {
  constructor(t, n, s) {
    const i = t.type + "[" + (n >= 0 ? n : "") + "]", a = n === -1 || t.dynamic;
    super("array", i, s, a);
    g(this, "coder");
    g(this, "length");
    T(this, { coder: t, length: n });
  }
  defaultValue() {
    const t = this.coder.defaultValue(), n = [];
    for (let s = 0; s < this.length; s++)
      n.push(t);
    return n;
  }
  encode(t, n) {
    const s = ge.dereference(n, "array");
    Array.isArray(s) || this._throwError("expected array value", s);
    let i = this.length;
    i === -1 && (i = s.length, t.writeValue(s.length)), ff(s.length, i, "coder array" + (this.localName ? " " + this.localName : ""));
    let a = [];
    for (let c = 0; c < s.length; c++)
      a.push(this.coder);
    return ul(t, a, s);
  }
  decode(t) {
    let n = this.length;
    n === -1 && (n = t.readIndex(), A(n * we <= t.dataLength, "insufficient data length", "BUFFER_OVERRUN", { buffer: t.bytes, offset: n * we, length: t.dataLength }));
    let s = [];
    for (let i = 0; i < n; i++)
      s.push(new Vh(this.coder));
    return dl(t, s);
  }
}
class Qh extends Yt {
  constructor(e) {
    super("bool", "bool", e, !1);
  }
  defaultValue() {
    return !1;
  }
  encode(e, t) {
    const n = ge.dereference(t, "bool");
    return e.writeValue(n ? 1 : 0);
  }
  decode(e) {
    return !!e.readValue();
  }
}
class hl extends Yt {
  constructor(e, t) {
    super(e, e, t, !0);
  }
  defaultValue() {
    return "0x";
  }
  encode(e, t) {
    t = be(t);
    let n = e.writeValue(t.length);
    return n += e.writeBytes(t), n;
  }
  decode(e) {
    return e.readBytes(e.readIndex(), !0);
  }
}
class zh extends hl {
  constructor(e) {
    super("bytes", e);
  }
  decode(e) {
    return N(super.decode(e));
  }
}
class Jh extends Yt {
  constructor(t, n) {
    let s = "bytes" + String(t);
    super(s, s, n, !1);
    g(this, "size");
    T(this, { size: t }, { size: "number" });
  }
  defaultValue() {
    return "0x0000000000000000000000000000000000000000000000000000000000000000".substring(0, 2 + this.size * 2);
  }
  encode(t, n) {
    let s = be(ge.dereference(n, this.type));
    return s.length !== this.size && this._throwError("incorrect data length", n), t.writeBytes(s);
  }
  decode(t) {
    return N(t.readBytes(this.size));
  }
}
const jh = new Uint8Array([]);
class Wh extends Yt {
  constructor(e) {
    super("null", "", e, !1);
  }
  defaultValue() {
    return null;
  }
  encode(e, t) {
    return t != null && this._throwError("not null", t), e.writeBytes(jh);
  }
  decode(e) {
    return e.readBytes(0), null;
  }
}
const Yh = BigInt(0), Zh = BigInt(1), Xh = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
class $h extends Yt {
  constructor(t, n, s) {
    const i = (n ? "int" : "uint") + t * 8;
    super(i, i, s, !1);
    g(this, "size");
    g(this, "signed");
    T(this, { size: t, signed: n }, { size: "number", signed: "boolean" });
  }
  defaultValue() {
    return 0;
  }
  encode(t, n) {
    let s = S(ge.dereference(n, this.type)), i = Ds(Xh, we * 8);
    if (this.signed) {
      let a = Ds(i, this.size * 8 - 1);
      (s > a || s < -(a + Zh)) && this._throwError("value out-of-bounds", n), s = xf(s, 8 * we);
    } else
      (s < Yh || s > Ds(i, this.size * 8)) && this._throwError("value out-of-bounds", n);
    return t.writeValue(s);
  }
  decode(t) {
    let n = Ds(t.readValue(), this.size * 8);
    return this.signed && (n = Uu(n, this.size * 8)), n;
  }
}
class qh extends hl {
  constructor(e) {
    super("string", e);
  }
  defaultValue() {
    return "";
  }
  encode(e, t) {
    return super.encode(e, Ee(ge.dereference(t, "string")));
  }
  decode(e) {
    return io(super.decode(e));
  }
}
class ta extends Yt {
  constructor(t, n) {
    let s = !1;
    const i = [];
    t.forEach((c) => {
      c.dynamic && (s = !0), i.push(c.type);
    });
    const a = "tuple(" + i.join(",") + ")";
    super("tuple", a, n, s);
    g(this, "coders");
    T(this, { coders: Object.freeze(t.slice()) });
  }
  defaultValue() {
    const t = [];
    this.coders.forEach((s) => {
      t.push(s.defaultValue());
    });
    const n = this.coders.reduce((s, i) => {
      const a = i.localName;
      return a && (s[a] || (s[a] = 0), s[a]++), s;
    }, {});
    return this.coders.forEach((s, i) => {
      let a = s.localName;
      !a || n[a] !== 1 || (a === "length" && (a = "_length"), t[a] == null && (t[a] = t[i]));
    }), Object.freeze(t);
  }
  encode(t, n) {
    const s = ge.dereference(n, "tuple");
    return ul(t, this.coders, s);
  }
  decode(t) {
    return dl(t, this.coders);
  }
}
function jt(r) {
  return z(Ee(r));
}
function ex(r) {
  let e = 0;
  function t() {
    return r[e++] << 8 | r[e++];
  }
  let n = t(), s = 1, i = [0, 1];
  for (let R = 1; R < n; R++)
    i.push(s += t());
  let a = t(), c = e;
  e += a;
  let o = 0, f = 0;
  function u() {
    return o == 0 && (f = f << 8 | r[e++], o = 8), f >> --o & 1;
  }
  const d = 31, h = 2 ** d, p = h >>> 1, m = p >> 1, w = h - 1;
  let E = 0;
  for (let R = 0; R < d; R++)
    E = E << 1 | u();
  let C = [], B = 0, I = h;
  for (; ; ) {
    let R = Math.floor(((E - B + 1) * s - 1) / I), J = 0, se = n;
    for (; se - J > 1; ) {
      let fe = J + se >>> 1;
      R < i[fe] ? se = fe : J = fe;
    }
    if (J == 0)
      break;
    C.push(J);
    let Q = B + Math.floor(I * i[J] / s), j = B + Math.floor(I * i[J + 1] / s) - 1;
    for (; !((Q ^ j) & p); )
      E = E << 1 & w | u(), Q = Q << 1 & w, j = j << 1 & w | 1;
    for (; Q & ~j & m; )
      E = E & p | E << 1 & w >>> 1 | u(), Q = Q << 1 ^ p, j = (j ^ p) << 1 | p | 1;
    B = Q, I = 1 + j - Q;
  }
  let K = n - 4;
  return C.map((R) => {
    switch (R - K) {
      case 3:
        return K + 65792 + (r[c++] << 16 | r[c++] << 8 | r[c++]);
      case 2:
        return K + 256 + (r[c++] << 8 | r[c++]);
      case 1:
        return K + r[c++];
      default:
        return R - 1;
    }
  });
}
function tx(r) {
  let e = 0;
  return () => r[e++];
}
function xl(r) {
  return tx(ex(nx(r)));
}
function nx(r) {
  let e = [];
  [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"].forEach((s, i) => e[s.charCodeAt(0)] = i);
  let t = r.length, n = new Uint8Array(6 * t >> 3);
  for (let s = 0, i = 0, a = 0, c = 0; s < t; s++)
    c = c << 6 | e[r.charCodeAt(s)], a += 6, a >= 8 && (n[i++] = c >> (a -= 8));
  return n;
}
function rx(r) {
  return r & 1 ? ~r >> 1 : r >> 1;
}
function sx(r, e) {
  let t = Array(r);
  for (let n = 0, s = 0; n < r; n++)
    t[n] = s += rx(e());
  return t;
}
function En(r, e = 0) {
  let t = [];
  for (; ; ) {
    let n = r(), s = r();
    if (!s)
      break;
    e += n;
    for (let i = 0; i < s; i++)
      t.push(e + i);
    e += s + 1;
  }
  return t;
}
function bl(r) {
  return si(() => {
    let e = En(r);
    if (e.length)
      return e;
  });
}
function pl(r) {
  let e = [];
  for (; ; ) {
    let t = r();
    if (t == 0)
      break;
    e.push(ix(t, r));
  }
  for (; ; ) {
    let t = r() - 1;
    if (t < 0)
      break;
    e.push(ax(t, r));
  }
  return e.flat();
}
function si(r) {
  let e = [];
  for (; ; ) {
    let t = r(e.length);
    if (!t)
      break;
    e.push(t);
  }
  return e;
}
function gl(r, e, t) {
  let n = Array(r).fill().map(() => []);
  for (let s = 0; s < e; s++)
    sx(r, t).forEach((i, a) => n[a].push(i));
  return n;
}
function ix(r, e) {
  let t = 1 + e(), n = e(), s = si(e);
  return gl(s.length, 1 + r, e).flatMap((a, c) => {
    let [o, ...f] = a;
    return Array(s[c]).fill().map((u, d) => {
      let h = d * n;
      return [o + d * t, f.map((p) => p + h)];
    });
  });
}
function ax(r, e) {
  let t = 1 + e();
  return gl(t, 1 + r, e).map((s) => [s[0], s.slice(1)]);
}
var Be = xl("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");
const p0 = /* @__PURE__ */ new Map([[8217, "apostrophe"], [8260, "fraction slash"], [12539, "middle dot"]]), g0 = 4;
function cx(r) {
  return r.toString(16).toUpperCase().padStart(2, "0");
}
function yl(r) {
  return `{${cx(r)}}`;
}
function ox(r) {
  let e = [];
  for (let t = 0, n = r.length; t < n; ) {
    let s = r.codePointAt(t);
    t += s < 65536 ? 1 : 2, e.push(s);
  }
  return e;
}
function ii(r) {
  let t = r.length;
  if (t < 4096)
    return String.fromCodePoint(...r);
  let n = [];
  for (let s = 0; s < t; )
    n.push(String.fromCodePoint(...r.slice(s, s += 4096)));
  return n.join("");
}
var po = xl("AEUDTAHBCFQATQDRADAAcgAgADQAFAAsABQAHwAOACQADQARAAoAFwAHABIACAAPAAUACwAFAAwABAAQAAMABwAEAAoABQAIAAIACgABAAQAFAALAAIACwABAAIAAQAHAAMAAwAEAAsADAAMAAwACgANAA0AAwAKAAkABAAdAAYAZwDSAdsDJgC0CkMB8xhZAqfoC190UGcThgBurwf7PT09Pb09AjgJum8OjDllxHYUKXAPxzq6tABAxgK8ysUvWAgMPT09PT09PSs6LT2HcgWXWwFLoSMEEEl5RFVMKvO0XQ8ExDdJMnIgsj26PTQyy8FfEQ8AY8IPAGcEbwRwBHEEcgRzBHQEdQR2BHcEeAR6BHsEfAR+BIAEgfndBQoBYgULAWIFDAFiBNcE2ATZBRAFEQUvBdALFAsVDPcNBw13DYcOMA4xDjMB4BllHI0B2grbAMDpHLkQ7QHVAPRNQQFnGRUEg0yEB2uaJF8AJpIBpob5AERSMAKNoAXqaQLUBMCzEiACnwRZEkkVsS7tANAsBG0RuAQLEPABv9HICTUBXigPZwRBApMDOwAamhtaABqEAY8KvKx3LQ4ArAB8UhwEBAVSagD8AEFZADkBIadVj2UMUgx5Il4ANQC9AxIB1BlbEPMAs30CGxlXAhwZKQIECBc6EbsCoxngzv7UzRQA8M0BawL6ZwkN7wABAD33OQRcsgLJCjMCjqUChtw/km+NAsXPAoP2BT84PwURAK0RAvptb6cApQS/OMMey5HJS84UdxpxTPkCogVFITaTOwERAK5pAvkNBOVyA7q3BKlOJSALAgUIBRcEdASpBXqzABXFSWZOawLCOqw//AolCZdvv3dSBkEQGyelEPcMMwG1ATsN7UvYBPEGOwTJH30ZGQ/NlZwIpS3dDO0m4y6hgFoj9SqDBe1L9DzdC01RaA9ZC2UJ4zpjgU4DIQENIosK3Q05CG0Q8wrJaw3lEUUHOQPVSZoApQcBCxEdNRW1JhBirAsJOXcG+xr2C48mrxMpevwF0xohBk0BKRr/AM8u54WwWjFcHE9fBgMLJSPHFKhQIA0lQLd4SBobBxUlqQKRQ3BKh1E2HpMh9jw9DWYuE1F8B/U8BRlPC4E8nkarRQ4R0j6NPUgiSUwsBDV/LC8niwnPD4UMuXxyAVkJIQmxDHETMREXN8UIOQcZLZckJxUIIUaVYJoE958D8xPRAwsFPwlBBxMDtRwtEy4VKQUNgSTXAvM21S6zAo9WgAEXBcsPJR/fEFBH4A7pCJsCZQODJesALRUhABcimwhDYwBfj9hTBS7LCMdqbCN0A2cU52ERcweRDlcHpxwzFb8c4XDIXguGCCijrwlbAXUJmQFfBOMICTVbjKAgQWdTi1gYmyBhQT9d/AIxDGUVn0S9h3gCiw9rEhsBNQFzBzkNAQJ3Ee0RaxCVCOuGBDW1M/g6JQRPIYMgEQonA09szgsnJvkM+GkBoxJiAww0PXfuZ6tgtiQX/QcZMsVBYCHxC5JPzQycGsEYQlQuGeQHvwPzGvMn6kFXBf8DowMTOk0z7gS9C2kIiwk/AEkOoxcH1xhqCnGM0AExiwG3mQNXkYMCb48GNwcLAGcLhwV55QAdAqcIowAFAM8DVwA5Aq0HnQAZAIVBAT0DJy8BIeUCjwOTCDHLAZUvAfMpBBvDDBUA9zduSgLDsQKAamaiBd1YAo4CSTUBTSUEBU5HUQOvceEA2wBLBhPfRwEVq0rLGuNDAd9vKwDHAPsABTUHBUEBzQHzbQC3AV8LMQmis7UBTekpAIMAFWsB1wKJAN0ANQB/8QFTAE0FWfkF0wJPSQERMRgrV2EBuwMfATMBDQB5BsuNpckHHwRtB9MCEBsV4QLvLge1AQMi3xPNQsUCvd5VoWACZIECYkJbTa9bNyACofcCaJgCZgkCn4Q4GwsCZjsCZiYEbgR/A38TA36SOQY5dxc5gjojIwJsHQIyNjgKAm3HAm2u74ozZ0UrAWcA3gDhAEoFB5gMjQD+C8IADbUCdy8CdqI/AnlLQwJ4uh1c20WuRtcCfD8CesgCfQkCfPAFWQUgSABIfWMkAoFtAoAAAoAFAn+uSVhKWxUXSswC0QEC0MxLJwOITwOH5kTFkTIC8qFdAwMDrkvOTC0lA89NTE2vAos/AorYwRsHHUNnBbcCjjcCjlxAl4ECjtkCjlx4UbRTNQpS1FSFApP7ApMMAOkAHFUeVa9V0AYsGymVhjLheGZFOzkCl58C77JYIagAWSUClo8ClnycAKlZrFoJgU0AOwKWtQKWTlxEXNECmcsCmWRcyl0HGQKcmznCOp0CnBYCn5sCnriKAB0PMSoPAp3xAp6SALU9YTRh7wKe0wKgbgGpAp6fHwKeTqVjyGQnJSsCJ68CJn4CoPsCoEwCot0CocQCpi8Cpc4Cp/8AfQKn8mh8aLEAA0lqHGrRAqzjAqyuAq1nAq0CAlcdAlXcArHh1wMfTmyXArK9DQKy6Bds4G1jbUhfAyXNArZcOz9ukAMpRQK4XgK5RxUCuSp3cDZw4QK9GQK72nCWAzIRAr6IcgIDM3ECvhpzInNPAsPLAsMEc4J0SzVFdOADPKcDPJoDPb8CxXwCxkcCxhCJAshpUQLIRALJTwLJLgJknQLd0nh5YXiueSVL0AMYo2cCAmH0GfOVJHsLXpJeuxECz2sCz2wvS1PS8xOfAMatAs9zASnqA04SfksFAtwnAtuKAtJPA1JcA1NfAQEDVYyAiT8AyxbtYEWCHILTgs6DjQLaxwLZ3oQQhEmnPAOGpQAvA2QOhnFZ+QBVAt9lAt64c3cC4i/tFAHzMCcB9JsB8tKHAuvzAulweQLq+QLq5AD5RwG5Au6JAuuclqqXAwLuPwOF4Jh5cOBxoQLzAwBpA44WmZMC9xMDkW4DkocC95gC+dkC+GaaHJqruzebHgOdgwL++gEbADmfHJ+zAwWNA6ZqA6bZANHFAwZqoYiiBQkDDEkCwAA/AwDhQRdTARHzA2sHl2cFAJMtK7evvdsBiZkUfxEEOQH7KQUhDp0JnwCS/SlXxQL3AZ0AtwW5AG8LbUEuFCaNLgFDAYD8AbUmAHUDDgRtACwCFgyhAAAKAj0CagPdA34EkQEgRQUhfAoABQBEABMANhICdwEABdUDa+8KxQIA9wqfJ7+xt+UBkSFBQgHpFH8RNMCJAAQAGwBaAkUChIsABjpTOpSNbQC4Oo860ACNOME63AClAOgAywE6gTo7Ofw5+Tt2iTpbO56JOm85GAFWATMBbAUvNV01njWtNWY1dTW2NcU1gjWRNdI14TWeNa017jX9NbI1wTYCNhE1xjXVNhY2JzXeNe02LjY9Ni41LSE2OjY9Njw2yTcIBJA8VzY4Nt03IDcPNsogN4k3MAoEsDxnNiQ3GTdsOo03IULUQwdC4EMLHA8PCZsobShRVQYA6X8A6bABFCnXAukBowC9BbcAbwNzBL8MDAMMAQgDAAkKCwsLCQoGBAVVBI/DvwDz9b29kaUCb0QtsRTNLt4eGBcSHAMZFhYZEhYEARAEBUEcQRxBHEEcQRxBHEEaQRxBHEFCSTxBPElISUhBNkM2QTYbNklISVmBVIgBFLWZAu0BhQCjBcEAbykBvwGJAaQcEZ0ePCklMAAhMvAIMAL54gC7Bm8EescjzQMpARQpKgDUABavAj626xQAJP0A3etzuf4NNRA7efy2Z9NQrCnC0OSyANz5BBIbJ5IFDR6miIavYS6tprjjmuKebxm5C74Q225X1pkaYYPb6f1DK4k3xMEBb9S2WMjEibTNWhsRJIA+vwNVEiXTE5iXs/wezV66oFLfp9NZGYW+Gk19J2+bCT6Ye2w6LDYdgzKMUabk595eLBCXANz9HUpWbATq9vqXVx9XDg+Pc9Xp4+bsS005SVM/BJBM4687WUuf+Uj9dEi8aDNaPxtpbDxcG1THTImUMZq4UCaaNYpsVqraNyKLJXDYsFZ/5jl7bLRtO88t7P3xZaAxhb5OdPMXqsSkp1WCieG8jXm1U99+blvLlXzPCS+M93VnJCiK+09LfaSaBAVBomyDgJua8dfUzR7ga34IvR2Nvj+A9heJ6lsl1KG4NkI1032Cnff1m1wof2B9oHJK4bi6JkEdSqeNeiuo6QoZZincoc73/TH9SXF8sCE7XyuYyW8WSgbGFCjPV0ihLKhdPs08Tx82fYAkLLc4I2wdl4apY7GU5lHRFzRWJep7Ww3wbeA3qmd59/86P4xuNaqDpygXt6M85glSBHOCGgJDnt+pN9bK7HApMguX6+06RZNjzVmcZJ+wcUrJ9//bpRNxNuKpNl9uFds+S9tdx7LaM5ZkIrPj6nIU9mnbFtVbs9s/uLgl8MVczAwet+iOEzzBlYW7RCMgE6gyNLeq6+1tIx4dpgZnd0DksJS5f+JNDpwwcPNXaaVspq1fbQajOrJgK0ofKtJ1Ne90L6VO4MOl5S886p7u6xo7OLjG8TGL+HU1JXGJgppg4nNbNJ5nlzSpuPYy21JUEcUA94PoFiZfjZue+QnyQ80ekOuZVkxx4g+cvhJfHgNl4hy1/a6+RKcKlar/J29y//EztlbVPHVUeQ1zX86eQVAjR/M3dA9w4W8LfaXp4EgM85wOWasli837PzVMOnsLzR+k3o75/lRPAJSE1xAKQzEi5v10ke+VBvRt1cwQRMd+U5mLCTGVd6XiZtgBG5cDi0w22GKcVNvHiu5LQbZEDVtz0onn7k5+heuKXVsZtSzilkLRAUmjMXEMB3J9YC50XBxPiz53SC+EhnPl9WsKCv92SM/OFFIMJZYfl0WW8tIO3UxYcwdMAj7FSmgrsZ2aAZO03BOhP1bNNZItyXYQFTpC3SG1VuPDqH9GkiCDmE+JwxyIVSO5siDErAOpEXFgjy6PQtOVDj+s6e1r8heWVvmZnTciuf4EiNZzCAd7SOMhXERIOlsHIMG399i9aLTy3m2hRLZjJVDNLS53iGIK11dPqQt0zBDyg6qc7YqkDm2M5Ve6dCWCaCbTXX2rToaIgz6+zh4lYUi/+6nqcFMAkQJKHYLK0wYk5N9szV6xihDbDDFr45lN1K4aCXBq/FitPSud9gLt5ZVn+ZqGX7cwm2z5EGMgfFpIFyhGGuDPmso6TItTMwny+7uPnLCf4W6goFQFV0oQSsc9VfMmVLcLr6ZetDZbaSFTLqnSO/bIPjA3/zAUoqgGFAEQS4IhuMzEp2I3jJzbzkk/IEmyax+rhZTwd6f+CGtwPixu8IvzACquPWPREu9ZvGkUzpRwvRRuaNN6cr0W1wWits9ICdYJ7ltbgMiSL3sTPeufgNcVqMVWFkCPDH4jG2jA0XcVgQj62Cb29v9f/z/+2KbYvIv/zzjpQAPkliaVDzNrW57TZ/ZOyZD0nlfMmAIBIAGAI0D3k/mdN4xr9v85ZbZbbqfH2jGd5hUqNZWwl5SPfoGmfElmazUIeNL1j/mkF7VNAzTq4jNt8JoQ11NQOcmhprXoxSxfRGJ9LDEOAQ+dmxAQH90iti9e2u/MoeuaGcDTHoC+xsmEeWmxEKefQuIzHbpw5Tc5cEocboAD09oipWQhtTO1wivf/O+DRe2rpl/E9wlrzBorjJsOeG1B/XPW4EaJEFdNlECEZga5ZoGRHXgYouGRuVkm8tDESiEyFNo+3s5M5puSdTyUL2llnINVHEt91XUNW4ewdMgJ4boJfEyt/iY5WXqbA+A2Fkt5Z0lutiWhe9nZIyIUjyXDC3UsaG1t+eNx6z4W/OYoTB7A6x+dNSTOi9AInctbESqm5gvOLww7OWXPrmHwVZasrl4eD113pm+JtT7JVOvnCXqdzzdTRHgJ0PiGTFYW5Gvt9R9LD6Lzfs0v/TZZHSmyVNq7viIHE6DBK7Qp07Iz55EM8SYtQvZf/obBniTWi5C2/ovHfw4VndkE5XYdjOhCMRjDeOEfXeN/CwfGduiUIfsoFeUxXeQXba7c7972XNv8w+dTjjUM0QeNAReW+J014dKAD/McQYXT7c0GQPIkn3Ll6R7gGjuiQoZD0TEeEqQpKoZ15g/0OPQI17QiSv9AUROa/V/TQN3dvLArec3RrsYlvBm1b8LWzltdugsC50lNKYLEp2a+ZZYqPejULRlOJh5zj/LVMyTDvwKhMxxwuDkxJ1QpoNI0OTWLom4Z71SNzI9TV1iXJrIu9Wcnd+MCaAw8o1jSXd94YU/1gnkrC9BUEOtQvEIQ7g0i6h+KL2JKk8Ydl7HruvgWMSAmNe+LshGhV4qnWHhO9/RIPQzY1tHRj2VqOyNsDpK0cww+56AdDC4gsWwY0XxoucIWIqs/GcwnWqlaT0KPr8mbK5U94/301i1WLt4YINTVvCFBrFZbIbY8eycOdeJ2teD5IfPLCRg7jjcFTwlMFNl9zdh/o3E/hHPwj7BWg0MU09pPrBLbrCgm54A6H+I6v27+jL5gkjWg/iYdks9jbfVP5y/n0dlgWEMlKasl7JvFZd56LfybW1eeaVO0gxTfXZwD8G4SI116yx7UKVRgui6Ya1YpixqXeNLc8IxtAwCU5IhwQgn+NqHnRaDv61CxKhOq4pOX7M6pkA+Pmpd4j1vn6ACUALoLLc4vpXci8VidLxzm7qFBe7s+quuJs6ETYmnpgS3LwSZxPIltgBDXz8M1k/W2ySNv2f9/NPhxLGK2D21dkHeSGmenRT3Yqcdl0m/h3OYr8V+lXNYGf8aCCpd4bWjE4QIPj7vUKN4Nrfs7ML6Y2OyS830JCnofg/k7lpFpt4SqZc5HGg1HCOrHvOdC8bP6FGDbE/VV0mX4IakzbdS/op+Kt3G24/8QbBV7y86sGSQ/vZzU8FXs7u6jIvwchsEP2BpIhW3G8uWNwa3HmjfH/ZjhhCWvluAcF+nMf14ClKg5hGgtPLJ98ueNAkc5Hs2WZlk2QHvfreCK1CCGO6nMZVSb99VM/ajr8WHTte9JSmkXq/i/U943HEbdzW6Re/S88dKgg8pGOLlAeNiqrcLkUR3/aClFpMXcOUP3rmETcWSfMXZE3TUOi8i+fqRnTYLflVx/Vb/6GJ7eIRZUA6k3RYR3iFSK9c4iDdNwJuZL2FKz/IK5VimcNWEqdXjSoxSgmF0UPlDoUlNrPcM7ftmA8Y9gKiqKEHuWN+AZRIwtVSxye2Kf8rM3lhJ5XcBXU9n4v0Oy1RU2M+4qM8AQPVwse8ErNSob5oFPWxuqZnVzo1qB/IBxkM3EVUKFUUlO3e51259GgNcJbCmlvrdjtoTW7rChm1wyCKzpCTwozUUEOIcWLneRLgMXh+SjGSFkAllzbGS5HK7LlfCMRNRDSvbQPjcXaenNYxCvu2Qyznz6StuxVj66SgI0T8B6/sfHAJYZaZ78thjOSIFumNWLQbeZixDCCC+v0YBtkxiBB3jefHqZ/dFHU+crbj6OvS1x/JDD7vlm7zOVPwpUC01nhxZuY/63E7g");
function Gs(r) {
  return r >> 24 & 255;
}
function ml(r) {
  return r & 16777215;
}
const fx = new Map(bl(po).flatMap((r, e) => r.map((t) => [t, e + 1 << 24]))), lx = new Set(En(po)), wl = /* @__PURE__ */ new Map(), Uc = /* @__PURE__ */ new Map();
for (let [r, e] of pl(po)) {
  if (!lx.has(r) && e.length == 2) {
    let [t, n] = e, s = Uc.get(t);
    s || (s = /* @__PURE__ */ new Map(), Uc.set(t, s)), s.set(n, r);
  }
  wl.set(r, e.reverse());
}
const ai = 44032, Na = 4352, Ia = 4449, va = 4519, Al = 19, El = 21, Es = 28, ka = El * Es, ux = Al * ka, dx = ai + ux, hx = Na + Al, xx = Ia + El, bx = va + Es;
function Cl(r) {
  return r >= ai && r < dx;
}
function px(r, e) {
  if (r >= Na && r < hx && e >= Ia && e < xx)
    return ai + (r - Na) * ka + (e - Ia) * Es;
  if (Cl(r) && e > va && e < bx && (r - ai) % Es == 0)
    return r + (e - va);
  {
    let t = Uc.get(r);
    return t && (t = t.get(e), t) ? t : -1;
  }
}
function Pl(r) {
  let e = [], t = [], n = !1;
  function s(i) {
    let a = fx.get(i);
    a && (n = !0, i |= a), e.push(i);
  }
  for (let i of r)
    for (; ; ) {
      if (i < 128)
        e.push(i);
      else if (Cl(i)) {
        let a = i - ai, c = a / ka | 0, o = a % ka / Es | 0, f = a % Es;
        s(Na + c), s(Ia + o), f > 0 && s(va + f);
      } else {
        let a = wl.get(i);
        a ? t.push(...a) : s(i);
      }
      if (!t.length)
        break;
      i = t.pop();
    }
  if (n && e.length > 1) {
    let i = Gs(e[0]);
    for (let a = 1; a < e.length; a++) {
      let c = Gs(e[a]);
      if (c == 0 || i <= c) {
        i = c;
        continue;
      }
      let o = a - 1;
      for (; ; ) {
        let f = e[o + 1];
        if (e[o + 1] = e[o], e[o] = f, !o || (i = Gs(e[--o]), i <= c))
          break;
      }
      i = Gs(e[a]);
    }
  }
  return e;
}
function gx(r) {
  let e = [], t = [], n = -1, s = 0;
  for (let i of r) {
    let a = Gs(i), c = ml(i);
    if (n == -1)
      a == 0 ? n = c : e.push(c);
    else if (s > 0 && s >= a)
      a == 0 ? (e.push(n, ...t), t.length = 0, n = c) : t.push(c), s = a;
    else {
      let o = px(n, c);
      o >= 0 ? n = o : s == 0 && a == 0 ? (e.push(n), n = c) : (t.push(c), s = a);
    }
  }
  return n >= 0 && e.push(n, ...t), e;
}
function Nl(r) {
  return Pl(r).map(ml);
}
function yx(r) {
  return gx(Pl(r));
}
const Lc = 65039, Il = ".", vl = 1, y0 = 45;
function Rs() {
  return new Set(En(Be));
}
const mx = new Map(pl(Be)), wx = Rs(), Oa = Rs(), m0 = new Set(En(Be).map(function(r) {
  return this[r];
}, [...Oa])), Ax = Rs();
Rs();
const Ex = bl(Be);
function w0() {
  return new Set([En(Be).map((r) => Ex[r]), En(Be)].flat(2));
}
const Cx = Be(), ci = si((r) => {
  let e = si(Be).map((t) => t + 96);
  if (e.length) {
    let t = r >= Cx;
    e[0] -= 32, e = ii(e), t && (e = `Restricted[${e}]`);
    let n = w0(), s = w0(), i = [...n, ...s].sort((c, o) => c - o), a = !Be();
    return { N: e, P: n, M: a, R: t, V: new Set(i) };
  }
}), A0 = Rs(), oi = /* @__PURE__ */ new Map();
[...A0, ...Rs()].sort((r, e) => r - e).map((r, e, t) => {
  let n = Be(), s = t[e] = n ? t[e - n] : { V: [], M: /* @__PURE__ */ new Map() };
  s.V.push(r), A0.has(r) || oi.set(r, s);
});
for (let { V: r, M: e } of new Set(oi.values())) {
  let t = [];
  for (let s of r) {
    let i = ci.filter((c) => c.V.has(s)), a = t.find(({ G: c }) => i.some((o) => c.has(o)));
    a || (a = { G: /* @__PURE__ */ new Set(), V: [] }, t.push(a)), a.V.push(s), i.forEach((c) => a.G.add(c));
  }
  let n = t.flatMap(({ G: s }) => [...s]);
  for (let { G: s, V: i } of t) {
    let a = new Set(n.filter((c) => !s.has(c)));
    for (let c of i)
      e.set(c, a);
  }
}
let fi = /* @__PURE__ */ new Set(), kl = /* @__PURE__ */ new Set();
for (let r of ci)
  for (let e of r.V)
    (fi.has(e) ? kl : fi).add(e);
for (let r of fi)
  !oi.has(r) && !kl.has(r) && oi.set(r, vl);
const Px = /* @__PURE__ */ new Set([...fi, ...Nl(fi)]), Nx = En(Be), Ix = Ol([]);
function Ol(r) {
  let e = si(() => {
    let c = En(Be).map((o) => Nx[o]);
    if (c.length)
      return Ol(c);
  }).sort((c, o) => o.Q.size - c.Q.size), t = Be(), n = t % 3;
  t = t / 3 | 0;
  let s = t & 1;
  t >>= 1;
  let i = t & 1, a = t & 2;
  return { B: e, V: n, F: s, S: i, C: a, Q: new Set(r) };
}
class vx extends Array {
  get is_emoji() {
    return !0;
  }
}
function Za(r, e = yl) {
  let t = [];
  Tx(r[0]) && t.push("◌");
  let n = 0, s = r.length;
  for (let i = 0; i < s; i++) {
    let a = r[i];
    Tl(a) && (t.push(ii(r.slice(n, i))), t.push(e(a)), n = i + 1);
  }
  return t.push(ii(r.slice(n, s))), t.join("");
}
function go(r) {
  return (Tl(r) ? "" : `${yo(Za([r]))} `) + yl(r);
}
function yo(r) {
  return `"${r}"‎`;
}
function kx(r) {
  if (r.length >= 4 && r[2] == y0 && r[3] == y0)
    throw new Error("invalid label extension");
}
function E0(r) {
  for (let t = r.lastIndexOf(95); t > 0; )
    if (r[--t] !== 95)
      throw new Error("underscore allowed only at start");
}
function Ox(r) {
  let e = r[0], t = p0.get(e);
  if (t)
    throw Ws(`leading ${t}`);
  let n = r.length, s = -1;
  for (let i = 1; i < n; i++) {
    e = r[i];
    let a = p0.get(e);
    if (a) {
      if (s == i)
        throw Ws(`${t} + ${a}`);
      s = i + 1, t = a;
    }
  }
  if (s == n)
    throw Ws(`trailing ${t}`);
}
function Tx(r) {
  return Oa.has(r);
}
function Tl(r) {
  return Ax.has(r);
}
function Rx(r) {
  return Lx(Sx(r));
}
function Sx(r, e) {
  let t = 0;
  return r.split(Il).map((n) => {
    let s = ox(n), i = {
      input: s,
      offset: t
      // codepoint, not substring!
    };
    t += s.length + 1;
    let a;
    try {
      let c = i.tokens = Dx(s, yx), o = c.length, f;
      if (o) {
        let u = c[0], d = o > 1 || u.is_emoji;
        if (!d && u.every((h) => h < 128))
          a = u, E0(a), kx(a), f = "ASCII";
        else if (d && (i.emoji = !0, u = c.flatMap((h) => h.is_emoji ? [] : h)), a = c.flatMap((h) => !e && h.is_emoji ? Mx(h) : h), E0(a), !u.length)
          f = "Emoji";
        else {
          if (Oa.has(a[0]))
            throw Ws("leading combining mark");
          for (let m = 1; m < o; m++) {
            let w = c[m];
            if (!w.is_emoji && Oa.has(w[0]))
              throw Ws(`emoji + combining mark: "${ii(c[m - 1])} + ${Za([w[0]])}"`);
          }
          Ox(a);
          let h = [...new Set(u)], [p] = Ux(h);
          Fx(p, u), Bx(p, h), f = p.N;
        }
      } else
        throw new Error("empty label");
      i.type = f;
    } catch (c) {
      i.error = c;
    }
    return i.output = a, i;
  });
}
function Bx(r, e) {
  let t, n = [];
  for (let s of e) {
    let i = oi.get(s);
    if (i === vl)
      return;
    if (i) {
      let a = i.M.get(s);
      if (t = t ? t.filter((c) => a.has(c)) : [...a], !t.length)
        return;
    } else
      n.push(s);
  }
  if (t) {
    for (let s of t)
      if (n.every((i) => s.V.has(i)))
        throw new Error(`whole-script confusable: ${r.N}/${s.N}`);
  }
}
function Ux(r) {
  let e = ci;
  for (let t of r) {
    let n = e.filter((s) => s.V.has(t));
    if (!n.length)
      throw e === ci ? Rl(t) : Sl(e[0], t);
    if (e = n, n.length == 1)
      break;
  }
  return e;
}
function Lx(r) {
  return r.map(({ input: e, error: t, output: n }) => {
    if (t) {
      let s = t.message;
      throw new Error(r.length == 1 ? s : `Invalid label ${yo(Za(e))}: ${s}`);
    }
    return ii(n);
  }).join(Il);
}
function Rl(r) {
  return new Error(`disallowed character: ${go(r)}`);
}
function Sl(r, e) {
  let t = go(e), n = ci.find((s) => s.P.has(e));
  return n && (t = `${n.N} ${t}`), new Error(`illegal mixture: ${r.N} + ${t}`);
}
function Ws(r) {
  return new Error(`illegal placement: ${r}`);
}
function Fx(r, e) {
  let { V: t, M: n } = r;
  for (let s of e)
    if (!t.has(s))
      throw Sl(r, s);
  if (n) {
    let s = Nl(e);
    for (let i = 1, a = s.length; i < a; i++)
      if (m0.has(s[i])) {
        let c = i + 1;
        for (let o; c < a && m0.has(o = s[c]); c++)
          for (let f = i; f < c; f++)
            if (s[f] == o)
              throw new Error(`non-spacing marks: repeated ${go(o)}`);
        if (c - i > g0)
          throw new Error(`non-spacing marks: too many ${yo(Za(s.slice(i - 1, c)))} (${c - i}/${g0})`);
        i = c;
      }
  }
}
function Dx(r, e) {
  let t = [], n = [];
  for (r = r.slice().reverse(); r.length; ) {
    let s = Gx(r);
    if (s)
      n.length && (t.push(e(n)), n = []), t.push(s);
    else {
      let i = r.pop();
      if (Px.has(i))
        n.push(i);
      else {
        let a = mx.get(i);
        if (a)
          n.push(...a);
        else if (!wx.has(i))
          throw Rl(i);
      }
    }
  }
  return n.length && t.push(e(n)), t;
}
function Mx(r) {
  return r.filter((e) => e != Lc);
}
function Gx(r, e) {
  let t = Ix, n, s, i = [], a = r.length;
  for (e && (e.length = 0); a; ) {
    let c = r[--a];
    if (t = t.B.find((o) => o.Q.has(c)), !t)
      break;
    if (t.S)
      s = c;
    else if (t.C && c === s)
      break;
    i.push(c), t.F && (i.push(Lc), a > 0 && r[a - 1] == Lc && a--), t.V && (n = Hx(i, t), e && e.push(...r.slice(a).reverse()), r.length = a);
  }
  return n;
}
function Hx(r, e) {
  let t = vx.from(r);
  return e.V == 2 && t.splice(1, 1), t;
}
const Bl = new Uint8Array(32);
Bl.fill(0);
function C0(r) {
  return b(r.length !== 0, "invalid ENS name; empty component", "comp", r), r;
}
function Ul(r) {
  const e = Ee(Kx(r)), t = [];
  if (r.length === 0)
    return t;
  let n = 0;
  for (let s = 0; s < e.length; s++)
    e[s] === 46 && (t.push(C0(e.slice(n, s))), n = s + 1);
  return b(n < e.length, "invalid ENS name; empty component", "name", r), t.push(C0(e.slice(n))), t;
}
function Kx(r) {
  try {
    return Rx(r);
  } catch (e) {
    b(!1, `invalid ENS name (${e.message})`, "name", r);
  }
}
function Fc(r) {
  b(typeof r == "string", "invalid ENS name; not a string", "name", r);
  let e = Bl;
  const t = Ul(r);
  for (; t.length; )
    e = z(_([e, z(t.pop())]));
  return N(e);
}
function Vx(r) {
  return N(_(Ul(r).map((e) => {
    if (e.length > 63)
      throw new Error("invalid DNS encoded entry; length exceeds 63 bytes");
    const t = new Uint8Array(e.length + 1);
    return t.set(e, 1), t[0] = t.length - 1, t;
  }))) + "00";
}
function ac(r, e) {
  return {
    address: F(r),
    storageKeys: e.map((t, n) => (b(q(t, 32), "invalid slot", `storageKeys[${n}]`, t), t.toLowerCase()))
  };
}
function hr(r) {
  if (Array.isArray(r))
    return r.map((t, n) => Array.isArray(t) ? (b(t.length === 2, "invalid slot set", `value[${n}]`, t), ac(t[0], t[1])) : (b(t != null && typeof t == "object", "invalid address-slot set", "value", r), ac(t.address, t.storageKeys)));
  b(r != null && typeof r == "object", "invalid access list", "value", r);
  const e = Object.keys(r).map((t) => {
    const n = r[t].reduce((s, i) => (s[i] = !0, s), {});
    return ac(t, Object.keys(n).sort());
  });
  return e.sort((t, n) => t.address.localeCompare(n.address)), e;
}
function Mi(r) {
  let e;
  return typeof r == "string" ? e = Et.computePublicKey(r, !1) : e = r.publicKey, F(z("0x" + e.substring(4)).substring(26));
}
function _x(r, e) {
  return Mi(Et.recoverPublicKey(r, e));
}
const Ne = BigInt(0), Qx = BigInt(2), zx = BigInt(27), Jx = BigInt(28), jx = BigInt(35), Wx = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
function mo(r) {
  return r === "0x" ? null : F(r);
}
function Ll(r, e) {
  try {
    return hr(r);
  } catch (t) {
    b(!1, t.message, e, r);
  }
}
function Xa(r, e) {
  return r === "0x" ? 0 : L(r, e);
}
function ye(r, e) {
  if (r === "0x")
    return Ne;
  const t = S(r, e);
  return b(t <= Wx, "value exceeds uint size", e, t), t;
}
function ce(r, e) {
  const t = S(r, "value"), n = me(t);
  return b(n.length <= 32, "value too large", `tx.${e}`, t), n;
}
function Fl(r) {
  return hr(r).map((e) => [e.address, e.storageKeys]);
}
function Yx(r) {
  const e = ao(r);
  b(Array.isArray(e) && (e.length === 9 || e.length === 6), "invalid field count for legacy transaction", "data", r);
  const t = {
    type: 0,
    nonce: Xa(e[0], "nonce"),
    gasPrice: ye(e[1], "gasPrice"),
    gasLimit: ye(e[2], "gasLimit"),
    to: mo(e[3]),
    value: ye(e[4], "value"),
    data: N(e[5]),
    chainId: Ne
  };
  if (e.length === 6)
    return t;
  const n = ye(e[6], "v"), s = ye(e[7], "r"), i = ye(e[8], "s");
  if (s === Ne && i === Ne)
    t.chainId = n;
  else {
    let a = (n - jx) / Qx;
    a < Ne && (a = Ne), t.chainId = a, b(a !== Ne || n === zx || n === Jx, "non-canonical legacy v", "v", e[6]), t.signature = at.from({
      r: ir(e[7], 32),
      s: ir(e[8], 32),
      v: n
    }), t.hash = z(r);
  }
  return t;
}
function P0(r, e) {
  const t = [
    ce(r.nonce || 0, "nonce"),
    ce(r.gasPrice || 0, "gasPrice"),
    ce(r.gasLimit || 0, "gasLimit"),
    r.to != null ? F(r.to) : "0x",
    ce(r.value || 0, "value"),
    r.data || "0x"
  ];
  let n = Ne;
  if (r.chainId != Ne)
    n = S(r.chainId, "tx.chainId"), b(!e || e.networkV == null || e.legacyChainId === n, "tx.chainId/sig.v mismatch", "sig", e);
  else if (r.signature) {
    const i = r.signature.legacyChainId;
    i != null && (n = i);
  }
  if (!e)
    return n !== Ne && (t.push(me(n)), t.push("0x"), t.push("0x")), ei(t);
  let s = BigInt(27 + e.yParity);
  return n !== Ne ? s = at.getChainIdV(n, e.v) : BigInt(e.v) !== s && b(!1, "tx.chainId/sig.v mismatch", "sig", e), t.push(me(s)), t.push(me(e.r)), t.push(me(e.s)), ei(t);
}
function Dl(r, e) {
  let t;
  try {
    if (t = Xa(e[0], "yParity"), t !== 0 && t !== 1)
      throw new Error("bad yParity");
  } catch {
    b(!1, "invalid yParity", "yParity", e[0]);
  }
  const n = ir(e[1], 32), s = ir(e[2], 32), i = at.from({ r: n, s, yParity: t });
  r.signature = i;
}
function Zx(r) {
  const e = ao(O(r).slice(1));
  b(Array.isArray(e) && (e.length === 9 || e.length === 12), "invalid field count for transaction type: 2", "data", N(r));
  const t = ye(e[2], "maxPriorityFeePerGas"), n = ye(e[3], "maxFeePerGas"), s = {
    type: 2,
    chainId: ye(e[0], "chainId"),
    nonce: Xa(e[1], "nonce"),
    maxPriorityFeePerGas: t,
    maxFeePerGas: n,
    gasPrice: null,
    gasLimit: ye(e[4], "gasLimit"),
    to: mo(e[5]),
    value: ye(e[6], "value"),
    data: N(e[7]),
    accessList: Ll(e[8], "accessList")
  };
  return e.length === 9 || (s.hash = z(r), Dl(s, e.slice(9))), s;
}
function N0(r, e) {
  const t = [
    ce(r.chainId || 0, "chainId"),
    ce(r.nonce || 0, "nonce"),
    ce(r.maxPriorityFeePerGas || 0, "maxPriorityFeePerGas"),
    ce(r.maxFeePerGas || 0, "maxFeePerGas"),
    ce(r.gasLimit || 0, "gasLimit"),
    r.to != null ? F(r.to) : "0x",
    ce(r.value || 0, "value"),
    r.data || "0x",
    Fl(r.accessList || [])
  ];
  return e && (t.push(ce(e.yParity, "yParity")), t.push(me(e.r)), t.push(me(e.s))), _(["0x02", ei(t)]);
}
function Xx(r) {
  const e = ao(O(r).slice(1));
  b(Array.isArray(e) && (e.length === 8 || e.length === 11), "invalid field count for transaction type: 1", "data", N(r));
  const t = {
    type: 1,
    chainId: ye(e[0], "chainId"),
    nonce: Xa(e[1], "nonce"),
    gasPrice: ye(e[2], "gasPrice"),
    gasLimit: ye(e[3], "gasLimit"),
    to: mo(e[4]),
    value: ye(e[5], "value"),
    data: N(e[6]),
    accessList: Ll(e[7], "accessList")
  };
  return e.length === 8 || (t.hash = z(r), Dl(t, e.slice(8))), t;
}
function I0(r, e) {
  const t = [
    ce(r.chainId || 0, "chainId"),
    ce(r.nonce || 0, "nonce"),
    ce(r.gasPrice || 0, "gasPrice"),
    ce(r.gasLimit || 0, "gasLimit"),
    r.to != null ? F(r.to) : "0x",
    ce(r.value || 0, "value"),
    r.data || "0x",
    Fl(r.accessList || [])
  ];
  return e && (t.push(ce(e.yParity, "recoveryParam")), t.push(me(e.r)), t.push(me(e.s))), _(["0x01", ei(t)]);
}
var Bt, Vr, _r, Qr, zr, Jr, jr, Wr, Yr, Zr, Xr, $r;
const en = class en {
  /**
   *  Creates a new Transaction with default values.
   */
  constructor() {
    y(this, Bt, void 0);
    y(this, Vr, void 0);
    y(this, _r, void 0);
    y(this, Qr, void 0);
    y(this, zr, void 0);
    y(this, Jr, void 0);
    y(this, jr, void 0);
    y(this, Wr, void 0);
    y(this, Yr, void 0);
    y(this, Zr, void 0);
    y(this, Xr, void 0);
    y(this, $r, void 0);
    x(this, Bt, null), x(this, Vr, null), x(this, Qr, 0), x(this, zr, BigInt(0)), x(this, Jr, null), x(this, jr, null), x(this, Wr, null), x(this, _r, "0x"), x(this, Yr, BigInt(0)), x(this, Zr, BigInt(0)), x(this, Xr, null), x(this, $r, null);
  }
  /**
   *  The transaction type.
   *
   *  If null, the type will be automatically inferred based on
   *  explicit properties.
   */
  get type() {
    return l(this, Bt);
  }
  set type(e) {
    switch (e) {
      case null:
        x(this, Bt, null);
        break;
      case 0:
      case "legacy":
        x(this, Bt, 0);
        break;
      case 1:
      case "berlin":
      case "eip-2930":
        x(this, Bt, 1);
        break;
      case 2:
      case "london":
      case "eip-1559":
        x(this, Bt, 2);
        break;
      default:
        b(!1, "unsupported transaction type", "type", e);
    }
  }
  /**
   *  The name of the transaction type.
   */
  get typeName() {
    switch (this.type) {
      case 0:
        return "legacy";
      case 1:
        return "eip-2930";
      case 2:
        return "eip-1559";
    }
    return null;
  }
  /**
   *  The ``to`` address for the transaction or ``null`` if the
   *  transaction is an ``init`` transaction.
   */
  get to() {
    return l(this, Vr);
  }
  set to(e) {
    x(this, Vr, e == null ? null : F(e));
  }
  /**
   *  The transaction nonce.
   */
  get nonce() {
    return l(this, Qr);
  }
  set nonce(e) {
    x(this, Qr, L(e, "value"));
  }
  /**
   *  The gas limit.
   */
  get gasLimit() {
    return l(this, zr);
  }
  set gasLimit(e) {
    x(this, zr, S(e));
  }
  /**
   *  The gas price.
   *
   *  On legacy networks this defines the fee that will be paid. On
   *  EIP-1559 networks, this should be ``null``.
   */
  get gasPrice() {
    const e = l(this, Jr);
    return e == null && (this.type === 0 || this.type === 1) ? Ne : e;
  }
  set gasPrice(e) {
    x(this, Jr, e == null ? null : S(e, "gasPrice"));
  }
  /**
   *  The maximum priority fee per unit of gas to pay. On legacy
   *  networks this should be ``null``.
   */
  get maxPriorityFeePerGas() {
    const e = l(this, jr);
    return e ?? (this.type === 2 ? Ne : null);
  }
  set maxPriorityFeePerGas(e) {
    x(this, jr, e == null ? null : S(e, "maxPriorityFeePerGas"));
  }
  /**
   *  The maximum total fee per unit of gas to pay. On legacy
   *  networks this should be ``null``.
   */
  get maxFeePerGas() {
    const e = l(this, Wr);
    return e ?? (this.type === 2 ? Ne : null);
  }
  set maxFeePerGas(e) {
    x(this, Wr, e == null ? null : S(e, "maxFeePerGas"));
  }
  /**
   *  The transaction data. For ``init`` transactions this is the
   *  deployment code.
   */
  get data() {
    return l(this, _r);
  }
  set data(e) {
    x(this, _r, N(e));
  }
  /**
   *  The amount of ether (in wei) to send in this transactions.
   */
  get value() {
    return l(this, Yr);
  }
  set value(e) {
    x(this, Yr, S(e, "value"));
  }
  /**
   *  The chain ID this transaction is valid on.
   */
  get chainId() {
    return l(this, Zr);
  }
  set chainId(e) {
    x(this, Zr, S(e));
  }
  /**
   *  If signed, the signature for this transaction.
   */
  get signature() {
    return l(this, Xr) || null;
  }
  set signature(e) {
    x(this, Xr, e == null ? null : at.from(e));
  }
  /**
   *  The access list.
   *
   *  An access list permits discounted (but pre-paid) access to
   *  bytecode and state variable access within contract execution.
   */
  get accessList() {
    const e = l(this, $r) || null;
    return e ?? (this.type === 1 || this.type === 2 ? [] : null);
  }
  set accessList(e) {
    x(this, $r, e == null ? null : hr(e));
  }
  /**
   *  The transaction hash, if signed. Otherwise, ``null``.
   */
  get hash() {
    return this.signature == null ? null : z(this.serialized);
  }
  /**
   *  The pre-image hash of this transaction.
   *
   *  This is the digest that a [[Signer]] must sign to authorize
   *  this transaction.
   */
  get unsignedHash() {
    return z(this.unsignedSerialized);
  }
  /**
   *  The sending address, if signed. Otherwise, ``null``.
   */
  get from() {
    return this.signature == null ? null : _x(this.unsignedHash, this.signature);
  }
  /**
   *  The public key of the sender, if signed. Otherwise, ``null``.
   */
  get fromPublicKey() {
    return this.signature == null ? null : Et.recoverPublicKey(this.unsignedHash, this.signature);
  }
  /**
   *  Returns true if signed.
   *
   *  This provides a Type Guard that properties requiring a signed
   *  transaction are non-null.
   */
  isSigned() {
    return this.signature != null;
  }
  /**
   *  The serialized transaction.
   *
   *  This throws if the transaction is unsigned. For the pre-image,
   *  use [[unsignedSerialized]].
   */
  get serialized() {
    switch (A(this.signature != null, "cannot serialize unsigned transaction; maybe you meant .unsignedSerialized", "UNSUPPORTED_OPERATION", { operation: ".serialized" }), this.inferType()) {
      case 0:
        return P0(this, this.signature);
      case 1:
        return I0(this, this.signature);
      case 2:
        return N0(this, this.signature);
    }
    A(!1, "unsupported transaction type", "UNSUPPORTED_OPERATION", { operation: ".serialized" });
  }
  /**
   *  The transaction pre-image.
   *
   *  The hash of this is the digest which needs to be signed to
   *  authorize this transaction.
   */
  get unsignedSerialized() {
    switch (this.inferType()) {
      case 0:
        return P0(this);
      case 1:
        return I0(this);
      case 2:
        return N0(this);
    }
    A(!1, "unsupported transaction type", "UNSUPPORTED_OPERATION", { operation: ".unsignedSerialized" });
  }
  /**
   *  Return the most "likely" type; currently the highest
   *  supported transaction type.
   */
  inferType() {
    return this.inferTypes().pop();
  }
  /**
   *  Validates the explicit properties and returns a list of compatible
   *  transaction types.
   */
  inferTypes() {
    const e = this.gasPrice != null, t = this.maxFeePerGas != null || this.maxPriorityFeePerGas != null, n = this.accessList != null;
    this.maxFeePerGas != null && this.maxPriorityFeePerGas != null && A(this.maxFeePerGas >= this.maxPriorityFeePerGas, "priorityFee cannot be more than maxFee", "BAD_DATA", { value: this }), A(!t || this.type !== 0 && this.type !== 1, "transaction type cannot have maxFeePerGas or maxPriorityFeePerGas", "BAD_DATA", { value: this }), A(this.type !== 0 || !n, "legacy transaction cannot have accessList", "BAD_DATA", { value: this });
    const s = [];
    return this.type != null ? s.push(this.type) : t ? s.push(2) : e ? (s.push(1), n || s.push(0)) : n ? (s.push(1), s.push(2)) : (s.push(0), s.push(1), s.push(2)), s.sort(), s;
  }
  /**
   *  Returns true if this transaction is a legacy transaction (i.e.
   *  ``type === 0``).
   *
   *  This provides a Type Guard that the related properties are
   *  non-null.
   */
  isLegacy() {
    return this.type === 0;
  }
  /**
   *  Returns true if this transaction is berlin hardform transaction (i.e.
   *  ``type === 1``).
   *
   *  This provides a Type Guard that the related properties are
   *  non-null.
   */
  isBerlin() {
    return this.type === 1;
  }
  /**
   *  Returns true if this transaction is london hardform transaction (i.e.
   *  ``type === 2``).
   *
   *  This provides a Type Guard that the related properties are
   *  non-null.
   */
  isLondon() {
    return this.type === 2;
  }
  /**
   *  Create a copy of this transaciton.
   */
  clone() {
    return en.from(this);
  }
  /**
   *  Return a JSON-friendly object.
   */
  toJSON() {
    const e = (t) => t == null ? null : t.toString();
    return {
      type: this.type,
      to: this.to,
      //            from: this.from,
      data: this.data,
      nonce: this.nonce,
      gasLimit: e(this.gasLimit),
      gasPrice: e(this.gasPrice),
      maxPriorityFeePerGas: e(this.maxPriorityFeePerGas),
      maxFeePerGas: e(this.maxFeePerGas),
      value: e(this.value),
      chainId: e(this.chainId),
      sig: this.signature ? this.signature.toJSON() : null,
      accessList: this.accessList
    };
  }
  /**
   *  Create a **Transaction** from a serialized transaction or a
   *  Transaction-like object.
   */
  static from(e) {
    if (e == null)
      return new en();
    if (typeof e == "string") {
      const n = O(e);
      if (n[0] >= 127)
        return en.from(Yx(n));
      switch (n[0]) {
        case 1:
          return en.from(Xx(n));
        case 2:
          return en.from(Zx(n));
      }
      A(!1, "unsupported transaction type", "UNSUPPORTED_OPERATION", { operation: "from" });
    }
    const t = new en();
    return e.type != null && (t.type = e.type), e.to != null && (t.to = e.to), e.nonce != null && (t.nonce = e.nonce), e.gasLimit != null && (t.gasLimit = e.gasLimit), e.gasPrice != null && (t.gasPrice = e.gasPrice), e.maxPriorityFeePerGas != null && (t.maxPriorityFeePerGas = e.maxPriorityFeePerGas), e.maxFeePerGas != null && (t.maxFeePerGas = e.maxFeePerGas), e.data != null && (t.data = e.data), e.value != null && (t.value = e.value), e.chainId != null && (t.chainId = e.chainId), e.signature != null && (t.signature = at.from(e.signature)), e.accessList != null && (t.accessList = e.accessList), e.hash != null && (b(t.isSigned(), "unsigned transaction cannot define hash", "tx", e), b(t.hash === e.hash, "hash mismatch", "tx", e)), e.from != null && (b(t.isSigned(), "unsigned transaction cannot define from", "tx", e), b(t.from.toLowerCase() === (e.from || "").toLowerCase(), "from mismatch", "tx", e)), t;
  }
};
Bt = new WeakMap(), Vr = new WeakMap(), _r = new WeakMap(), Qr = new WeakMap(), zr = new WeakMap(), Jr = new WeakMap(), jr = new WeakMap(), Wr = new WeakMap(), Yr = new WeakMap(), Zr = new WeakMap(), Xr = new WeakMap(), $r = new WeakMap();
let li = en;
function $x(r) {
  return typeof r == "string" && (r = Ee(r)), z(_([
    Ee(Uh),
    Ee(String(r.length)),
    r
  ]));
}
const Ml = new Uint8Array(32);
Ml.fill(0);
const qx = BigInt(-1), Gl = BigInt(0), Hl = BigInt(1), eb = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
function tb(r) {
  const e = O(r), t = e.length % 32;
  return t ? _([e, Ml.slice(t)]) : N(e);
}
const nb = zt(Hl, 32), rb = zt(Gl, 32), v0 = {
  name: "string",
  version: "string",
  chainId: "uint256",
  verifyingContract: "address",
  salt: "bytes32"
}, cc = [
  "name",
  "version",
  "chainId",
  "verifyingContract",
  "salt"
];
function k0(r) {
  return function(e) {
    return b(typeof e == "string", `invalid domain value for ${JSON.stringify(r)}`, `domain.${r}`, e), e;
  };
}
const sb = {
  name: k0("name"),
  version: k0("version"),
  chainId: function(r) {
    const e = S(r, "domain.chainId");
    return b(e >= 0, "invalid chain ID", "domain.chainId", r), Number.isSafeInteger(e) ? Number(e) : Cr(e);
  },
  verifyingContract: function(r) {
    try {
      return F(r).toLowerCase();
    } catch {
    }
    b(!1, 'invalid domain value "verifyingContract"', "domain.verifyingContract", r);
  },
  salt: function(r) {
    const e = O(r, "domain.salt");
    return b(e.length === 32, 'invalid domain value "salt"', "domain.salt", r), N(e);
  }
};
function oc(r) {
  {
    const e = r.match(/^(u?)int(\d*)$/);
    if (e) {
      const t = e[1] === "", n = parseInt(e[2] || "256");
      b(n % 8 === 0 && n !== 0 && n <= 256 && (e[2] == null || e[2] === String(n)), "invalid numeric width", "type", r);
      const s = Ds(eb, t ? n - 1 : n), i = t ? (s + Hl) * qx : Gl;
      return function(a) {
        const c = S(a, "value");
        return b(c >= i && c <= s, `value out-of-bounds for ${r}`, "value", c), zt(t ? xf(c, 256) : c, 32);
      };
    }
  }
  {
    const e = r.match(/^bytes(\d+)$/);
    if (e) {
      const t = parseInt(e[1]);
      return b(t !== 0 && t <= 32 && e[1] === String(t), "invalid bytes width", "type", r), function(n) {
        const s = O(n);
        return b(s.length === t, `invalid length for ${r}`, "value", n), tb(n);
      };
    }
  }
  switch (r) {
    case "address":
      return function(e) {
        return ir(F(e), 32);
      };
    case "bool":
      return function(e) {
        return e ? nb : rb;
      };
    case "bytes":
      return function(e) {
        return z(e);
      };
    case "string":
      return function(e) {
        return jt(e);
      };
  }
  return null;
}
function O0(r, e) {
  return `${r}(${e.map(({ name: t, type: n }) => n + " " + t).join(",")})`;
}
var yi, Ut, qr, Ha, Kl;
const Ke = class Ke {
  /**
   *  Create a new **TypedDataEncoder** for %%types%%.
   *
   *  This performs all necessary checking that types are valid and
   *  do not violate the [[link-eip-712]] structural constraints as
   *  well as computes the [[primaryType]].
   */
  constructor(e) {
    y(this, Ha);
    /**
     *  The primary type for the structured [[types]].
     *
     *  This is derived automatically from the [[types]], since no
     *  recursion is possible, once the DAG for the types is consturcted
     *  internally, the primary type must be the only remaining type with
     *  no parent nodes.
     */
    g(this, "primaryType");
    y(this, yi, void 0);
    y(this, Ut, void 0);
    y(this, qr, void 0);
    x(this, yi, JSON.stringify(e)), x(this, Ut, /* @__PURE__ */ new Map()), x(this, qr, /* @__PURE__ */ new Map());
    const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
    Object.keys(e).forEach((c) => {
      t.set(c, /* @__PURE__ */ new Set()), n.set(c, []), s.set(c, /* @__PURE__ */ new Set());
    });
    for (const c in e) {
      const o = /* @__PURE__ */ new Set();
      for (const f of e[c]) {
        b(!o.has(f.name), `duplicate variable name ${JSON.stringify(f.name)} in ${JSON.stringify(c)}`, "types", e), o.add(f.name);
        const u = f.type.match(/^([^\x5b]*)(\x5b|$)/)[1] || null;
        b(u !== c, `circular type reference to ${JSON.stringify(u)}`, "types", e), !oc(u) && (b(n.has(u), `unknown type ${JSON.stringify(u)}`, "types", e), n.get(u).push(c), t.get(c).add(u));
      }
    }
    const i = Array.from(n.keys()).filter((c) => n.get(c).length === 0);
    b(i.length !== 0, "missing primary type", "types", e), b(i.length === 1, `ambiguous primary types or unused types: ${i.map((c) => JSON.stringify(c)).join(", ")}`, "types", e), T(this, { primaryType: i[0] });
    function a(c, o) {
      b(!o.has(c), `circular type reference to ${JSON.stringify(c)}`, "types", e), o.add(c);
      for (const f of t.get(c))
        if (n.has(f)) {
          a(f, o);
          for (const u of o)
            s.get(u).add(f);
        }
      o.delete(c);
    }
    a(this.primaryType, /* @__PURE__ */ new Set());
    for (const [c, o] of s) {
      const f = Array.from(o);
      f.sort(), l(this, Ut).set(c, O0(c, e[c]) + f.map((u) => O0(u, e[u])).join(""));
    }
  }
  /**
   *  The types.
   */
  get types() {
    return JSON.parse(l(this, yi));
  }
  /**
   *  Returnthe encoder for the specific %%type%%.
   */
  getEncoder(e) {
    let t = l(this, qr).get(e);
    return t || (t = P(this, Ha, Kl).call(this, e), l(this, qr).set(e, t)), t;
  }
  /**
   *  Return the full type for %%name%%.
   */
  encodeType(e) {
    const t = l(this, Ut).get(e);
    return b(t, `unknown type: ${JSON.stringify(e)}`, "name", e), t;
  }
  /**
   *  Return the encoded %%value%% for the %%type%%.
   */
  encodeData(e, t) {
    return this.getEncoder(e)(t);
  }
  /**
   *  Returns the hash of %%value%% for the type of %%name%%.
   */
  hashStruct(e, t) {
    return z(this.encodeData(e, t));
  }
  /**
   *  Return the fulled encoded %%value%% for the [[types]].
   */
  encode(e) {
    return this.encodeData(this.primaryType, e);
  }
  /**
   *  Return the hash of the fully encoded %%value%% for the [[types]].
   */
  hash(e) {
    return this.hashStruct(this.primaryType, e);
  }
  /**
   *  @_ignore:
   */
  _visit(e, t, n) {
    if (oc(e))
      return n(e, t);
    const s = e.match(/^(.*)(\x5b(\d*)\x5d)$/);
    if (s)
      return b(!s[3] || parseInt(s[3]) === t.length, `array length mismatch; expected length ${parseInt(s[3])}`, "value", t), t.map((a) => this._visit(s[1], a, n));
    const i = this.types[e];
    if (i)
      return i.reduce((a, { name: c, type: o }) => (a[c] = this._visit(o, t[c], n), a), {});
    b(!1, `unknown type: ${e}`, "type", e);
  }
  /**
   *  Call %%calback%% for each value in %%value%%, passing the type and
   *  component within %%value%%.
   *
   *  This is useful for replacing addresses or other transformation that
   *  may be desired on each component, based on its type.
   */
  visit(e, t) {
    return this._visit(this.primaryType, e, t);
  }
  /**
   *  Create a new **TypedDataEncoder** for %%types%%.
   */
  static from(e) {
    return new Ke(e);
  }
  /**
   *  Return the primary type for %%types%%.
   */
  static getPrimaryType(e) {
    return Ke.from(e).primaryType;
  }
  /**
   *  Return the hashed struct for %%value%% using %%types%% and %%name%%.
   */
  static hashStruct(e, t, n) {
    return Ke.from(t).hashStruct(e, n);
  }
  /**
   *  Return the domain hash for %%domain%%.
   */
  static hashDomain(e) {
    const t = [];
    for (const n in e) {
      if (e[n] == null)
        continue;
      const s = v0[n];
      b(s, `invalid typed-data domain key: ${JSON.stringify(n)}`, "domain", e), t.push({ name: n, type: s });
    }
    return t.sort((n, s) => cc.indexOf(n.name) - cc.indexOf(s.name)), Ke.hashStruct("EIP712Domain", { EIP712Domain: t }, e);
  }
  /**
   *  Return the fully encoded [[link-eip-712]] %%value%% for %%types%% with %%domain%%.
   */
  static encode(e, t, n) {
    return _([
      "0x1901",
      Ke.hashDomain(e),
      Ke.from(t).hash(n)
    ]);
  }
  /**
   *  Return the hash of the fully encoded [[link-eip-712]] %%value%% for %%types%% with %%domain%%.
   */
  static hash(e, t, n) {
    return z(Ke.encode(e, t, n));
  }
  // Replaces all address types with ENS names with their looked up address
  /**
   * Resolves to the value from resolving all addresses in %%value%% for
   * %%types%% and the %%domain%%.
   */
  static async resolveNames(e, t, n, s) {
    e = Object.assign({}, e);
    for (const c in e)
      e[c] == null && delete e[c];
    const i = {};
    e.verifyingContract && !q(e.verifyingContract, 20) && (i[e.verifyingContract] = "0x");
    const a = Ke.from(t);
    a.visit(n, (c, o) => (c === "address" && !q(o, 20) && (i[o] = "0x"), o));
    for (const c in i)
      i[c] = await s(c);
    return e.verifyingContract && i[e.verifyingContract] && (e.verifyingContract = i[e.verifyingContract]), n = a.visit(n, (c, o) => c === "address" && i[o] ? i[o] : o), { domain: e, value: n };
  }
  /**
   *  Returns the JSON-encoded payload expected by nodes which implement
   *  the JSON-RPC [[link-eip-712]] method.
   */
  static getPayload(e, t, n) {
    Ke.hashDomain(e);
    const s = {}, i = [];
    cc.forEach((o) => {
      const f = e[o];
      f != null && (s[o] = sb[o](f), i.push({ name: o, type: v0[o] }));
    });
    const a = Ke.from(t), c = Object.assign({}, t);
    return b(c.EIP712Domain == null, "types must not contain EIP712Domain type", "types.EIP712Domain", t), c.EIP712Domain = i, a.encode(n), {
      types: c,
      domain: s,
      primaryType: a.primaryType,
      message: a.visit(n, (o, f) => {
        if (o.match(/^bytes(\d*)/))
          return N(O(f));
        if (o.match(/^u?int/))
          return S(f).toString();
        switch (o) {
          case "address":
            return f.toLowerCase();
          case "bool":
            return !!f;
          case "string":
            return b(typeof f == "string", "invalid string", "value", f), f;
        }
        b(!1, "unsupported type", "type", o);
      })
    };
  }
};
yi = new WeakMap(), Ut = new WeakMap(), qr = new WeakMap(), Ha = new WeakSet(), Kl = function(e) {
  {
    const s = oc(e);
    if (s)
      return s;
  }
  const t = e.match(/^(.*)(\x5b(\d*)\x5d)$/);
  if (t) {
    const s = t[1], i = this.getEncoder(s);
    return (a) => {
      b(!t[3] || parseInt(t[3]) === a.length, `array length mismatch; expected length ${parseInt(t[3])}`, "value", a);
      let c = a.map(i);
      return l(this, Ut).has(s) && (c = c.map(z)), z(_(c));
    };
  }
  const n = this.types[e];
  if (n) {
    const s = jt(l(this, Ut).get(e));
    return (i) => {
      const a = n.map(({ name: c, type: o }) => {
        const f = this.getEncoder(o)(i[c]);
        return l(this, Ut).has(o) ? z(f) : f;
      });
      return a.unshift(s), _(a);
    };
  }
  b(!1, `unknown type: ${e}`, "type", e);
};
let Cs = Ke;
function Ae(r) {
  const e = /* @__PURE__ */ new Set();
  return r.forEach((t) => e.add(t)), Object.freeze(e);
}
const ib = "external public payable", ab = Ae(ib.split(" ")), Vl = "constant external internal payable private public pure view", cb = Ae(Vl.split(" ")), _l = "constructor error event fallback function receive struct", Ql = Ae(_l.split(" ")), zl = "calldata memory storage payable indexed", ob = Ae(zl.split(" ")), fb = "tuple returns", lb = [_l, zl, fb, Vl].join(" "), ub = Ae(lb.split(" ")), db = {
  "(": "OPEN_PAREN",
  ")": "CLOSE_PAREN",
  "[": "OPEN_BRACKET",
  "]": "CLOSE_BRACKET",
  ",": "COMMA",
  "@": "AT"
}, hb = new RegExp("^(\\s*)"), xb = new RegExp("^([0-9]+)"), bb = new RegExp("^([a-zA-Z$_][a-zA-Z0-9$_]*)"), Jl = new RegExp("^([a-zA-Z$_][a-zA-Z0-9$_]*)$"), jl = new RegExp("^(address|bool|bytes([0-9]*)|string|u?int([0-9]*))$");
var ae, tt, mi, Dc;
const Ka = class Ka {
  constructor(e) {
    y(this, mi);
    y(this, ae, void 0);
    y(this, tt, void 0);
    x(this, ae, 0), x(this, tt, e.slice());
  }
  get offset() {
    return l(this, ae);
  }
  get length() {
    return l(this, tt).length - l(this, ae);
  }
  clone() {
    return new Ka(l(this, tt));
  }
  reset() {
    x(this, ae, 0);
  }
  // Pops and returns the value of the next token, if it is a keyword in allowed; throws if out of tokens
  popKeyword(e) {
    const t = this.peek();
    if (t.type !== "KEYWORD" || !e.has(t.text))
      throw new Error(`expected keyword ${t.text}`);
    return this.pop().text;
  }
  // Pops and returns the value of the next token if it is `type`; throws if out of tokens
  popType(e) {
    if (this.peek().type !== e)
      throw new Error(`expected ${e}; got ${JSON.stringify(this.peek())}`);
    return this.pop().text;
  }
  // Pops and returns a "(" TOKENS ")"
  popParen() {
    const e = this.peek();
    if (e.type !== "OPEN_PAREN")
      throw new Error("bad start");
    const t = P(this, mi, Dc).call(this, l(this, ae) + 1, e.match + 1);
    return x(this, ae, e.match + 1), t;
  }
  // Pops and returns the items within "(" ITEM1 "," ITEM2 "," ... ")"
  popParams() {
    const e = this.peek();
    if (e.type !== "OPEN_PAREN")
      throw new Error("bad start");
    const t = [];
    for (; l(this, ae) < e.match - 1; ) {
      const n = this.peek().linkNext;
      t.push(P(this, mi, Dc).call(this, l(this, ae) + 1, n)), x(this, ae, n);
    }
    return x(this, ae, e.match + 1), t;
  }
  // Returns the top Token, throwing if out of tokens
  peek() {
    if (l(this, ae) >= l(this, tt).length)
      throw new Error("out-of-bounds");
    return l(this, tt)[l(this, ae)];
  }
  // Returns the next value, if it is a keyword in `allowed`
  peekKeyword(e) {
    const t = this.peekType("KEYWORD");
    return t != null && e.has(t) ? t : null;
  }
  // Returns the value of the next token if it is `type`
  peekType(e) {
    if (this.length === 0)
      return null;
    const t = this.peek();
    return t.type === e ? t.text : null;
  }
  // Returns the next token; throws if out of tokens
  pop() {
    const e = this.peek();
    return Ss(this, ae)._++, e;
  }
  toString() {
    const e = [];
    for (let t = l(this, ae); t < l(this, tt).length; t++) {
      const n = l(this, tt)[t];
      e.push(`${n.type}:${n.text}`);
    }
    return `<TokenString ${e.join(" ")}>`;
  }
};
ae = new WeakMap(), tt = new WeakMap(), mi = new WeakSet(), Dc = function(e = 0, t = 0) {
  return new Ka(l(this, tt).slice(e, t).map((n) => Object.freeze(Object.assign({}, n, {
    match: n.match - e,
    linkBack: n.linkBack - e,
    linkNext: n.linkNext - e
  }))));
};
let ct = Ka;
function Nn(r) {
  const e = [], t = (a) => {
    const c = i < r.length ? JSON.stringify(r[i]) : "$EOI";
    throw new Error(`invalid token ${c} at ${i}: ${a}`);
  };
  let n = [], s = [], i = 0;
  for (; i < r.length; ) {
    let a = r.substring(i), c = a.match(hb);
    c && (i += c[1].length, a = r.substring(i));
    const o = { depth: n.length, linkBack: -1, linkNext: -1, match: -1, type: "", text: "", offset: i, value: -1 };
    e.push(o);
    let f = db[a[0]] || "";
    if (f) {
      if (o.type = f, o.text = a[0], i++, f === "OPEN_PAREN")
        n.push(e.length - 1), s.push(e.length - 1);
      else if (f == "CLOSE_PAREN")
        n.length === 0 && t("no matching open bracket"), o.match = n.pop(), e[o.match].match = e.length - 1, o.depth--, o.linkBack = s.pop(), e[o.linkBack].linkNext = e.length - 1;
      else if (f === "COMMA")
        o.linkBack = s.pop(), e[o.linkBack].linkNext = e.length - 1, s.push(e.length - 1);
      else if (f === "OPEN_BRACKET")
        o.type = "BRACKET";
      else if (f === "CLOSE_BRACKET") {
        let u = e.pop().text;
        if (e.length > 0 && e[e.length - 1].type === "NUMBER") {
          const d = e.pop().text;
          u = d + u, e[e.length - 1].value = L(d);
        }
        if (e.length === 0 || e[e.length - 1].type !== "BRACKET")
          throw new Error("missing opening bracket");
        e[e.length - 1].text += u;
      }
      continue;
    }
    if (c = a.match(bb), c) {
      if (o.text = c[1], i += o.text.length, ub.has(o.text)) {
        o.type = "KEYWORD";
        continue;
      }
      if (o.text.match(jl)) {
        o.type = "TYPE";
        continue;
      }
      o.type = "ID";
      continue;
    }
    if (c = a.match(xb), c) {
      o.text = c[1], o.type = "NUMBER", i += o.text.length;
      continue;
    }
    throw new Error(`unexpected token ${JSON.stringify(a[0])} at position ${i}`);
  }
  return new ct(e.map((a) => Object.freeze(a)));
}
function T0(r, e) {
  let t = [];
  for (const n in e.keys())
    r.has(n) && t.push(n);
  if (t.length > 1)
    throw new Error(`conflicting types: ${t.join(", ")}`);
}
function $a(r, e) {
  if (e.peekKeyword(Ql)) {
    const t = e.pop().text;
    if (t !== r)
      throw new Error(`expected ${r}, got ${t}`);
  }
  return e.popType("ID");
}
function Wt(r, e) {
  const t = /* @__PURE__ */ new Set();
  for (; ; ) {
    const n = r.peekType("KEYWORD");
    if (n == null || e && !e.has(n))
      break;
    if (r.pop(), t.has(n))
      throw new Error(`duplicate keywords: ${JSON.stringify(n)}`);
    t.add(n);
  }
  return Object.freeze(t);
}
function Wl(r) {
  let e = Wt(r, cb);
  return T0(e, Ae("constant payable nonpayable".split(" "))), T0(e, Ae("pure view payable nonpayable".split(" "))), e.has("view") ? "view" : e.has("pure") ? "pure" : e.has("payable") ? "payable" : e.has("nonpayable") ? "nonpayable" : e.has("constant") ? "view" : "nonpayable";
}
function Qt(r, e) {
  return r.popParams().map((t) => oe.from(t, e));
}
function Yl(r) {
  if (r.peekType("AT")) {
    if (r.pop(), r.peekType("NUMBER"))
      return S(r.pop().text);
    throw new Error("invalid gas");
  }
  return null;
}
function cr(r) {
  if (r.length)
    throw new Error(`unexpected tokens: ${r.toString()}`);
}
const pb = new RegExp(/^(.*)\[([0-9]*)\]$/);
function R0(r) {
  const e = r.match(jl);
  if (b(e, "invalid type", "type", r), r === "uint")
    return "uint256";
  if (r === "int")
    return "int256";
  if (e[2]) {
    const t = parseInt(e[2]);
    b(t !== 0 && t <= 32, "invalid bytes length", "type", r);
  } else if (e[3]) {
    const t = parseInt(e[3]);
    b(t !== 0 && t <= 256 && t % 8 === 0, "invalid numeric width", "type", r);
  }
  return r;
}
const $ = {}, ve = Symbol.for("_ethers_internal"), S0 = "_ParamTypeInternal", B0 = "_ErrorInternal", U0 = "_EventInternal", L0 = "_ConstructorInternal", F0 = "_FallbackInternal", D0 = "_FunctionInternal", M0 = "_StructInternal";
var es, ua;
const Ve = class Ve {
  /**
   *  @private
   */
  constructor(e, t, n, s, i, a, c, o) {
    y(this, es);
    /**
     *  The local name of the parameter (or ``""`` if unbound)
     */
    g(this, "name");
    /**
     *  The fully qualified type (e.g. ``"address"``, ``"tuple(address)"``,
     *  ``"uint256[3][]"``)
     */
    g(this, "type");
    /**
     *  The base type (e.g. ``"address"``, ``"tuple"``, ``"array"``)
     */
    g(this, "baseType");
    /**
     *  True if the parameters is indexed.
     *
     *  For non-indexable types this is ``null``.
     */
    g(this, "indexed");
    /**
     *  The components for the tuple.
     *
     *  For non-tuple types this is ``null``.
     */
    g(this, "components");
    /**
     *  The array length, or ``-1`` for dynamic-lengthed arrays.
     *
     *  For non-array types this is ``null``.
     */
    g(this, "arrayLength");
    /**
     *  The type of each child in the array.
     *
     *  For non-array types this is ``null``.
     */
    g(this, "arrayChildren");
    if (ur(e, $, "ParamType"), Object.defineProperty(this, ve, { value: S0 }), a && (a = Object.freeze(a.slice())), s === "array") {
      if (c == null || o == null)
        throw new Error("");
    } else if (c != null || o != null)
      throw new Error("");
    if (s === "tuple") {
      if (a == null)
        throw new Error("");
    } else if (a != null)
      throw new Error("");
    T(this, {
      name: t,
      type: n,
      baseType: s,
      indexed: i,
      components: a,
      arrayLength: c,
      arrayChildren: o
    });
  }
  /**
   *  Return a string representation of this type.
   *
   *  For example,
   *
   *  ``sighash" => "(uint256,address)"``
   *
   *  ``"minimal" => "tuple(uint256,address) indexed"``
   *
   *  ``"full" => "tuple(uint256 foo, address bar) indexed baz"``
   */
  format(e) {
    if (e == null && (e = "sighash"), e === "json") {
      const n = this.name || "";
      if (this.isArray()) {
        const i = JSON.parse(this.arrayChildren.format("json"));
        return i.name = n, i.type += `[${this.arrayLength < 0 ? "" : String(this.arrayLength)}]`, JSON.stringify(i);
      }
      const s = {
        type: this.baseType === "tuple" ? "tuple" : this.type,
        name: n
      };
      return typeof this.indexed == "boolean" && (s.indexed = this.indexed), this.isTuple() && (s.components = this.components.map((i) => JSON.parse(i.format(e)))), JSON.stringify(s);
    }
    let t = "";
    return this.isArray() ? (t += this.arrayChildren.format(e), t += `[${this.arrayLength < 0 ? "" : String(this.arrayLength)}]`) : this.isTuple() ? (e !== "sighash" && (t += this.type), t += "(" + this.components.map((n) => n.format(e)).join(e === "full" ? ", " : ",") + ")") : t += this.type, e !== "sighash" && (this.indexed === !0 && (t += " indexed"), e === "full" && this.name && (t += " " + this.name)), t;
  }
  /**
   *  Returns true if %%this%% is an Array type.
   *
   *  This provides a type gaurd ensuring that [[arrayChildren]]
   *  and [[arrayLength]] are non-null.
   */
  isArray() {
    return this.baseType === "array";
  }
  /**
   *  Returns true if %%this%% is a Tuple type.
   *
   *  This provides a type gaurd ensuring that [[components]]
   *  is non-null.
   */
  isTuple() {
    return this.baseType === "tuple";
  }
  /**
   *  Returns true if %%this%% is an Indexable type.
   *
   *  This provides a type gaurd ensuring that [[indexed]]
   *  is non-null.
   */
  isIndexable() {
    return this.indexed != null;
  }
  /**
   *  Walks the **ParamType** with %%value%%, calling %%process%%
   *  on each type, destructing the %%value%% recursively.
   */
  walk(e, t) {
    if (this.isArray()) {
      if (!Array.isArray(e))
        throw new Error("invalid array value");
      if (this.arrayLength !== -1 && e.length !== this.arrayLength)
        throw new Error("array is wrong length");
      const n = this;
      return e.map((s) => n.arrayChildren.walk(s, t));
    }
    if (this.isTuple()) {
      if (!Array.isArray(e))
        throw new Error("invalid tuple value");
      if (e.length !== this.components.length)
        throw new Error("array is wrong length");
      const n = this;
      return e.map((s, i) => n.components[i].walk(s, t));
    }
    return t(this.type, e);
  }
  /**
   *  Walks the **ParamType** with %%value%%, asynchronously calling
   *  %%process%% on each type, destructing the %%value%% recursively.
   *
   *  This can be used to resolve ENS naes by walking and resolving each
   *  ``"address"`` type.
   */
  async walkAsync(e, t) {
    const n = [], s = [e];
    return P(this, es, ua).call(this, n, e, t, (i) => {
      s[0] = i;
    }), n.length && await Promise.all(n), s[0];
  }
  /**
   *  Creates a new **ParamType** for %%obj%%.
   *
   *  If %%allowIndexed%% then the ``indexed`` keyword is permitted,
   *  otherwise the ``indexed`` keyword will throw an error.
   */
  static from(e, t) {
    if (Ve.isParamType(e))
      return e;
    if (typeof e == "string")
      try {
        return Ve.from(Nn(e), t);
      } catch {
        b(!1, "invalid param type", "obj", e);
      }
    else if (e instanceof ct) {
      let c = "", o = "", f = null;
      Wt(e, Ae(["tuple"])).has("tuple") || e.peekType("OPEN_PAREN") ? (o = "tuple", f = e.popParams().map((w) => Ve.from(w)), c = `tuple(${f.map((w) => w.format()).join(",")})`) : (c = R0(e.popType("TYPE")), o = c);
      let u = null, d = null;
      for (; e.length && e.peekType("BRACKET"); ) {
        const w = e.pop();
        u = new Ve($, "", c, o, null, f, d, u), d = w.value, c += w.text, o = "array", f = null;
      }
      let h = null;
      if (Wt(e, ob).has("indexed")) {
        if (!t)
          throw new Error("");
        h = !0;
      }
      const m = e.peekType("ID") ? e.pop().text : "";
      if (e.length)
        throw new Error("leftover tokens");
      return new Ve($, m, c, o, h, f, d, u);
    }
    const n = e.name;
    b(!n || typeof n == "string" && n.match(Jl), "invalid name", "obj.name", n);
    let s = e.indexed;
    s != null && (b(t, "parameter cannot be indexed", "obj.indexed", e.indexed), s = !!s);
    let i = e.type, a = i.match(pb);
    if (a) {
      const c = parseInt(a[2] || "-1"), o = Ve.from({
        type: a[1],
        components: e.components
      });
      return new Ve($, n || "", i, "array", s, null, c, o);
    }
    if (i === "tuple" || i.startsWith(
      "tuple("
      /* fix: ) */
    ) || i.startsWith(
      "("
      /* fix: ) */
    )) {
      const c = e.components != null ? e.components.map((f) => Ve.from(f)) : null;
      return new Ve($, n || "", i, "tuple", s, c, null, null);
    }
    return i = R0(e.type), new Ve($, n || "", i, i, s, null, null, null);
  }
  /**
   *  Returns true if %%value%% is a **ParamType**.
   */
  static isParamType(e) {
    return e && e[ve] === S0;
  }
};
es = new WeakSet(), ua = function(e, t, n, s) {
  if (this.isArray()) {
    if (!Array.isArray(t))
      throw new Error("invalid array value");
    if (this.arrayLength !== -1 && t.length !== this.arrayLength)
      throw new Error("array is wrong length");
    const a = this.arrayChildren, c = t.slice();
    c.forEach((o, f) => {
      var u;
      P(u = a, es, ua).call(u, e, o, n, (d) => {
        c[f] = d;
      });
    }), s(c);
    return;
  }
  if (this.isTuple()) {
    const a = this.components;
    let c;
    if (Array.isArray(t))
      c = t.slice();
    else {
      if (t == null || typeof t != "object")
        throw new Error("invalid tuple value");
      c = a.map((o) => {
        if (!o.name)
          throw new Error("cannot use object value with unnamed components");
        if (!(o.name in t))
          throw new Error(`missing value for component ${o.name}`);
        return t[o.name];
      });
    }
    if (c.length !== this.components.length)
      throw new Error("array is wrong length");
    c.forEach((o, f) => {
      var u;
      P(u = a[f], es, ua).call(u, e, o, n, (d) => {
        c[f] = d;
      });
    }), s(c);
    return;
  }
  const i = n(this.type, t);
  i.then ? e.push(async function() {
    s(await i);
  }()) : s(i);
};
let oe = Ve;
class or {
  /**
   *  @private
   */
  constructor(e, t, n) {
    /**
     *  The type of the fragment.
     */
    g(this, "type");
    /**
     *  The inputs for the fragment.
     */
    g(this, "inputs");
    ur(e, $, "Fragment"), n = Object.freeze(n.slice()), T(this, { type: t, inputs: n });
  }
  /**
   *  Creates a new **Fragment** for %%obj%%, wich can be any supported
   *  ABI frgament type.
   */
  static from(e) {
    if (typeof e == "string") {
      try {
        or.from(JSON.parse(e));
      } catch {
      }
      return or.from(Nn(e));
    }
    if (e instanceof ct)
      switch (e.peekKeyword(Ql)) {
        case "constructor":
          return Kt.from(e);
        case "error":
          return Ie.from(e);
        case "event":
          return wt.from(e);
        case "fallback":
        case "receive":
          return vt.from(e);
        case "function":
          return At.from(e);
        case "struct":
          return sr.from(e);
      }
    else if (typeof e == "object") {
      switch (e.type) {
        case "constructor":
          return Kt.from(e);
        case "error":
          return Ie.from(e);
        case "event":
          return wt.from(e);
        case "fallback":
        case "receive":
          return vt.from(e);
        case "function":
          return At.from(e);
        case "struct":
          return sr.from(e);
      }
      A(!1, `unsupported type: ${e.type}`, "UNSUPPORTED_OPERATION", {
        operation: "Fragment.from"
      });
    }
    b(!1, "unsupported frgament object", "obj", e);
  }
  /**
   *  Returns true if %%value%% is a [[ConstructorFragment]].
   */
  static isConstructor(e) {
    return Kt.isFragment(e);
  }
  /**
   *  Returns true if %%value%% is an [[ErrorFragment]].
   */
  static isError(e) {
    return Ie.isFragment(e);
  }
  /**
   *  Returns true if %%value%% is an [[EventFragment]].
   */
  static isEvent(e) {
    return wt.isFragment(e);
  }
  /**
   *  Returns true if %%value%% is a [[FunctionFragment]].
   */
  static isFunction(e) {
    return At.isFragment(e);
  }
  /**
   *  Returns true if %%value%% is a [[StructFragment]].
   */
  static isStruct(e) {
    return sr.isFragment(e);
  }
}
class qa extends or {
  /**
   *  @private
   */
  constructor(t, n, s, i) {
    super(t, n, i);
    /**
     *  The name of the fragment.
     */
    g(this, "name");
    b(typeof s == "string" && s.match(Jl), "invalid identifier", "name", s), i = Object.freeze(i.slice()), T(this, { name: s });
  }
}
function ui(r, e) {
  return "(" + e.map((t) => t.format(r)).join(r === "full" ? ", " : ",") + ")";
}
class Ie extends qa {
  /**
   *  @private
   */
  constructor(e, t, n) {
    super(e, "error", t, n), Object.defineProperty(this, ve, { value: B0 });
  }
  /**
   *  The Custom Error selector.
   */
  get selector() {
    return jt(this.format("sighash")).substring(0, 10);
  }
  /**
   *  Returns a string representation of this fragment as %%format%%.
   */
  format(e) {
    if (e == null && (e = "sighash"), e === "json")
      return JSON.stringify({
        type: "error",
        name: this.name,
        inputs: this.inputs.map((n) => JSON.parse(n.format(e)))
      });
    const t = [];
    return e !== "sighash" && t.push("error"), t.push(this.name + ui(e, this.inputs)), t.join(" ");
  }
  /**
   *  Returns a new **ErrorFragment** for %%obj%%.
   */
  static from(e) {
    if (Ie.isFragment(e))
      return e;
    if (typeof e == "string")
      return Ie.from(Nn(e));
    if (e instanceof ct) {
      const t = $a("error", e), n = Qt(e);
      return cr(e), new Ie($, t, n);
    }
    return new Ie($, e.name, e.inputs ? e.inputs.map(oe.from) : []);
  }
  /**
   *  Returns ``true`` and provides a type guard if %%value%% is an
   *  **ErrorFragment**.
   */
  static isFragment(e) {
    return e && e[ve] === B0;
  }
}
class wt extends qa {
  /**
   *  @private
   */
  constructor(t, n, s, i) {
    super(t, "event", n, s);
    /**
     *  Whether this event is anonymous.
     */
    g(this, "anonymous");
    Object.defineProperty(this, ve, { value: U0 }), T(this, { anonymous: i });
  }
  /**
   *  The Event topic hash.
   */
  get topicHash() {
    return jt(this.format("sighash"));
  }
  /**
   *  Returns a string representation of this event as %%format%%.
   */
  format(t) {
    if (t == null && (t = "sighash"), t === "json")
      return JSON.stringify({
        type: "event",
        anonymous: this.anonymous,
        name: this.name,
        inputs: this.inputs.map((s) => JSON.parse(s.format(t)))
      });
    const n = [];
    return t !== "sighash" && n.push("event"), n.push(this.name + ui(t, this.inputs)), t !== "sighash" && this.anonymous && n.push("anonymous"), n.join(" ");
  }
  /**
   *  Return the topic hash for an event with %%name%% and %%params%%.
   */
  static getTopicHash(t, n) {
    return n = (n || []).map((i) => oe.from(i)), new wt($, t, n, !1).topicHash;
  }
  /**
   *  Returns a new **EventFragment** for %%obj%%.
   */
  static from(t) {
    if (wt.isFragment(t))
      return t;
    if (typeof t == "string")
      try {
        return wt.from(Nn(t));
      } catch {
        b(!1, "invalid event fragment", "obj", t);
      }
    else if (t instanceof ct) {
      const n = $a("event", t), s = Qt(t, !0), i = !!Wt(t, Ae(["anonymous"])).has("anonymous");
      return cr(t), new wt($, n, s, i);
    }
    return new wt($, t.name, t.inputs ? t.inputs.map((n) => oe.from(n, !0)) : [], !!t.anonymous);
  }
  /**
   *  Returns ``true`` and provides a type guard if %%value%% is an
   *  **EventFragment**.
   */
  static isFragment(t) {
    return t && t[ve] === U0;
  }
}
class Kt extends or {
  /**
   *  @private
   */
  constructor(t, n, s, i, a) {
    super(t, n, s);
    /**
     *  Whether the constructor can receive an endowment.
     */
    g(this, "payable");
    /**
     *  The recommended gas limit for deployment or ``null``.
     */
    g(this, "gas");
    Object.defineProperty(this, ve, { value: L0 }), T(this, { payable: i, gas: a });
  }
  /**
   *  Returns a string representation of this constructor as %%format%%.
   */
  format(t) {
    if (A(t != null && t !== "sighash", "cannot format a constructor for sighash", "UNSUPPORTED_OPERATION", { operation: "format(sighash)" }), t === "json")
      return JSON.stringify({
        type: "constructor",
        stateMutability: this.payable ? "payable" : "undefined",
        payable: this.payable,
        gas: this.gas != null ? this.gas : void 0,
        inputs: this.inputs.map((s) => JSON.parse(s.format(t)))
      });
    const n = [`constructor${ui(t, this.inputs)}`];
    return n.push(this.payable ? "payable" : "nonpayable"), this.gas != null && n.push(`@${this.gas.toString()}`), n.join(" ");
  }
  /**
   *  Returns a new **ConstructorFragment** for %%obj%%.
   */
  static from(t) {
    if (Kt.isFragment(t))
      return t;
    if (typeof t == "string")
      try {
        return Kt.from(Nn(t));
      } catch {
        b(!1, "invalid constuctor fragment", "obj", t);
      }
    else if (t instanceof ct) {
      Wt(t, Ae(["constructor"]));
      const n = Qt(t), s = !!Wt(t, ab).has("payable"), i = Yl(t);
      return cr(t), new Kt($, "constructor", n, s, i);
    }
    return new Kt($, "constructor", t.inputs ? t.inputs.map(oe.from) : [], !!t.payable, t.gas != null ? t.gas : null);
  }
  /**
   *  Returns ``true`` and provides a type guard if %%value%% is a
   *  **ConstructorFragment**.
   */
  static isFragment(t) {
    return t && t[ve] === L0;
  }
}
class vt extends or {
  constructor(t, n, s) {
    super(t, "fallback", n);
    /**
     *  If the function can be sent value during invocation.
     */
    g(this, "payable");
    Object.defineProperty(this, ve, { value: F0 }), T(this, { payable: s });
  }
  /**
   *  Returns a string representation of this fallback as %%format%%.
   */
  format(t) {
    const n = this.inputs.length === 0 ? "receive" : "fallback";
    if (t === "json") {
      const s = this.payable ? "payable" : "nonpayable";
      return JSON.stringify({ type: n, stateMutability: s });
    }
    return `${n}()${this.payable ? " payable" : ""}`;
  }
  /**
   *  Returns a new **FallbackFragment** for %%obj%%.
   */
  static from(t) {
    if (vt.isFragment(t))
      return t;
    if (typeof t == "string")
      try {
        return vt.from(Nn(t));
      } catch {
        b(!1, "invalid fallback fragment", "obj", t);
      }
    else if (t instanceof ct) {
      const n = t.toString(), s = t.peekKeyword(Ae(["fallback", "receive"]));
      if (b(s, "type must be fallback or receive", "obj", n), t.popKeyword(Ae(["fallback", "receive"])) === "receive") {
        const o = Qt(t);
        return b(o.length === 0, "receive cannot have arguments", "obj.inputs", o), Wt(t, Ae(["payable"])), cr(t), new vt($, [], !0);
      }
      let a = Qt(t);
      a.length ? b(a.length === 1 && a[0].type === "bytes", "invalid fallback inputs", "obj.inputs", a.map((o) => o.format("minimal")).join(", ")) : a = [oe.from("bytes")];
      const c = Wl(t);
      if (b(c === "nonpayable" || c === "payable", "fallback cannot be constants", "obj.stateMutability", c), Wt(t, Ae(["returns"])).has("returns")) {
        const o = Qt(t);
        b(o.length === 1 && o[0].type === "bytes", "invalid fallback outputs", "obj.outputs", o.map((f) => f.format("minimal")).join(", "));
      }
      return cr(t), new vt($, a, c === "payable");
    }
    if (t.type === "receive")
      return new vt($, [], !0);
    if (t.type === "fallback") {
      const n = [oe.from("bytes")], s = t.stateMutability === "payable";
      return new vt($, n, s);
    }
    b(!1, "invalid fallback description", "obj", t);
  }
  /**
   *  Returns ``true`` and provides a type guard if %%value%% is a
   *  **FallbackFragment**.
   */
  static isFragment(t) {
    return t && t[ve] === F0;
  }
}
class At extends qa {
  /**
   *  @private
   */
  constructor(t, n, s, i, a, c) {
    super(t, "function", n, i);
    /**
     *  If the function is constant (e.g. ``pure`` or ``view`` functions).
     */
    g(this, "constant");
    /**
     *  The returned types for the result of calling this function.
     */
    g(this, "outputs");
    /**
     *  The state mutability (e.g. ``payable``, ``nonpayable``, ``view``
     *  or ``pure``)
     */
    g(this, "stateMutability");
    /**
     *  If the function can be sent value during invocation.
     */
    g(this, "payable");
    /**
     *  The recommended gas limit to send when calling this function.
     */
    g(this, "gas");
    Object.defineProperty(this, ve, { value: D0 }), a = Object.freeze(a.slice()), T(this, { constant: s === "view" || s === "pure", gas: c, outputs: a, payable: s === "payable", stateMutability: s });
  }
  /**
   *  The Function selector.
   */
  get selector() {
    return jt(this.format("sighash")).substring(0, 10);
  }
  /**
   *  Returns a string representation of this function as %%format%%.
   */
  format(t) {
    if (t == null && (t = "sighash"), t === "json")
      return JSON.stringify({
        type: "function",
        name: this.name,
        constant: this.constant,
        stateMutability: this.stateMutability !== "nonpayable" ? this.stateMutability : void 0,
        payable: this.payable,
        gas: this.gas != null ? this.gas : void 0,
        inputs: this.inputs.map((s) => JSON.parse(s.format(t))),
        outputs: this.outputs.map((s) => JSON.parse(s.format(t)))
      });
    const n = [];
    return t !== "sighash" && n.push("function"), n.push(this.name + ui(t, this.inputs)), t !== "sighash" && (this.stateMutability !== "nonpayable" && n.push(this.stateMutability), this.outputs && this.outputs.length && (n.push("returns"), n.push(ui(t, this.outputs))), this.gas != null && n.push(`@${this.gas.toString()}`)), n.join(" ");
  }
  /**
   *  Return the selector for a function with %%name%% and %%params%%.
   */
  static getSelector(t, n) {
    return n = (n || []).map((i) => oe.from(i)), new At($, t, "view", n, [], null).selector;
  }
  /**
   *  Returns a new **FunctionFragment** for %%obj%%.
   */
  static from(t) {
    if (At.isFragment(t))
      return t;
    if (typeof t == "string")
      try {
        return At.from(Nn(t));
      } catch {
        b(!1, "invalid function fragment", "obj", t);
      }
    else if (t instanceof ct) {
      const s = $a("function", t), i = Qt(t), a = Wl(t);
      let c = [];
      Wt(t, Ae(["returns"])).has("returns") && (c = Qt(t));
      const o = Yl(t);
      return cr(t), new At($, s, a, i, c, o);
    }
    let n = t.stateMutability;
    return n == null && (n = "payable", typeof t.constant == "boolean" ? (n = "view", t.constant || (n = "payable", typeof t.payable == "boolean" && !t.payable && (n = "nonpayable"))) : typeof t.payable == "boolean" && !t.payable && (n = "nonpayable")), new At($, t.name, n, t.inputs ? t.inputs.map(oe.from) : [], t.outputs ? t.outputs.map(oe.from) : [], t.gas != null ? t.gas : null);
  }
  /**
   *  Returns ``true`` and provides a type guard if %%value%% is a
   *  **FunctionFragment**.
   */
  static isFragment(t) {
    return t && t[ve] === D0;
  }
}
class sr extends qa {
  /**
   *  @private
   */
  constructor(e, t, n) {
    super(e, "struct", t, n), Object.defineProperty(this, ve, { value: M0 });
  }
  /**
   *  Returns a string representation of this struct as %%format%%.
   */
  format() {
    throw new Error("@TODO");
  }
  /**
   *  Returns a new **StructFragment** for %%obj%%.
   */
  static from(e) {
    if (typeof e == "string")
      try {
        return sr.from(Nn(e));
      } catch {
        b(!1, "invalid struct fragment", "obj", e);
      }
    else if (e instanceof ct) {
      const t = $a("struct", e), n = Qt(e);
      return cr(e), new sr($, t, n);
    }
    return new sr($, e.name, e.inputs ? e.inputs.map(oe.from) : []);
  }
  // @TODO: fix this return type
  /**
   *  Returns ``true`` and provides a type guard if %%value%% is a
   *  **StructFragment**.
   */
  static isFragment(e) {
    return e && e[ve] === M0;
  }
}
const ot = /* @__PURE__ */ new Map();
ot.set(0, "GENERIC_PANIC");
ot.set(1, "ASSERT_FALSE");
ot.set(17, "OVERFLOW");
ot.set(18, "DIVIDE_BY_ZERO");
ot.set(33, "ENUM_RANGE_ERROR");
ot.set(34, "BAD_STORAGE_DATA");
ot.set(49, "STACK_UNDERFLOW");
ot.set(50, "ARRAY_RANGE_ERROR");
ot.set(65, "OUT_OF_MEMORY");
ot.set(81, "UNINITIALIZED_FUNCTION_CALL");
const gb = new RegExp(/^bytes([0-9]*)$/), yb = new RegExp(/^(u?int)([0-9]*)$/);
let fc = null;
function mb(r, e, t, n) {
  let s = "missing revert data", i = null;
  const a = null;
  let c = null;
  if (t) {
    s = "execution reverted";
    const f = O(t);
    if (t = N(t), f.length === 0)
      s += " (no data present; likely require(false) occurred", i = "require(false)";
    else if (f.length % 32 !== 4)
      s += " (could not decode reason; invalid data length)";
    else if (N(f.slice(0, 4)) === "0x08c379a0")
      try {
        i = n.decode(["string"], f.slice(4))[0], c = {
          signature: "Error(string)",
          name: "Error",
          args: [i]
        }, s += `: ${JSON.stringify(i)}`;
      } catch {
        s += " (could not decode reason; invalid string data)";
      }
    else if (N(f.slice(0, 4)) === "0x4e487b71")
      try {
        const u = Number(n.decode(["uint256"], f.slice(4))[0]);
        c = {
          signature: "Panic(uint256)",
          name: "Panic",
          args: [u]
        }, i = `Panic due to ${ot.get(u) || "UNKNOWN"}(${u})`, s += `: ${i}`;
      } catch {
        s += " (could not decode panic code)";
      }
    else
      s += " (unknown custom error)";
  }
  const o = {
    to: e.to ? F(e.to) : null,
    data: e.data || "0x"
  };
  return e.from && (o.from = F(e.from)), ne(s, "CALL_EXCEPTION", {
    action: r,
    data: t,
    reason: i,
    transaction: o,
    invocation: a,
    revert: c
  });
}
var sn, mr;
const Va = class Va {
  constructor() {
    y(this, sn);
  }
  /**
   *  Get the default values for the given %%types%%.
   *
   *  For example, a ``uint`` is by default ``0`` and ``bool``
   *  is by default ``false``.
   */
  getDefaultValue(e) {
    const t = e.map((s) => P(this, sn, mr).call(this, oe.from(s)));
    return new ta(t, "_").defaultValue();
  }
  /**
   *  Encode the %%values%% as the %%types%% into ABI data.
   *
   *  @returns DataHexstring
   */
  encode(e, t) {
    ff(t.length, e.length, "types/values length mismatch");
    const n = e.map((a) => P(this, sn, mr).call(this, oe.from(a))), s = new ta(n, "_"), i = new vc();
    return s.encode(i, t), i.data;
  }
  /**
   *  Decode the ABI %%data%% as the %%types%% into values.
   *
   *  If %%loose%% decoding is enabled, then strict padding is
   *  not enforced. Some older versions of Solidity incorrectly
   *  padded event data emitted from ``external`` functions.
   */
  decode(e, t, n) {
    const s = e.map((a) => P(this, sn, mr).call(this, oe.from(a)));
    return new ta(s, "_").decode(new kc(t, n));
  }
  /**
   *  Returns the shared singleton instance of a default [[AbiCoder]].
   *
   *  On the first call, the instance is created internally.
   */
  static defaultAbiCoder() {
    return fc == null && (fc = new Va()), fc;
  }
  /**
   *  Returns an ethers-compatible [[CallExceptionError]] Error for the given
   *  result %%data%% for the [[CallExceptionAction]] %%action%% against
   *  the Transaction %%tx%%.
   */
  static getBuiltinCallException(e, t, n) {
    return mb(e, t, n, Va.defaultAbiCoder());
  }
};
sn = new WeakSet(), mr = function(e) {
  if (e.isArray())
    return new _h(P(this, sn, mr).call(this, e.arrayChildren), e.arrayLength, e.name);
  if (e.isTuple())
    return new ta(e.components.map((n) => P(this, sn, mr).call(this, n)), e.name);
  switch (e.baseType) {
    case "address":
      return new Kh(e.name);
    case "bool":
      return new Qh(e.name);
    case "string":
      return new qh(e.name);
    case "bytes":
      return new zh(e.name);
    case "":
      return new Wh(e.name);
  }
  let t = e.type.match(yb);
  if (t) {
    let n = parseInt(t[2] || "256");
    return b(n !== 0 && n <= 256 && n % 8 === 0, "invalid " + t[1] + " bit length", "param", e), new $h(n / 8, t[1] === "int", e.name);
  }
  if (t = e.type.match(gb), t) {
    let n = parseInt(t[1]);
    return b(n !== 0 && n <= 32, "invalid bytes length", "param", e), new Jh(n, e.name);
  }
  b(!1, "invalid type", "type", e.type);
};
let di = Va;
class wb {
  /**
   *  @_ignore:
   */
  constructor(e, t, n) {
    /**
     *  The matching fragment for the ``topic0``.
     */
    g(this, "fragment");
    /**
     *  The name of the Event.
     */
    g(this, "name");
    /**
     *  The full Event signature.
     */
    g(this, "signature");
    /**
     *  The topic hash for the Event.
     */
    g(this, "topic");
    /**
     *  The arguments passed into the Event with ``emit``.
     */
    g(this, "args");
    const s = e.name, i = e.format();
    T(this, {
      fragment: e,
      name: s,
      signature: i,
      topic: t,
      args: n
    });
  }
}
class Ab {
  /**
   *  @_ignore:
   */
  constructor(e, t, n, s) {
    /**
     *  The matching fragment from the transaction ``data``.
     */
    g(this, "fragment");
    /**
     *  The name of the Function from the transaction ``data``.
     */
    g(this, "name");
    /**
     *  The arguments passed to the Function from the transaction ``data``.
     */
    g(this, "args");
    /**
     *  The full Function signature from the transaction ``data``.
     */
    g(this, "signature");
    /**
     *  The selector for the Function from the transaction ``data``.
     */
    g(this, "selector");
    /**
     *  The ``value`` (in wei) from the transaction.
     */
    g(this, "value");
    const i = e.name, a = e.format();
    T(this, {
      fragment: e,
      name: i,
      args: n,
      signature: a,
      selector: t,
      value: s
    });
  }
}
class Eb {
  /**
   *  @_ignore:
   */
  constructor(e, t, n) {
    /**
     *  The matching fragment.
     */
    g(this, "fragment");
    /**
     *  The name of the Error.
     */
    g(this, "name");
    /**
     *  The arguments passed to the Error with ``revert``.
     */
    g(this, "args");
    /**
     *  The full Error signature.
     */
    g(this, "signature");
    /**
     *  The selector for the Error.
     */
    g(this, "selector");
    const s = e.name, i = e.format();
    T(this, {
      fragment: e,
      name: s,
      args: n,
      signature: i,
      selector: t
    });
  }
}
class G0 {
  /**
   *  @_ignore:
   */
  constructor(e) {
    /**
     *  The ``keccak256`` of the value logged.
     */
    g(this, "hash");
    /**
     *  @_ignore:
     */
    g(this, "_isIndexed");
    T(this, { hash: e, _isIndexed: !0 });
  }
  /**
   *  Returns ``true`` if %%value%% is an **Indexed**.
   *
   *  This provides a Type Guard for property access.
   */
  static isIndexed(e) {
    return !!(e && e._isIndexed);
  }
}
const H0 = {
  0: "generic panic",
  1: "assert(false)",
  17: "arithmetic overflow",
  18: "division or modulo by zero",
  33: "enum overflow",
  34: "invalid encoded storage byte array accessed",
  49: "out-of-bounds array access; popping on an empty array",
  50: "out-of-bounds access of an array or bytesN",
  65: "out of memory",
  81: "uninitialized function"
}, K0 = {
  "0x08c379a0": {
    signature: "Error(string)",
    name: "Error",
    inputs: ["string"],
    reason: (r) => `reverted with reason string ${JSON.stringify(r)}`
  },
  "0x4e487b71": {
    signature: "Panic(uint256)",
    name: "Panic",
    inputs: ["uint256"],
    reason: (r) => {
      let e = "unknown panic code";
      return r >= 0 && r <= 255 && H0[r.toString()] && (e = H0[r.toString()]), `reverted with panic code 0x${r.toString(16)} (${e})`;
    }
  }
};
var xt, bt, pt, le, ts, da, ns, ha;
const Pr = class Pr {
  /**
   *  Create a new Interface for the %%fragments%%.
   */
  constructor(e) {
    // Find a function definition by any means necessary (unless it is ambiguous)
    y(this, ts);
    // Find an event definition by any means necessary (unless it is ambiguous)
    y(this, ns);
    /**
     *  All the Contract ABI members (i.e. methods, events, errors, etc).
     */
    g(this, "fragments");
    /**
     *  The Contract constructor.
     */
    g(this, "deploy");
    /**
     *  The Fallback method, if any.
     */
    g(this, "fallback");
    /**
     *  If receiving ether is supported.
     */
    g(this, "receive");
    y(this, xt, void 0);
    y(this, bt, void 0);
    y(this, pt, void 0);
    //    #structs: Map<string, StructFragment>;
    y(this, le, void 0);
    let t = [];
    typeof e == "string" ? t = JSON.parse(e) : t = e, x(this, pt, /* @__PURE__ */ new Map()), x(this, xt, /* @__PURE__ */ new Map()), x(this, bt, /* @__PURE__ */ new Map());
    const n = [];
    for (const a of t)
      try {
        n.push(or.from(a));
      } catch (c) {
        console.log("EE", c);
      }
    T(this, {
      fragments: Object.freeze(n)
    });
    let s = null, i = !1;
    x(this, le, this.getAbiCoder()), this.fragments.forEach((a, c) => {
      let o;
      switch (a.type) {
        case "constructor":
          if (this.deploy) {
            console.log("duplicate definition - constructor");
            return;
          }
          T(this, { deploy: a });
          return;
        case "fallback":
          a.inputs.length === 0 ? i = !0 : (b(!s || a.payable !== s.payable, "conflicting fallback fragments", `fragments[${c}]`, a), s = a, i = s.payable);
          return;
        case "function":
          o = l(this, pt);
          break;
        case "event":
          o = l(this, bt);
          break;
        case "error":
          o = l(this, xt);
          break;
        default:
          return;
      }
      const f = a.format();
      o.has(f) || o.set(f, a);
    }), this.deploy || T(this, {
      deploy: Kt.from("constructor()")
    }), T(this, { fallback: s, receive: i });
  }
  /**
   *  Returns the entire Human-Readable ABI, as an array of
   *  signatures, optionally as %%minimal%% strings, which
   *  removes parameter names and unneceesary spaces.
   */
  format(e) {
    const t = e ? "minimal" : "full";
    return this.fragments.map((s) => s.format(t));
  }
  /**
   *  Return the JSON-encoded ABI. This is the format Solidiy
   *  returns.
   */
  formatJson() {
    const e = this.fragments.map((t) => t.format("json"));
    return JSON.stringify(e.map((t) => JSON.parse(t)));
  }
  /**
   *  The ABI coder that will be used to encode and decode binary
   *  data.
   */
  getAbiCoder() {
    return di.defaultAbiCoder();
  }
  /**
   *  Get the function name for %%key%%, which may be a function selector,
   *  function name or function signature that belongs to the ABI.
   */
  getFunctionName(e) {
    const t = P(this, ts, da).call(this, e, null, !1);
    return b(t, "no matching function", "key", e), t.name;
  }
  /**
   *  Returns true if %%key%% (a function selector, function name or
   *  function signature) is present in the ABI.
   *
   *  In the case of a function name, the name may be ambiguous, so
   *  accessing the [[FunctionFragment]] may require refinement.
   */
  hasFunction(e) {
    return !!P(this, ts, da).call(this, e, null, !1);
  }
  /**
   *  Get the [[FunctionFragment]] for %%key%%, which may be a function
   *  selector, function name or function signature that belongs to the ABI.
   *
   *  If %%values%% is provided, it will use the Typed API to handle
   *  ambiguous cases where multiple functions match by name.
   *
   *  If the %%key%% and %%values%% do not refine to a single function in
   *  the ABI, this will throw.
   */
  getFunction(e, t) {
    return P(this, ts, da).call(this, e, t || null, !0);
  }
  /**
   *  Iterate over all functions, calling %%callback%%, sorted by their name.
   */
  forEachFunction(e) {
    const t = Array.from(l(this, pt).keys());
    t.sort((n, s) => n.localeCompare(s));
    for (let n = 0; n < t.length; n++) {
      const s = t[n];
      e(l(this, pt).get(s), n);
    }
  }
  /**
   *  Get the event name for %%key%%, which may be a topic hash,
   *  event name or event signature that belongs to the ABI.
   */
  getEventName(e) {
    const t = P(this, ns, ha).call(this, e, null, !1);
    return b(t, "no matching event", "key", e), t.name;
  }
  /**
   *  Returns true if %%key%% (an event topic hash, event name or
   *  event signature) is present in the ABI.
   *
   *  In the case of an event name, the name may be ambiguous, so
   *  accessing the [[EventFragment]] may require refinement.
   */
  hasEvent(e) {
    return !!P(this, ns, ha).call(this, e, null, !1);
  }
  /**
   *  Get the [[EventFragment]] for %%key%%, which may be a topic hash,
   *  event name or event signature that belongs to the ABI.
   *
   *  If %%values%% is provided, it will use the Typed API to handle
   *  ambiguous cases where multiple events match by name.
   *
   *  If the %%key%% and %%values%% do not refine to a single event in
   *  the ABI, this will throw.
   */
  getEvent(e, t) {
    return P(this, ns, ha).call(this, e, t || null, !0);
  }
  /**
   *  Iterate over all events, calling %%callback%%, sorted by their name.
   */
  forEachEvent(e) {
    const t = Array.from(l(this, bt).keys());
    t.sort((n, s) => n.localeCompare(s));
    for (let n = 0; n < t.length; n++) {
      const s = t[n];
      e(l(this, bt).get(s), n);
    }
  }
  /**
   *  Get the [[ErrorFragment]] for %%key%%, which may be an error
   *  selector, error name or error signature that belongs to the ABI.
   *
   *  If %%values%% is provided, it will use the Typed API to handle
   *  ambiguous cases where multiple errors match by name.
   *
   *  If the %%key%% and %%values%% do not refine to a single error in
   *  the ABI, this will throw.
   */
  getError(e, t) {
    if (q(e)) {
      const s = e.toLowerCase();
      if (K0[s])
        return Ie.from(K0[s].signature);
      for (const i of l(this, xt).values())
        if (s === i.selector)
          return i;
      return null;
    }
    if (e.indexOf("(") === -1) {
      const s = [];
      for (const [i, a] of l(this, xt))
        i.split(
          "("
          /* fix:) */
        )[0] === e && s.push(a);
      if (s.length === 0)
        return e === "Error" ? Ie.from("error Error(string)") : e === "Panic" ? Ie.from("error Panic(uint256)") : null;
      if (s.length > 1) {
        const i = s.map((a) => JSON.stringify(a.format())).join(", ");
        b(!1, `ambiguous error description (i.e. ${i})`, "name", e);
      }
      return s[0];
    }
    if (e = Ie.from(e).format(), e === "Error(string)")
      return Ie.from("error Error(string)");
    if (e === "Panic(uint256)")
      return Ie.from("error Panic(uint256)");
    const n = l(this, xt).get(e);
    return n || null;
  }
  /**
   *  Iterate over all errors, calling %%callback%%, sorted by their name.
   */
  forEachError(e) {
    const t = Array.from(l(this, xt).keys());
    t.sort((n, s) => n.localeCompare(s));
    for (let n = 0; n < t.length; n++) {
      const s = t[n];
      e(l(this, xt).get(s), n);
    }
  }
  // Get the 4-byte selector used by Solidity to identify a function
  /*
  getSelector(fragment: ErrorFragment | FunctionFragment): string {
      if (typeof(fragment) === "string") {
          const matches: Array<Fragment> = [ ];
  
          try { matches.push(this.getFunction(fragment)); } catch (error) { }
          try { matches.push(this.getError(<string>fragment)); } catch (_) { }
  
          if (matches.length === 0) {
              logger.throwArgumentError("unknown fragment", "key", fragment);
          } else if (matches.length > 1) {
              logger.throwArgumentError("ambiguous fragment matches function and error", "key", fragment);
          }
  
          fragment = matches[0];
      }
  
      return dataSlice(id(fragment.format()), 0, 4);
  }
      */
  // Get the 32-byte topic hash used by Solidity to identify an event
  /*
  getEventTopic(fragment: EventFragment): string {
      //if (typeof(fragment) === "string") { fragment = this.getEvent(eventFragment); }
      return id(fragment.format());
  }
  */
  _decodeParams(e, t) {
    return l(this, le).decode(e, t);
  }
  _encodeParams(e, t) {
    return l(this, le).encode(e, t);
  }
  /**
   *  Encodes a ``tx.data`` object for deploying the Contract with
   *  the %%values%% as the constructor arguments.
   */
  encodeDeploy(e) {
    return this._encodeParams(this.deploy.inputs, e || []);
  }
  /**
   *  Decodes the result %%data%% (e.g. from an ``eth_call``) for the
   *  specified error (see [[getError]] for valid values for
   *  %%key%%).
   *
   *  Most developers should prefer the [[parseCallResult]] method instead,
   *  which will automatically detect a ``CALL_EXCEPTION`` and throw the
   *  corresponding error.
   */
  decodeErrorResult(e, t) {
    if (typeof e == "string") {
      const n = this.getError(e);
      b(n, "unknown error", "fragment", e), e = n;
    }
    return b(W(t, 0, 4) === e.selector, `data signature does not match error ${e.name}.`, "data", t), this._decodeParams(e.inputs, W(t, 4));
  }
  /**
   *  Encodes the transaction revert data for a call result that
   *  reverted from the the Contract with the sepcified %%error%%
   *  (see [[getError]] for valid values for %%fragment%%) with the %%values%%.
   *
   *  This is generally not used by most developers, unless trying to mock
   *  a result from a Contract.
   */
  encodeErrorResult(e, t) {
    if (typeof e == "string") {
      const n = this.getError(e);
      b(n, "unknown error", "fragment", e), e = n;
    }
    return _([
      e.selector,
      this._encodeParams(e.inputs, t || [])
    ]);
  }
  /**
   *  Decodes the %%data%% from a transaction ``tx.data`` for
   *  the function specified (see [[getFunction]] for valid values
   *  for %%fragment%%).
   *
   *  Most developers should prefer the [[parseTransaction]] method
   *  instead, which will automatically detect the fragment.
   */
  decodeFunctionData(e, t) {
    if (typeof e == "string") {
      const n = this.getFunction(e);
      b(n, "unknown function", "fragment", e), e = n;
    }
    return b(W(t, 0, 4) === e.selector, `data signature does not match function ${e.name}.`, "data", t), this._decodeParams(e.inputs, W(t, 4));
  }
  /**
   *  Encodes the ``tx.data`` for a transaction that calls the function
   *  specified (see [[getFunction]] for valid values for %%fragment%%) with
   *  the %%values%%.
   */
  encodeFunctionData(e, t) {
    if (typeof e == "string") {
      const n = this.getFunction(e);
      b(n, "unknown function", "fragment", e), e = n;
    }
    return _([
      e.selector,
      this._encodeParams(e.inputs, t || [])
    ]);
  }
  /**
   *  Decodes the result %%data%% (e.g. from an ``eth_call``) for the
   *  specified function (see [[getFunction]] for valid values for
   *  %%key%%).
   *
   *  Most developers should prefer the [[parseCallResult]] method instead,
   *  which will automatically detect a ``CALL_EXCEPTION`` and throw the
   *  corresponding error.
   */
  decodeFunctionResult(e, t) {
    if (typeof e == "string") {
      const i = this.getFunction(e);
      b(i, "unknown function", "fragment", e), e = i;
    }
    let n = "invalid length for result data";
    const s = be(t);
    if (s.length % 32 === 0)
      try {
        return l(this, le).decode(e.outputs, s);
      } catch {
        n = "could not decode result data";
      }
    A(!1, n, "BAD_DATA", {
      value: N(s),
      info: { method: e.name, signature: e.format() }
    });
  }
  makeError(e, t) {
    const n = O(e, "data"), s = di.getBuiltinCallException("call", t, n), i = "execution reverted (unknown custom error)";
    if (s.message.startsWith(i)) {
      const c = N(n.slice(0, 4)), o = this.getError(c);
      if (o)
        try {
          const f = l(this, le).decode(o.inputs, n.slice(4));
          s.revert = {
            name: o.name,
            signature: o.format(),
            args: f
          }, s.reason = s.revert.signature, s.message = `execution reverted: ${s.reason}`;
        } catch {
          s.message = "execution reverted (coult not decode custom error)";
        }
    }
    const a = this.parseTransaction(t);
    return a && (s.invocation = {
      method: a.name,
      signature: a.signature,
      args: a.args
    }), s;
  }
  /**
   *  Encodes the result data (e.g. from an ``eth_call``) for the
   *  specified function (see [[getFunction]] for valid values
   *  for %%fragment%%) with %%values%%.
   *
   *  This is generally not used by most developers, unless trying to mock
   *  a result from a Contract.
   */
  encodeFunctionResult(e, t) {
    if (typeof e == "string") {
      const n = this.getFunction(e);
      b(n, "unknown function", "fragment", e), e = n;
    }
    return N(l(this, le).encode(e.outputs, t || []));
  }
  /*
      spelunk(inputs: Array<ParamType>, values: ReadonlyArray<any>, processfunc: (type: string, value: any) => Promise<any>): Promise<Array<any>> {
          const promises: Array<Promise<>> = [ ];
          const process = function(type: ParamType, value: any): any {
              if (type.baseType === "array") {
                  return descend(type.child
              }
              if (type. === "address") {
              }
          };
  
          const descend = function (inputs: Array<ParamType>, values: ReadonlyArray<any>) {
              if (inputs.length !== values.length) { throw new Error("length mismatch"); }
              
          };
  
          const result: Array<any> = [ ];
          values.forEach((value, index) => {
              if (value == null) {
                  topics.push(null);
              } else if (param.baseType === "array" || param.baseType === "tuple") {
                  logger.throwArgumentError("filtering with tuples or arrays not supported", ("contract." + param.name), value);
              } else if (Array.isArray(value)) {
                  topics.push(value.map((value) => encodeTopic(param, value)));
              } else {
                  topics.push(encodeTopic(param, value));
              }
          });
      }
  */
  // Create the filter for the event with search criteria (e.g. for eth_filterLog)
  encodeFilterTopics(e, t) {
    if (typeof e == "string") {
      const i = this.getEvent(e);
      b(i, "unknown event", "eventFragment", e), e = i;
    }
    A(t.length <= e.inputs.length, `too many arguments for ${e.format()}`, "UNEXPECTED_ARGUMENT", { count: t.length, expectedCount: e.inputs.length });
    const n = [];
    e.anonymous || n.push(e.topicHash);
    const s = (i, a) => i.type === "string" ? jt(a) : i.type === "bytes" ? z(N(a)) : (i.type === "bool" && typeof a == "boolean" ? a = a ? "0x01" : "0x00" : i.type.match(/^u?int/) ? a = zt(a) : i.type.match(/^bytes/) ? a = Bu(a, 32) : i.type === "address" && l(this, le).encode(["address"], [a]), ir(N(a), 32));
    for (t.forEach((i, a) => {
      const c = e.inputs[a];
      if (!c.indexed) {
        b(i == null, "cannot filter non-indexed parameters; must be null", "contract." + c.name, i);
        return;
      }
      i == null ? n.push(null) : c.baseType === "array" || c.baseType === "tuple" ? b(!1, "filtering with tuples or arrays not supported", "contract." + c.name, i) : Array.isArray(i) ? n.push(i.map((o) => s(c, o))) : n.push(s(c, i));
    }); n.length && n[n.length - 1] === null; )
      n.pop();
    return n;
  }
  encodeEventLog(e, t) {
    if (typeof e == "string") {
      const a = this.getEvent(e);
      b(a, "unknown event", "eventFragment", e), e = a;
    }
    const n = [], s = [], i = [];
    return e.anonymous || n.push(e.topicHash), b(t.length === e.inputs.length, "event arguments/values mismatch", "values", t), e.inputs.forEach((a, c) => {
      const o = t[c];
      if (a.indexed)
        if (a.type === "string")
          n.push(jt(o));
        else if (a.type === "bytes")
          n.push(z(o));
        else {
          if (a.baseType === "tuple" || a.baseType === "array")
            throw new Error("not implemented");
          n.push(l(this, le).encode([a.type], [o]));
        }
      else
        s.push(a), i.push(o);
    }), {
      data: l(this, le).encode(s, i),
      topics: n
    };
  }
  // Decode a filter for the event and the search criteria
  decodeEventLog(e, t, n) {
    if (typeof e == "string") {
      const p = this.getEvent(e);
      b(p, "unknown event", "eventFragment", e), e = p;
    }
    if (n != null && !e.anonymous) {
      const p = e.topicHash;
      b(q(n[0], 32) && n[0].toLowerCase() === p, "fragment/topic mismatch", "topics[0]", n[0]), n = n.slice(1);
    }
    const s = [], i = [], a = [];
    e.inputs.forEach((p, m) => {
      p.indexed ? p.type === "string" || p.type === "bytes" || p.baseType === "tuple" || p.baseType === "array" ? (s.push(oe.from({ type: "bytes32", name: p.name })), a.push(!0)) : (s.push(p), a.push(!1)) : (i.push(p), a.push(!1));
    });
    const c = n != null ? l(this, le).decode(s, _(n)) : null, o = l(this, le).decode(i, t, !0), f = [], u = [];
    let d = 0, h = 0;
    return e.inputs.forEach((p, m) => {
      let w = null;
      if (p.indexed)
        if (c == null)
          w = new G0(null);
        else if (a[m])
          w = new G0(c[h++]);
        else
          try {
            w = c[h++];
          } catch (E) {
            w = E;
          }
      else
        try {
          w = o[d++];
        } catch (E) {
          w = E;
        }
      f.push(w), u.push(p.name || null);
    }), wa.fromItems(f, u);
  }
  /**
   *  Parses a transaction, finding the matching function and extracts
   *  the parameter values along with other useful function details.
   *
   *  If the matching function cannot be found, return null.
   */
  parseTransaction(e) {
    const t = O(e.data, "tx.data"), n = S(e.value != null ? e.value : 0, "tx.value"), s = this.getFunction(N(t.slice(0, 4)));
    if (!s)
      return null;
    const i = l(this, le).decode(s.inputs, t.slice(4));
    return new Ab(s, s.selector, i, n);
  }
  parseCallResult(e) {
    throw new Error("@TODO");
  }
  /**
   *  Parses a receipt log, finding the matching event and extracts
   *  the parameter values along with other useful event details.
   *
   *  If the matching event cannot be found, returns null.
   */
  parseLog(e) {
    const t = this.getEvent(e.topics[0]);
    return !t || t.anonymous ? null : new wb(t, t.topicHash, this.decodeEventLog(t, e.data, e.topics));
  }
  /**
   *  Parses a revert data, finding the matching error and extracts
   *  the parameter values along with other useful error details.
   *
   *  If the matching event cannot be found, returns null.
   */
  parseError(e) {
    const t = N(e), n = this.getError(W(t, 0, 4));
    if (!n)
      return null;
    const s = l(this, le).decode(n.inputs, W(t, 4));
    return new Eb(n, n.selector, s);
  }
  /**
   *  Creates a new [[Interface]] from the ABI %%value%%.
   *
   *  The %%value%% may be provided as an existing [[Interface]] object,
   *  a JSON-encoded ABI or any Human-Readable ABI format.
   */
  static from(e) {
    return e instanceof Pr ? e : typeof e == "string" ? new Pr(JSON.parse(e)) : typeof e.format == "function" ? new Pr(e.format("json")) : new Pr(e);
  }
};
xt = new WeakMap(), bt = new WeakMap(), pt = new WeakMap(), le = new WeakMap(), ts = new WeakSet(), da = function(e, t, n) {
  if (q(e)) {
    const i = e.toLowerCase();
    for (const a of l(this, pt).values())
      if (i === a.selector)
        return a;
    return null;
  }
  if (e.indexOf("(") === -1) {
    const i = [];
    for (const [a, c] of l(this, pt))
      a.split(
        "("
        /* fix:) */
      )[0] === e && i.push(c);
    if (t) {
      const a = t.length > 0 ? t[t.length - 1] : null;
      let c = t.length, o = !0;
      ge.isTyped(a) && a.type === "overrides" && (o = !1, c--);
      for (let f = i.length - 1; f >= 0; f--) {
        const u = i[f].inputs.length;
        u !== c && (!o || u !== c - 1) && i.splice(f, 1);
      }
      for (let f = i.length - 1; f >= 0; f--) {
        const u = i[f].inputs;
        for (let d = 0; d < t.length; d++)
          if (ge.isTyped(t[d])) {
            if (d >= u.length) {
              if (t[d].type === "overrides")
                continue;
              i.splice(f, 1);
              break;
            }
            if (t[d].type !== u[d].baseType) {
              i.splice(f, 1);
              break;
            }
          }
      }
    }
    if (i.length === 1 && t && t.length !== i[0].inputs.length) {
      const a = t[t.length - 1];
      (a == null || Array.isArray(a) || typeof a != "object") && i.splice(0, 1);
    }
    if (i.length === 0)
      return null;
    if (i.length > 1 && n) {
      const a = i.map((c) => JSON.stringify(c.format())).join(", ");
      b(!1, `ambiguous function description (i.e. matches ${a})`, "key", e);
    }
    return i[0];
  }
  const s = l(this, pt).get(At.from(e).format());
  return s || null;
}, ns = new WeakSet(), ha = function(e, t, n) {
  if (q(e)) {
    const i = e.toLowerCase();
    for (const a of l(this, bt).values())
      if (i === a.topicHash)
        return a;
    return null;
  }
  if (e.indexOf("(") === -1) {
    const i = [];
    for (const [a, c] of l(this, bt))
      a.split(
        "("
        /* fix:) */
      )[0] === e && i.push(c);
    if (t) {
      for (let a = i.length - 1; a >= 0; a--)
        i[a].inputs.length < t.length && i.splice(a, 1);
      for (let a = i.length - 1; a >= 0; a--) {
        const c = i[a].inputs;
        for (let o = 0; o < t.length; o++)
          if (ge.isTyped(t[o]) && t[o].type !== c[o].baseType) {
            i.splice(a, 1);
            break;
          }
      }
    }
    if (i.length === 0)
      return null;
    if (i.length > 1 && n) {
      const a = i.map((c) => JSON.stringify(c.format())).join(", ");
      b(!1, `ambiguous event description (i.e. matches ${a})`, "key", e);
    }
    return i[0];
  }
  const s = l(this, bt).get(wt.from(e).format());
  return s || null;
};
let Mc = Pr;
const Zl = BigInt(0);
function Ys(r) {
  return r ?? null;
}
function xe(r) {
  return r == null ? null : r.toString();
}
class V0 {
  /**
   *  Creates a new FeeData for %%gasPrice%%, %%maxFeePerGas%% and
   *  %%maxPriorityFeePerGas%%.
   */
  constructor(e, t, n) {
    /**
     *  The gas price for legacy networks.
     */
    g(this, "gasPrice");
    /**
     *  The maximum fee to pay per gas.
     *
     *  The base fee per gas is defined by the network and based on
     *  congestion, increasing the cost during times of heavy load
     *  and lowering when less busy.
     *
     *  The actual fee per gas will be the base fee for the block
     *  and the priority fee, up to the max fee per gas.
     *
     *  This will be ``null`` on legacy networks (i.e. [pre-EIP-1559](link-eip-1559))
     */
    g(this, "maxFeePerGas");
    /**
     *  The additional amout to pay per gas to encourage a validator
     *  to include the transaction.
     *
     *  The purpose of this is to compensate the validator for the
     *  adjusted risk for including a given transaction.
     *
     *  This will be ``null`` on legacy networks (i.e. [pre-EIP-1559](link-eip-1559))
     */
    g(this, "maxPriorityFeePerGas");
    T(this, {
      gasPrice: Ys(e),
      maxFeePerGas: Ys(t),
      maxPriorityFeePerGas: Ys(n)
    });
  }
  /**
   *  Returns a JSON-friendly value.
   */
  toJSON() {
    const { gasPrice: e, maxFeePerGas: t, maxPriorityFeePerGas: n } = this;
    return {
      _type: "FeeData",
      gasPrice: xe(e),
      maxFeePerGas: xe(t),
      maxPriorityFeePerGas: xe(n)
    };
  }
}
function Ta(r) {
  const e = {};
  r.to && (e.to = r.to), r.from && (e.from = r.from), r.data && (e.data = N(r.data));
  const t = "chainId,gasLimit,gasPrice,maxFeePerGas,maxPriorityFeePerGas,value".split(/,/);
  for (const s of t)
    !(s in r) || r[s] == null || (e[s] = S(r[s], `request.${s}`));
  const n = "type,nonce".split(/,/);
  for (const s of n)
    !(s in r) || r[s] == null || (e[s] = L(r[s], `request.${s}`));
  return r.accessList && (e.accessList = hr(r.accessList)), "blockTag" in r && (e.blockTag = r.blockTag), "enableCcipRead" in r && (e.enableCcipRead = !!r.enableCcipRead), "customData" in r && (e.customData = r.customData), e;
}
var Lt;
class Cb {
  /**
   *  Create a new **Block** object.
   *
   *  This should generally not be necessary as the unless implementing a
   *  low-level library.
   */
  constructor(e, t) {
    /**
     *  The provider connected to the block used to fetch additional details
     *  if necessary.
     */
    g(this, "provider");
    /**
     *  The block number, sometimes called the block height. This is a
     *  sequential number that is one higher than the parent block.
     */
    g(this, "number");
    /**
     *  The block hash.
     *
     *  This hash includes all properties, so can be safely used to identify
     *  an exact set of block properties.
     */
    g(this, "hash");
    /**
     *  The timestamp for this block, which is the number of seconds since
     *  epoch that this block was included.
     */
    g(this, "timestamp");
    /**
     *  The block hash of the parent block.
     */
    g(this, "parentHash");
    /**
     *  The nonce.
     *
     *  On legacy networks, this is the random number inserted which
     *  permitted the difficulty target to be reached.
     */
    g(this, "nonce");
    /**
     *  The difficulty target.
     *
     *  On legacy networks, this is the proof-of-work target required
     *  for a block to meet the protocol rules to be included.
     *
     *  On modern networks, this is a random number arrived at using
     *  randao.  @TODO: Find links?
     */
    g(this, "difficulty");
    /**
     *  The total gas limit for this block.
     */
    g(this, "gasLimit");
    /**
     *  The total gas used in this block.
     */
    g(this, "gasUsed");
    /**
     *  The miner coinbase address, wihch receives any subsidies for
     *  including this block.
     */
    g(this, "miner");
    /**
     *  Any extra data the validator wished to include.
     */
    g(this, "extraData");
    /**
     *  The base fee per gas that all transactions in this block were
     *  charged.
     *
     *  This adjusts after each block, depending on how congested the network
     *  is.
     */
    g(this, "baseFeePerGas");
    y(this, Lt, void 0);
    x(this, Lt, e.transactions.map((n) => typeof n != "string" ? new hi(n, t) : n)), T(this, {
      provider: t,
      hash: Ys(e.hash),
      number: e.number,
      timestamp: e.timestamp,
      parentHash: e.parentHash,
      nonce: e.nonce,
      difficulty: e.difficulty,
      gasLimit: e.gasLimit,
      gasUsed: e.gasUsed,
      miner: e.miner,
      extraData: e.extraData,
      baseFeePerGas: Ys(e.baseFeePerGas)
    });
  }
  /**
   *  Returns the list of transaction hashes.
   */
  get transactions() {
    return l(this, Lt).map((e) => typeof e == "string" ? e : e.hash);
  }
  /**
   *  Returns the complete transactions for blocks which
   *  prefetched them, by passing ``true`` to %%prefetchTxs%%
   *  into [[Provider-getBlock]].
   */
  get prefetchedTransactions() {
    const e = l(this, Lt).slice();
    return e.length === 0 ? [] : (A(typeof e[0] == "object", "transactions were not prefetched with block request", "UNSUPPORTED_OPERATION", {
      operation: "transactionResponses()"
    }), e);
  }
  /**
   *  Returns a JSON-friendly value.
   */
  toJSON() {
    const { baseFeePerGas: e, difficulty: t, extraData: n, gasLimit: s, gasUsed: i, hash: a, miner: c, nonce: o, number: f, parentHash: u, timestamp: d, transactions: h } = this;
    return {
      _type: "Block",
      baseFeePerGas: xe(e),
      difficulty: xe(t),
      extraData: n,
      gasLimit: xe(s),
      gasUsed: xe(i),
      hash: a,
      miner: c,
      nonce: o,
      number: f,
      parentHash: u,
      timestamp: d,
      transactions: h
    };
  }
  [Symbol.iterator]() {
    let e = 0;
    const t = this.transactions;
    return {
      next: () => e < this.length ? {
        value: t[e++],
        done: !1
      } : { value: void 0, done: !0 }
    };
  }
  /**
   *  The number of transactions in this block.
   */
  get length() {
    return l(this, Lt).length;
  }
  /**
   *  The [[link-js-date]] this block was included at.
   */
  get date() {
    return this.timestamp == null ? null : new Date(this.timestamp * 1e3);
  }
  /**
   *  Get the transaction at %%indexe%% within this block.
   */
  async getTransaction(e) {
    let t;
    if (typeof e == "number")
      t = l(this, Lt)[e];
    else {
      const n = e.toLowerCase();
      for (const s of l(this, Lt))
        if (typeof s == "string") {
          if (s !== n)
            continue;
          t = s;
          break;
        } else {
          if (s.hash === n)
            continue;
          t = s;
          break;
        }
    }
    if (t == null)
      throw new Error("no such tx");
    return typeof t == "string" ? await this.provider.getTransaction(t) : t;
  }
  /**
   *  If a **Block** was fetched with a request to include the transactions
   *  this will allow synchronous access to those transactions.
   *
   *  If the transactions were not prefetched, this will throw.
   */
  getPrefetchedTransaction(e) {
    const t = this.prefetchedTransactions;
    if (typeof e == "number")
      return t[e];
    e = e.toLowerCase();
    for (const n of t)
      if (n.hash === e)
        return n;
    b(!1, "no matching transaction", "indexOrHash", e);
  }
  /**
   *  Returns true if this block been mined. This provides a type guard
   *  for all properties on a [[MinedBlock]].
   */
  isMined() {
    return !!this.hash;
  }
  /**
   *  Returns true if this block is an [[link-eip-2930]] block.
   */
  isLondon() {
    return !!this.baseFeePerGas;
  }
  /**
   *  @_ignore:
   */
  orphanedEvent() {
    if (!this.isMined())
      throw new Error("");
    return Pb(this);
  }
}
Lt = new WeakMap();
class Gi {
  /**
   *  @_ignore:
   */
  constructor(e, t) {
    /**
     *  The provider connected to the log used to fetch additional details
     *  if necessary.
     */
    g(this, "provider");
    /**
     *  The transaction hash of the transaction this log occurred in. Use the
     *  [[Log-getTransaction]] to get the [[TransactionResponse]].
     */
    g(this, "transactionHash");
    /**
     *  The block hash of the block this log occurred in. Use the
     *  [[Log-getBlock]] to get the [[Block]].
     */
    g(this, "blockHash");
    /**
     *  The block number of the block this log occurred in. It is preferred
     *  to use the [[Block-hash]] when fetching the related [[Block]],
     *  since in the case of an orphaned block, the block at that height may
     *  have changed.
     */
    g(this, "blockNumber");
    /**
     *  If the **Log** represents a block that was removed due to an orphaned
     *  block, this will be true.
     *
     *  This can only happen within an orphan event listener.
     */
    g(this, "removed");
    /**
     *  The address of the contract that emitted this log.
     */
    g(this, "address");
    /**
     *  The data included in this log when it was emitted.
     */
    g(this, "data");
    /**
     *  The indexed topics included in this log when it was emitted.
     *
     *  All topics are included in the bloom filters, so they can be
     *  efficiently filtered using the [[Provider-getLogs]] method.
     */
    g(this, "topics");
    /**
     *  The index within the block this log occurred at. This is generally
     *  not useful to developers, but can be used with the various roots
     *  to proof inclusion within a block.
     */
    g(this, "index");
    /**
     *  The index within the transaction of this log.
     */
    g(this, "transactionIndex");
    this.provider = t;
    const n = Object.freeze(e.topics.slice());
    T(this, {
      transactionHash: e.transactionHash,
      blockHash: e.blockHash,
      blockNumber: e.blockNumber,
      removed: e.removed,
      address: e.address,
      data: e.data,
      topics: n,
      index: e.index,
      transactionIndex: e.transactionIndex
    });
  }
  /**
   *  Returns a JSON-compatible object.
   */
  toJSON() {
    const { address: e, blockHash: t, blockNumber: n, data: s, index: i, removed: a, topics: c, transactionHash: o, transactionIndex: f } = this;
    return {
      _type: "log",
      address: e,
      blockHash: t,
      blockNumber: n,
      data: s,
      index: i,
      removed: a,
      topics: c,
      transactionHash: o,
      transactionIndex: f
    };
  }
  /**
   *  Returns the block that this log occurred in.
   */
  async getBlock() {
    const e = await this.provider.getBlock(this.blockHash);
    return A(!!e, "failed to find transaction", "UNKNOWN_ERROR", {}), e;
  }
  /**
   *  Returns the transaction that this log occurred in.
   */
  async getTransaction() {
    const e = await this.provider.getTransaction(this.transactionHash);
    return A(!!e, "failed to find transaction", "UNKNOWN_ERROR", {}), e;
  }
  /**
   *  Returns the transaction receipt fot the transaction that this
   *  log occurred in.
   */
  async getTransactionReceipt() {
    const e = await this.provider.getTransactionReceipt(this.transactionHash);
    return A(!!e, "failed to find transaction receipt", "UNKNOWN_ERROR", {}), e;
  }
  /**
   *  @_ignore:
   */
  removedEvent() {
    return Nb(this);
  }
}
var wi;
class Xl {
  /**
   *  @_ignore:
   */
  constructor(e, t) {
    /**
     *  The provider connected to the log used to fetch additional details
     *  if necessary.
     */
    g(this, "provider");
    /**
     *  The address the transaction was send to.
     */
    g(this, "to");
    /**
     *  The sender of the transaction.
     */
    g(this, "from");
    /**
     *  The address of the contract if the transaction was directly
     *  responsible for deploying one.
     *
     *  This is non-null **only** if the ``to`` is empty and the ``data``
     *  was successfully executed as initcode.
     */
    g(this, "contractAddress");
    /**
     *  The transaction hash.
     */
    g(this, "hash");
    /**
     *  The index of this transaction within the block transactions.
     */
    g(this, "index");
    /**
     *  The block hash of the [[Block]] this transaction was included in.
     */
    g(this, "blockHash");
    /**
     *  The block number of the [[Block]] this transaction was included in.
     */
    g(this, "blockNumber");
    /**
     *  The bloom filter bytes that represent all logs that occurred within
     *  this transaction. This is generally not useful for most developers,
     *  but can be used to validate the included logs.
     */
    g(this, "logsBloom");
    /**
     *  The actual amount of gas used by this transaction.
     *
     *  When creating a transaction, the amount of gas that will be used can
     *  only be approximated, but the sender must pay the gas fee for the
     *  entire gas limit. After the transaction, the difference is refunded.
     */
    g(this, "gasUsed");
    /**
     *  The amount of gas used by all transactions within the block for this
     *  and all transactions with a lower ``index``.
     *
     *  This is generally not useful for developers but can be used to
     *  validate certain aspects of execution.
     */
    g(this, "cumulativeGasUsed");
    /**
     *  The actual gas price used during execution.
     *
     *  Due to the complexity of [[link-eip-1559]] this value can only
     *  be caluclated after the transaction has been mined, snce the base
     *  fee is protocol-enforced.
     */
    g(this, "gasPrice");
    /**
     *  The [[link-eip-2718]] transaction type.
     */
    g(this, "type");
    //readonly byzantium!: boolean;
    /**
     *  The status of this transaction, indicating success (i.e. ``1``) or
     *  a revert (i.e. ``0``).
     *
     *  This is available in post-byzantium blocks, but some backends may
     *  backfill this value.
     */
    g(this, "status");
    /**
     *  The root hash of this transaction.
     *
     *  This is no present and was only included in pre-byzantium blocks, but
     *  could be used to validate certain parts of the receipt.
     */
    g(this, "root");
    y(this, wi, void 0);
    x(this, wi, Object.freeze(e.logs.map((s) => new Gi(s, t))));
    let n = Zl;
    e.effectiveGasPrice != null ? n = e.effectiveGasPrice : e.gasPrice != null && (n = e.gasPrice), T(this, {
      provider: t,
      to: e.to,
      from: e.from,
      contractAddress: e.contractAddress,
      hash: e.hash,
      index: e.index,
      blockHash: e.blockHash,
      blockNumber: e.blockNumber,
      logsBloom: e.logsBloom,
      gasUsed: e.gasUsed,
      cumulativeGasUsed: e.cumulativeGasUsed,
      gasPrice: n,
      type: e.type,
      //byzantium: tx.byzantium,
      status: e.status,
      root: e.root
    });
  }
  /**
   *  The logs for this transaction.
   */
  get logs() {
    return l(this, wi);
  }
  /**
   *  Returns a JSON-compatible representation.
   */
  toJSON() {
    const {
      to: e,
      from: t,
      contractAddress: n,
      hash: s,
      index: i,
      blockHash: a,
      blockNumber: c,
      logsBloom: o,
      logs: f,
      //byzantium, 
      status: u,
      root: d
    } = this;
    return {
      _type: "TransactionReceipt",
      blockHash: a,
      blockNumber: c,
      //byzantium, 
      contractAddress: n,
      cumulativeGasUsed: xe(this.cumulativeGasUsed),
      from: t,
      gasPrice: xe(this.gasPrice),
      gasUsed: xe(this.gasUsed),
      hash: s,
      index: i,
      logs: f,
      logsBloom: o,
      root: d,
      status: u,
      to: e
    };
  }
  /**
   *  @_ignore:
   */
  get length() {
    return this.logs.length;
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.length ? { value: this.logs[e++], done: !1 } : { value: void 0, done: !0 }
    };
  }
  /**
   *  The total fee for this transaction, in wei.
   */
  get fee() {
    return this.gasUsed * this.gasPrice;
  }
  /**
   *  Resolves to the block this transaction occurred in.
   */
  async getBlock() {
    const e = await this.provider.getBlock(this.blockHash);
    if (e == null)
      throw new Error("TODO");
    return e;
  }
  /**
   *  Resolves to the transaction this transaction occurred in.
   */
  async getTransaction() {
    const e = await this.provider.getTransaction(this.hash);
    if (e == null)
      throw new Error("TODO");
    return e;
  }
  /**
   *  Resolves to the return value of the execution of this transaction.
   *
   *  Support for this feature is limited, as it requires an archive node
   *  with the ``debug_`` or ``trace_`` API enabled.
   */
  async getResult() {
    return await this.provider.getTransactionResult(this.hash);
  }
  /**
   *  Resolves to the number of confirmations this transaction has.
   */
  async confirmations() {
    return await this.provider.getBlockNumber() - this.blockNumber + 1;
  }
  /**
   *  @_ignore:
   */
  removedEvent() {
    return ql(this);
  }
  /**
   *  @_ignore:
   */
  reorderedEvent(e) {
    return A(!e || e.isMined(), "unmined 'other' transction cannot be orphaned", "UNSUPPORTED_OPERATION", { operation: "reorderedEvent(other)" }), $l(this, e);
  }
}
wi = new WeakMap();
var an;
const So = class So {
  /**
   *  @_ignore:
   */
  constructor(e, t) {
    /**
     *  The provider this is connected to, which will influence how its
     *  methods will resolve its async inspection methods.
     */
    g(this, "provider");
    /**
     *  The block number of the block that this transaction was included in.
     *
     *  This is ``null`` for pending transactions.
     */
    g(this, "blockNumber");
    /**
     *  The blockHash of the block that this transaction was included in.
     *
     *  This is ``null`` for pending transactions.
     */
    g(this, "blockHash");
    /**
     *  The index within the block that this transaction resides at.
     */
    g(this, "index");
    /**
     *  The transaction hash.
     */
    g(this, "hash");
    /**
     *  The [[link-eip-2718]] transaction envelope type. This is
     *  ``0`` for legacy transactions types.
     */
    g(this, "type");
    /**
     *  The receiver of this transaction.
     *
     *  If ``null``, then the transaction is an initcode transaction.
     *  This means the result of executing the [[data]] will be deployed
     *  as a new contract on chain (assuming it does not revert) and the
     *  address may be computed using [[getCreateAddress]].
     */
    g(this, "to");
    /**
     *  The sender of this transaction. It is implicitly computed
     *  from the transaction pre-image hash (as the digest) and the
     *  [[signature]] using ecrecover.
     */
    g(this, "from");
    /**
     *  The nonce, which is used to prevent replay attacks and offer
     *  a method to ensure transactions from a given sender are explicitly
     *  ordered.
     *
     *  When sending a transaction, this must be equal to the number of
     *  transactions ever sent by [[from]].
     */
    g(this, "nonce");
    /**
     *  The maximum units of gas this transaction can consume. If execution
     *  exceeds this, the entries transaction is reverted and the sender
     *  is charged for the full amount, despite not state changes being made.
     */
    g(this, "gasLimit");
    /**
     *  The gas price can have various values, depending on the network.
     *
     *  In modern networks, for transactions that are included this is
     *  the //effective gas price// (the fee per gas that was actually
     *  charged), while for transactions that have not been included yet
     *  is the [[maxFeePerGas]].
     *
     *  For legacy transactions, or transactions on legacy networks, this
     *  is the fee that will be charged per unit of gas the transaction
     *  consumes.
     */
    g(this, "gasPrice");
    /**
     *  The maximum priority fee (per unit of gas) to allow a
     *  validator to charge the sender. This is inclusive of the
     *  [[maxFeeFeePerGas]].
     */
    g(this, "maxPriorityFeePerGas");
    /**
     *  The maximum fee (per unit of gas) to allow this transaction
     *  to charge the sender.
     */
    g(this, "maxFeePerGas");
    /**
     *  The data.
     */
    g(this, "data");
    /**
     *  The value, in wei. Use [[formatEther]] to format this value
     *  as ether.
     */
    g(this, "value");
    /**
     *  The chain ID.
     */
    g(this, "chainId");
    /**
     *  The signature.
     */
    g(this, "signature");
    /**
     *  The [[link-eip-2930]] access list for transaction types that
     *  support it, otherwise ``null``.
     */
    g(this, "accessList");
    y(this, an, void 0);
    this.provider = t, this.blockNumber = e.blockNumber != null ? e.blockNumber : null, this.blockHash = e.blockHash != null ? e.blockHash : null, this.hash = e.hash, this.index = e.index, this.type = e.type, this.from = e.from, this.to = e.to || null, this.gasLimit = e.gasLimit, this.nonce = e.nonce, this.data = e.data, this.value = e.value, this.gasPrice = e.gasPrice, this.maxPriorityFeePerGas = e.maxPriorityFeePerGas != null ? e.maxPriorityFeePerGas : null, this.maxFeePerGas = e.maxFeePerGas != null ? e.maxFeePerGas : null, this.chainId = e.chainId, this.signature = e.signature, this.accessList = e.accessList != null ? e.accessList : null, x(this, an, -1);
  }
  /**
   *  Returns a JSON-compatible representation of this transaction.
   */
  toJSON() {
    const { blockNumber: e, blockHash: t, index: n, hash: s, type: i, to: a, from: c, nonce: o, data: f, signature: u, accessList: d } = this;
    return {
      _type: "TransactionReceipt",
      accessList: d,
      blockNumber: e,
      blockHash: t,
      chainId: xe(this.chainId),
      data: f,
      from: c,
      gasLimit: xe(this.gasLimit),
      gasPrice: xe(this.gasPrice),
      hash: s,
      maxFeePerGas: xe(this.maxFeePerGas),
      maxPriorityFeePerGas: xe(this.maxPriorityFeePerGas),
      nonce: o,
      signature: u,
      to: a,
      index: n,
      type: i,
      value: xe(this.value)
    };
  }
  /**
   *  Resolves to the Block that this transaction was included in.
   *
   *  This will return null if the transaction has not been included yet.
   */
  async getBlock() {
    let e = this.blockNumber;
    if (e == null) {
      const n = await this.getTransaction();
      n && (e = n.blockNumber);
    }
    if (e == null)
      return null;
    const t = this.provider.getBlock(e);
    if (t == null)
      throw new Error("TODO");
    return t;
  }
  /**
   *  Resolves to this transaction being re-requested from the
   *  provider. This can be used if you have an unmined transaction
   *  and wish to get an up-to-date populated instance.
   */
  async getTransaction() {
    return this.provider.getTransaction(this.hash);
  }
  /**
   *  Resolve to the number of confirmations this transaction has.
   */
  async confirmations() {
    if (this.blockNumber == null) {
      const { tx: t, blockNumber: n } = await he({
        tx: this.getTransaction(),
        blockNumber: this.provider.getBlockNumber()
      });
      return t == null || t.blockNumber == null ? 0 : n - t.blockNumber + 1;
    }
    return await this.provider.getBlockNumber() - this.blockNumber + 1;
  }
  /**
   *  Resolves once this transaction has been mined and has
   *  %%confirms%% blocks including it (default: ``1``) with an
   *  optional %%timeout%%.
   *
   *  This can resolve to ``null`` only if %%confirms%% is ``0``
   *  and the transaction has not been mined, otherwise this will
   *  wait until enough confirmations have completed.
   */
  async wait(e, t) {
    const n = e ?? 1, s = t ?? 0;
    let i = l(this, an), a = -1, c = i === -1;
    const o = async () => {
      if (c)
        return null;
      const { blockNumber: h, nonce: p } = await he({
        blockNumber: this.provider.getBlockNumber(),
        nonce: this.provider.getTransactionCount(this.from)
      });
      if (p < this.nonce) {
        i = h;
        return;
      }
      if (c)
        return null;
      const m = await this.getTransaction();
      if (!(m && m.blockNumber != null))
        for (a === -1 && (a = i - 3, a < l(this, an) && (a = l(this, an))); a <= h; ) {
          if (c)
            return null;
          const w = await this.provider.getBlock(a, !0);
          if (w == null)
            return;
          for (const E of w)
            if (E === this.hash)
              return;
          for (let E = 0; E < w.length; E++) {
            const C = await w.getTransaction(E);
            if (C.from === this.from && C.nonce === this.nonce) {
              if (c)
                return null;
              const B = await this.provider.getTransactionReceipt(C.hash);
              if (B == null || h - B.blockNumber + 1 < n)
                return;
              let I = "replaced";
              C.data === this.data && C.to === this.to && C.value === this.value ? I = "repriced" : C.data === "0x" && C.from === C.to && C.value === Zl && (I = "cancelled"), A(!1, "transaction was replaced", "TRANSACTION_REPLACED", {
                cancelled: I === "replaced" || I === "cancelled",
                reason: I,
                replacement: C.replaceableTransaction(i),
                hash: C.hash,
                receipt: B
              });
            }
          }
          a++;
        }
    }, f = (h) => {
      if (h == null || h.status !== 0)
        return h;
      A(!1, "transaction execution reverted", "CALL_EXCEPTION", {
        action: "sendTransaction",
        data: null,
        reason: null,
        invocation: null,
        revert: null,
        transaction: {
          to: h.to,
          from: h.from,
          data: ""
          // @TODO: in v7, split out sendTransaction properties
        },
        receipt: h
      });
    }, u = await this.provider.getTransactionReceipt(this.hash);
    if (n === 0)
      return f(u);
    if (u) {
      if (await u.confirmations() >= n)
        return f(u);
    } else if (await o(), n === 0)
      return null;
    return await new Promise((h, p) => {
      const m = [], w = () => {
        m.forEach((C) => C());
      };
      if (m.push(() => {
        c = !0;
      }), s > 0) {
        const C = setTimeout(() => {
          w(), p(ne("wait for transaction timeout", "TIMEOUT"));
        }, s);
        m.push(() => {
          clearTimeout(C);
        });
      }
      const E = async (C) => {
        if (await C.confirmations() >= n) {
          w();
          try {
            h(f(C));
          } catch (B) {
            p(B);
          }
        }
      };
      if (m.push(() => {
        this.provider.off(this.hash, E);
      }), this.provider.on(this.hash, E), i >= 0) {
        const C = async () => {
          try {
            await o();
          } catch (B) {
            if (je(B, "TRANSACTION_REPLACED")) {
              w(), p(B);
              return;
            }
          }
          c || this.provider.once("block", C);
        };
        m.push(() => {
          this.provider.off("block", C);
        }), this.provider.once("block", C);
      }
    });
  }
  /**
   *  Returns ``true`` if this transaction has been included.
   *
   *  This is effective only as of the time the TransactionResponse
   *  was instantiated. To get up-to-date information, use
   *  [[getTransaction]].
   *
   *  This provides a Type Guard that this transaction will have
   *  non-null property values for properties that are null for
   *  unmined transactions.
   */
  isMined() {
    return this.blockHash != null;
  }
  /**
   *  Returns true if the transaction is a legacy (i.e. ``type == 0``)
   *  transaction.
   *
   *  This provides a Type Guard that this transaction will have
   *  the ``null``-ness for hardfork-specific properties set correctly.
   */
  isLegacy() {
    return this.type === 0;
  }
  /**
   *  Returns true if the transaction is a Berlin (i.e. ``type == 1``)
   *  transaction. See [[link-eip-2070]].
   *
   *  This provides a Type Guard that this transaction will have
   *  the ``null``-ness for hardfork-specific properties set correctly.
   */
  isBerlin() {
    return this.type === 1;
  }
  /**
   *  Returns true if the transaction is a London (i.e. ``type == 2``)
   *  transaction. See [[link-eip-1559]].
   *
   *  This provides a Type Guard that this transaction will have
   *  the ``null``-ness for hardfork-specific properties set correctly.
   */
  isLondon() {
    return this.type === 2;
  }
  /**
   *  Returns a filter which can be used to listen for orphan events
   *  that evict this transaction.
   */
  removedEvent() {
    return A(this.isMined(), "unmined transaction canot be orphaned", "UNSUPPORTED_OPERATION", { operation: "removeEvent()" }), ql(this);
  }
  /**
   *  Returns a filter which can be used to listen for orphan events
   *  that re-order this event against %%other%%.
   */
  reorderedEvent(e) {
    return A(this.isMined(), "unmined transaction canot be orphaned", "UNSUPPORTED_OPERATION", { operation: "removeEvent()" }), A(!e || e.isMined(), "unmined 'other' transaction canot be orphaned", "UNSUPPORTED_OPERATION", { operation: "removeEvent()" }), $l(this, e);
  }
  /**
   *  Returns a new TransactionResponse instance which has the ability to
   *  detect (and throw an error) if the transaction is replaced, which
   *  will begin scanning at %%startBlock%%.
   *
   *  This should generally not be used by developers and is intended
   *  primarily for internal use. Setting an incorrect %%startBlock%% can
   *  have devastating performance consequences if used incorrectly.
   */
  replaceableTransaction(e) {
    b(Number.isInteger(e) && e >= 0, "invalid startBlock", "startBlock", e);
    const t = new So(this, this.provider);
    return x(t, an, e), t;
  }
};
an = new WeakMap();
let hi = So;
function Pb(r) {
  return { orphan: "drop-block", hash: r.hash, number: r.number };
}
function $l(r, e) {
  return { orphan: "reorder-transaction", tx: r, other: e };
}
function ql(r) {
  return { orphan: "drop-transaction", tx: r };
}
function Nb(r) {
  return { orphan: "drop-log", log: {
    transactionHash: r.transactionHash,
    blockHash: r.blockHash,
    blockNumber: r.blockNumber,
    address: r.address,
    data: r.data,
    topics: Object.freeze(r.topics.slice()),
    index: r.index
  } };
}
class wo extends Gi {
  /**
   * @_ignore:
   */
  constructor(t, n, s) {
    super(t, t.provider);
    /**
     *  The Contract Interface.
     */
    g(this, "interface");
    /**
     *  The matching event.
     */
    g(this, "fragment");
    /**
     *  The parsed arguments passed to the event by ``emit``.
     */
    g(this, "args");
    const i = n.decodeEventLog(s, t.data, t.topics);
    T(this, { args: i, fragment: s, interface: n });
  }
  /**
   *  The name of the event.
   */
  get eventName() {
    return this.fragment.name;
  }
  /**
   *  The signature of the event.
   */
  get eventSignature() {
    return this.fragment.format();
  }
}
class eu extends Gi {
  /**
   * @_ignore:
   */
  constructor(t, n) {
    super(t, t.provider);
    /**
     *  The error encounted when trying to decode the log.
     */
    g(this, "error");
    T(this, { error: n });
  }
}
var rs;
class Ib extends Xl {
  /**
   *  @_ignore:
   */
  constructor(t, n, s) {
    super(s, n);
    y(this, rs, void 0);
    x(this, rs, t);
  }
  /**
   *  The parsed logs for any [[Log]] which has a matching event in the
   *  Contract ABI.
   */
  get logs() {
    return super.logs.map((t) => {
      const n = t.topics.length ? l(this, rs).getEvent(t.topics[0]) : null;
      if (n)
        try {
          return new wo(t, l(this, rs), n);
        } catch (s) {
          return new eu(t, s);
        }
      return t;
    });
  }
}
rs = new WeakMap();
var Ai;
class Ao extends hi {
  /**
   *  @_ignore:
   */
  constructor(t, n, s) {
    super(s, n);
    y(this, Ai, void 0);
    x(this, Ai, t);
  }
  /**
   *  Resolves once this transaction has been mined and has
   *  %%confirms%% blocks including it (default: ``1``) with an
   *  optional %%timeout%%.
   *
   *  This can resolve to ``null`` only if %%confirms%% is ``0``
   *  and the transaction has not been mined, otherwise this will
   *  wait until enough confirmations have completed.
   */
  async wait(t) {
    const n = await super.wait(t);
    return n == null ? null : new Ib(l(this, Ai), this.provider, n);
  }
}
Ai = new WeakMap();
class tu extends pf {
  /**
   *  @_event:
   */
  constructor(t, n, s, i) {
    super(t, n, s);
    /**
     *  The log with no matching events.
     */
    g(this, "log");
    T(this, { log: i });
  }
  /**
   *  Resolves to the block the event occured in.
   */
  async getBlock() {
    return await this.log.getBlock();
  }
  /**
   *  Resolves to the transaction the event occured in.
   */
  async getTransaction() {
    return await this.log.getTransaction();
  }
  /**
   *  Resolves to the transaction receipt the event occured in.
   */
  async getTransactionReceipt() {
    return await this.log.getTransactionReceipt();
  }
}
class vb extends tu {
  /**
   *  @_ignore:
   */
  constructor(e, t, n, s, i) {
    super(e, t, n, new wo(i, e.interface, s));
    const a = e.interface.decodeEventLog(s, this.log.data, this.log.topics);
    T(this, { args: a, fragment: s });
  }
  /**
   *  The event name.
   */
  get eventName() {
    return this.fragment.name;
  }
  /**
   *  The event signature.
   */
  get eventSignature() {
    return this.fragment.format();
  }
}
const _0 = BigInt(0);
function nu(r) {
  return r && typeof r.call == "function";
}
function ru(r) {
  return r && typeof r.estimateGas == "function";
}
function Eo(r) {
  return r && typeof r.resolveName == "function";
}
function su(r) {
  return r && typeof r.sendTransaction == "function";
}
var Ei;
class kb {
  constructor(e, t, n) {
    y(this, Ei, void 0);
    g(this, "fragment");
    if (T(this, { fragment: t }), t.inputs.length < n.length)
      throw new Error("too many arguments");
    const s = fr(e.runner, "resolveName"), i = Eo(s) ? s : null;
    x(this, Ei, async function() {
      const a = await Promise.all(t.inputs.map((c, o) => n[o] == null ? null : c.walkAsync(n[o], (u, d) => u === "address" ? Array.isArray(d) ? Promise.all(d.map((h) => pe(h, i))) : pe(d, i) : d)));
      return e.interface.encodeFilterTopics(t, a);
    }());
  }
  getTopicFilter() {
    return l(this, Ei);
  }
}
Ei = new WeakMap();
function fr(r, e) {
  return r == null ? null : typeof r[e] == "function" ? r : r.provider && typeof r.provider[e] == "function" ? r.provider : null;
}
function Ln(r) {
  return r == null ? null : r.provider || null;
}
async function iu(r, e) {
  const t = ge.dereference(r, "overrides");
  b(typeof t == "object", "invalid overrides parameter", "overrides", r);
  const n = Ta(t);
  return b(n.to == null || (e || []).indexOf("to") >= 0, "cannot override to", "overrides.to", n.to), b(n.data == null || (e || []).indexOf("data") >= 0, "cannot override data", "overrides.data", n.data), n.from && (n.from = await pe(n.from)), n;
}
async function Ob(r, e, t) {
  const n = fr(r, "resolveName"), s = Eo(n) ? n : null;
  return await Promise.all(e.map((i, a) => i.walkAsync(t[a], (c, o) => (o = ge.dereference(o, c), c === "address" ? pe(o, s) : o))));
}
function Tb(r) {
  const e = async function(a) {
    const c = await iu(a, ["data"]);
    c.to = await r.getAddress();
    const o = r.interface, f = S(c.value || _0, "overrides.value") === _0, u = (c.data || "0x") === "0x";
    o.fallback && !o.fallback.payable && o.receive && !u && !f && b(!1, "cannot send data to receive or send value to non-payable fallback", "overrides", a), b(o.fallback || u, "cannot send data to receive-only contract", "overrides.data", c.data);
    const d = o.receive || o.fallback && o.fallback.payable;
    return b(d || f, "cannot send value to non-payable fallback", "overrides.value", c.value), b(o.fallback || u, "cannot send data to receive-only contract", "overrides.data", c.data), c;
  }, t = async function(a) {
    const c = fr(r.runner, "call");
    A(nu(c), "contract runner does not support calling", "UNSUPPORTED_OPERATION", { operation: "call" });
    const o = await e(a);
    try {
      return await c.call(o);
    } catch (f) {
      throw so(f) && f.data ? r.interface.makeError(f.data, o) : f;
    }
  }, n = async function(a) {
    const c = r.runner;
    A(su(c), "contract runner does not support sending transactions", "UNSUPPORTED_OPERATION", { operation: "sendTransaction" });
    const o = await c.sendTransaction(await e(a)), f = Ln(r.runner);
    return new Ao(r.interface, f, o);
  }, s = async function(a) {
    const c = fr(r.runner, "estimateGas");
    return A(ru(c), "contract runner does not support gas estimation", "UNSUPPORTED_OPERATION", { operation: "estimateGas" }), await c.estimateGas(await e(a));
  }, i = async (a) => await n(a);
  return T(i, {
    _contract: r,
    estimateGas: s,
    populateTransaction: e,
    send: n,
    staticCall: t
  }), i;
}
function Rb(r, e) {
  const t = function(...f) {
    const u = r.interface.getFunction(e, f);
    return A(u, "no matching fragment", "UNSUPPORTED_OPERATION", {
      operation: "fragment",
      info: { key: e, args: f }
    }), u;
  }, n = async function(...f) {
    const u = t(...f);
    let d = {};
    if (u.inputs.length + 1 === f.length && (d = await iu(f.pop())), u.inputs.length !== f.length)
      throw new Error("internal error: fragment inputs doesn't match arguments; should not happen");
    const h = await Ob(r.runner, u.inputs, f);
    return Object.assign({}, d, await he({
      to: r.getAddress(),
      data: r.interface.encodeFunctionData(u, h)
    }));
  }, s = async function(...f) {
    const u = await c(...f);
    return u.length === 1 ? u[0] : u;
  }, i = async function(...f) {
    const u = r.runner;
    A(su(u), "contract runner does not support sending transactions", "UNSUPPORTED_OPERATION", { operation: "sendTransaction" });
    const d = await u.sendTransaction(await n(...f)), h = Ln(r.runner);
    return new Ao(r.interface, h, d);
  }, a = async function(...f) {
    const u = fr(r.runner, "estimateGas");
    return A(ru(u), "contract runner does not support gas estimation", "UNSUPPORTED_OPERATION", { operation: "estimateGas" }), await u.estimateGas(await n(...f));
  }, c = async function(...f) {
    const u = fr(r.runner, "call");
    A(nu(u), "contract runner does not support calling", "UNSUPPORTED_OPERATION", { operation: "call" });
    const d = await n(...f);
    let h = "0x";
    try {
      h = await u.call(d);
    } catch (m) {
      throw so(m) && m.data ? r.interface.makeError(m.data, d) : m;
    }
    const p = t(...f);
    return r.interface.decodeFunctionResult(p, h);
  }, o = async (...f) => t(...f).constant ? await s(...f) : await i(...f);
  return T(o, {
    name: r.interface.getFunctionName(e),
    _contract: r,
    _key: e,
    getFragment: t,
    estimateGas: a,
    populateTransaction: n,
    send: i,
    staticCall: s,
    staticCallResult: c
  }), Object.defineProperty(o, "fragment", {
    configurable: !1,
    enumerable: !0,
    get: () => {
      const f = r.interface.getFunction(e);
      return A(f, "no matching fragment", "UNSUPPORTED_OPERATION", {
        operation: "fragment",
        info: { key: e }
      }), f;
    }
  }), o;
}
function Sb(r, e) {
  const t = function(...s) {
    const i = r.interface.getEvent(e, s);
    return A(i, "no matching fragment", "UNSUPPORTED_OPERATION", {
      operation: "fragment",
      info: { key: e, args: s }
    }), i;
  }, n = function(...s) {
    return new kb(r, t(...s), s);
  };
  return T(n, {
    name: r.interface.getEventName(e),
    _contract: r,
    _key: e,
    getFragment: t
  }), Object.defineProperty(n, "fragment", {
    configurable: !1,
    enumerable: !0,
    get: () => {
      const s = r.interface.getEvent(e);
      return A(s, "no matching fragment", "UNSUPPORTED_OPERATION", {
        operation: "fragment",
        info: { key: e }
      }), s;
    }
  }), n;
}
const Ra = Symbol.for("_ethersInternal_contract"), au = /* @__PURE__ */ new WeakMap();
function Bb(r, e) {
  au.set(r[Ra], e);
}
function Oe(r) {
  return au.get(r[Ra]);
}
function Ub(r) {
  return r && typeof r == "object" && "getTopicFilter" in r && typeof r.getTopicFilter == "function" && r.fragment;
}
async function Co(r, e) {
  let t, n = null;
  if (Array.isArray(e)) {
    const i = function(a) {
      if (q(a, 32))
        return a;
      const c = r.interface.getEvent(a);
      return b(c, "unknown fragment", "name", a), c.topicHash;
    };
    t = e.map((a) => a == null ? null : Array.isArray(a) ? a.map(i) : i(a));
  } else
    e === "*" ? t = [null] : typeof e == "string" ? q(e, 32) ? t = [e] : (n = r.interface.getEvent(e), b(n, "unknown fragment", "event", e), t = [n.topicHash]) : Ub(e) ? t = await e.getTopicFilter() : "fragment" in e ? (n = e.fragment, t = [n.topicHash]) : b(!1, "unknown event name", "event", e);
  t = t.map((i) => {
    if (i == null)
      return null;
    if (Array.isArray(i)) {
      const a = Array.from(new Set(i.map((c) => c.toLowerCase())).values());
      return a.length === 1 ? a[0] : (a.sort(), a);
    }
    return i.toLowerCase();
  });
  const s = t.map((i) => i == null ? "null" : Array.isArray(i) ? i.join("|") : i).join("&");
  return { fragment: n, tag: s, topics: t };
}
async function Hs(r, e) {
  const { subs: t } = Oe(r);
  return t.get((await Co(r, e)).tag) || null;
}
async function Q0(r, e, t) {
  const n = Ln(r.runner);
  A(n, "contract runner does not support subscribing", "UNSUPPORTED_OPERATION", { operation: e });
  const { fragment: s, tag: i, topics: a } = await Co(r, t), { addr: c, subs: o } = Oe(r);
  let f = o.get(i);
  if (!f) {
    const d = { address: c || r, topics: a }, h = (E) => {
      let C = s;
      if (C == null)
        try {
          C = r.interface.getEvent(E.topics[0]);
        } catch {
        }
      if (C) {
        const B = C, I = s ? r.interface.decodeEventLog(s, E.data, E.topics) : [];
        Hc(r, t, I, (K) => new vb(r, K, t, B, E));
      } else
        Hc(r, t, [], (B) => new tu(r, B, t, E));
    };
    let p = [];
    f = { tag: i, listeners: [], start: () => {
      p.length || p.push(n.on(d, h));
    }, stop: async () => {
      if (p.length == 0)
        return;
      let E = p;
      p = [], await Promise.all(E), n.off(d, h);
    } }, o.set(i, f);
  }
  return f;
}
let Gc = Promise.resolve();
async function Lb(r, e, t, n) {
  await Gc;
  const s = await Hs(r, e);
  if (!s)
    return !1;
  const i = s.listeners.length;
  return s.listeners = s.listeners.filter(({ listener: a, once: c }) => {
    const o = Array.from(t);
    n && o.push(n(c ? null : a));
    try {
      a.call(r, ...o);
    } catch {
    }
    return !c;
  }), s.listeners.length === 0 && (s.stop(), Oe(r).subs.delete(s.tag)), i > 0;
}
async function Hc(r, e, t, n) {
  try {
    await Gc;
  } catch {
  }
  const s = Lb(r, e, t, n);
  return Gc = s, await s;
}
const na = ["then"];
var e1;
const qs = class qs {
  /**
   *  Creates a new contract connected to %%target%% with the %%abi%% and
   *  optionally connected to a %%runner%% to perform operations on behalf
   *  of.
   */
  constructor(e, t, n, s) {
    /**
     *  The target to connect to.
     *
     *  This can be an address, ENS name or any [[Addressable]], such as
     *  another contract. To get the resovled address, use the ``getAddress``
     *  method.
     */
    g(this, "target");
    /**
     *  The contract Interface.
     */
    g(this, "interface");
    /**
     *  The connected runner. This is generally a [[Provider]] or a
     *  [[Signer]], which dictates what operations are supported.
     *
     *  For example, a **Contract** connected to a [[Provider]] may
     *  only execute read-only operations.
     */
    g(this, "runner");
    /**
     *  All the Events available on this contract.
     */
    g(this, "filters");
    /**
     *  @_ignore:
     */
    g(this, e1);
    /**
     *  The fallback or receive function if any.
     */
    g(this, "fallback");
    b(typeof e == "string" || ll(e), "invalid value for Contract target", "target", e), n == null && (n = null);
    const i = Mc.from(t);
    T(this, { target: e, runner: n, interface: i }), Object.defineProperty(this, Ra, { value: {} });
    let a, c = null, o = null;
    if (s) {
      const d = Ln(n);
      o = new Ao(this.interface, d, s);
    }
    let f = /* @__PURE__ */ new Map();
    if (typeof e == "string")
      if (q(e))
        c = e, a = Promise.resolve(e);
      else {
        const d = fr(n, "resolveName");
        if (!Eo(d))
          throw ne("contract runner does not support name resolution", "UNSUPPORTED_OPERATION", {
            operation: "resolveName"
          });
        a = d.resolveName(e).then((h) => {
          if (h == null)
            throw ne("an ENS name used for a contract target must be correctly configured", "UNCONFIGURED_NAME", {
              value: e
            });
          return Oe(this).addr = h, h;
        });
      }
    else
      a = e.getAddress().then((d) => {
        if (d == null)
          throw new Error("TODO");
        return Oe(this).addr = d, d;
      });
    Bb(this, { addrPromise: a, addr: c, deployTx: o, subs: f });
    const u = new Proxy({}, {
      get: (d, h, p) => {
        if (typeof h == "symbol" || na.indexOf(h) >= 0)
          return Reflect.get(d, h, p);
        try {
          return this.getEvent(h);
        } catch (m) {
          if (!je(m, "INVALID_ARGUMENT") || m.argument !== "key")
            throw m;
        }
      },
      has: (d, h) => na.indexOf(h) >= 0 ? Reflect.has(d, h) : Reflect.has(d, h) || this.interface.hasEvent(String(h))
    });
    return T(this, { filters: u }), T(this, {
      fallback: i.receive || i.fallback ? Tb(this) : null
    }), new Proxy(this, {
      get: (d, h, p) => {
        if (typeof h == "symbol" || h in d || na.indexOf(h) >= 0)
          return Reflect.get(d, h, p);
        try {
          return d.getFunction(h);
        } catch (m) {
          if (!je(m, "INVALID_ARGUMENT") || m.argument !== "key")
            throw m;
        }
      },
      has: (d, h) => typeof h == "symbol" || h in d || na.indexOf(h) >= 0 ? Reflect.has(d, h) : d.interface.hasFunction(h)
    });
  }
  /**
   *  Return a new Contract instance with the same target and ABI, but
   *  a different %%runner%%.
   */
  connect(e) {
    return new qs(this.target, this.interface, e);
  }
  /**
   *  Return a new Contract instance with the same ABI and runner, but
   *  a different %%target%%.
   */
  attach(e) {
    return new qs(e, this.interface, this.runner);
  }
  /**
   *  Return the resolved address of this Contract.
   */
  async getAddress() {
    return await Oe(this).addrPromise;
  }
  /**
   *  Return the deployed bytecode or null if no bytecode is found.
   */
  async getDeployedCode() {
    const e = Ln(this.runner);
    A(e, "runner does not support .provider", "UNSUPPORTED_OPERATION", { operation: "getDeployedCode" });
    const t = await e.getCode(await this.getAddress());
    return t === "0x" ? null : t;
  }
  /**
   *  Resolve to this Contract once the bytecode has been deployed, or
   *  resolve immediately if already deployed.
   */
  async waitForDeployment() {
    const e = this.deploymentTransaction();
    if (e)
      return await e.wait(), this;
    if (await this.getDeployedCode() != null)
      return this;
    const n = Ln(this.runner);
    return A(n != null, "contract runner does not support .provider", "UNSUPPORTED_OPERATION", { operation: "waitForDeployment" }), new Promise((s, i) => {
      const a = async () => {
        try {
          if (await this.getDeployedCode() != null)
            return s(this);
          n.once("block", a);
        } catch (c) {
          i(c);
        }
      };
      a();
    });
  }
  /**
   *  Return the transaction used to deploy this contract.
   *
   *  This is only available if this instance was returned from a
   *  [[ContractFactory]].
   */
  deploymentTransaction() {
    return Oe(this).deployTx;
  }
  /**
   *  Return the function for a given name. This is useful when a contract
   *  method name conflicts with a JavaScript name such as ``prototype`` or
   *  when using a Contract programatically.
   */
  getFunction(e) {
    return typeof e != "string" && (e = e.format()), Rb(this, e);
  }
  /**
   *  Return the event for a given name. This is useful when a contract
   *  event name conflicts with a JavaScript name such as ``prototype`` or
   *  when using a Contract programatically.
   */
  getEvent(e) {
    return typeof e != "string" && (e = e.format()), Sb(this, e);
  }
  /**
   *  @_ignore:
   */
  async queryTransaction(e) {
    throw new Error("@TODO");
  }
  /*
      // @TODO: this is a non-backwards compatible change, but will be added
      //        in v7 and in a potential SmartContract class in an upcoming
      //        v6 release
      async getTransactionReceipt(hash: string): Promise<null | ContractTransactionReceipt> {
          const provider = getProvider(this.runner);
          assert(provider, "contract runner does not have a provider",
              "UNSUPPORTED_OPERATION", { operation: "queryTransaction" });
  
          const receipt = await provider.getTransactionReceipt(hash);
          if (receipt == null) { return null; }
  
          return new ContractTransactionReceipt(this.interface, provider, receipt);
      }
      */
  /**
   *  Provide historic access to event data for %%event%% in the range
   *  %%fromBlock%% (default: ``0``) to %%toBlock%% (default: ``"latest"``)
   *  inclusive.
   */
  async queryFilter(e, t, n) {
    t == null && (t = 0), n == null && (n = "latest");
    const { addr: s, addrPromise: i } = Oe(this), a = s || await i, { fragment: c, topics: o } = await Co(this, e), f = { address: a, topics: o, fromBlock: t, toBlock: n }, u = Ln(this.runner);
    return A(u, "contract runner does not have a provider", "UNSUPPORTED_OPERATION", { operation: "queryFilter" }), (await u.getLogs(f)).map((d) => {
      let h = c;
      if (h == null)
        try {
          h = this.interface.getEvent(d.topics[0]);
        } catch {
        }
      if (h)
        try {
          return new wo(d, this.interface, h);
        } catch (p) {
          return new eu(d, p);
        }
      return new Gi(d, u);
    });
  }
  /**
   *  Add an event %%listener%% for the %%event%%.
   */
  async on(e, t) {
    const n = await Q0(this, "on", e);
    return n.listeners.push({ listener: t, once: !1 }), n.start(), this;
  }
  /**
   *  Add an event %%listener%% for the %%event%%, but remove the listener
   *  after it is fired once.
   */
  async once(e, t) {
    const n = await Q0(this, "once", e);
    return n.listeners.push({ listener: t, once: !0 }), n.start(), this;
  }
  /**
   *  Emit an %%event%% calling all listeners with %%args%%.
   *
   *  Resolves to ``true`` if any listeners were called.
   */
  async emit(e, ...t) {
    return await Hc(this, e, t, null);
  }
  /**
   *  Resolves to the number of listeners of %%event%% or the total number
   *  of listeners if unspecified.
   */
  async listenerCount(e) {
    if (e) {
      const s = await Hs(this, e);
      return s ? s.listeners.length : 0;
    }
    const { subs: t } = Oe(this);
    let n = 0;
    for (const { listeners: s } of t.values())
      n += s.length;
    return n;
  }
  /**
   *  Resolves to the listeners subscribed to %%event%% or all listeners
   *  if unspecified.
   */
  async listeners(e) {
    if (e) {
      const s = await Hs(this, e);
      return s ? s.listeners.map(({ listener: i }) => i) : [];
    }
    const { subs: t } = Oe(this);
    let n = [];
    for (const { listeners: s } of t.values())
      n = n.concat(s.map(({ listener: i }) => i));
    return n;
  }
  /**
   *  Remove the %%listener%% from the listeners for %%event%% or remove
   *  all listeners if unspecified.
   */
  async off(e, t) {
    const n = await Hs(this, e);
    if (!n)
      return this;
    if (t) {
      const s = n.listeners.map(({ listener: i }) => i).indexOf(t);
      s >= 0 && n.listeners.splice(s, 1);
    }
    return (t == null || n.listeners.length === 0) && (n.stop(), Oe(this).subs.delete(n.tag)), this;
  }
  /**
   *  Remove all the listeners for %%event%% or remove all listeners if
   *  unspecified.
   */
  async removeAllListeners(e) {
    if (e) {
      const t = await Hs(this, e);
      if (!t)
        return this;
      t.stop(), Oe(this).subs.delete(t.tag);
    } else {
      const { subs: t } = Oe(this);
      for (const { tag: n, stop: s } of t.values())
        s(), t.delete(n);
    }
    return this;
  }
  /**
   *  Alias for [on].
   */
  async addListener(e, t) {
    return await this.on(e, t);
  }
  /**
   *  Alias for [off].
   */
  async removeListener(e, t) {
    return await this.off(e, t);
  }
  /**
   *  Create a new Class for the %%abi%%.
   */
  static buildClass(e) {
    class t extends qs {
      constructor(s, i = null) {
        super(s, e, i);
      }
    }
    return t;
  }
  /**
   *  Create a new BaseContract with a specified Interface.
   */
  static from(e, t, n) {
    return n == null && (n = null), new this(e, t, n);
  }
};
e1 = Ra;
let Kc = qs;
function Fb() {
  return Kc;
}
class Zs extends Fb() {
}
function lc(r) {
  return r.match(/^ipfs:\/\/ipfs\//i) ? r = r.substring(12) : r.match(/^ipfs:\/\//i) ? r = r.substring(7) : b(!1, "unsupported IPFS format", "link", r), `https://gateway.ipfs.io/ipfs/${r}`;
}
class Db {
  /**
   *  Creates a new **MulticoinProviderPluing** for %%name%%.
   */
  constructor(e) {
    /**
     *  The name.
     */
    g(this, "name");
    T(this, { name: e });
  }
  connect(e) {
    return this;
  }
  /**
   *  Returns ``true`` if %%coinType%% is supported by this plugin.
   */
  supportsCoinType(e) {
    return !1;
  }
  /**
   *  Resovles to the encoded %%address%% for %%coinType%%.
   */
  async encodeAddress(e, t) {
    throw new Error("unsupported coin");
  }
  /**
   *  Resovles to the decoded %%data%% for %%coinType%%.
   */
  async decodeAddress(e, t) {
    throw new Error("unsupported coin");
  }
}
const cu = new RegExp("^(ipfs)://(.*)$", "i"), z0 = [
  new RegExp("^(https)://(.*)$", "i"),
  new RegExp("^(data):(.*)$", "i"),
  cu,
  new RegExp("^eip155:[0-9]+/(erc[0-9]+):(.*)$", "i")
];
var cn, zn, on, wr, _a, ou;
const Nr = class Nr {
  constructor(e, t, n) {
    y(this, on);
    /**
     *  The connected provider.
     */
    g(this, "provider");
    /**
     *  The address of the resolver.
     */
    g(this, "address");
    /**
     *  The name this resolver was resolved against.
     */
    g(this, "name");
    // For EIP-2544 names, the ancestor that provided the resolver
    y(this, cn, void 0);
    y(this, zn, void 0);
    T(this, { provider: e, address: t, name: n }), x(this, cn, null), x(this, zn, new Zs(t, [
      "function supportsInterface(bytes4) view returns (bool)",
      "function resolve(bytes, bytes) view returns (bytes)",
      "function addr(bytes32) view returns (address)",
      "function addr(bytes32, uint) view returns (bytes)",
      "function text(bytes32, string) view returns (string)",
      "function contenthash(bytes32) view returns (bytes)"
    ], e));
  }
  /**
   *  Resolves to true if the resolver supports wildcard resolution.
   */
  async supportsWildcard() {
    return l(this, cn) == null && x(this, cn, (async () => {
      try {
        return await l(this, zn).supportsInterface("0x9061b923");
      } catch (e) {
        if (je(e, "CALL_EXCEPTION"))
          return !1;
        throw x(this, cn, null), e;
      }
    })()), await l(this, cn);
  }
  /**
   *  Resolves to the address for %%coinType%% or null if the
   *  provided %%coinType%% has not been configured.
   */
  async getAddress(e) {
    if (e == null && (e = 60), e === 60)
      try {
        const i = await P(this, on, wr).call(this, "addr(bytes32)");
        return i == null || i === Bc ? null : i;
      } catch (i) {
        if (je(i, "CALL_EXCEPTION"))
          return null;
        throw i;
      }
    if (e >= 0 && e < 2147483648) {
      let i = e + 2147483648;
      const a = await P(this, on, wr).call(this, "addr(bytes32,uint)", [i]);
      if (q(a, 20))
        return F(a);
    }
    let t = null;
    for (const i of this.provider.plugins)
      if (i instanceof Db && i.supportsCoinType(e)) {
        t = i;
        break;
      }
    if (t == null)
      return null;
    const n = await P(this, on, wr).call(this, "addr(bytes32,uint)", [e]);
    if (n == null || n === "0x")
      return null;
    const s = await t.decodeAddress(e, n);
    if (s != null)
      return s;
    A(!1, "invalid coin data", "UNSUPPORTED_OPERATION", {
      operation: `getAddress(${e})`,
      info: { coinType: e, data: n }
    });
  }
  /**
   *  Resolves to the EIP-634 text record for %%key%%, or ``null``
   *  if unconfigured.
   */
  async getText(e) {
    const t = await P(this, on, wr).call(this, "text(bytes32,string)", [e]);
    return t == null || t === "0x" ? null : t;
  }
  /**
   *  Rsolves to the content-hash or ``null`` if unconfigured.
   */
  async getContentHash() {
    const e = await P(this, on, wr).call(this, "contenthash(bytes32)");
    if (e == null || e === "0x")
      return null;
    const t = e.match(/^0x(e3010170|e5010172)(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/);
    if (t) {
      const s = t[1] === "e3010170" ? "ipfs" : "ipns", i = parseInt(t[4], 16);
      if (t[5].length === i * 2)
        return `${s}://${bf("0x" + t[2])}`;
    }
    const n = e.match(/^0xe40101fa011b20([0-9a-f]*)$/);
    if (n && n[1].length === 64)
      return `bzz://${n[1]}`;
    A(!1, "invalid or unsupported content hash data", "UNSUPPORTED_OPERATION", {
      operation: "getContentHash()",
      info: { data: e }
    });
  }
  /**
   *  Resolves to the avatar url or ``null`` if the avatar is either
   *  unconfigured or incorrectly configured (e.g. references an NFT
   *  not owned by the address).
   *
   *  If diagnosing issues with configurations, the [[_getAvatar]]
   *  method may be useful.
   */
  async getAvatar() {
    return (await this._getAvatar()).url;
  }
  /**
   *  When resolving an avatar, there are many steps involved, such
   *  fetching metadata and possibly validating ownership of an
   *  NFT.
   *
   *  This method can be used to examine each step and the value it
   *  was working from.
   */
  async _getAvatar() {
    const e = [{ type: "name", value: this.name }];
    try {
      const t = await this.getText("avatar");
      if (t == null)
        return e.push({ type: "!avatar", value: "" }), { url: null, linkage: e };
      e.push({ type: "avatar", value: t });
      for (let n = 0; n < z0.length; n++) {
        const s = t.match(z0[n]);
        if (s == null)
          continue;
        const i = s[1].toLowerCase();
        switch (i) {
          case "https":
          case "data":
            return e.push({ type: "url", value: t }), { linkage: e, url: t };
          case "ipfs": {
            const a = lc(t);
            return e.push({ type: "ipfs", value: t }), e.push({ type: "url", value: a }), { linkage: e, url: a };
          }
          case "erc721":
          case "erc1155": {
            const a = i === "erc721" ? "tokenURI(uint256)" : "uri(uint256)";
            e.push({ type: i, value: t });
            const c = await this.getAddress();
            if (c == null)
              return e.push({ type: "!owner", value: "" }), { url: null, linkage: e };
            const o = (s[2] || "").split("/");
            if (o.length !== 2)
              return e.push({ type: `!${i}caip`, value: s[2] || "" }), { url: null, linkage: e };
            const f = o[1], u = new Zs(o[0], [
              // ERC-721
              "function tokenURI(uint) view returns (string)",
              "function ownerOf(uint) view returns (address)",
              // ERC-1155
              "function uri(uint) view returns (string)",
              "function balanceOf(address, uint256) view returns (uint)"
            ], this.provider);
            if (i === "erc721") {
              const w = await u.ownerOf(f);
              if (c !== w)
                return e.push({ type: "!owner", value: w }), { url: null, linkage: e };
              e.push({ type: "owner", value: w });
            } else if (i === "erc1155") {
              const w = await u.balanceOf(c, f);
              if (!w)
                return e.push({ type: "!balance", value: "0" }), { url: null, linkage: e };
              e.push({ type: "balance", value: w.toString() });
            }
            let d = await u[a](f);
            if (d == null || d === "0x")
              return e.push({ type: "!metadata-url", value: "" }), { url: null, linkage: e };
            e.push({ type: "metadata-url-base", value: d }), i === "erc1155" && (d = d.replace("{id}", zt(f, 32).substring(2)), e.push({ type: "metadata-url-expanded", value: d })), d.match(/^ipfs:/i) && (d = lc(d)), e.push({ type: "metadata-url", value: d });
            let h = {};
            const p = await new Jt(d).send();
            p.assertOk();
            try {
              h = p.bodyJson;
            } catch {
              try {
                e.push({ type: "!metadata", value: p.bodyText });
              } catch {
                const C = p.body;
                return C && e.push({ type: "!metadata", value: N(C) }), { url: null, linkage: e };
              }
              return { url: null, linkage: e };
            }
            if (!h)
              return e.push({ type: "!metadata", value: "" }), { url: null, linkage: e };
            e.push({ type: "metadata", value: JSON.stringify(h) });
            let m = h.image;
            if (typeof m != "string")
              return e.push({ type: "!imageUrl", value: "" }), { url: null, linkage: e };
            if (!m.match(/^(https:\/\/|data:)/i)) {
              if (m.match(cu) == null)
                return e.push({ type: "!imageUrl-ipfs", value: m }), { url: null, linkage: e };
              e.push({ type: "imageUrl-ipfs", value: m }), m = lc(m);
            }
            return e.push({ type: "url", value: m }), { linkage: e, url: m };
          }
        }
      }
    } catch {
    }
    return { linkage: e, url: null };
  }
  static async getEnsAddress(e) {
    const t = await e.getNetwork(), n = t.getPlugin("org.ethers.plugins.network.Ens");
    return A(n, "network does not support ENS", "UNSUPPORTED_OPERATION", {
      operation: "getEnsAddress",
      info: { network: t }
    }), n.address;
  }
  /**
   *  Resolve to the ENS resolver for %%name%% using %%provider%% or
   *  ``null`` if unconfigured.
   */
  static async fromName(e, t) {
    var s;
    let n = t;
    for (; ; ) {
      if (n === "" || n === "." || t !== "eth" && n === "eth")
        return null;
      const i = await P(s = Nr, _a, ou).call(s, e, n);
      if (i != null) {
        const a = new Nr(e, i, t);
        return n !== t && !await a.supportsWildcard() ? null : a;
      }
      n = n.split(".").slice(1).join(".");
    }
  }
};
cn = new WeakMap(), zn = new WeakMap(), on = new WeakSet(), wr = async function(e, t) {
  t = (t || []).slice();
  const n = l(this, zn).interface;
  t.unshift(Fc(this.name));
  let s = null;
  await this.supportsWildcard() && (s = n.getFunction(e), A(s, "missing fragment", "UNKNOWN_ERROR", {
    info: { funcName: e }
  }), t = [
    Vx(this.name),
    n.encodeFunctionData(s, t)
  ], e = "resolve(bytes,bytes)"), t.push({
    enableCcipRead: !0
  });
  try {
    const i = await l(this, zn)[e](...t);
    return s ? n.decodeFunctionResult(s, i)[0] : i;
  } catch (i) {
    if (!je(i, "CALL_EXCEPTION"))
      throw i;
  }
  return null;
}, _a = new WeakSet(), ou = async function(e, t) {
  const n = await Nr.getEnsAddress(e);
  try {
    const i = await new Zs(n, [
      "function resolver(bytes32) view returns (address)"
    ], e).resolver(Fc(t), {
      enableCcipRead: !0
    });
    return i === Bc ? null : i;
  } catch (s) {
    throw s;
  }
  return null;
}, y(Nr, _a);
let Sa = Nr;
const J0 = BigInt(0);
function Z(r, e) {
  return function(t) {
    return t == null ? e : r(t);
  };
}
function Po(r) {
  return (e) => {
    if (!Array.isArray(e))
      throw new Error("not an array");
    return e.map((t) => r(t));
  };
}
function Hi(r, e) {
  return (t) => {
    const n = {};
    for (const s in r) {
      let i = s;
      if (e && s in e && !(i in t)) {
        for (const a of e[s])
          if (a in t) {
            i = a;
            break;
          }
      }
      try {
        const a = r[s](t[i]);
        a !== void 0 && (n[s] = a);
      } catch (a) {
        const c = a instanceof Error ? a.message : "not-an-error";
        A(!1, `invalid value for value.${s} (${c})`, "BAD_DATA", { value: t });
      }
    }
    return n;
  };
}
function Mb(r) {
  switch (r) {
    case !0:
    case "true":
      return !0;
    case !1:
    case "false":
      return !1;
  }
  b(!1, `invalid boolean; ${JSON.stringify(r)}`, "value", r);
}
function Ps(r) {
  return b(q(r, !0), "invalid data", "value", r), r;
}
function We(r) {
  return b(q(r, 32), "invalid hash", "value", r), r;
}
const Gb = Hi({
  address: F,
  blockHash: We,
  blockNumber: L,
  data: Ps,
  index: L,
  removed: Z(Mb, !1),
  topics: Po(We),
  transactionHash: We,
  transactionIndex: L
}, {
  index: ["logIndex"]
});
function Hb(r) {
  return Gb(r);
}
const Kb = Hi({
  hash: Z(We),
  parentHash: We,
  number: L,
  timestamp: L,
  nonce: Z(Ps),
  difficulty: S,
  gasLimit: S,
  gasUsed: S,
  miner: Z(F),
  extraData: Ps,
  baseFeePerGas: Z(S)
});
function Vb(r) {
  const e = Kb(r);
  return e.transactions = r.transactions.map((t) => typeof t == "string" ? t : fu(t)), e;
}
const _b = Hi({
  transactionIndex: L,
  blockNumber: L,
  transactionHash: We,
  address: F,
  topics: Po(We),
  data: Ps,
  index: L,
  blockHash: We
}, {
  index: ["logIndex"]
});
function Qb(r) {
  return _b(r);
}
const zb = Hi({
  to: Z(F, null),
  from: Z(F, null),
  contractAddress: Z(F, null),
  // should be allowNull(hash), but broken-EIP-658 support is handled in receipt
  index: L,
  root: Z(N),
  gasUsed: S,
  logsBloom: Z(Ps),
  blockHash: We,
  hash: We,
  logs: Po(Qb),
  blockNumber: L,
  //confirmations: allowNull(getNumber, null),
  cumulativeGasUsed: S,
  effectiveGasPrice: Z(S),
  status: Z(L),
  type: Z(L, 0)
}, {
  effectiveGasPrice: ["gasPrice"],
  hash: ["transactionHash"],
  index: ["transactionIndex"]
});
function Jb(r) {
  return zb(r);
}
function fu(r) {
  r.to && S(r.to) === J0 && (r.to = "0x0000000000000000000000000000000000000000");
  const e = Hi({
    hash: We,
    type: (t) => t === "0x" || t == null ? 0 : L(t),
    accessList: Z(hr, null),
    blockHash: Z(We, null),
    blockNumber: Z(L, null),
    transactionIndex: Z(L, null),
    //confirmations: allowNull(getNumber, null),
    from: F,
    // either (gasPrice) or (maxPriorityFeePerGas + maxFeePerGas) must be set
    gasPrice: Z(S),
    maxPriorityFeePerGas: Z(S),
    maxFeePerGas: Z(S),
    gasLimit: S,
    to: Z(F, null),
    value: S,
    nonce: L,
    data: Ps,
    creates: Z(F, null),
    chainId: Z(S, null)
  }, {
    data: ["input"],
    gasLimit: ["gas"]
  })(r);
  if (e.to == null && e.creates == null && (e.creates = Hh(e)), (r.type === 1 || r.type === 2) && r.accessList == null && (e.accessList = []), r.signature ? e.signature = at.from(r.signature) : e.signature = at.from(r), e.chainId == null) {
    const t = e.signature.legacyChainId;
    t != null && (e.chainId = t);
  }
  return e.blockHash && S(e.blockHash) === J0 && (e.blockHash = null), e;
}
const jb = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
class Ki {
  /**
   *  Creates a new **NetworkPlugin**.
   */
  constructor(e) {
    /**
     *  The name of the plugin.
     *
     *  It is recommended to use reverse-domain-notation, which permits
     *  unique names with a known authority as well as hierarchal entries.
     */
    g(this, "name");
    T(this, { name: e });
  }
  /**
   *  Creates a copy of this plugin.
   */
  clone() {
    return new Ki(this.name);
  }
}
class ec extends Ki {
  /**
   *  Creates a new GasCostPlugin from %%effectiveBlock%% until the
   *  latest block or another GasCostPlugin supercedes that block number,
   *  with the associated %%costs%%.
   */
  constructor(t, n) {
    t == null && (t = 0);
    super(`org.ethers.network.plugins.GasCost#${t || 0}`);
    /**
     *  The block number to treat these values as valid from.
     *
     *  This allows a hardfork to have updated values included as well as
     *  mulutiple hardforks to be supported.
     */
    g(this, "effectiveBlock");
    /**
     *  The transactions base fee.
     */
    g(this, "txBase");
    /**
     *  The fee for creating a new account.
     */
    g(this, "txCreate");
    /**
     *  The fee per zero-byte in the data.
     */
    g(this, "txDataZero");
    /**
     *  The fee per non-zero-byte in the data.
     */
    g(this, "txDataNonzero");
    /**
     *  The fee per storage key in the [[link-eip-2930]] access list.
     */
    g(this, "txAccessListStorageKey");
    /**
     *  The fee per address in the [[link-eip-2930]] access list.
     */
    g(this, "txAccessListAddress");
    const s = { effectiveBlock: t };
    function i(a, c) {
      let o = (n || {})[a];
      o == null && (o = c), b(typeof o == "number", `invalud value for ${a}`, "costs", n), s[a] = o;
    }
    i("txBase", 21e3), i("txCreate", 32e3), i("txDataZero", 4), i("txDataNonzero", 16), i("txAccessListStorageKey", 1900), i("txAccessListAddress", 2400), T(this, s);
  }
  clone() {
    return new ec(this.effectiveBlock, this);
  }
}
class tc extends Ki {
  /**
   *  Creates a new **EnsPlugin** connected to %%address%% on the
   *  %%targetNetwork%%. The default ENS address and mainnet is used
   *  if unspecified.
   */
  constructor(t, n) {
    super("org.ethers.plugins.network.Ens");
    /**
     *  The ENS Registrty Contract address.
     */
    g(this, "address");
    /**
     *  The chain ID that the ENS contract lives on.
     */
    g(this, "targetNetwork");
    T(this, {
      address: t || jb,
      targetNetwork: n ?? 1
    });
  }
  clone() {
    return new tc(this.address, this.targetNetwork);
  }
}
var Ci, Pi;
class lu extends Ki {
  /**
   *  Creates a new **FetchUrlFeeDataNetworkPlugin** which will
   *  be used when computing the fee data for the network.
   */
  constructor(t, n) {
    super("org.ethers.plugins.network.FetchUrlFeeDataPlugin");
    y(this, Ci, void 0);
    y(this, Pi, void 0);
    x(this, Ci, t), x(this, Pi, n);
  }
  /**
   *  The URL to initialize the FetchRequest with in %%processFunc%%.
   */
  get url() {
    return l(this, Ci);
  }
  /**
   *  The callback to use when computing the FeeData.
   */
  get processFunc() {
    return l(this, Pi);
  }
  // We are immutable, so we can serve as our own clone
  clone() {
    return this;
  }
}
Ci = new WeakMap(), Pi = new WeakMap();
const uc = /* @__PURE__ */ new Map();
var ss, is, fn;
const Ir = class Ir {
  /**
   *  Creates a new **Network** for %%name%% and %%chainId%%.
   */
  constructor(e, t) {
    y(this, ss, void 0);
    y(this, is, void 0);
    y(this, fn, void 0);
    x(this, ss, e), x(this, is, S(t)), x(this, fn, /* @__PURE__ */ new Map());
  }
  /**
   *  Returns a JSON-compatible representation of a Network.
   */
  toJSON() {
    return { name: this.name, chainId: String(this.chainId) };
  }
  /**
   *  The network common name.
   *
   *  This is the canonical name, as networks migh have multiple
   *  names.
   */
  get name() {
    return l(this, ss);
  }
  set name(e) {
    x(this, ss, e);
  }
  /**
   *  The network chain ID.
   */
  get chainId() {
    return l(this, is);
  }
  set chainId(e) {
    x(this, is, S(e, "chainId"));
  }
  /**
   *  Returns true if %%other%% matches this network. Any chain ID
   *  must match, and if no chain ID is present, the name must match.
   *
   *  This method does not currently check for additional properties,
   *  such as ENS address or plug-in compatibility.
   */
  matches(e) {
    if (e == null)
      return !1;
    if (typeof e == "string") {
      try {
        return this.chainId === S(e);
      } catch {
      }
      return this.name === e;
    }
    if (typeof e == "number" || typeof e == "bigint") {
      try {
        return this.chainId === S(e);
      } catch {
      }
      return !1;
    }
    if (typeof e == "object") {
      if (e.chainId != null) {
        try {
          return this.chainId === S(e.chainId);
        } catch {
        }
        return !1;
      }
      return e.name != null ? this.name === e.name : !1;
    }
    return !1;
  }
  /**
   *  Returns the list of plugins currently attached to this Network.
   */
  get plugins() {
    return Array.from(l(this, fn).values());
  }
  /**
   *  Attach a new %%plugin%% to this Network. The network name
   *  must be unique, excluding any fragment.
   */
  attachPlugin(e) {
    if (l(this, fn).get(e.name))
      throw new Error(`cannot replace existing plugin: ${e.name} `);
    return l(this, fn).set(e.name, e.clone()), this;
  }
  /**
   *  Return the plugin, if any, matching %%name%% exactly. Plugins
   *  with fragments will not be returned unless %%name%% includes
   *  a fragment.
   */
  getPlugin(e) {
    return l(this, fn).get(e) || null;
  }
  /**
   *  Gets a list of all plugins that match %%name%%, with otr without
   *  a fragment.
   */
  getPlugins(e) {
    return this.plugins.filter((t) => t.name.split("#")[0] === e);
  }
  /**
   *  Create a copy of this Network.
   */
  clone() {
    const e = new Ir(this.name, this.chainId);
    return this.plugins.forEach((t) => {
      e.attachPlugin(t.clone());
    }), e;
  }
  /**
   *  Compute the intrinsic gas required for a transaction.
   *
   *  A GasCostPlugin can be attached to override the default
   *  values.
   */
  computeIntrinsicGas(e) {
    const t = this.getPlugin("org.ethers.plugins.network.GasCost") || new ec();
    let n = t.txBase;
    if (e.to == null && (n += t.txCreate), e.data)
      for (let s = 2; s < e.data.length; s += 2)
        e.data.substring(s, s + 2) === "00" ? n += t.txDataZero : n += t.txDataNonzero;
    if (e.accessList) {
      const s = hr(e.accessList);
      for (const i in s)
        n += t.txAccessListAddress + t.txAccessListStorageKey * s[i].storageKeys.length;
    }
    return n;
  }
  /**
   *  Returns a new Network for the %%network%% name or chainId.
   */
  static from(e) {
    if (Yb(), e == null)
      return Ir.from("mainnet");
    if (typeof e == "number" && (e = BigInt(e)), typeof e == "string" || typeof e == "bigint") {
      const t = uc.get(e);
      if (t)
        return t();
      if (typeof e == "bigint")
        return new Ir("unknown", e);
      b(!1, "unknown network", "network", e);
    }
    if (typeof e.clone == "function")
      return e.clone();
    if (typeof e == "object") {
      b(typeof e.name == "string" && typeof e.chainId == "number", "invalid network object name or chainId", "network", e);
      const t = new Ir(e.name, e.chainId);
      return (e.ensAddress || e.ensNetwork != null) && t.attachPlugin(new tc(e.ensAddress, e.ensNetwork)), t;
    }
    b(!1, "invalid network", "network", e);
  }
  /**
   *  Register %%nameOrChainId%% with a function which returns
   *  an instance of a Network representing that chain.
   */
  static register(e, t) {
    typeof e == "number" && (e = BigInt(e));
    const n = uc.get(e);
    n && b(!1, `conflicting network for ${JSON.stringify(n.name)}`, "nameOrChainId", e), uc.set(e, t);
  }
};
ss = new WeakMap(), is = new WeakMap(), fn = new WeakMap();
let Vt = Ir;
function j0(r, e) {
  const t = String(r);
  if (!t.match(/^[0-9.]+$/))
    throw new Error(`invalid gwei value: ${r}`);
  const n = t.split(".");
  if (n.length === 1 && n.push(""), n.length !== 2)
    throw new Error(`invalid gwei value: ${r}`);
  for (; n[1].length < e; )
    n[1] += "0";
  if (n[1].length > 9) {
    let s = BigInt(n[1].substring(0, 9));
    n[1].substring(9).match(/^0+$/) || s++, n[1] = s.toString();
  }
  return BigInt(n[0] + n[1]);
}
function W0(r) {
  return new lu(r, async (e, t, n) => {
    n.setHeader("User-Agent", "ethers");
    let s;
    try {
      const [i, a] = await Promise.all([
        n.send(),
        e()
      ]);
      s = i;
      const c = s.bodyJson.standard;
      return {
        gasPrice: a.gasPrice,
        maxFeePerGas: j0(c.maxFee, 9),
        maxPriorityFeePerGas: j0(c.maxPriorityFee, 9)
      };
    } catch (i) {
      A(!1, `error encountered with polygon gas station (${JSON.stringify(n.url)})`, "SERVER_ERROR", { request: n, response: s, error: i });
    }
  });
}
function Wb(r) {
  return new lu("data:", async (e, t, n) => {
    const s = await e();
    if (s.maxFeePerGas == null || s.maxPriorityFeePerGas == null)
      return s;
    const i = s.maxFeePerGas - s.maxPriorityFeePerGas;
    return {
      gasPrice: s.gasPrice,
      maxFeePerGas: i + r,
      maxPriorityFeePerGas: r
    };
  });
}
let Y0 = !1;
function Yb() {
  if (Y0)
    return;
  Y0 = !0;
  function r(e, t, n) {
    const s = function() {
      const i = new Vt(e, t);
      return n.ensNetwork != null && i.attachPlugin(new tc(null, n.ensNetwork)), i.attachPlugin(new ec()), (n.plugins || []).forEach((a) => {
        i.attachPlugin(a);
      }), i;
    };
    Vt.register(e, s), Vt.register(t, s), n.altNames && n.altNames.forEach((i) => {
      Vt.register(i, s);
    });
  }
  r("mainnet", 1, { ensNetwork: 1, altNames: ["homestead"] }), r("ropsten", 3, { ensNetwork: 3 }), r("rinkeby", 4, { ensNetwork: 4 }), r("goerli", 5, { ensNetwork: 5 }), r("kovan", 42, { ensNetwork: 42 }), r("sepolia", 11155111, {}), r("classic", 61, {}), r("classicKotti", 6, {}), r("arbitrum", 42161, {
    ensNetwork: 1
  }), r("arbitrum-goerli", 421613, {}), r("bnb", 56, { ensNetwork: 1 }), r("bnbt", 97, {}), r("linea", 59144, { ensNetwork: 1 }), r("linea-goerli", 59140, {}), r("matic", 137, {
    ensNetwork: 1,
    plugins: [
      W0("https://gasstation.polygon.technology/v2")
    ]
  }), r("matic-mumbai", 80001, {
    altNames: ["maticMumbai", "maticmum"],
    plugins: [
      W0("https://gasstation-testnet.polygon.technology/v2")
    ]
  }), r("optimism", 10, {
    ensNetwork: 1,
    plugins: [
      Wb(BigInt("1000000"))
    ]
  }), r("optimism-goerli", 420, {}), r("xdai", 100, { ensNetwork: 1 });
}
function Vc(r) {
  return JSON.parse(JSON.stringify(r));
}
var Ft, Qe, ln, gt, as, xa;
class Zb {
  /**
   *  Create a new **PollingBlockSubscriber** attached to %%provider%%.
   */
  constructor(e) {
    y(this, as);
    y(this, Ft, void 0);
    y(this, Qe, void 0);
    y(this, ln, void 0);
    // The most recent block we have scanned for events. The value -2
    // indicates we still need to fetch an initial block number
    y(this, gt, void 0);
    x(this, Ft, e), x(this, Qe, null), x(this, ln, 4e3), x(this, gt, -2);
  }
  /**
   *  The polling interval.
   */
  get pollingInterval() {
    return l(this, ln);
  }
  set pollingInterval(e) {
    x(this, ln, e);
  }
  start() {
    l(this, Qe) || (x(this, Qe, l(this, Ft)._setTimeout(P(this, as, xa).bind(this), l(this, ln))), P(this, as, xa).call(this));
  }
  stop() {
    l(this, Qe) && (l(this, Ft)._clearTimeout(l(this, Qe)), x(this, Qe, null));
  }
  pause(e) {
    this.stop(), e && x(this, gt, -2);
  }
  resume() {
    this.start();
  }
}
Ft = new WeakMap(), Qe = new WeakMap(), ln = new WeakMap(), gt = new WeakMap(), as = new WeakSet(), xa = async function() {
  try {
    const e = await l(this, Ft).getBlockNumber();
    if (l(this, gt) === -2) {
      x(this, gt, e);
      return;
    }
    if (e !== l(this, gt)) {
      for (let t = l(this, gt) + 1; t <= e; t++) {
        if (l(this, Qe) == null)
          return;
        await l(this, Ft).emit("block", t);
      }
      x(this, gt, e);
    }
  } catch {
  }
  l(this, Qe) != null && x(this, Qe, l(this, Ft)._setTimeout(P(this, as, xa).bind(this), l(this, ln)));
};
var Jn, jn, un;
class uu {
  /**
   *  Create a new **OnBlockSubscriber** attached to %%provider%%.
   */
  constructor(e) {
    y(this, Jn, void 0);
    y(this, jn, void 0);
    y(this, un, void 0);
    x(this, Jn, e), x(this, un, !1), x(this, jn, (t) => {
      this._poll(t, l(this, Jn));
    });
  }
  /**
   *  Called on every new block.
   */
  async _poll(e, t) {
    throw new Error("sub-classes must override this");
  }
  start() {
    l(this, un) || (x(this, un, !0), l(this, jn).call(this, -2), l(this, Jn).on("block", l(this, jn)));
  }
  stop() {
    l(this, un) && (x(this, un, !1), l(this, Jn).off("block", l(this, jn)));
  }
  pause(e) {
    this.stop();
  }
  resume() {
    this.start();
  }
}
Jn = new WeakMap(), jn = new WeakMap(), un = new WeakMap();
var Qa;
class Xb extends uu {
  constructor(t, n) {
    super(t);
    y(this, Qa, void 0);
    x(this, Qa, Vc(n));
  }
  async _poll(t, n) {
    throw new Error("@TODO");
  }
}
Qa = new WeakMap();
var cs;
class $b extends uu {
  /**
   *  Create a new **PollingTransactionSubscriber** attached to
   *  %%provider%%, listening for %%hash%%.
   */
  constructor(t, n) {
    super(t);
    y(this, cs, void 0);
    x(this, cs, n);
  }
  async _poll(t, n) {
    const s = await n.getTransactionReceipt(l(this, cs));
    s && n.emit(l(this, cs), s);
  }
}
cs = new WeakMap();
var Dt, os, fs, dn, ze, za, du;
class No {
  /**
   *  Create a new **PollingTransactionSubscriber** attached to
   *  %%provider%%, listening for %%filter%%.
   */
  constructor(e, t) {
    y(this, za);
    y(this, Dt, void 0);
    y(this, os, void 0);
    y(this, fs, void 0);
    y(this, dn, void 0);
    // The most recent block we have scanned for events. The value -2
    // indicates we still need to fetch an initial block number
    y(this, ze, void 0);
    x(this, Dt, e), x(this, os, Vc(t)), x(this, fs, P(this, za, du).bind(this)), x(this, dn, !1), x(this, ze, -2);
  }
  start() {
    l(this, dn) || (x(this, dn, !0), l(this, ze) === -2 && l(this, Dt).getBlockNumber().then((e) => {
      x(this, ze, e);
    }), l(this, Dt).on("block", l(this, fs)));
  }
  stop() {
    l(this, dn) && (x(this, dn, !1), l(this, Dt).off("block", l(this, fs)));
  }
  pause(e) {
    this.stop(), e && x(this, ze, -2);
  }
  resume() {
    this.start();
  }
}
Dt = new WeakMap(), os = new WeakMap(), fs = new WeakMap(), dn = new WeakMap(), ze = new WeakMap(), za = new WeakSet(), du = async function(e) {
  if (l(this, ze) === -2)
    return;
  const t = Vc(l(this, os));
  t.fromBlock = l(this, ze) + 1, t.toBlock = e;
  const n = await l(this, Dt).getLogs(t);
  if (n.length === 0) {
    l(this, ze) < e - 60 && x(this, ze, e - 60);
    return;
  }
  for (const s of n)
    l(this, Dt).emit(l(this, os), s), x(this, ze, s.blockNumber);
};
const qb = BigInt(2), ep = 10;
function ra(r) {
  return r && typeof r.then == "function";
}
function ba(r, e) {
  return r + ":" + JSON.stringify(e, (t, n) => {
    if (n == null)
      return "null";
    if (typeof n == "bigint")
      return `bigint:${n.toString()}`;
    if (typeof n == "string")
      return n.toLowerCase();
    if (typeof n == "object" && !Array.isArray(n)) {
      const s = Object.keys(n);
      return s.sort(), s.reduce((i, a) => (i[a] = n[a], i), {});
    }
    return n;
  });
}
class hu {
  /**
   *  Create a new UnmanagedSubscriber with %%name%%.
   */
  constructor(e) {
    /**
     *  The name fof the event.
     */
    g(this, "name");
    T(this, { name: e });
  }
  start() {
  }
  stop() {
  }
  pause(e) {
  }
  resume() {
  }
}
function tp(r) {
  return JSON.parse(JSON.stringify(r));
}
function _c(r) {
  return r = Array.from(new Set(r).values()), r.sort(), r;
}
async function dc(r, e) {
  if (r == null)
    throw new Error("invalid event");
  if (Array.isArray(r) && (r = { topics: r }), typeof r == "string")
    switch (r) {
      case "block":
      case "pending":
      case "debug":
      case "error":
      case "network":
        return { type: r, tag: r };
    }
  if (q(r, 32)) {
    const t = r.toLowerCase();
    return { type: "transaction", tag: ba("tx", { hash: t }), hash: t };
  }
  if (r.orphan) {
    const t = r;
    return { type: "orphan", tag: ba("orphan", t), filter: tp(t) };
  }
  if (r.address || r.topics) {
    const t = r, n = {
      topics: (t.topics || []).map((s) => s == null ? null : Array.isArray(s) ? _c(s.map((i) => i.toLowerCase())) : s.toLowerCase())
    };
    if (t.address) {
      const s = [], i = [], a = (c) => {
        q(c) ? s.push(c) : i.push((async () => {
          s.push(await pe(c, e));
        })());
      };
      Array.isArray(t.address) ? t.address.forEach(a) : a(t.address), i.length && await Promise.all(i), n.address = _c(s.map((c) => c.toLowerCase()));
    }
    return { filter: n, tag: ba("event", n), type: "event" };
  }
  b(!1, "unknown ProviderEvent", "event", r);
}
function hc() {
  return (/* @__PURE__ */ new Date()).getTime();
}
const np = {
  cacheTimeout: 250,
  pollingInterval: 4e3
};
var ue, hn, de, ls, Se, Wn, xn, Mt, Ni, Je, us, ds, Ce, Me, Ii, Qc, vi, zc, Yn, Ks, ki, Jc, Zn, Vs, hs, pa;
class rp {
  /**
   *  Create a new **AbstractProvider** connected to %%network%%, or
   *  use the various network detection capabilities to discover the
   *  [[Network]] if necessary.
   */
  constructor(e, t) {
    // Shares multiple identical requests made during the same 250ms
    y(this, Ce);
    y(this, Ii);
    y(this, vi);
    // Account
    y(this, Yn);
    y(this, ki);
    y(this, Zn);
    y(this, hs);
    y(this, ue, void 0);
    y(this, hn, void 0);
    // null=unpaused, true=paused+dropWhilePaused, false=paused
    y(this, de, void 0);
    y(this, ls, void 0);
    y(this, Se, void 0);
    y(this, Wn, void 0);
    y(this, xn, void 0);
    // The most recent block number if running an event or -1 if no "block" event
    y(this, Mt, void 0);
    y(this, Ni, void 0);
    y(this, Je, void 0);
    y(this, us, void 0);
    y(this, ds, void 0);
    if (x(this, ds, Object.assign({}, np, t || {})), e === "any")
      x(this, Wn, !0), x(this, Se, null);
    else if (e) {
      const n = Vt.from(e);
      x(this, Wn, !1), x(this, Se, Promise.resolve(n)), setTimeout(() => {
        this.emit("network", n, null);
      }, 0);
    } else
      x(this, Wn, !1), x(this, Se, null);
    x(this, Mt, -1), x(this, xn, /* @__PURE__ */ new Map()), x(this, ue, /* @__PURE__ */ new Map()), x(this, hn, /* @__PURE__ */ new Map()), x(this, de, null), x(this, ls, !1), x(this, Ni, 1), x(this, Je, /* @__PURE__ */ new Map()), x(this, us, !1);
  }
  get pollingInterval() {
    return l(this, ds).pollingInterval;
  }
  /**
   *  Returns ``this``, to allow an **AbstractProvider** to implement
   *  the [[ContractRunner]] interface.
   */
  get provider() {
    return this;
  }
  /**
   *  Returns all the registered plug-ins.
   */
  get plugins() {
    return Array.from(l(this, hn).values());
  }
  /**
   *  Attach a new plug-in.
   */
  attachPlugin(e) {
    if (l(this, hn).get(e.name))
      throw new Error(`cannot replace existing plugin: ${e.name} `);
    return l(this, hn).set(e.name, e.connect(this)), this;
  }
  /**
   *  Get a plugin by name.
   */
  getPlugin(e) {
    return l(this, hn).get(e) || null;
  }
  /**
   *  Prevent any CCIP-read operation, regardless of whether requested
   *  in a [[call]] using ``enableCcipRead``.
   */
  get disableCcipRead() {
    return l(this, us);
  }
  set disableCcipRead(e) {
    x(this, us, !!e);
  }
  /**
   *  Resolves to the data for executing the CCIP-read operations.
   */
  async ccipReadFetch(e, t, n) {
    if (this.disableCcipRead || n.length === 0 || e.to == null)
      return null;
    const s = e.to.toLowerCase(), i = t.toLowerCase(), a = [];
    for (let c = 0; c < n.length; c++) {
      const o = n[c], f = o.replace("{sender}", s).replace("{data}", i), u = new Jt(f);
      o.indexOf("{data}") === -1 && (u.body = { data: i, sender: s }), this.emit("debug", { action: "sendCcipReadFetchRequest", request: u, index: c, urls: n });
      let d = "unknown error";
      const h = await u.send();
      try {
        const p = h.bodyJson;
        if (p.data)
          return this.emit("debug", { action: "receiveCcipReadFetchResult", request: u, result: p }), p.data;
        p.message && (d = p.message), this.emit("debug", { action: "receiveCcipReadFetchError", request: u, result: p });
      } catch {
      }
      A(h.statusCode < 400 || h.statusCode >= 500, `response not found during CCIP fetch: ${d}`, "OFFCHAIN_FAULT", { reason: "404_MISSING_RESOURCE", transaction: e, info: { url: o, errorMessage: d } }), a.push(d);
    }
    A(!1, `error encountered during CCIP fetch: ${a.map((c) => JSON.stringify(c)).join(", ")}`, "OFFCHAIN_FAULT", {
      reason: "500_SERVER_ERROR",
      transaction: e,
      info: { urls: n, errorMessages: a }
    });
  }
  /**
   *  Provides the opportunity for a sub-class to wrap a block before
   *  returning it, to add additional properties or an alternate
   *  sub-class of [[Block]].
   */
  _wrapBlock(e, t) {
    return new Cb(Vb(e), this);
  }
  /**
   *  Provides the opportunity for a sub-class to wrap a log before
   *  returning it, to add additional properties or an alternate
   *  sub-class of [[Log]].
   */
  _wrapLog(e, t) {
    return new Gi(Hb(e), this);
  }
  /**
   *  Provides the opportunity for a sub-class to wrap a transaction
   *  receipt before returning it, to add additional properties or an
   *  alternate sub-class of [[TransactionReceipt]].
   */
  _wrapTransactionReceipt(e, t) {
    return new Xl(Jb(e), this);
  }
  /**
   *  Provides the opportunity for a sub-class to wrap a transaction
   *  response before returning it, to add additional properties or an
   *  alternate sub-class of [[TransactionResponse]].
   */
  _wrapTransactionResponse(e, t) {
    return new hi(fu(e), this);
  }
  /**
   *  Resolves to the Network, forcing a network detection using whatever
   *  technique the sub-class requires.
   *
   *  Sub-classes **must** override this.
   */
  _detectNetwork() {
    A(!1, "sub-classes must implement this", "UNSUPPORTED_OPERATION", {
      operation: "_detectNetwork"
    });
  }
  /**
   *  Sub-classes should use this to perform all built-in operations. All
   *  methods sanitizes and normalizes the values passed into this.
   *
   *  Sub-classes **must** override this.
   */
  async _perform(e) {
    A(!1, `unsupported method: ${e.method}`, "UNSUPPORTED_OPERATION", {
      operation: e.method,
      info: e
    });
  }
  // State
  async getBlockNumber() {
    const e = L(await P(this, Ce, Me).call(this, { method: "getBlockNumber" }), "%response");
    return l(this, Mt) >= 0 && x(this, Mt, e), e;
  }
  /**
   *  Returns or resolves to the address for %%address%%, resolving ENS
   *  names and [[Addressable]] objects and returning if already an
   *  address.
   */
  _getAddress(e) {
    return pe(e, this);
  }
  /**
   *  Returns or resolves to a valid block tag for %%blockTag%%, resolving
   *  negative values and returning if already a valid block tag.
   */
  _getBlockTag(e) {
    if (e == null)
      return "latest";
    switch (e) {
      case "earliest":
        return "0x0";
      case "latest":
      case "pending":
      case "safe":
      case "finalized":
        return e;
    }
    if (q(e))
      return q(e, 32) ? e : Cr(e);
    if (typeof e == "bigint" && (e = L(e, "blockTag")), typeof e == "number")
      return e >= 0 ? Cr(e) : l(this, Mt) >= 0 ? Cr(l(this, Mt) + e) : this.getBlockNumber().then((t) => Cr(t + e));
    b(!1, "invalid blockTag", "blockTag", e);
  }
  /**
   *  Returns or resolves to a filter for %%filter%%, resolving any ENS
   *  names or [[Addressable]] object and returning if already a valid
   *  filter.
   */
  _getFilter(e) {
    const t = (e.topics || []).map((o) => o == null ? null : Array.isArray(o) ? _c(o.map((f) => f.toLowerCase())) : o.toLowerCase()), n = "blockHash" in e ? e.blockHash : void 0, s = (o, f, u) => {
      let d;
      switch (o.length) {
        case 0:
          break;
        case 1:
          d = o[0];
          break;
        default:
          o.sort(), d = o;
      }
      if (n && (f != null || u != null))
        throw new Error("invalid filter");
      const h = {};
      return d && (h.address = d), t.length && (h.topics = t), f && (h.fromBlock = f), u && (h.toBlock = u), n && (h.blockHash = n), h;
    };
    let i = [];
    if (e.address)
      if (Array.isArray(e.address))
        for (const o of e.address)
          i.push(this._getAddress(o));
      else
        i.push(this._getAddress(e.address));
    let a;
    "fromBlock" in e && (a = this._getBlockTag(e.fromBlock));
    let c;
    return "toBlock" in e && (c = this._getBlockTag(e.toBlock)), i.filter((o) => typeof o != "string").length || a != null && typeof a != "string" || c != null && typeof c != "string" ? Promise.all([Promise.all(i), a, c]).then((o) => s(o[0], o[1], o[2])) : s(i, a, c);
  }
  /**
   *  Returns or resovles to a transaction for %%request%%, resolving
   *  any ENS names or [[Addressable]] and returning if already a valid
   *  transaction.
   */
  _getTransactionRequest(e) {
    const t = Ta(e), n = [];
    if (["to", "from"].forEach((s) => {
      if (t[s] == null)
        return;
      const i = pe(t[s]);
      ra(i) ? n.push(async function() {
        t[s] = await i;
      }()) : t[s] = i;
    }), t.blockTag != null) {
      const s = this._getBlockTag(t.blockTag);
      ra(s) ? n.push(async function() {
        t.blockTag = await s;
      }()) : t.blockTag = s;
    }
    return n.length ? async function() {
      return await Promise.all(n), t;
    }() : t;
  }
  async getNetwork() {
    if (l(this, Se) == null) {
      const s = this._detectNetwork().then((i) => (this.emit("network", i, null), i), (i) => {
        throw l(this, Se) === s && x(this, Se, null), i;
      });
      return x(this, Se, s), (await s).clone();
    }
    const e = l(this, Se), [t, n] = await Promise.all([
      e,
      this._detectNetwork()
      // The actual connected network
    ]);
    return t.chainId !== n.chainId && (l(this, Wn) ? (this.emit("network", n, t), l(this, Se) === e && x(this, Se, Promise.resolve(n))) : A(!1, `network changed: ${t.chainId} => ${n.chainId} `, "NETWORK_ERROR", {
      event: "changed"
    })), t.clone();
  }
  async getFeeData() {
    const e = await this.getNetwork(), t = async () => {
      const { _block: s, gasPrice: i } = await he({
        _block: P(this, ki, Jc).call(this, "latest", !1),
        gasPrice: (async () => {
          try {
            const f = await P(this, Ce, Me).call(this, { method: "getGasPrice" });
            return S(f, "%response");
          } catch {
          }
          return null;
        })()
      });
      let a = null, c = null;
      const o = this._wrapBlock(s, e);
      return o && o.baseFeePerGas && (c = BigInt("1000000000"), a = o.baseFeePerGas * qb + c), new V0(i, a, c);
    }, n = e.getPlugin("org.ethers.plugins.network.FetchUrlFeeDataPlugin");
    if (n) {
      const s = new Jt(n.url), i = await n.processFunc(t, this, s);
      return new V0(i.gasPrice, i.maxFeePerGas, i.maxPriorityFeePerGas);
    }
    return await t();
  }
  async estimateGas(e) {
    let t = this._getTransactionRequest(e);
    return ra(t) && (t = await t), S(await P(this, Ce, Me).call(this, {
      method: "estimateGas",
      transaction: t
    }), "%response");
  }
  async call(e) {
    const { tx: t, blockTag: n } = await he({
      tx: this._getTransactionRequest(e),
      blockTag: this._getBlockTag(e.blockTag)
    });
    return await P(this, vi, zc).call(this, P(this, Ii, Qc).call(this, t, n, e.enableCcipRead ? 0 : -1));
  }
  async getBalance(e, t) {
    return S(await P(this, Yn, Ks).call(this, { method: "getBalance" }, e, t), "%response");
  }
  async getTransactionCount(e, t) {
    return L(await P(this, Yn, Ks).call(this, { method: "getTransactionCount" }, e, t), "%response");
  }
  async getCode(e, t) {
    return N(await P(this, Yn, Ks).call(this, { method: "getCode" }, e, t));
  }
  async getStorage(e, t, n) {
    const s = S(t, "position");
    return N(await P(this, Yn, Ks).call(this, { method: "getStorage", position: s }, e, n));
  }
  // Write
  async broadcastTransaction(e) {
    const { blockNumber: t, hash: n, network: s } = await he({
      blockNumber: this.getBlockNumber(),
      hash: this._perform({
        method: "broadcastTransaction",
        signedTransaction: e
      }),
      network: this.getNetwork()
    }), i = li.from(e);
    if (i.hash !== n)
      throw new Error("@TODO: the returned hash did not match");
    return this._wrapTransactionResponse(i, s).replaceableTransaction(t);
  }
  // Queries
  async getBlock(e, t) {
    const { network: n, params: s } = await he({
      network: this.getNetwork(),
      params: P(this, ki, Jc).call(this, e, !!t)
    });
    return s == null ? null : this._wrapBlock(s, n);
  }
  async getTransaction(e) {
    const { network: t, params: n } = await he({
      network: this.getNetwork(),
      params: P(this, Ce, Me).call(this, { method: "getTransaction", hash: e })
    });
    return n == null ? null : this._wrapTransactionResponse(n, t);
  }
  async getTransactionReceipt(e) {
    const { network: t, params: n } = await he({
      network: this.getNetwork(),
      params: P(this, Ce, Me).call(this, { method: "getTransactionReceipt", hash: e })
    });
    if (n == null)
      return null;
    if (n.gasPrice == null && n.effectiveGasPrice == null) {
      const s = await P(this, Ce, Me).call(this, { method: "getTransaction", hash: e });
      if (s == null)
        throw new Error("report this; could not find tx or effectiveGasPrice");
      n.effectiveGasPrice = s.gasPrice;
    }
    return this._wrapTransactionReceipt(n, t);
  }
  async getTransactionResult(e) {
    const { result: t } = await he({
      network: this.getNetwork(),
      result: P(this, Ce, Me).call(this, { method: "getTransactionResult", hash: e })
    });
    return t == null ? null : N(t);
  }
  // Bloom-filter Queries
  async getLogs(e) {
    let t = this._getFilter(e);
    ra(t) && (t = await t);
    const { network: n, params: s } = await he({
      network: this.getNetwork(),
      params: P(this, Ce, Me).call(this, { method: "getLogs", filter: t })
    });
    return s.map((i) => this._wrapLog(i, n));
  }
  // ENS
  _getProvider(e) {
    A(!1, "provider cannot connect to target network", "UNSUPPORTED_OPERATION", {
      operation: "_getProvider()"
    });
  }
  async getResolver(e) {
    return await Sa.fromName(this, e);
  }
  async getAvatar(e) {
    const t = await this.getResolver(e);
    return t ? await t.getAvatar() : null;
  }
  async resolveName(e) {
    const t = await this.getResolver(e);
    return t ? await t.getAddress() : null;
  }
  async lookupAddress(e) {
    e = F(e);
    const t = Fc(e.substring(2).toLowerCase() + ".addr.reverse");
    try {
      const n = await Sa.getEnsAddress(this), i = await new Zs(n, [
        "function resolver(bytes32) view returns (address)"
      ], this).resolver(t);
      if (i == null || i === Bc)
        return null;
      const c = await new Zs(i, [
        "function name(bytes32) view returns (string)"
      ], this).name(t);
      return await this.resolveName(c) !== e ? null : c;
    } catch (n) {
      if (je(n, "BAD_DATA") && n.value === "0x" || je(n, "CALL_EXCEPTION"))
        return null;
      throw n;
    }
    return null;
  }
  async waitForTransaction(e, t, n) {
    const s = t ?? 1;
    return s === 0 ? this.getTransactionReceipt(e) : new Promise(async (i, a) => {
      let c = null;
      const o = async (f) => {
        try {
          const u = await this.getTransactionReceipt(e);
          if (u != null && f - u.blockNumber + 1 >= s) {
            i(u), c && (clearTimeout(c), c = null);
            return;
          }
        } catch (u) {
          console.log("EEE", u);
        }
        this.once("block", o);
      };
      n != null && (c = setTimeout(() => {
        c != null && (c = null, this.off("block", o), a(ne("timeout", "TIMEOUT", { reason: "timeout" })));
      }, n)), o(await this.getBlockNumber());
    });
  }
  async waitForBlock(e) {
    A(!1, "not implemented yet", "NOT_IMPLEMENTED", {
      operation: "waitForBlock"
    });
  }
  /**
   *  Clear a timer created using the [[_setTimeout]] method.
   */
  _clearTimeout(e) {
    const t = l(this, Je).get(e);
    t && (t.timer && clearTimeout(t.timer), l(this, Je).delete(e));
  }
  /**
   *  Create a timer that will execute %%func%% after at least %%timeout%%
   *  (in ms). If %%timeout%% is unspecified, then %%func%% will execute
   *  in the next event loop.
   *
   *  [Pausing](AbstractProvider-paused) the provider will pause any
   *  associated timers.
   */
  _setTimeout(e, t) {
    t == null && (t = 0);
    const n = Ss(this, Ni)._++, s = () => {
      l(this, Je).delete(n), e();
    };
    if (this.paused)
      l(this, Je).set(n, { timer: null, func: s, time: t });
    else {
      const i = setTimeout(s, t);
      l(this, Je).set(n, { timer: i, func: s, time: hc() });
    }
    return n;
  }
  /**
   *  Perform %%func%% on each subscriber.
   */
  _forEachSubscriber(e) {
    for (const t of l(this, ue).values())
      e(t.subscriber);
  }
  /**
   *  Sub-classes may override this to customize subscription
   *  implementations.
   */
  _getSubscriber(e) {
    switch (e.type) {
      case "debug":
      case "error":
      case "network":
        return new hu(e.type);
      case "block": {
        const t = new Zb(this);
        return t.pollingInterval = this.pollingInterval, t;
      }
      case "event":
        return new No(this, e.filter);
      case "transaction":
        return new $b(this, e.hash);
      case "orphan":
        return new Xb(this, e.filter);
    }
    throw new Error(`unsupported event: ${e.type}`);
  }
  /**
   *  If a [[Subscriber]] fails and needs to replace itself, this
   *  method may be used.
   *
   *  For example, this is used for providers when using the
   *  ``eth_getFilterChanges`` method, which can return null if state
   *  filters are not supported by the backend, allowing the Subscriber
   *  to swap in a [[PollingEventSubscriber]].
   */
  _recoverSubscriber(e, t) {
    for (const n of l(this, ue).values())
      if (n.subscriber === e) {
        n.started && n.subscriber.stop(), n.subscriber = t, n.started && t.start(), l(this, de) != null && t.pause(l(this, de));
        break;
      }
  }
  async on(e, t) {
    const n = await P(this, hs, pa).call(this, e);
    return n.listeners.push({ listener: t, once: !1 }), n.started || (n.subscriber.start(), n.started = !0, l(this, de) != null && n.subscriber.pause(l(this, de))), this;
  }
  async once(e, t) {
    const n = await P(this, hs, pa).call(this, e);
    return n.listeners.push({ listener: t, once: !0 }), n.started || (n.subscriber.start(), n.started = !0, l(this, de) != null && n.subscriber.pause(l(this, de))), this;
  }
  async emit(e, ...t) {
    const n = await P(this, Zn, Vs).call(this, e, t);
    if (!n || n.listeners.length === 0)
      return !1;
    const s = n.listeners.length;
    return n.listeners = n.listeners.filter(({ listener: i, once: a }) => {
      const c = new pf(this, a ? null : i, e);
      try {
        i.call(this, ...t, c);
      } catch {
      }
      return !a;
    }), n.listeners.length === 0 && (n.started && n.subscriber.stop(), l(this, ue).delete(n.tag)), s > 0;
  }
  async listenerCount(e) {
    if (e) {
      const n = await P(this, Zn, Vs).call(this, e);
      return n ? n.listeners.length : 0;
    }
    let t = 0;
    for (const { listeners: n } of l(this, ue).values())
      t += n.length;
    return t;
  }
  async listeners(e) {
    if (e) {
      const n = await P(this, Zn, Vs).call(this, e);
      return n ? n.listeners.map(({ listener: s }) => s) : [];
    }
    let t = [];
    for (const { listeners: n } of l(this, ue).values())
      t = t.concat(n.map(({ listener: s }) => s));
    return t;
  }
  async off(e, t) {
    const n = await P(this, Zn, Vs).call(this, e);
    if (!n)
      return this;
    if (t) {
      const s = n.listeners.map(({ listener: i }) => i).indexOf(t);
      s >= 0 && n.listeners.splice(s, 1);
    }
    return (!t || n.listeners.length === 0) && (n.started && n.subscriber.stop(), l(this, ue).delete(n.tag)), this;
  }
  async removeAllListeners(e) {
    if (e) {
      const { tag: t, started: n, subscriber: s } = await P(this, hs, pa).call(this, e);
      n && s.stop(), l(this, ue).delete(t);
    } else
      for (const [t, { started: n, subscriber: s }] of l(this, ue))
        n && s.stop(), l(this, ue).delete(t);
    return this;
  }
  // Alias for "on"
  async addListener(e, t) {
    return await this.on(e, t);
  }
  // Alias for "off"
  async removeListener(e, t) {
    return this.off(e, t);
  }
  /**
   *  If this provider has been destroyed using the [[destroy]] method.
   *
   *  Once destroyed, all resources are reclaimed, internal event loops
   *  and timers are cleaned up and no further requests may be sent to
   *  the provider.
   */
  get destroyed() {
    return l(this, ls);
  }
  /**
   *  Sub-classes may use this to shutdown any sockets or release their
   *  resources and reject any pending requests.
   *
   *  Sub-classes **must** call ``super.destroy()``.
   */
  destroy() {
    this.removeAllListeners();
    for (const e of l(this, Je).keys())
      this._clearTimeout(e);
    x(this, ls, !0);
  }
  /**
   *  Whether the provider is currently paused.
   *
   *  A paused provider will not emit any events, and generally should
   *  not make any requests to the network, but that is up to sub-classes
   *  to manage.
   *
   *  Setting ``paused = true`` is identical to calling ``.pause(false)``,
   *  which will buffer any events that occur while paused until the
   *  provider is unpaused.
   */
  get paused() {
    return l(this, de) != null;
  }
  set paused(e) {
    !!e !== this.paused && (this.paused ? this.resume() : this.pause(!1));
  }
  /**
   *  Pause the provider. If %%dropWhilePaused%%, any events that occur
   *  while paused are dropped, otherwise all events will be emitted once
   *  the provider is unpaused.
   */
  pause(e) {
    if (x(this, Mt, -1), l(this, de) != null) {
      if (l(this, de) == !!e)
        return;
      A(!1, "cannot change pause type; resume first", "UNSUPPORTED_OPERATION", {
        operation: "pause"
      });
    }
    this._forEachSubscriber((t) => t.pause(e)), x(this, de, !!e);
    for (const t of l(this, Je).values())
      t.timer && clearTimeout(t.timer), t.time = hc() - t.time;
  }
  /**
   *  Resume the provider.
   */
  resume() {
    if (l(this, de) != null) {
      this._forEachSubscriber((e) => e.resume()), x(this, de, null);
      for (const e of l(this, Je).values()) {
        let t = e.time;
        t < 0 && (t = 0), e.time = hc(), setTimeout(e.func, t);
      }
    }
  }
}
ue = new WeakMap(), hn = new WeakMap(), de = new WeakMap(), ls = new WeakMap(), Se = new WeakMap(), Wn = new WeakMap(), xn = new WeakMap(), Mt = new WeakMap(), Ni = new WeakMap(), Je = new WeakMap(), us = new WeakMap(), ds = new WeakMap(), Ce = new WeakSet(), Me = async function(e) {
  const t = l(this, ds).cacheTimeout;
  if (t < 0)
    return await this._perform(e);
  const n = ba(e.method, e);
  let s = l(this, xn).get(n);
  return s || (s = this._perform(e), l(this, xn).set(n, s), setTimeout(() => {
    l(this, xn).get(n) === s && l(this, xn).delete(n);
  }, t)), await s;
}, Ii = new WeakSet(), Qc = async function(e, t, n) {
  A(n < ep, "CCIP read exceeded maximum redirections", "OFFCHAIN_FAULT", {
    reason: "TOO_MANY_REDIRECTS",
    transaction: Object.assign({}, e, { blockTag: t, enableCcipRead: !0 })
  });
  const s = Ta(e);
  try {
    return N(await this._perform({ method: "call", transaction: s, blockTag: t }));
  } catch (i) {
    if (!this.disableCcipRead && so(i) && i.data && n >= 0 && t === "latest" && s.to != null && W(i.data, 0, 4) === "0x556f1830") {
      const a = i.data, c = await pe(s.to, this);
      let o;
      try {
        o = op(W(i.data, 4));
      } catch (d) {
        A(!1, d.message, "OFFCHAIN_FAULT", {
          reason: "BAD_DATA",
          transaction: s,
          info: { data: a }
        });
      }
      A(o.sender.toLowerCase() === c.toLowerCase(), "CCIP Read sender mismatch", "CALL_EXCEPTION", {
        action: "call",
        data: a,
        reason: "OffchainLookup",
        transaction: s,
        invocation: null,
        revert: {
          signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
          name: "OffchainLookup",
          args: o.errorArgs
        }
      });
      const f = await this.ccipReadFetch(s, o.calldata, o.urls);
      A(f != null, "CCIP Read failed to fetch data", "OFFCHAIN_FAULT", {
        reason: "FETCH_FAILED",
        transaction: s,
        info: { data: i.data, errorArgs: o.errorArgs }
      });
      const u = {
        to: c,
        data: _([o.selector, cp([f, o.extraData])])
      };
      this.emit("debug", { action: "sendCcipReadCall", transaction: u });
      try {
        const d = await P(this, Ii, Qc).call(this, u, t, n + 1);
        return this.emit("debug", { action: "receiveCcipReadCallResult", transaction: Object.assign({}, u), result: d }), d;
      } catch (d) {
        throw this.emit("debug", { action: "receiveCcipReadCallError", transaction: Object.assign({}, u), error: d }), d;
      }
    }
    throw i;
  }
}, vi = new WeakSet(), zc = async function(e) {
  const { value: t } = await he({
    network: this.getNetwork(),
    value: e
  });
  return t;
}, Yn = new WeakSet(), Ks = async function(e, t, n) {
  let s = this._getAddress(t), i = this._getBlockTag(n);
  return (typeof s != "string" || typeof i != "string") && ([s, i] = await Promise.all([s, i])), await P(this, vi, zc).call(this, P(this, Ce, Me).call(this, Object.assign(e, { address: s, blockTag: i })));
}, ki = new WeakSet(), Jc = async function(e, t) {
  if (q(e, 32))
    return await P(this, Ce, Me).call(this, {
      method: "getBlock",
      blockHash: e,
      includeTransactions: t
    });
  let n = this._getBlockTag(e);
  return typeof n != "string" && (n = await n), await P(this, Ce, Me).call(this, {
    method: "getBlock",
    blockTag: n,
    includeTransactions: t
  });
}, Zn = new WeakSet(), Vs = async function(e, t) {
  let n = await dc(e, this);
  return n.type === "event" && t && t.length > 0 && t[0].removed === !0 && (n = await dc({ orphan: "drop-log", log: t[0] }, this)), l(this, ue).get(n.tag) || null;
}, hs = new WeakSet(), pa = async function(e) {
  const t = await dc(e, this), n = t.tag;
  let s = l(this, ue).get(n);
  return s || (s = { subscriber: this._getSubscriber(t), tag: n, addressableMap: /* @__PURE__ */ new WeakMap(), nameMap: /* @__PURE__ */ new Map(), started: !1, listeners: [] }, l(this, ue).set(n, s)), s;
};
function sp(r, e) {
  try {
    const t = jc(r, e);
    if (t)
      return io(t);
  } catch {
  }
  return null;
}
function jc(r, e) {
  if (r === "0x")
    return null;
  try {
    const t = L(W(r, e, e + 32)), n = L(W(r, t, t + 32));
    return W(r, t + 32, t + 32 + n);
  } catch {
  }
  return null;
}
function Z0(r) {
  const e = me(r);
  if (e.length > 32)
    throw new Error("internal; should not happen");
  const t = new Uint8Array(32);
  return t.set(e, 32 - e.length), t;
}
function ip(r) {
  if (r.length % 32 === 0)
    return r;
  const e = new Uint8Array(Math.ceil(r.length / 32) * 32);
  return e.set(r), e;
}
const ap = new Uint8Array([]);
function cp(r) {
  const e = [];
  let t = 0;
  for (let n = 0; n < r.length; n++)
    e.push(ap), t += 32;
  for (let n = 0; n < r.length; n++) {
    const s = O(r[n]);
    e[n] = Z0(t), e.push(Z0(s.length)), e.push(ip(s)), t += 32 + Math.ceil(s.length / 32) * 32;
  }
  return _(e);
}
const X0 = "0x0000000000000000000000000000000000000000000000000000000000000000";
function op(r) {
  const e = {
    sender: "",
    urls: [],
    calldata: "",
    selector: "",
    extraData: "",
    errorArgs: []
  };
  A(vr(r) >= 5 * 32, "insufficient OffchainLookup data", "OFFCHAIN_FAULT", {
    reason: "insufficient OffchainLookup data"
  });
  const t = W(r, 0, 32);
  A(W(t, 0, 12) === W(X0, 0, 12), "corrupt OffchainLookup sender", "OFFCHAIN_FAULT", {
    reason: "corrupt OffchainLookup sender"
  }), e.sender = W(t, 12);
  try {
    const n = [], s = L(W(r, 32, 64)), i = L(W(r, s, s + 32)), a = W(r, s + 32);
    for (let c = 0; c < i; c++) {
      const o = sp(a, c * 32);
      if (o == null)
        throw new Error("abort");
      n.push(o);
    }
    e.urls = n;
  } catch {
    A(!1, "corrupt OffchainLookup urls", "OFFCHAIN_FAULT", {
      reason: "corrupt OffchainLookup urls"
    });
  }
  try {
    const n = jc(r, 64);
    if (n == null)
      throw new Error("abort");
    e.calldata = n;
  } catch {
    A(!1, "corrupt OffchainLookup calldata", "OFFCHAIN_FAULT", {
      reason: "corrupt OffchainLookup calldata"
    });
  }
  A(W(r, 100, 128) === W(X0, 0, 28), "corrupt OffchainLookup callbaackSelector", "OFFCHAIN_FAULT", {
    reason: "corrupt OffchainLookup callbaackSelector"
  }), e.selector = W(r, 96, 100);
  try {
    const n = jc(r, 128);
    if (n == null)
      throw new Error("abort");
    e.extraData = n;
  } catch {
    A(!1, "corrupt OffchainLookup extraData", "OFFCHAIN_FAULT", {
      reason: "corrupt OffchainLookup extraData"
    });
  }
  return e.errorArgs = "sender,urls,calldata,selector,extraData".split(/,/).map((n) => e[n]), e;
}
function br(r, e) {
  if (r.provider)
    return r.provider;
  A(!1, "missing provider", "UNSUPPORTED_OPERATION", { operation: e });
}
async function $0(r, e) {
  let t = Ta(e);
  if (t.to != null && (t.to = pe(t.to, r)), t.from != null) {
    const n = t.from;
    t.from = Promise.all([
      r.getAddress(),
      pe(n, r)
    ]).then(([s, i]) => (b(s.toLowerCase() === i.toLowerCase(), "transaction from mismatch", "tx.from", i), s));
  } else
    t.from = r.getAddress();
  return await he(t);
}
class Io {
  /**
   *  Creates a new Signer connected to %%provider%%.
   */
  constructor(e) {
    /**
     *  The provider this signer is connected to.
     */
    g(this, "provider");
    T(this, { provider: e || null });
  }
  async getNonce(e) {
    return br(this, "getTransactionCount").getTransactionCount(await this.getAddress(), e);
  }
  async populateCall(e) {
    return await $0(this, e);
  }
  async populateTransaction(e) {
    const t = br(this, "populateTransaction"), n = await $0(this, e);
    n.nonce == null && (n.nonce = await this.getNonce("pending")), n.gasLimit == null && (n.gasLimit = await this.estimateGas(n));
    const s = await this.provider.getNetwork();
    if (n.chainId != null) {
      const a = S(n.chainId);
      b(a === s.chainId, "transaction chainId mismatch", "tx.chainId", e.chainId);
    } else
      n.chainId = s.chainId;
    const i = n.maxFeePerGas != null || n.maxPriorityFeePerGas != null;
    if (n.gasPrice != null && (n.type === 2 || i) ? b(!1, "eip-1559 transaction do not support gasPrice", "tx", e) : (n.type === 0 || n.type === 1) && i && b(!1, "pre-eip-1559 transaction do not support maxFeePerGas/maxPriorityFeePerGas", "tx", e), (n.type === 2 || n.type == null) && n.maxFeePerGas != null && n.maxPriorityFeePerGas != null)
      n.type = 2;
    else if (n.type === 0 || n.type === 1) {
      const a = await t.getFeeData();
      A(a.gasPrice != null, "network does not support gasPrice", "UNSUPPORTED_OPERATION", {
        operation: "getGasPrice"
      }), n.gasPrice == null && (n.gasPrice = a.gasPrice);
    } else {
      const a = await t.getFeeData();
      if (n.type == null)
        if (a.maxFeePerGas != null && a.maxPriorityFeePerGas != null)
          if (n.type = 2, n.gasPrice != null) {
            const c = n.gasPrice;
            delete n.gasPrice, n.maxFeePerGas = c, n.maxPriorityFeePerGas = c;
          } else
            n.maxFeePerGas == null && (n.maxFeePerGas = a.maxFeePerGas), n.maxPriorityFeePerGas == null && (n.maxPriorityFeePerGas = a.maxPriorityFeePerGas);
        else
          a.gasPrice != null ? (A(!i, "network does not support EIP-1559", "UNSUPPORTED_OPERATION", {
            operation: "populateTransaction"
          }), n.gasPrice == null && (n.gasPrice = a.gasPrice), n.type = 0) : A(!1, "failed to get consistent fee data", "UNSUPPORTED_OPERATION", {
            operation: "signer.getFeeData"
          });
      else
        n.type === 2 && (n.maxFeePerGas == null && (n.maxFeePerGas = a.maxFeePerGas), n.maxPriorityFeePerGas == null && (n.maxPriorityFeePerGas = a.maxPriorityFeePerGas));
    }
    return await he(n);
  }
  async estimateGas(e) {
    return br(this, "estimateGas").estimateGas(await this.populateCall(e));
  }
  async call(e) {
    return br(this, "call").call(await this.populateCall(e));
  }
  async resolveName(e) {
    return await br(this, "resolveName").resolveName(e);
  }
  async sendTransaction(e) {
    const t = br(this, "sendTransaction"), n = await this.populateTransaction(e);
    delete n.from;
    const s = li.from(n);
    return await t.broadcastTransaction(await this.signTransaction(s));
  }
}
var xs, ga;
const Bo = class Bo extends Io {
  /**
   *  Creates a new **VoidSigner** with %%address%% attached to
   *  %%provider%%.
   */
  constructor(t, n) {
    super(n);
    y(this, xs);
    /**
     *  The signer address.
     */
    g(this, "address");
    T(this, { address: t });
  }
  async getAddress() {
    return this.address;
  }
  connect(t) {
    return new Bo(this.address, t);
  }
  async signTransaction(t) {
    P(this, xs, ga).call(this, "transactions", "signTransaction");
  }
  async signMessage(t) {
    P(this, xs, ga).call(this, "messages", "signMessage");
  }
  async signTypedData(t, n, s) {
    P(this, xs, ga).call(this, "typed-data", "signTypedData");
  }
};
xs = new WeakSet(), ga = function(t, n) {
  A(!1, `VoidSigner cannot sign ${t}`, "UNSUPPORTED_OPERATION", { operation: n });
};
let Wc = Bo;
function fp(r) {
  return JSON.parse(JSON.stringify(r));
}
var Pe, yt, Xn, bn, $n, bs, Oi, Yc, Ti, Zc;
class xu {
  /**
   *  Creates a new **FilterIdSubscriber** which will used [[_subscribe]]
   *  and [[_emitResults]] to setup the subscription and provide the event
   *  to the %%provider%%.
   */
  constructor(e) {
    y(this, Oi);
    y(this, Ti);
    y(this, Pe, void 0);
    y(this, yt, void 0);
    y(this, Xn, void 0);
    y(this, bn, void 0);
    y(this, $n, void 0);
    y(this, bs, void 0);
    x(this, Pe, e), x(this, yt, null), x(this, Xn, P(this, Oi, Yc).bind(this)), x(this, bn, !1), x(this, $n, null), x(this, bs, !1);
  }
  /**
   *  Sub-classes **must** override this to begin the subscription.
   */
  _subscribe(e) {
    throw new Error("subclasses must override this");
  }
  /**
   *  Sub-classes **must** override this handle the events.
   */
  _emitResults(e, t) {
    throw new Error("subclasses must override this");
  }
  /**
   *  Sub-classes **must** override this handle recovery on errors.
   */
  _recover(e) {
    throw new Error("subclasses must override this");
  }
  start() {
    l(this, bn) || (x(this, bn, !0), P(this, Oi, Yc).call(this, -2));
  }
  stop() {
    l(this, bn) && (x(this, bn, !1), x(this, bs, !0), P(this, Ti, Zc).call(this), l(this, Pe).off("block", l(this, Xn)));
  }
  pause(e) {
    e && P(this, Ti, Zc).call(this), l(this, Pe).off("block", l(this, Xn));
  }
  resume() {
    this.start();
  }
}
Pe = new WeakMap(), yt = new WeakMap(), Xn = new WeakMap(), bn = new WeakMap(), $n = new WeakMap(), bs = new WeakMap(), Oi = new WeakSet(), Yc = async function(e) {
  try {
    l(this, yt) == null && x(this, yt, this._subscribe(l(this, Pe)));
    let t = null;
    try {
      t = await l(this, yt);
    } catch (i) {
      if (!je(i, "UNSUPPORTED_OPERATION") || i.operation !== "eth_newFilter")
        throw i;
    }
    if (t == null) {
      x(this, yt, null), l(this, Pe)._recoverSubscriber(this, this._recover(l(this, Pe)));
      return;
    }
    const n = await l(this, Pe).getNetwork();
    if (l(this, $n) || x(this, $n, n), l(this, $n).chainId !== n.chainId)
      throw new Error("chaid changed");
    if (l(this, bs))
      return;
    const s = await l(this, Pe).send("eth_getFilterChanges", [t]);
    await this._emitResults(l(this, Pe), s);
  } catch (t) {
    console.log("@TODO", t);
  }
  l(this, Pe).once("block", l(this, Xn));
}, Ti = new WeakSet(), Zc = function() {
  const e = l(this, yt);
  e && (x(this, yt, null), e.then((t) => {
    l(this, Pe).send("eth_uninstallFilter", [t]);
  }));
};
var qn;
class lp extends xu {
  /**
   *  Creates a new **FilterIdEventSubscriber** attached to %%provider%%
   *  listening for %%filter%%.
   */
  constructor(t, n) {
    super(t);
    y(this, qn, void 0);
    x(this, qn, fp(n));
  }
  _recover(t) {
    return new No(t, l(this, qn));
  }
  async _subscribe(t) {
    return await t.send("eth_newFilter", [l(this, qn)]);
  }
  async _emitResults(t, n) {
    for (const s of n)
      t.emit(l(this, qn), t._wrapLog(s, t._network));
  }
}
qn = new WeakMap();
class up extends xu {
  async _subscribe(e) {
    return await e.send("eth_newPendingTransactionFilter", []);
  }
  async _emitResults(e, t) {
    for (const n of t)
      e.emit("pending", n);
  }
}
const dp = "bigint,boolean,function,number,string,symbol".split(/,/g);
function ya(r) {
  if (r == null || dp.indexOf(typeof r) >= 0 || typeof r.getAddress == "function")
    return r;
  if (Array.isArray(r))
    return r.map(ya);
  if (typeof r == "object")
    return Object.keys(r).reduce((e, t) => (e[t] = r[t], e), {});
  throw new Error(`should not happen: ${r} (${typeof r})`);
}
function hp(r) {
  return new Promise((e) => {
    setTimeout(e, r);
  });
}
function pr(r) {
  return r && r.toLowerCase();
}
function q0(r) {
  return r && typeof r.pollingInterval == "number";
}
const xp = {
  polling: !1,
  staticNetwork: null,
  batchStallTime: 10,
  batchMaxSize: 1 << 20,
  batchMaxCount: 100,
  cacheTimeout: 250,
  pollingInterval: 4e3
};
class xc extends Io {
  constructor(t, n) {
    super(t);
    g(this, "address");
    n = F(n), T(this, { address: n });
  }
  connect(t) {
    A(!1, "cannot reconnect JsonRpcSigner", "UNSUPPORTED_OPERATION", {
      operation: "signer.connect"
    });
  }
  async getAddress() {
    return this.address;
  }
  // JSON-RPC will automatially fill in nonce, etc. so we just check from
  async populateTransaction(t) {
    return await this.populateCall(t);
  }
  // Returns just the hash of the transaction after sent, which is what
  // the bare JSON-RPC API does;
  async sendUncheckedTransaction(t) {
    const n = ya(t), s = [];
    if (n.from) {
      const a = n.from;
      s.push((async () => {
        const c = await pe(a, this.provider);
        b(c != null && c.toLowerCase() === this.address.toLowerCase(), "from address mismatch", "transaction", t), n.from = c;
      })());
    } else
      n.from = this.address;
    if (n.gasLimit == null && s.push((async () => {
      n.gasLimit = await this.provider.estimateGas({ ...n, from: this.address });
    })()), n.to != null) {
      const a = n.to;
      s.push((async () => {
        n.to = await pe(a, this.provider);
      })());
    }
    s.length && await Promise.all(s);
    const i = this.provider.getRpcTransaction(n);
    return this.provider.send("eth_sendTransaction", [i]);
  }
  async sendTransaction(t) {
    const n = await this.provider.getBlockNumber(), s = await this.sendUncheckedTransaction(t);
    return await new Promise((i, a) => {
      const c = [1e3, 100], o = async () => {
        const f = await this.provider.getTransaction(s);
        if (f != null) {
          i(f.replaceableTransaction(n));
          return;
        }
        this.provider._setTimeout(() => {
          o();
        }, c.pop() || 4e3);
      };
      o();
    });
  }
  async signTransaction(t) {
    const n = ya(t);
    if (n.from) {
      const i = await pe(n.from, this.provider);
      b(i != null && i.toLowerCase() === this.address.toLowerCase(), "from address mismatch", "transaction", t), n.from = i;
    } else
      n.from = this.address;
    const s = this.provider.getRpcTransaction(n);
    return await this.provider.send("eth_signTransaction", [s]);
  }
  async signMessage(t) {
    const n = typeof t == "string" ? Ee(t) : t;
    return await this.provider.send("personal_sign", [
      N(n),
      this.address.toLowerCase()
    ]);
  }
  async signTypedData(t, n, s) {
    const i = ya(s), a = await Cs.resolveNames(t, n, i, async (c) => {
      const o = await pe(c);
      return b(o != null, "TypedData does not support null address", "value", c), o;
    });
    return await this.provider.send("eth_signTypedData_v4", [
      this.address.toLowerCase(),
      JSON.stringify(Cs.getPayload(a.domain, n, a.value))
    ]);
  }
  async unlock(t) {
    return this.provider.send("personal_unlockAccount", [
      this.address.toLowerCase(),
      t,
      null
    ]);
  }
  // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
  async _legacySignMessage(t) {
    const n = typeof t == "string" ? Ee(t) : t;
    return await this.provider.send("eth_sign", [
      this.address.toLowerCase(),
      N(n)
    ]);
  }
}
var er, ps, Gt, mt, nt, Ht, Ri, Xc;
class bp extends rp {
  constructor(t, n) {
    super(t, n);
    y(this, Ri);
    y(this, er, void 0);
    // The next ID to use for the JSON-RPC ID field
    y(this, ps, void 0);
    // Payloads are queued and triggered in batches using the drainTimer
    y(this, Gt, void 0);
    y(this, mt, void 0);
    y(this, nt, void 0);
    y(this, Ht, void 0);
    x(this, ps, 1), x(this, er, Object.assign({}, xp, n || {})), x(this, Gt, []), x(this, mt, null), x(this, Ht, null);
    {
      let i = null;
      const a = new Promise((c) => {
        i = c;
      });
      x(this, nt, { promise: a, resolve: i });
    }
    const s = this._getOption("staticNetwork");
    s && (b(t == null || s.matches(t), "staticNetwork MUST match network object", "options", n), x(this, Ht, s));
  }
  /**
   *  Returns the value associated with the option %%key%%.
   *
   *  Sub-classes can use this to inquire about configuration options.
   */
  _getOption(t) {
    return l(this, er)[t];
  }
  /**
   *  Gets the [[Network]] this provider has committed to. On each call, the network
   *  is detected, and if it has changed, the call will reject.
   */
  get _network() {
    return A(l(this, Ht), "network is not available yet", "NETWORK_ERROR"), l(this, Ht);
  }
  /**
   *  Resolves to the non-normalized value by performing %%req%%.
   *
   *  Sub-classes may override this to modify behavior of actions,
   *  and should generally call ``super._perform`` as a fallback.
   */
  async _perform(t) {
    if (t.method === "call" || t.method === "estimateGas") {
      let s = t.transaction;
      if (s && s.type != null && S(s.type) && s.maxFeePerGas == null && s.maxPriorityFeePerGas == null) {
        const i = await this.getFeeData();
        i.maxFeePerGas == null && i.maxPriorityFeePerGas == null && (t = Object.assign({}, t, {
          transaction: Object.assign({}, s, { type: void 0 })
        }));
      }
    }
    const n = this.getRpcRequest(t);
    return n != null ? await this.send(n.method, n.args) : super._perform(t);
  }
  /**
   *  Sub-classes may override this; it detects the *actual* network that
   *  we are **currently** connected to.
   *
   *  Keep in mind that [[send]] may only be used once [[ready]], otherwise the
   *  _send primitive must be used instead.
   */
  async _detectNetwork() {
    const t = this._getOption("staticNetwork");
    if (t)
      return t;
    if (this.ready)
      return Vt.from(S(await this.send("eth_chainId", [])));
    const n = {
      id: Ss(this, ps)._++,
      method: "eth_chainId",
      params: [],
      jsonrpc: "2.0"
    };
    this.emit("debug", { action: "sendRpcPayload", payload: n });
    let s;
    try {
      s = (await this._send(n))[0];
    } catch (i) {
      throw this.emit("debug", { action: "receiveRpcError", error: i }), i;
    }
    if (this.emit("debug", { action: "receiveRpcResult", result: s }), "result" in s)
      return Vt.from(S(s.result));
    throw this.getRpcError(n, s);
  }
  /**
   *  Sub-classes **MUST** call this. Until [[_start]] has been called, no calls
   *  will be passed to [[_send]] from [[send]]. If it is overridden, then
   *  ``super._start()`` **MUST** be called.
   *
   *  Calling it multiple times is safe and has no effect.
   */
  _start() {
    l(this, nt) == null || l(this, nt).resolve == null || (l(this, nt).resolve(), x(this, nt, null), (async () => {
      for (; l(this, Ht) == null && !this.destroyed; )
        try {
          x(this, Ht, await this._detectNetwork());
        } catch (t) {
          if (this.destroyed)
            break;
          console.log("JsonRpcProvider failed to detect network and cannot start up; retry in 1s (perhaps the URL is wrong or the node is not started)"), this.emit("error", ne("failed to bootstrap network detection", "NETWORK_ERROR", { event: "initial-network-discovery", info: { error: t } })), await hp(1e3);
        }
      P(this, Ri, Xc).call(this);
    })());
  }
  /**
   *  Resolves once the [[_start]] has been called. This can be used in
   *  sub-classes to defer sending data until the connection has been
   *  established.
   */
  async _waitUntilReady() {
    if (l(this, nt) != null)
      return await l(this, nt).promise;
  }
  /**
   *  Return a Subscriber that will manage the %%sub%%.
   *
   *  Sub-classes may override this to modify the behavior of
   *  subscription management.
   */
  _getSubscriber(t) {
    return t.type === "pending" ? new up(this) : t.type === "event" ? this._getOption("polling") ? new No(this, t.filter) : new lp(this, t.filter) : t.type === "orphan" && t.filter.orphan === "drop-log" ? new hu("orphan") : super._getSubscriber(t);
  }
  /**
   *  Returns true only if the [[_start]] has been called.
   */
  get ready() {
    return l(this, nt) == null;
  }
  /**
   *  Returns %%tx%% as a normalized JSON-RPC transaction request,
   *  which has all values hexlified and any numeric values converted
   *  to Quantity values.
   */
  getRpcTransaction(t) {
    const n = {};
    return ["chainId", "gasLimit", "gasPrice", "type", "maxFeePerGas", "maxPriorityFeePerGas", "nonce", "value"].forEach((s) => {
      if (t[s] == null)
        return;
      let i = s;
      s === "gasLimit" && (i = "gas"), n[i] = Cr(S(t[s], `tx.${s}`));
    }), ["from", "to", "data"].forEach((s) => {
      t[s] != null && (n[s] = N(t[s]));
    }), t.accessList && (n.accessList = hr(t.accessList)), n;
  }
  /**
   *  Returns the request method and arguments required to perform
   *  %%req%%.
   */
  getRpcRequest(t) {
    switch (t.method) {
      case "chainId":
        return { method: "eth_chainId", args: [] };
      case "getBlockNumber":
        return { method: "eth_blockNumber", args: [] };
      case "getGasPrice":
        return { method: "eth_gasPrice", args: [] };
      case "getBalance":
        return {
          method: "eth_getBalance",
          args: [pr(t.address), t.blockTag]
        };
      case "getTransactionCount":
        return {
          method: "eth_getTransactionCount",
          args: [pr(t.address), t.blockTag]
        };
      case "getCode":
        return {
          method: "eth_getCode",
          args: [pr(t.address), t.blockTag]
        };
      case "getStorage":
        return {
          method: "eth_getStorageAt",
          args: [
            pr(t.address),
            "0x" + t.position.toString(16),
            t.blockTag
          ]
        };
      case "broadcastTransaction":
        return {
          method: "eth_sendRawTransaction",
          args: [t.signedTransaction]
        };
      case "getBlock":
        if ("blockTag" in t)
          return {
            method: "eth_getBlockByNumber",
            args: [t.blockTag, !!t.includeTransactions]
          };
        if ("blockHash" in t)
          return {
            method: "eth_getBlockByHash",
            args: [t.blockHash, !!t.includeTransactions]
          };
        break;
      case "getTransaction":
        return {
          method: "eth_getTransactionByHash",
          args: [t.hash]
        };
      case "getTransactionReceipt":
        return {
          method: "eth_getTransactionReceipt",
          args: [t.hash]
        };
      case "call":
        return {
          method: "eth_call",
          args: [this.getRpcTransaction(t.transaction), t.blockTag]
        };
      case "estimateGas":
        return {
          method: "eth_estimateGas",
          args: [this.getRpcTransaction(t.transaction)]
        };
      case "getLogs":
        return t.filter && t.filter.address != null && (Array.isArray(t.filter.address) ? t.filter.address = t.filter.address.map(pr) : t.filter.address = pr(t.filter.address)), { method: "eth_getLogs", args: [t.filter] };
    }
    return null;
  }
  /**
   *  Returns an ethers-style Error for the given JSON-RPC error
   *  %%payload%%, coalescing the various strings and error shapes
   *  that different nodes return, coercing them into a machine-readable
   *  standardized error.
   */
  getRpcError(t, n) {
    const { method: s } = t, { error: i } = n;
    if (s === "eth_estimateGas" && i.message) {
      const o = i.message;
      if (!o.match(/revert/i) && o.match(/insufficient funds/i))
        return ne("insufficient funds", "INSUFFICIENT_FUNDS", {
          transaction: t.params[0],
          info: { payload: t, error: i }
        });
    }
    if (s === "eth_call" || s === "eth_estimateGas") {
      const o = $c(i), f = di.getBuiltinCallException(s === "eth_call" ? "call" : "estimateGas", t.params[0], o ? o.data : null);
      return f.info = { error: i, payload: t }, f;
    }
    const a = JSON.stringify(gp(i));
    if (typeof i.message == "string" && i.message.match(/user denied|ethers-user-denied/i))
      return ne("user rejected action", "ACTION_REJECTED", {
        action: {
          eth_sign: "signMessage",
          personal_sign: "signMessage",
          eth_signTypedData_v4: "signTypedData",
          eth_signTransaction: "signTransaction",
          eth_sendTransaction: "sendTransaction",
          eth_requestAccounts: "requestAccess",
          wallet_requestAccounts: "requestAccess"
        }[s] || "unknown",
        reason: "rejected",
        info: { payload: t, error: i }
      });
    if (s === "eth_sendRawTransaction" || s === "eth_sendTransaction") {
      const o = t.params[0];
      if (a.match(/insufficient funds|base fee exceeds gas limit/i))
        return ne("insufficient funds for intrinsic transaction cost", "INSUFFICIENT_FUNDS", {
          transaction: o,
          info: { error: i }
        });
      if (a.match(/nonce/i) && a.match(/too low/i))
        return ne("nonce has already been used", "NONCE_EXPIRED", { transaction: o, info: { error: i } });
      if (a.match(/replacement transaction/i) && a.match(/underpriced/i))
        return ne("replacement fee too low", "REPLACEMENT_UNDERPRICED", { transaction: o, info: { error: i } });
      if (a.match(/only replay-protected/i))
        return ne("legacy pre-eip-155 transactions not supported", "UNSUPPORTED_OPERATION", {
          operation: s,
          info: { transaction: o, info: { error: i } }
        });
    }
    let c = !!a.match(/the method .* does not exist/i);
    return c || i && i.details && i.details.startsWith("Unauthorized method:") && (c = !0), c ? ne("unsupported operation", "UNSUPPORTED_OPERATION", {
      operation: t.method,
      info: { error: i, payload: t }
    }) : ne("could not coalesce error", "UNKNOWN_ERROR", { error: i, payload: t });
  }
  /**
   *  Requests the %%method%% with %%params%% via the JSON-RPC protocol
   *  over the underlying channel. This can be used to call methods
   *  on the backend that do not have a high-level API within the Provider
   *  API.
   *
   *  This method queues requests according to the batch constraints
   *  in the options, assigns the request a unique ID.
   *
   *  **Do NOT override** this method in sub-classes; instead
   *  override [[_send]] or force the options values in the
   *  call to the constructor to modify this method's behavior.
   */
  send(t, n) {
    if (this.destroyed)
      return Promise.reject(ne("provider destroyed; cancelled request", "UNSUPPORTED_OPERATION", { operation: t }));
    const s = Ss(this, ps)._++, i = new Promise((a, c) => {
      l(this, Gt).push({
        resolve: a,
        reject: c,
        payload: { method: t, params: n, id: s, jsonrpc: "2.0" }
      });
    });
    return P(this, Ri, Xc).call(this), i;
  }
  /**
   *  Resolves to the [[Signer]] account for  %%address%% managed by
   *  the client.
   *
   *  If the %%address%% is a number, it is used as an index in the
   *  the accounts from [[listAccounts]].
   *
   *  This can only be used on clients which manage accounts (such as
   *  Geth with imported account or MetaMask).
   *
   *  Throws if the account doesn't exist.
   */
  async getSigner(t) {
    t == null && (t = 0);
    const n = this.send("eth_accounts", []);
    if (typeof t == "number") {
      const i = await n;
      if (t >= i.length)
        throw new Error("no such account");
      return new xc(this, i[t]);
    }
    const { accounts: s } = await he({
      network: this.getNetwork(),
      accounts: n
    });
    t = F(t);
    for (const i of s)
      if (F(i) === t)
        return new xc(this, t);
    throw new Error("invalid account");
  }
  async listAccounts() {
    return (await this.send("eth_accounts", [])).map((n) => new xc(this, n));
  }
  destroy() {
    l(this, mt) && (clearTimeout(l(this, mt)), x(this, mt, null));
    for (const { payload: t, reject: n } of l(this, Gt))
      n(ne("provider destroyed; cancelled request", "UNSUPPORTED_OPERATION", { operation: t.method }));
    x(this, Gt, []), super.destroy();
  }
}
er = new WeakMap(), ps = new WeakMap(), Gt = new WeakMap(), mt = new WeakMap(), nt = new WeakMap(), Ht = new WeakMap(), Ri = new WeakSet(), Xc = function() {
  if (l(this, mt))
    return;
  const t = this._getOption("batchMaxCount") === 1 ? 0 : this._getOption("batchStallTime");
  x(this, mt, setTimeout(() => {
    x(this, mt, null);
    const n = l(this, Gt);
    for (x(this, Gt, []); n.length; ) {
      const s = [n.shift()];
      for (; n.length && s.length !== l(this, er).batchMaxCount; )
        if (s.push(n.shift()), JSON.stringify(s.map((a) => a.payload)).length > l(this, er).batchMaxSize) {
          n.unshift(s.pop());
          break;
        }
      (async () => {
        const i = s.length === 1 ? s[0].payload : s.map((a) => a.payload);
        this.emit("debug", { action: "sendRpcPayload", payload: i });
        try {
          const a = await this._send(i);
          this.emit("debug", { action: "receiveRpcResult", result: a });
          for (const { resolve: c, reject: o, payload: f } of s) {
            if (this.destroyed) {
              o(ne("provider destroyed; cancelled request", "UNSUPPORTED_OPERATION", { operation: f.method }));
              continue;
            }
            const u = a.filter((d) => d.id === f.id)[0];
            if (u == null) {
              const d = ne("missing response for request", "BAD_DATA", {
                value: a,
                info: { payload: f }
              });
              this.emit("error", d), o(d);
              continue;
            }
            if ("error" in u) {
              o(this.getRpcError(f, u));
              continue;
            }
            c(u.result);
          }
        } catch (a) {
          this.emit("debug", { action: "receiveRpcError", error: a });
          for (const { reject: c } of s)
            c(a);
        }
      })();
    }
  }, t));
};
var pn;
class pp extends bp {
  constructor(t, n) {
    super(t, n);
    y(this, pn, void 0);
    x(this, pn, 4e3);
  }
  _getSubscriber(t) {
    const n = super._getSubscriber(t);
    return q0(n) && (n.pollingInterval = l(this, pn)), n;
  }
  /**
   *  The polling interval (default: 4000 ms)
   */
  get pollingInterval() {
    return l(this, pn);
  }
  set pollingInterval(t) {
    if (!Number.isInteger(t) || t < 0)
      throw new Error("invalid interval");
    x(this, pn, t), this._forEachSubscriber((n) => {
      q0(n) && (n.pollingInterval = l(this, pn));
    });
  }
}
pn = new WeakMap();
var gs;
class sa extends pp {
  constructor(t, n, s) {
    t == null && (t = "http://localhost:8545");
    super(n, s);
    y(this, gs, void 0);
    typeof t == "string" ? x(this, gs, new Jt(t)) : x(this, gs, t.clone());
  }
  _getConnection() {
    return l(this, gs).clone();
  }
  async send(t, n) {
    return await this._start(), await super.send(t, n);
  }
  async _send(t) {
    const n = this._getConnection();
    n.body = JSON.stringify(t), n.setHeader("content-type", "application/json");
    const s = await n.send();
    s.assertOk();
    let i = s.bodyJson;
    return Array.isArray(i) || (i = [i]), i;
  }
}
gs = new WeakMap();
function $c(r) {
  if (r == null)
    return null;
  if (typeof r.message == "string" && r.message.match(/revert/i) && q(r.data))
    return { message: r.message, data: r.data };
  if (typeof r == "object") {
    for (const e in r) {
      const t = $c(r[e]);
      if (t)
        return t;
    }
    return null;
  }
  if (typeof r == "string")
    try {
      return $c(JSON.parse(r));
    } catch {
    }
  return null;
}
function qc(r, e) {
  if (r != null) {
    if (typeof r.message == "string" && e.push(r.message), typeof r == "object")
      for (const t in r)
        qc(r[t], e);
    if (typeof r == "string")
      try {
        return qc(JSON.parse(r), e);
      } catch {
      }
  }
}
function gp(r) {
  const e = [];
  return qc(r, e), e;
}
var ys;
const Uo = class Uo extends Io {
  /**
   *  Creates a new BaseWallet for %%privateKey%%, optionally
   *  connected to %%provider%%.
   *
   *  If %%provider%% is not specified, only offline methods can
   *  be used.
   */
  constructor(t, n) {
    super(n);
    /**
     *  The wallet address.
     */
    g(this, "address");
    y(this, ys, void 0);
    b(t && typeof t.sign == "function", "invalid private key", "privateKey", "[ REDACTED ]"), x(this, ys, t);
    const s = Mi(this.signingKey.publicKey);
    T(this, { address: s });
  }
  // Store private values behind getters to reduce visibility
  // in console.log
  /**
   *  The [[SigningKey]] used for signing payloads.
   */
  get signingKey() {
    return l(this, ys);
  }
  /**
   *  The private key for this wallet.
   */
  get privateKey() {
    return this.signingKey.privateKey;
  }
  async getAddress() {
    return this.address;
  }
  connect(t) {
    return new Uo(l(this, ys), t);
  }
  async signTransaction(t) {
    const { to: n, from: s } = await he({
      to: t.to ? pe(t.to, this.provider) : void 0,
      from: t.from ? pe(t.from, this.provider) : void 0
    });
    n != null && (t.to = n), s != null && (t.from = s), t.from != null && (b(F(t.from) === this.address, "transaction from address mismatch", "tx.from", t.from), delete t.from);
    const i = li.from(t);
    return i.signature = this.signingKey.sign(i.unsignedHash), i.serialized;
  }
  async signMessage(t) {
    return this.signMessageSync(t);
  }
  // @TODO: Add a secialized signTx and signTyped sync that enforces
  // all parameters are known?
  /**
   *  Returns the signature for %%message%% signed with this wallet.
   */
  signMessageSync(t) {
    return this.signingKey.sign($x(t)).serialized;
  }
  async signTypedData(t, n, s) {
    const i = await Cs.resolveNames(t, n, s, async (a) => {
      A(this.provider != null, "cannot resolve ENS names without a provider", "UNSUPPORTED_OPERATION", {
        operation: "resolveName",
        info: { name: a }
      });
      const c = await this.provider.resolveName(a);
      return A(c != null, "unconfigured ENS name", "UNCONFIGURED_NAME", {
        value: a
      }), c;
    });
    return this.signingKey.sign(Cs.hash(i.domain, n, i.value)).serialized;
  }
};
ys = new WeakMap();
let Ba = Uo;
const Ua = " !#$%&'()*+,-./<=>?@[]^_`{|}~", yp = /^[a-z]*$/i;
function ef(r, e) {
  let t = 97;
  return r.reduce((n, s) => (s === e ? t++ : s.match(yp) ? n.push(String.fromCharCode(t) + s) : (t = 97, n.push(s)), n), []);
}
function mp(r, e) {
  for (let s = Ua.length - 1; s >= 0; s--)
    r = r.split(Ua[s]).join(e.substring(2 * s, 2 * s + 2));
  const t = [], n = r.replace(/(:|([0-9])|([A-Z][a-z]*))/g, (s, i, a, c) => {
    if (a)
      for (let o = parseInt(a); o >= 0; o--)
        t.push(";");
    else
      t.push(i.toLowerCase());
    return "";
  });
  if (n)
    throw new Error(`leftovers: ${JSON.stringify(n)}`);
  return ef(ef(t, ";"), ":");
}
function wp(r) {
  return b(r[0] === "0", "unsupported auwl data", "data", r), mp(r.substring(1 + 2 * Ua.length), r.substring(1, 1 + 2 * Ua.length));
}
class Ap {
  /**
   *  Creates a new Wordlist instance.
   *
   *  Sub-classes MUST call this if they provide their own constructor,
   *  passing in the locale string of the language.
   *
   *  Generally there is no need to create instances of a Wordlist,
   *  since each language-specific Wordlist creates an instance and
   *  there is no state kept internally, so they are safe to share.
   */
  constructor(e) {
    g(this, "locale");
    T(this, { locale: e });
  }
  /**
   *  Sub-classes may override this to provide a language-specific
   *  method for spliting %%phrase%% into individual words.
   *
   *  By default, %%phrase%% is split using any sequences of
   *  white-space as defined by regular expressions (i.e. ``/\s+/``).
   */
  split(e) {
    return e.toLowerCase().split(/\s+/g);
  }
  /**
   *  Sub-classes may override this to provider a language-specific
   *  method for joining %%words%% into a phrase.
   *
   *  By default, %%words%% are joined by a single space.
   */
  join(e) {
    return e.join(" ");
  }
}
var ms, Si, tr, Bi, eo;
class Ep extends Ap {
  /**
   *  Creates a new Wordlist for %%locale%% using the OWL %%data%%
   *  and validated against the %%checksum%%.
   */
  constructor(t, n, s) {
    super(t);
    y(this, Bi);
    y(this, ms, void 0);
    y(this, Si, void 0);
    y(this, tr, void 0);
    x(this, ms, n), x(this, Si, s), x(this, tr, null);
  }
  /**
   *  The OWL-encoded data.
   */
  get _data() {
    return l(this, ms);
  }
  /**
   *  Decode all the words for the wordlist.
   */
  _decodeWords() {
    return wp(l(this, ms));
  }
  getWord(t) {
    const n = P(this, Bi, eo).call(this);
    return b(t >= 0 && t < n.length, `invalid word index: ${t}`, "index", t), n[t];
  }
  getWordIndex(t) {
    return P(this, Bi, eo).call(this).indexOf(t);
  }
}
ms = new WeakMap(), Si = new WeakMap(), tr = new WeakMap(), Bi = new WeakSet(), eo = function() {
  if (l(this, tr) == null) {
    const t = this._decodeWords();
    if (jt(t.join(`
`) + `
`) !== l(this, Si))
      throw new Error(`BIP39 Wordlist for ${this.locale} FAILED`);
    x(this, tr, t);
  }
  return l(this, tr);
};
const Cp = "0erleonalorenseinceregesticitStanvetearctssi#ch2Athck&tneLl0And#Il.yLeOutO=S|S%b/ra@SurdU'0Ce[Cid|CountCu'Hie=IdOu,-Qui*Ro[TT]T%T*[Tu$0AptDD-tD*[Ju,M.UltV<)Vi)0Rob-0FairF%dRaid0A(EEntRee0Ead0MRRp%tS!_rmBumCoholErtI&LLeyLowMo,O}PhaReadySoT Ways0A>urAz(gOngOuntU'd0Aly,Ch%Ci|G G!GryIm$K!Noun)Nu$O` Sw T&naTiqueXietyY1ArtOlogyPe?P!Pro=Ril1ChCt-EaEnaGueMMedM%MyOundR<+Re,Ri=RowTTefa@Ti,Tw%k0KPe@SaultSetSi,SumeThma0H!>OmTa{T&dT.udeTra@0Ct]D.Gu,NtTh%ToTumn0Era+OcadoOid0AkeA*AyEsomeFulKw?d0Is:ByChel%C#D+GL<)Lc#y~MbooN<aNn RRelyRga(R*lSeS-SketTt!3A^AnAutyCau'ComeEfF%eG(Ha=H(dLie=LowLtN^Nef./TrayTt Twe&Y#d3Cyc!DKeNdOlogyRdR`Tt _{AdeAmeAnketA,EakE[IndOodO[omOu'UeUrUsh_rdAtDyIlMbNeNusOkO,Rd R(gRrowSsTtomUn)XY_{etA(AndA[A=EadEezeI{Id+IefIghtIngIskOccoliOk&OnzeOomO` OwnUsh2Bb!DdyD+tFf$oIldLbLkL!tNd!Nk Rd&Rg R,SS(e[SyTt Y Zz:Bba+B(B!CtusGeKe~LmM aMpNN$N)lNdyNn#NoeNvasNy#Pab!P.$Pta(RRb#RdRgoRpetRryRtSeShS(o/!Su$TT$ogT^Teg%yTt!UghtU'Ut]Ve3Il(gL yM|NsusNturyRe$Rta(_irAlkAmp]An+AosApt Ar+A'AtEapE{Ee'EfErryE,I{&IefIldIm}yOi)Oo'R#-U{!UnkUrn0G?Nnam#Rc!Tiz&TyVil_imApArifyAwAyE<ErkEv I{I|IffImbIn-IpO{OgO'O`OudOwnUbUmpU, Ut^_^A,C#utDeFfeeIlInL!@L%LumnMb(eMeMf%tM-Mm#Mp<yNc tNdu@NfirmNg*[N}@Nsid NtrolNv()OkOlPp PyR$ReRnR*@/Tt#U^UntryUp!Ur'Us(V Yo>_{Ad!AftAmA}AshAt AwlAzyEamEd.EekEwI{etImeIspIt-OpO[Ou^OwdUci$UelUi'Umb!Un^UshYY,$2BeLtu*PPbo?dRiousRr|Rta(R=Sh]/omTe3C!:DMa+MpN)Ng R(gShUght WnY3AlBa>BrisCadeCemb CideCl(eC%a>C*a'ErF&'F(eFyG*eLayLiv M<dMi'Ni$Nti,NyP?tP&dPos.P`PutyRi=ScribeS tSignSkSpair/royTailTe@VelopVi)Vo>3AgramAlAm#dAryCeE'lEtFf G.$Gn.yLemmaNn NosaurRe@RtSag*eScov Sea'ShSmi[S%d Splay/<)V tVideV%)Zzy5Ct%Cum|G~Lph(Ma(Na>NkeyN%OrSeUb!Ve_ftAg#AmaA,-AwEamE[IftIllInkIpI=OpUmY2CkMbNeR(g/T^Ty1Arf1Nam-:G G!RlyRnR`Sily/Sy1HoOlogyOnomy0GeItUca>1F%t0G1GhtTh 2BowD E@r-Eg<tEm|Eph<tEvat%I>Se0B?kBodyBra)Er+Ot]PloyPow Pty0Ab!A@DD![D%'EmyErgyF%)Ga+G(eH<)JoyLi,OughR-hRollSu*T Ti*TryVelope1Isode0U$Uip0AA'OdeOs]R%Upt0CapeSayS&)Ta>0Ern$H-s1Id&)IlOkeOl=1A@Amp!Ce[Ch<+C.eCludeCu'Ecu>Erci'Hau,Hib.I!I,ItOt-P<dPe@Pi*Pla(Po'P*[T&dTra0EEbrow:Br-CeCultyDeIntI`~L'MeMilyMousNNcyNtasyRmSh]TT$Th TigueUltV%.e3Atu*Bru?yD $EEdElMa!N)/iv$T^V W3B Ct]EldGu*LeLmLt N$NdNeNg NishReRmR,Sc$ShTT}[X_gAmeAshAtAv%EeIghtIpOatO{O%Ow UidUshY_mCusGIlLd~owOdOtR)Re,R+tRkRtu}RumRw?dSsil/ UndX_gi!AmeEqu|EshI&dIn+OgOntO,OwnOz&U.2ElNNnyRna)RyTu*:D+tInLaxy~ yMePRa+Rba+Rd&Rl-Rm|SSpTeTh U+Ze3N $NiusN*Nt!Nu(e/u*2O,0AntFtGg!Ng RaffeRlVe_dAn)A*A[IdeImp'ObeOomOryO=OwUe_tDde[LdOdO'RillaSpelSsipV nWn_bA)A(AntApeA[Av.yEatE&IdIefItOc yOupOwUnt_rdE[IdeIltIt?N3M:B.IrLfMm M, NdPpyRb%RdRshR=,TVeWkZ?d3AdAl`ArtAvyD+hogIght~oLmetLpNRo3Dd&Gh~NtPRe/%y5BbyCkeyLdLeLiday~owMeNeyOdPeRnRr%R'Sp.$/TelUrV 5BGeM<Mb!M%Nd*dNgryNtRd!RryRtSb<d3Brid:1EOn0EaEntifyLe2N%e4LLeg$L}[0A+Ita>M&'Mu}Pa@Po'Pro=Pul'0ChCludeComeC*a'DexD-a>Do%Du,ryF<tFl-tF%mHa!H .Iti$Je@JuryMa>N Noc|PutQuiryS<eSe@SideSpi*/$lTa@T e,ToVe,V.eVol=3On0L<dOla>Sue0Em1Ory:CketGu?RZz3AlousAns~yWel9BInKeUr}yY5D+I)MpNg!Ni%Nk/:Ng?oo3EnEpT^upY3CkDD}yNdNgdomSsTT^&TeTt&Wi4EeIfeO{Ow:BBelB%Dd DyKeMpNgua+PtopR+T T(UghUndryVaWWnWsu.Y Zy3Ad AfArnA=Ctu*FtGG$G&dIsu*M#NdNg`NsOp?dSs#Tt Vel3ArB tyBr?yC&'FeFtGhtKeMbM.NkOnQuid/Tt!VeZ?d5AdAnB, C$CkG-NelyNgOpTt yUdUn+VeY$5CkyGga+Mb N?N^Xury3R-s:Ch(eDG-G}tIdIlInJ%KeMm$NNa+Nda>NgoNs]Nu$P!Rb!R^Rg(R(eRketRria+SkSs/ T^T i$ThTrixTt XimumZe3AdowAnAsu*AtCh<-D$DiaLodyLtMb M%yNt]NuRcyR+R.RryShSsa+T$Thod3Dd!DnightLk~]M-NdNimumN%Nu>Rac!Rr%S ySs/akeXXedXtu*5Bi!DelDifyMM|N.%NkeyN, N`OnR$ReRn(gSqu.oTh T]T%Unta(U'VeVie5ChFf(LeLtiplySc!SeumShroomS-/Tu$3Self/ yTh:I=MePk(Rrow/yT]Tu*3ArCkEdGati=G!@I` PhewR=/TTw%kUtr$V WsXt3CeGht5B!I'M(eeOd!Rm$R`SeTab!TeTh(gTi)VelW5C!?Mb R'T:K0EyJe@Li+Scu*S =Ta(Vious0CurE<Tob 0Or1FF Fi)T&2L1Ay0DI=Ymp-0It0CeEI#L(eLy1EnEraIn]Po'T]1An+B.Ch?dD D(?yG<I|Ig($Ph<0Tr-h0H 0Tdo%T TputTside0AlEnEr0NN 0Yg&0/ 0O}:CtDd!GeIrLa)LmNdaNelN-N` P RadeR|RkRrotRtySsT^ThTi|TrolTt nU'VeYm|3A)AnutArAs<tL-<NN$tyNcilOp!Pp Rfe@Rm.Rs#T2O}OtoRa'Ys-$0AnoCn-Ctu*E)GGe#~LotNkO} Pe/olT^Zza_)A}tA,-A>AyEa'Ed+U{UgUn+2EmEtIntL?LeLi)NdNyOlPul?Rt]S.]Ssib!/TatoTt yV tyWd W _@i)Ai'Ed-tEf Epa*Es|EttyEv|I)IdeIm?yIntI%.yIs#Iva>IzeOb!mO)[Odu)Of.OgramOje@Omo>OofOp tyOsp O>@OudOvide2Bl-Dd(g~LpL'Mpk(N^PilPpyR^a'R.yRpo'R'ShTZz!3Ramid:99Al.yAntumArt E,]I{ItIzO>:Bb.Cco#CeCkD?DioIlInI'~yMpN^NdomN+PidReTeTh V&WZ%3AdyAlAs#BelBuildC$lCei=CipeC%dCyc!Du)F!@F%mFu'G]G*tGul?Je@LaxLea'LiefLyMa(Memb M(dMo=Nd NewNtOp&PairPeatPla)P%tQui*ScueSemb!Si,Sour)Sp#'SultTi*T*atTurnUn]Ve$ViewW?d2Y`m0BBb#CeChDeD+F!GhtGidNgOtPp!SkTu$V$V 5AdA,BotBu,CketM<)OfOkieOmSeTa>UghUndU>Y$5Bb DeGLeNNwayR$:DDd!D}[FeIlLadLm#L#LtLu>MeMp!NdTisfyToshiU)Usa+VeY1A!AnA*Att E}HemeHoolI&)I[%sOrp]OutRapRe&RiptRub1AAr^As#AtC#dC*tCt]Cur.yEdEkGm|Le@~M(?Ni%N'Nt&)RiesRvi)Ss]Tt!TupV&_dowAftAllowA*EdEllEriffIeldIftI}IpIv O{OeOotOpOrtOuld O=RimpRugUff!Y0Bl(gCkDeE+GhtGnL|Lk~yLv Mil?Mp!N)NgR&/ Tua>XZe1A>Et^IIllInIrtUll0AbAmEepEnd I)IdeIghtImOg<OtOwUsh0AllArtI!OkeOo`0A{AkeApIffOw0ApCc Ci$CkDaFtL?Ldi LidLut]L=Me#eNgOnRryRtUlUndUpUr)U`0A)A*Ati$AwnEakEci$EedEllEndH eI)Id IkeInIr.L.OilOns%O#OrtOtRayReadR(gY0Ua*UeezeUir*l_b!AdiumAffA+AirsAmpAndArtA>AyEakEelEmEpE*oI{IllIngO{Oma^O}OolOryO=Ra>gyReetRikeR#gRugg!Ud|UffUmb!Y!0Bje@Bm.BwayC)[ChDd&Ff G?G+,ItMm NNnyN'tP PplyP*meReRfa)R+Rpri'RroundR=ySpe@/a(1AllowAmpApArmE?EetIftImIngIt^Ord1MbolMptomRup/em:B!Ck!GIlL|LkNkPeR+tSk/eTtooXi3A^Am~NN<tNnisNtRm/Xt_nkAtEmeEnE%yE*EyIngIsOughtReeRi=RowUmbUnd 0CketDeG LtMb MeNyPRedSsueT!5A,BaccoDayDdl EGe` I!tK&MatoM%rowNeNgueNightOlO`PP-Pp!R^RnadoRtoi'SsT$Uri,W?dW WnY_{AdeAff-Ag-A(Ansf ApAshA=lAyEatEeEndI$IbeI{Igg ImIpOphyOub!U{UeUlyUmpetU,U`Y2BeIt]Mb!NaN}lRkeyRnRt!1El=EntyI)InI,O1PeP-$:5Ly5B*lla0Ab!Awa*C!Cov D DoFairFoldHappyIf%mIqueItIv 'KnownLo{TilUsu$Veil1Da>GradeHoldOnP Set1B<Ge0A+EEdEfulE![U$0Il.y:C<tCuumGueLidL!yL=NNishP%Rious/Ult3H-!L=tNd%Ntu*NueRbRifyRs]RyS'lT <3Ab!Br<tCiousCt%yDeoEw~a+Nta+Ol(Rtu$RusSaS.Su$T$Vid5C$I)IdLc<oLumeTeYa+:GeG#ItLk~LnutNtRfa*RmRri%ShSp/eT VeY3Al`Ap#ArA'lA` BDd(gEk&dIrdLcome/T_!AtEatEelEnE*IpIsp 0DeD`FeLd~NNdowNeNgNkNn Nt ReSdomSeShT}[5LfM<Nd OdOlRdRkRldRryR`_pE{E,!I,I>Ong::Rd3Ar~ow9UUngU`:3BraRo9NeO", Pp = "0x3c8acc1e7b08d8e76f9fda015ef48dc8c710a73cb7e0f77b2c18a9b5a7adde60";
let bc = null;
class lr extends Ep {
  /**
   *  Creates a new instance of the English language Wordlist.
   *
   *  This should be unnecessary most of the time as the exported
   *  [[langEn]] should suffice.
   *
   *  @_ignore:
   */
  constructor() {
    super("en", Cp, Pp);
  }
  /**
   *  Returns a singleton instance of a ``LangEn``, creating it
   *  if this is the first time being called.
   */
  static wordlist() {
    return bc == null && (bc = new lr()), bc;
  }
}
function bu(r) {
  return (1 << r) - 1 << 8 - r & 255;
}
function Np(r) {
  return (1 << r) - 1 & 255;
}
function pc(r, e) {
  lf("NFKD"), e == null && (e = lr.wordlist());
  const t = e.split(r);
  b(t.length % 3 === 0 && t.length >= 12 && t.length <= 24, "invalid mnemonic length", "mnemonic", "[ REDACTED ]");
  const n = new Uint8Array(Math.ceil(11 * t.length / 8));
  let s = 0;
  for (let f = 0; f < t.length; f++) {
    let u = e.getWordIndex(t[f].normalize("NFKD"));
    b(u >= 0, `invalid mnemonic word at index ${f}`, "mnemonic", "[ REDACTED ]");
    for (let d = 0; d < 11; d++)
      u & 1 << 10 - d && (n[s >> 3] |= 1 << 7 - s % 8), s++;
  }
  const i = 32 * t.length / 3, a = t.length / 3, c = bu(a), o = O(it(n.slice(0, i / 8)))[0] & c;
  return b(o === (n[n.length - 1] & c), "invalid mnemonic checksum", "mnemonic", "[ REDACTED ]"), N(n.slice(0, i / 8));
}
function gc(r, e) {
  b(r.length % 4 === 0 && r.length >= 16 && r.length <= 32, "invalid entropy size", "entropy", "[ REDACTED ]"), e == null && (e = lr.wordlist());
  const t = [0];
  let n = 11;
  for (let a = 0; a < r.length; a++)
    n > 8 ? (t[t.length - 1] <<= 8, t[t.length - 1] |= r[a], n -= 8) : (t[t.length - 1] <<= n, t[t.length - 1] |= r[a] >> 8 - n, t.push(r[a] & Np(8 - n)), n += 3);
  const s = r.length / 4, i = parseInt(it(r).substring(2, 4), 16) & bu(s);
  return t[t.length - 1] <<= s, t[t.length - 1] |= i >> 8 - s, e.join(t.map((a) => e.getWord(a)));
}
const yc = {};
class Ns {
  /**
   *  @private
   */
  constructor(e, t, n, s, i) {
    /**
     *  The mnemonic phrase of 12, 15, 18, 21 or 24 words.
     *
     *  Use the [[wordlist]] ``split`` method to get the individual words.
     */
    g(this, "phrase");
    /**
     *  The password used for this mnemonic. If no password is used this
     *  is the empty string (i.e. ``""``) as per the specification.
     */
    g(this, "password");
    /**
     *  The wordlist for this mnemonic.
     */
    g(this, "wordlist");
    /**
     *  The underlying entropy which the mnemonic encodes.
     */
    g(this, "entropy");
    s == null && (s = ""), i == null && (i = lr.wordlist()), ur(e, yc, "Mnemonic"), T(this, { phrase: n, password: s, wordlist: i, entropy: t });
  }
  /**
   *  Returns the seed for the mnemonic.
   */
  computeSeed() {
    const e = Ee("mnemonic" + this.password, "NFKD");
    return Pn(Ee(this.phrase, "NFKD"), e, 2048, 64, "sha512");
  }
  /**
   *  Creates a new Mnemonic for the %%phrase%%.
   *
   *  The default %%password%% is the empty string and the default
   *  wordlist is the [English wordlists](LangEn).
   */
  static fromPhrase(e, t, n) {
    const s = pc(e, n);
    return e = gc(O(s), n), new Ns(yc, s, e, t, n);
  }
  /**
   *  Create a new **Mnemonic** from the %%entropy%%.
   *
   *  The default %%password%% is the empty string and the default
   *  wordlist is the [English wordlists](LangEn).
   */
  static fromEntropy(e, t, n) {
    const s = O(e, "entropy"), i = gc(s, n);
    return new Ns(yc, N(s), i, t, n);
  }
  /**
   *  Returns the phrase for %%mnemonic%%.
   */
  static entropyToPhrase(e, t) {
    const n = O(e, "entropy");
    return gc(n, t);
  }
  /**
   *  Returns the entropy for %%phrase%%.
   */
  static phraseToEntropy(e, t) {
    return pc(e, t);
  }
  /**
   *  Returns true if %%phrase%% is a valid [[link-bip-39]] phrase.
   *
   *  This checks all the provided words belong to the %%wordlist%%,
   *  that the length is valid and the checksum is correct.
   */
  static isValidMnemonic(e, t) {
    try {
      return pc(e, t), !0;
    } catch {
    }
    return !1;
  }
}
/*! MIT License. Copyright 2015-2022 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
var ie = globalThis && globalThis.__classPrivateFieldGet || function(r, e, t, n) {
  if (t === "a" && !n)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? r !== e || !n : !e.has(r))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(r) : n ? n.value : e.get(r);
}, mc = globalThis && globalThis.__classPrivateFieldSet || function(r, e, t, n, s) {
  if (n === "m")
    throw new TypeError("Private method is not writable");
  if (n === "a" && !s)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? r !== e || !s : !e.has(r))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n === "a" ? s.call(r, t) : s ? s.value = t : e.set(r, t), t;
}, ma, Ge, ut;
const Ip = { 16: 10, 24: 12, 32: 14 }, vp = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145], Fe = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22], ia = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125], kp = [3328402341, 4168907908, 4000806809, 4135287693, 4294111757, 3597364157, 3731845041, 2445657428, 1613770832, 33620227, 3462883241, 1445669757, 3892248089, 3050821474, 1303096294, 3967186586, 2412431941, 528646813, 2311702848, 4202528135, 4026202645, 2992200171, 2387036105, 4226871307, 1101901292, 3017069671, 1604494077, 1169141738, 597466303, 1403299063, 3832705686, 2613100635, 1974974402, 3791519004, 1033081774, 1277568618, 1815492186, 2118074177, 4126668546, 2211236943, 1748251740, 1369810420, 3521504564, 4193382664, 3799085459, 2883115123, 1647391059, 706024767, 134480908, 2512897874, 1176707941, 2646852446, 806885416, 932615841, 168101135, 798661301, 235341577, 605164086, 461406363, 3756188221, 3454790438, 1311188841, 2142417613, 3933566367, 302582043, 495158174, 1479289972, 874125870, 907746093, 3698224818, 3025820398, 1537253627, 2756858614, 1983593293, 3084310113, 2108928974, 1378429307, 3722699582, 1580150641, 327451799, 2790478837, 3117535592, 0, 3253595436, 1075847264, 3825007647, 2041688520, 3059440621, 3563743934, 2378943302, 1740553945, 1916352843, 2487896798, 2555137236, 2958579944, 2244988746, 3151024235, 3320835882, 1336584933, 3992714006, 2252555205, 2588757463, 1714631509, 293963156, 2319795663, 3925473552, 67240454, 4269768577, 2689618160, 2017213508, 631218106, 1269344483, 2723238387, 1571005438, 2151694528, 93294474, 1066570413, 563977660, 1882732616, 4059428100, 1673313503, 2008463041, 2950355573, 1109467491, 537923632, 3858759450, 4260623118, 3218264685, 2177748300, 403442708, 638784309, 3287084079, 3193921505, 899127202, 2286175436, 773265209, 2479146071, 1437050866, 4236148354, 2050833735, 3362022572, 3126681063, 840505643, 3866325909, 3227541664, 427917720, 2655997905, 2749160575, 1143087718, 1412049534, 999329963, 193497219, 2353415882, 3354324521, 1807268051, 672404540, 2816401017, 3160301282, 369822493, 2916866934, 3688947771, 1681011286, 1949973070, 336202270, 2454276571, 201721354, 1210328172, 3093060836, 2680341085, 3184776046, 1135389935, 3294782118, 965841320, 831886756, 3554993207, 4068047243, 3588745010, 2345191491, 1849112409, 3664604599, 26054028, 2983581028, 2622377682, 1235855840, 3630984372, 2891339514, 4092916743, 3488279077, 3395642799, 4101667470, 1202630377, 268961816, 1874508501, 4034427016, 1243948399, 1546530418, 941366308, 1470539505, 1941222599, 2546386513, 3421038627, 2715671932, 3899946140, 1042226977, 2521517021, 1639824860, 227249030, 260737669, 3765465232, 2084453954, 1907733956, 3429263018, 2420656344, 100860677, 4160157185, 470683154, 3261161891, 1781871967, 2924959737, 1773779408, 394692241, 2579611992, 974986535, 664706745, 3655459128, 3958962195, 731420851, 571543859, 3530123707, 2849626480, 126783113, 865375399, 765172662, 1008606754, 361203602, 3387549984, 2278477385, 2857719295, 1344809080, 2782912378, 59542671, 1503764984, 160008576, 437062935, 1707065306, 3622233649, 2218934982, 3496503480, 2185314755, 697932208, 1512910199, 504303377, 2075177163, 2824099068, 1841019862, 739644986], Op = [2781242211, 2230877308, 2582542199, 2381740923, 234877682, 3184946027, 2984144751, 1418839493, 1348481072, 50462977, 2848876391, 2102799147, 434634494, 1656084439, 3863849899, 2599188086, 1167051466, 2636087938, 1082771913, 2281340285, 368048890, 3954334041, 3381544775, 201060592, 3963727277, 1739838676, 4250903202, 3930435503, 3206782108, 4149453988, 2531553906, 1536934080, 3262494647, 484572669, 2923271059, 1783375398, 1517041206, 1098792767, 49674231, 1334037708, 1550332980, 4098991525, 886171109, 150598129, 2481090929, 1940642008, 1398944049, 1059722517, 201851908, 1385547719, 1699095331, 1587397571, 674240536, 2704774806, 252314885, 3039795866, 151914247, 908333586, 2602270848, 1038082786, 651029483, 1766729511, 3447698098, 2682942837, 454166793, 2652734339, 1951935532, 775166490, 758520603, 3000790638, 4004797018, 4217086112, 4137964114, 1299594043, 1639438038, 3464344499, 2068982057, 1054729187, 1901997871, 2534638724, 4121318227, 1757008337, 0, 750906861, 1614815264, 535035132, 3363418545, 3988151131, 3201591914, 1183697867, 3647454910, 1265776953, 3734260298, 3566750796, 3903871064, 1250283471, 1807470800, 717615087, 3847203498, 384695291, 3313910595, 3617213773, 1432761139, 2484176261, 3481945413, 283769337, 100925954, 2180939647, 4037038160, 1148730428, 3123027871, 3813386408, 4087501137, 4267549603, 3229630528, 2315620239, 2906624658, 3156319645, 1215313976, 82966005, 3747855548, 3245848246, 1974459098, 1665278241, 807407632, 451280895, 251524083, 1841287890, 1283575245, 337120268, 891687699, 801369324, 3787349855, 2721421207, 3431482436, 959321879, 1469301956, 4065699751, 2197585534, 1199193405, 2898814052, 3887750493, 724703513, 2514908019, 2696962144, 2551808385, 3516813135, 2141445340, 1715741218, 2119445034, 2872807568, 2198571144, 3398190662, 700968686, 3547052216, 1009259540, 2041044702, 3803995742, 487983883, 1991105499, 1004265696, 1449407026, 1316239930, 504629770, 3683797321, 168560134, 1816667172, 3837287516, 1570751170, 1857934291, 4014189740, 2797888098, 2822345105, 2754712981, 936633572, 2347923833, 852879335, 1133234376, 1500395319, 3084545389, 2348912013, 1689376213, 3533459022, 3762923945, 3034082412, 4205598294, 133428468, 634383082, 2949277029, 2398386810, 3913789102, 403703816, 3580869306, 2297460856, 1867130149, 1918643758, 607656988, 4049053350, 3346248884, 1368901318, 600565992, 2090982877, 2632479860, 557719327, 3717614411, 3697393085, 2249034635, 2232388234, 2430627952, 1115438654, 3295786421, 2865522278, 3633334344, 84280067, 33027830, 303828494, 2747425121, 1600795957, 4188952407, 3496589753, 2434238086, 1486471617, 658119965, 3106381470, 953803233, 334231800, 3005978776, 857870609, 3151128937, 1890179545, 2298973838, 2805175444, 3056442267, 574365214, 2450884487, 550103529, 1233637070, 4289353045, 2018519080, 2057691103, 2399374476, 4166623649, 2148108681, 387583245, 3664101311, 836232934, 3330556482, 3100665960, 3280093505, 2955516313, 2002398509, 287182607, 3413881008, 4238890068, 3597515707, 975967766], Tp = [1671808611, 2089089148, 2006576759, 2072901243, 4061003762, 1807603307, 1873927791, 3310653893, 810573872, 16974337, 1739181671, 729634347, 4263110654, 3613570519, 2883997099, 1989864566, 3393556426, 2191335298, 3376449993, 2106063485, 4195741690, 1508618841, 1204391495, 4027317232, 2917941677, 3563566036, 2734514082, 2951366063, 2629772188, 2767672228, 1922491506, 3227229120, 3082974647, 4246528509, 2477669779, 644500518, 911895606, 1061256767, 4144166391, 3427763148, 878471220, 2784252325, 3845444069, 4043897329, 1905517169, 3631459288, 827548209, 356461077, 67897348, 3344078279, 593839651, 3277757891, 405286936, 2527147926, 84871685, 2595565466, 118033927, 305538066, 2157648768, 3795705826, 3945188843, 661212711, 2999812018, 1973414517, 152769033, 2208177539, 745822252, 439235610, 455947803, 1857215598, 1525593178, 2700827552, 1391895634, 994932283, 3596728278, 3016654259, 695947817, 3812548067, 795958831, 2224493444, 1408607827, 3513301457, 0, 3979133421, 543178784, 4229948412, 2982705585, 1542305371, 1790891114, 3410398667, 3201918910, 961245753, 1256100938, 1289001036, 1491644504, 3477767631, 3496721360, 4012557807, 2867154858, 4212583931, 1137018435, 1305975373, 861234739, 2241073541, 1171229253, 4178635257, 33948674, 2139225727, 1357946960, 1011120188, 2679776671, 2833468328, 1374921297, 2751356323, 1086357568, 2408187279, 2460827538, 2646352285, 944271416, 4110742005, 3168756668, 3066132406, 3665145818, 560153121, 271589392, 4279952895, 4077846003, 3530407890, 3444343245, 202643468, 322250259, 3962553324, 1608629855, 2543990167, 1154254916, 389623319, 3294073796, 2817676711, 2122513534, 1028094525, 1689045092, 1575467613, 422261273, 1939203699, 1621147744, 2174228865, 1339137615, 3699352540, 577127458, 712922154, 2427141008, 2290289544, 1187679302, 3995715566, 3100863416, 339486740, 3732514782, 1591917662, 186455563, 3681988059, 3762019296, 844522546, 978220090, 169743370, 1239126601, 101321734, 611076132, 1558493276, 3260915650, 3547250131, 2901361580, 1655096418, 2443721105, 2510565781, 3828863972, 2039214713, 3878868455, 3359869896, 928607799, 1840765549, 2374762893, 3580146133, 1322425422, 2850048425, 1823791212, 1459268694, 4094161908, 3928346602, 1706019429, 2056189050, 2934523822, 135794696, 3134549946, 2022240376, 628050469, 779246638, 472135708, 2800834470, 3032970164, 3327236038, 3894660072, 3715932637, 1956440180, 522272287, 1272813131, 3185336765, 2340818315, 2323976074, 1888542832, 1044544574, 3049550261, 1722469478, 1222152264, 50660867, 4127324150, 236067854, 1638122081, 895445557, 1475980887, 3117443513, 2257655686, 3243809217, 489110045, 2662934430, 3778599393, 4162055160, 2561878936, 288563729, 1773916777, 3648039385, 2391345038, 2493985684, 2612407707, 505560094, 2274497927, 3911240169, 3460925390, 1442818645, 678973480, 3749357023, 2358182796, 2717407649, 2306869641, 219617805, 3218761151, 3862026214, 1120306242, 1756942440, 1103331905, 2578459033, 762796589, 252780047, 2966125488, 1425844308, 3151392187, 372911126], Rp = [1667474886, 2088535288, 2004326894, 2071694838, 4075949567, 1802223062, 1869591006, 3318043793, 808472672, 16843522, 1734846926, 724270422, 4278065639, 3621216949, 2880169549, 1987484396, 3402253711, 2189597983, 3385409673, 2105378810, 4210693615, 1499065266, 1195886990, 4042263547, 2913856577, 3570689971, 2728590687, 2947541573, 2627518243, 2762274643, 1920112356, 3233831835, 3082273397, 4261223649, 2475929149, 640051788, 909531756, 1061110142, 4160160501, 3435941763, 875846760, 2779116625, 3857003729, 4059105529, 1903268834, 3638064043, 825316194, 353713962, 67374088, 3351728789, 589522246, 3284360861, 404236336, 2526454071, 84217610, 2593830191, 117901582, 303183396, 2155911963, 3806477791, 3958056653, 656894286, 2998062463, 1970642922, 151591698, 2206440989, 741110872, 437923380, 454765878, 1852748508, 1515908788, 2694904667, 1381168804, 993742198, 3604373943, 3014905469, 690584402, 3823320797, 791638366, 2223281939, 1398011302, 3520161977, 0, 3991743681, 538992704, 4244381667, 2981218425, 1532751286, 1785380564, 3419096717, 3200178535, 960056178, 1246420628, 1280103576, 1482221744, 3486468741, 3503319995, 4025428677, 2863326543, 4227536621, 1128514950, 1296947098, 859002214, 2240123921, 1162203018, 4193849577, 33687044, 2139062782, 1347481760, 1010582648, 2678045221, 2829640523, 1364325282, 2745433693, 1077985408, 2408548869, 2459086143, 2644360225, 943212656, 4126475505, 3166494563, 3065430391, 3671750063, 555836226, 269496352, 4294908645, 4092792573, 3537006015, 3452783745, 202118168, 320025894, 3974901699, 1600119230, 2543297077, 1145359496, 387397934, 3301201811, 2812801621, 2122220284, 1027426170, 1684319432, 1566435258, 421079858, 1936954854, 1616945344, 2172753945, 1330631070, 3705438115, 572679748, 707427924, 2425400123, 2290647819, 1179044492, 4008585671, 3099120491, 336870440, 3739122087, 1583276732, 185277718, 3688593069, 3772791771, 842159716, 976899700, 168435220, 1229577106, 101059084, 606366792, 1549591736, 3267517855, 3553849021, 2897014595, 1650632388, 2442242105, 2509612081, 3840161747, 2038008818, 3890688725, 3368567691, 926374254, 1835907034, 2374863873, 3587531953, 1313788572, 2846482505, 1819063512, 1448540844, 4109633523, 3941213647, 1701162954, 2054852340, 2930698567, 134748176, 3132806511, 2021165296, 623210314, 774795868, 471606328, 2795958615, 3031746419, 3334885783, 3907527627, 3722280097, 1953799400, 522133822, 1263263126, 3183336545, 2341176845, 2324333839, 1886425312, 1044267644, 3048588401, 1718004428, 1212733584, 50529542, 4143317495, 235803164, 1633788866, 892690282, 1465383342, 3115962473, 2256965911, 3250673817, 488449850, 2661202215, 3789633753, 4177007595, 2560144171, 286339874, 1768537042, 3654906025, 2391705863, 2492770099, 2610673197, 505291324, 2273808917, 3924369609, 3469625735, 1431699370, 673740880, 3755965093, 2358021891, 2711746649, 2307489801, 218961690, 3217021541, 3873845719, 1111672452, 1751693520, 1094828930, 2576986153, 757954394, 252645662, 2964376443, 1414855848, 3149649517, 370555436], Sp = [1374988112, 2118214995, 437757123, 975658646, 1001089995, 530400753, 2902087851, 1273168787, 540080725, 2910219766, 2295101073, 4110568485, 1340463100, 3307916247, 641025152, 3043140495, 3736164937, 632953703, 1172967064, 1576976609, 3274667266, 2169303058, 2370213795, 1809054150, 59727847, 361929877, 3211623147, 2505202138, 3569255213, 1484005843, 1239443753, 2395588676, 1975683434, 4102977912, 2572697195, 666464733, 3202437046, 4035489047, 3374361702, 2110667444, 1675577880, 3843699074, 2538681184, 1649639237, 2976151520, 3144396420, 4269907996, 4178062228, 1883793496, 2403728665, 2497604743, 1383856311, 2876494627, 1917518562, 3810496343, 1716890410, 3001755655, 800440835, 2261089178, 3543599269, 807962610, 599762354, 33778362, 3977675356, 2328828971, 2809771154, 4077384432, 1315562145, 1708848333, 101039829, 3509871135, 3299278474, 875451293, 2733856160, 92987698, 2767645557, 193195065, 1080094634, 1584504582, 3178106961, 1042385657, 2531067453, 3711829422, 1306967366, 2438237621, 1908694277, 67556463, 1615861247, 429456164, 3602770327, 2302690252, 1742315127, 2968011453, 126454664, 3877198648, 2043211483, 2709260871, 2084704233, 4169408201, 0, 159417987, 841739592, 504459436, 1817866830, 4245618683, 260388950, 1034867998, 908933415, 168810852, 1750902305, 2606453969, 607530554, 202008497, 2472011535, 3035535058, 463180190, 2160117071, 1641816226, 1517767529, 470948374, 3801332234, 3231722213, 1008918595, 303765277, 235474187, 4069246893, 766945465, 337553864, 1475418501, 2943682380, 4003061179, 2743034109, 4144047775, 1551037884, 1147550661, 1543208500, 2336434550, 3408119516, 3069049960, 3102011747, 3610369226, 1113818384, 328671808, 2227573024, 2236228733, 3535486456, 2935566865, 3341394285, 496906059, 3702665459, 226906860, 2009195472, 733156972, 2842737049, 294930682, 1206477858, 2835123396, 2700099354, 1451044056, 573804783, 2269728455, 3644379585, 2362090238, 2564033334, 2801107407, 2776292904, 3669462566, 1068351396, 742039012, 1350078989, 1784663195, 1417561698, 4136440770, 2430122216, 775550814, 2193862645, 2673705150, 1775276924, 1876241833, 3475313331, 3366754619, 270040487, 3902563182, 3678124923, 3441850377, 1851332852, 3969562369, 2203032232, 3868552805, 2868897406, 566021896, 4011190502, 3135740889, 1248802510, 3936291284, 699432150, 832877231, 708780849, 3332740144, 899835584, 1951317047, 4236429990, 3767586992, 866637845, 4043610186, 1106041591, 2144161806, 395441711, 1984812685, 1139781709, 3433712980, 3835036895, 2664543715, 1282050075, 3240894392, 1181045119, 2640243204, 25965917, 4203181171, 4211818798, 3009879386, 2463879762, 3910161971, 1842759443, 2597806476, 933301370, 1509430414, 3943906441, 3467192302, 3076639029, 3776767469, 2051518780, 2631065433, 1441952575, 404016761, 1942435775, 1408749034, 1610459739, 3745345300, 2017778566, 3400528769, 3110650942, 941896748, 3265478751, 371049330, 3168937228, 675039627, 4279080257, 967311729, 135050206, 3635733660, 1683407248, 2076935265, 3576870512, 1215061108, 3501741890], Bp = [1347548327, 1400783205, 3273267108, 2520393566, 3409685355, 4045380933, 2880240216, 2471224067, 1428173050, 4138563181, 2441661558, 636813900, 4233094615, 3620022987, 2149987652, 2411029155, 1239331162, 1730525723, 2554718734, 3781033664, 46346101, 310463728, 2743944855, 3328955385, 3875770207, 2501218972, 3955191162, 3667219033, 768917123, 3545789473, 692707433, 1150208456, 1786102409, 2029293177, 1805211710, 3710368113, 3065962831, 401639597, 1724457132, 3028143674, 409198410, 2196052529, 1620529459, 1164071807, 3769721975, 2226875310, 486441376, 2499348523, 1483753576, 428819965, 2274680428, 3075636216, 598438867, 3799141122, 1474502543, 711349675, 129166120, 53458370, 2592523643, 2782082824, 4063242375, 2988687269, 3120694122, 1559041666, 730517276, 2460449204, 4042459122, 2706270690, 3446004468, 3573941694, 533804130, 2328143614, 2637442643, 2695033685, 839224033, 1973745387, 957055980, 2856345839, 106852767, 1371368976, 4181598602, 1033297158, 2933734917, 1179510461, 3046200461, 91341917, 1862534868, 4284502037, 605657339, 2547432937, 3431546947, 2003294622, 3182487618, 2282195339, 954669403, 3682191598, 1201765386, 3917234703, 3388507166, 0, 2198438022, 1211247597, 2887651696, 1315723890, 4227665663, 1443857720, 507358933, 657861945, 1678381017, 560487590, 3516619604, 975451694, 2970356327, 261314535, 3535072918, 2652609425, 1333838021, 2724322336, 1767536459, 370938394, 182621114, 3854606378, 1128014560, 487725847, 185469197, 2918353863, 3106780840, 3356761769, 2237133081, 1286567175, 3152976349, 4255350624, 2683765030, 3160175349, 3309594171, 878443390, 1988838185, 3704300486, 1756818940, 1673061617, 3403100636, 272786309, 1075025698, 545572369, 2105887268, 4174560061, 296679730, 1841768865, 1260232239, 4091327024, 3960309330, 3497509347, 1814803222, 2578018489, 4195456072, 575138148, 3299409036, 446754879, 3629546796, 4011996048, 3347532110, 3252238545, 4270639778, 915985419, 3483825537, 681933534, 651868046, 2755636671, 3828103837, 223377554, 2607439820, 1649704518, 3270937875, 3901806776, 1580087799, 4118987695, 3198115200, 2087309459, 2842678573, 3016697106, 1003007129, 2802849917, 1860738147, 2077965243, 164439672, 4100872472, 32283319, 2827177882, 1709610350, 2125135846, 136428751, 3874428392, 3652904859, 3460984630, 3572145929, 3593056380, 2939266226, 824852259, 818324884, 3224740454, 930369212, 2801566410, 2967507152, 355706840, 1257309336, 4148292826, 243256656, 790073846, 2373340630, 1296297904, 1422699085, 3756299780, 3818836405, 457992840, 3099667487, 2135319889, 77422314, 1560382517, 1945798516, 788204353, 1521706781, 1385356242, 870912086, 325965383, 2358957921, 2050466060, 2388260884, 2313884476, 4006521127, 901210569, 3990953189, 1014646705, 1503449823, 1062597235, 2031621326, 3212035895, 3931371469, 1533017514, 350174575, 2256028891, 2177544179, 1052338372, 741876788, 1606591296, 1914052035, 213705253, 2334669897, 1107234197, 1899603969, 3725069491, 2631447780, 2422494913, 1635502980, 1893020342, 1950903388, 1120974935], Up = [2807058932, 1699970625, 2764249623, 1586903591, 1808481195, 1173430173, 1487645946, 59984867, 4199882800, 1844882806, 1989249228, 1277555970, 3623636965, 3419915562, 1149249077, 2744104290, 1514790577, 459744698, 244860394, 3235995134, 1963115311, 4027744588, 2544078150, 4190530515, 1608975247, 2627016082, 2062270317, 1507497298, 2200818878, 567498868, 1764313568, 3359936201, 2305455554, 2037970062, 1047239e3, 1910319033, 1337376481, 2904027272, 2892417312, 984907214, 1243112415, 830661914, 861968209, 2135253587, 2011214180, 2927934315, 2686254721, 731183368, 1750626376, 4246310725, 1820824798, 4172763771, 3542330227, 48394827, 2404901663, 2871682645, 671593195, 3254988725, 2073724613, 145085239, 2280796200, 2779915199, 1790575107, 2187128086, 472615631, 3029510009, 4075877127, 3802222185, 4107101658, 3201631749, 1646252340, 4270507174, 1402811438, 1436590835, 3778151818, 3950355702, 3963161475, 4020912224, 2667994737, 273792366, 2331590177, 104699613, 95345982, 3175501286, 2377486676, 1560637892, 3564045318, 369057872, 4213447064, 3919042237, 1137477952, 2658625497, 1119727848, 2340947849, 1530455833, 4007360968, 172466556, 266959938, 516552836, 0, 2256734592, 3980931627, 1890328081, 1917742170, 4294704398, 945164165, 3575528878, 958871085, 3647212047, 2787207260, 1423022939, 775562294, 1739656202, 3876557655, 2530391278, 2443058075, 3310321856, 547512796, 1265195639, 437656594, 3121275539, 719700128, 3762502690, 387781147, 218828297, 3350065803, 2830708150, 2848461854, 428169201, 122466165, 3720081049, 1627235199, 648017665, 4122762354, 1002783846, 2117360635, 695634755, 3336358691, 4234721005, 4049844452, 3704280881, 2232435299, 574624663, 287343814, 612205898, 1039717051, 840019705, 2708326185, 793451934, 821288114, 1391201670, 3822090177, 376187827, 3113855344, 1224348052, 1679968233, 2361698556, 1058709744, 752375421, 2431590963, 1321699145, 3519142200, 2734591178, 188127444, 2177869557, 3727205754, 2384911031, 3215212461, 2648976442, 2450346104, 3432737375, 1180849278, 331544205, 3102249176, 4150144569, 2952102595, 2159976285, 2474404304, 766078933, 313773861, 2570832044, 2108100632, 1668212892, 3145456443, 2013908262, 418672217, 3070356634, 2594734927, 1852171925, 3867060991, 3473416636, 3907448597, 2614737639, 919489135, 164948639, 2094410160, 2997825956, 590424639, 2486224549, 1723872674, 3157750862, 3399941250, 3501252752, 3625268135, 2555048196, 3673637356, 1343127501, 4130281361, 3599595085, 2957853679, 1297403050, 81781910, 3051593425, 2283490410, 532201772, 1367295589, 3926170974, 895287692, 1953757831, 1093597963, 492483431, 3528626907, 1446242576, 1192455638, 1636604631, 209336225, 344873464, 1015671571, 669961897, 3375740769, 3857572124, 2973530695, 3747192018, 1933530610, 3464042516, 935293895, 3454686199, 2858115069, 1863638845, 3683022916, 4085369519, 3292445032, 875313188, 1080017571, 3279033885, 621591778, 1233856572, 2504130317, 24197544, 3017672716, 3835484340, 3247465558, 2220981195, 3060847922, 1551124588, 1463996600], Lp = [4104605777, 1097159550, 396673818, 660510266, 2875968315, 2638606623, 4200115116, 3808662347, 821712160, 1986918061, 3430322568, 38544885, 3856137295, 718002117, 893681702, 1654886325, 2975484382, 3122358053, 3926825029, 4274053469, 796197571, 1290801793, 1184342925, 3556361835, 2405426947, 2459735317, 1836772287, 1381620373, 3196267988, 1948373848, 3764988233, 3385345166, 3263785589, 2390325492, 1480485785, 3111247143, 3780097726, 2293045232, 548169417, 3459953789, 3746175075, 439452389, 1362321559, 1400849762, 1685577905, 1806599355, 2174754046, 137073913, 1214797936, 1174215055, 3731654548, 2079897426, 1943217067, 1258480242, 529487843, 1437280870, 3945269170, 3049390895, 3313212038, 923313619, 679998e3, 3215307299, 57326082, 377642221, 3474729866, 2041877159, 133361907, 1776460110, 3673476453, 96392454, 878845905, 2801699524, 777231668, 4082475170, 2330014213, 4142626212, 2213296395, 1626319424, 1906247262, 1846563261, 562755902, 3708173718, 1040559837, 3871163981, 1418573201, 3294430577, 114585348, 1343618912, 2566595609, 3186202582, 1078185097, 3651041127, 3896688048, 2307622919, 425408743, 3371096953, 2081048481, 1108339068, 2216610296, 0, 2156299017, 736970802, 292596766, 1517440620, 251657213, 2235061775, 2933202493, 758720310, 265905162, 1554391400, 1532285339, 908999204, 174567692, 1474760595, 4002861748, 2610011675, 3234156416, 3693126241, 2001430874, 303699484, 2478443234, 2687165888, 585122620, 454499602, 151849742, 2345119218, 3064510765, 514443284, 4044981591, 1963412655, 2581445614, 2137062819, 19308535, 1928707164, 1715193156, 4219352155, 1126790795, 600235211, 3992742070, 3841024952, 836553431, 1669664834, 2535604243, 3323011204, 1243905413, 3141400786, 4180808110, 698445255, 2653899549, 2989552604, 2253581325, 3252932727, 3004591147, 1891211689, 2487810577, 3915653703, 4237083816, 4030667424, 2100090966, 865136418, 1229899655, 953270745, 3399679628, 3557504664, 4118925222, 2061379749, 3079546586, 2915017791, 983426092, 2022837584, 1607244650, 2118541908, 2366882550, 3635996816, 972512814, 3283088770, 1568718495, 3499326569, 3576539503, 621982671, 2895723464, 410887952, 2623762152, 1002142683, 645401037, 1494807662, 2595684844, 1335535747, 2507040230, 4293295786, 3167684641, 367585007, 3885750714, 1865862730, 2668221674, 2960971305, 2763173681, 1059270954, 2777952454, 2724642869, 1320957812, 2194319100, 2429595872, 2815956275, 77089521, 3973773121, 3444575871, 2448830231, 1305906550, 4021308739, 2857194700, 2516901860, 3518358430, 1787304780, 740276417, 1699839814, 1592394909, 2352307457, 2272556026, 188821243, 1729977011, 3687994002, 274084841, 3594982253, 3613494426, 2701949495, 4162096729, 322734571, 2837966542, 1640576439, 484830689, 1202797690, 3537852828, 4067639125, 349075736, 3342319475, 4157467219, 4255800159, 1030690015, 1155237496, 2951971274, 1757691577, 607398968, 2738905026, 499347990, 3794078908, 1011452712, 227885567, 2818666809, 213114376, 3034881240, 1455525988, 3414450555, 850817237, 1817998408, 3092726480], Fp = [0, 235474187, 470948374, 303765277, 941896748, 908933415, 607530554, 708780849, 1883793496, 2118214995, 1817866830, 1649639237, 1215061108, 1181045119, 1417561698, 1517767529, 3767586992, 4003061179, 4236429990, 4069246893, 3635733660, 3602770327, 3299278474, 3400528769, 2430122216, 2664543715, 2362090238, 2193862645, 2835123396, 2801107407, 3035535058, 3135740889, 3678124923, 3576870512, 3341394285, 3374361702, 3810496343, 3977675356, 4279080257, 4043610186, 2876494627, 2776292904, 3076639029, 3110650942, 2472011535, 2640243204, 2403728665, 2169303058, 1001089995, 899835584, 666464733, 699432150, 59727847, 226906860, 530400753, 294930682, 1273168787, 1172967064, 1475418501, 1509430414, 1942435775, 2110667444, 1876241833, 1641816226, 2910219766, 2743034109, 2976151520, 3211623147, 2505202138, 2606453969, 2302690252, 2269728455, 3711829422, 3543599269, 3240894392, 3475313331, 3843699074, 3943906441, 4178062228, 4144047775, 1306967366, 1139781709, 1374988112, 1610459739, 1975683434, 2076935265, 1775276924, 1742315127, 1034867998, 866637845, 566021896, 800440835, 92987698, 193195065, 429456164, 395441711, 1984812685, 2017778566, 1784663195, 1683407248, 1315562145, 1080094634, 1383856311, 1551037884, 101039829, 135050206, 437757123, 337553864, 1042385657, 807962610, 573804783, 742039012, 2531067453, 2564033334, 2328828971, 2227573024, 2935566865, 2700099354, 3001755655, 3168937228, 3868552805, 3902563182, 4203181171, 4102977912, 3736164937, 3501741890, 3265478751, 3433712980, 1106041591, 1340463100, 1576976609, 1408749034, 2043211483, 2009195472, 1708848333, 1809054150, 832877231, 1068351396, 766945465, 599762354, 159417987, 126454664, 361929877, 463180190, 2709260871, 2943682380, 3178106961, 3009879386, 2572697195, 2538681184, 2236228733, 2336434550, 3509871135, 3745345300, 3441850377, 3274667266, 3910161971, 3877198648, 4110568485, 4211818798, 2597806476, 2497604743, 2261089178, 2295101073, 2733856160, 2902087851, 3202437046, 2968011453, 3936291284, 3835036895, 4136440770, 4169408201, 3535486456, 3702665459, 3467192302, 3231722213, 2051518780, 1951317047, 1716890410, 1750902305, 1113818384, 1282050075, 1584504582, 1350078989, 168810852, 67556463, 371049330, 404016761, 841739592, 1008918595, 775550814, 540080725, 3969562369, 3801332234, 4035489047, 4269907996, 3569255213, 3669462566, 3366754619, 3332740144, 2631065433, 2463879762, 2160117071, 2395588676, 2767645557, 2868897406, 3102011747, 3069049960, 202008497, 33778362, 270040487, 504459436, 875451293, 975658646, 675039627, 641025152, 2084704233, 1917518562, 1615861247, 1851332852, 1147550661, 1248802510, 1484005843, 1451044056, 933301370, 967311729, 733156972, 632953703, 260388950, 25965917, 328671808, 496906059, 1206477858, 1239443753, 1543208500, 1441952575, 2144161806, 1908694277, 1675577880, 1842759443, 3610369226, 3644379585, 3408119516, 3307916247, 4011190502, 3776767469, 4077384432, 4245618683, 2809771154, 2842737049, 3144396420, 3043140495, 2673705150, 2438237621, 2203032232, 2370213795], Dp = [0, 185469197, 370938394, 487725847, 741876788, 657861945, 975451694, 824852259, 1483753576, 1400783205, 1315723890, 1164071807, 1950903388, 2135319889, 1649704518, 1767536459, 2967507152, 3152976349, 2801566410, 2918353863, 2631447780, 2547432937, 2328143614, 2177544179, 3901806776, 3818836405, 4270639778, 4118987695, 3299409036, 3483825537, 3535072918, 3652904859, 2077965243, 1893020342, 1841768865, 1724457132, 1474502543, 1559041666, 1107234197, 1257309336, 598438867, 681933534, 901210569, 1052338372, 261314535, 77422314, 428819965, 310463728, 3409685355, 3224740454, 3710368113, 3593056380, 3875770207, 3960309330, 4045380933, 4195456072, 2471224067, 2554718734, 2237133081, 2388260884, 3212035895, 3028143674, 2842678573, 2724322336, 4138563181, 4255350624, 3769721975, 3955191162, 3667219033, 3516619604, 3431546947, 3347532110, 2933734917, 2782082824, 3099667487, 3016697106, 2196052529, 2313884476, 2499348523, 2683765030, 1179510461, 1296297904, 1347548327, 1533017514, 1786102409, 1635502980, 2087309459, 2003294622, 507358933, 355706840, 136428751, 53458370, 839224033, 957055980, 605657339, 790073846, 2373340630, 2256028891, 2607439820, 2422494913, 2706270690, 2856345839, 3075636216, 3160175349, 3573941694, 3725069491, 3273267108, 3356761769, 4181598602, 4063242375, 4011996048, 3828103837, 1033297158, 915985419, 730517276, 545572369, 296679730, 446754879, 129166120, 213705253, 1709610350, 1860738147, 1945798516, 2029293177, 1239331162, 1120974935, 1606591296, 1422699085, 4148292826, 4233094615, 3781033664, 3931371469, 3682191598, 3497509347, 3446004468, 3328955385, 2939266226, 2755636671, 3106780840, 2988687269, 2198438022, 2282195339, 2501218972, 2652609425, 1201765386, 1286567175, 1371368976, 1521706781, 1805211710, 1620529459, 2105887268, 1988838185, 533804130, 350174575, 164439672, 46346101, 870912086, 954669403, 636813900, 788204353, 2358957921, 2274680428, 2592523643, 2441661558, 2695033685, 2880240216, 3065962831, 3182487618, 3572145929, 3756299780, 3270937875, 3388507166, 4174560061, 4091327024, 4006521127, 3854606378, 1014646705, 930369212, 711349675, 560487590, 272786309, 457992840, 106852767, 223377554, 1678381017, 1862534868, 1914052035, 2031621326, 1211247597, 1128014560, 1580087799, 1428173050, 32283319, 182621114, 401639597, 486441376, 768917123, 651868046, 1003007129, 818324884, 1503449823, 1385356242, 1333838021, 1150208456, 1973745387, 2125135846, 1673061617, 1756818940, 2970356327, 3120694122, 2802849917, 2887651696, 2637442643, 2520393566, 2334669897, 2149987652, 3917234703, 3799141122, 4284502037, 4100872472, 3309594171, 3460984630, 3545789473, 3629546796, 2050466060, 1899603969, 1814803222, 1730525723, 1443857720, 1560382517, 1075025698, 1260232239, 575138148, 692707433, 878443390, 1062597235, 243256656, 91341917, 409198410, 325965383, 3403100636, 3252238545, 3704300486, 3620022987, 3874428392, 3990953189, 4042459122, 4227665663, 2460449204, 2578018489, 2226875310, 2411029155, 3198115200, 3046200461, 2827177882, 2743944855], Mp = [0, 218828297, 437656594, 387781147, 875313188, 958871085, 775562294, 590424639, 1750626376, 1699970625, 1917742170, 2135253587, 1551124588, 1367295589, 1180849278, 1265195639, 3501252752, 3720081049, 3399941250, 3350065803, 3835484340, 3919042237, 4270507174, 4085369519, 3102249176, 3051593425, 2734591178, 2952102595, 2361698556, 2177869557, 2530391278, 2614737639, 3145456443, 3060847922, 2708326185, 2892417312, 2404901663, 2187128086, 2504130317, 2555048196, 3542330227, 3727205754, 3375740769, 3292445032, 3876557655, 3926170974, 4246310725, 4027744588, 1808481195, 1723872674, 1910319033, 2094410160, 1608975247, 1391201670, 1173430173, 1224348052, 59984867, 244860394, 428169201, 344873464, 935293895, 984907214, 766078933, 547512796, 1844882806, 1627235199, 2011214180, 2062270317, 1507497298, 1423022939, 1137477952, 1321699145, 95345982, 145085239, 532201772, 313773861, 830661914, 1015671571, 731183368, 648017665, 3175501286, 2957853679, 2807058932, 2858115069, 2305455554, 2220981195, 2474404304, 2658625497, 3575528878, 3625268135, 3473416636, 3254988725, 3778151818, 3963161475, 4213447064, 4130281361, 3599595085, 3683022916, 3432737375, 3247465558, 3802222185, 4020912224, 4172763771, 4122762354, 3201631749, 3017672716, 2764249623, 2848461854, 2331590177, 2280796200, 2431590963, 2648976442, 104699613, 188127444, 472615631, 287343814, 840019705, 1058709744, 671593195, 621591778, 1852171925, 1668212892, 1953757831, 2037970062, 1514790577, 1463996600, 1080017571, 1297403050, 3673637356, 3623636965, 3235995134, 3454686199, 4007360968, 3822090177, 4107101658, 4190530515, 2997825956, 3215212461, 2830708150, 2779915199, 2256734592, 2340947849, 2627016082, 2443058075, 172466556, 122466165, 273792366, 492483431, 1047239e3, 861968209, 612205898, 695634755, 1646252340, 1863638845, 2013908262, 1963115311, 1446242576, 1530455833, 1277555970, 1093597963, 1636604631, 1820824798, 2073724613, 1989249228, 1436590835, 1487645946, 1337376481, 1119727848, 164948639, 81781910, 331544205, 516552836, 1039717051, 821288114, 669961897, 719700128, 2973530695, 3157750862, 2871682645, 2787207260, 2232435299, 2283490410, 2667994737, 2450346104, 3647212047, 3564045318, 3279033885, 3464042516, 3980931627, 3762502690, 4150144569, 4199882800, 3070356634, 3121275539, 2904027272, 2686254721, 2200818878, 2384911031, 2570832044, 2486224549, 3747192018, 3528626907, 3310321856, 3359936201, 3950355702, 3867060991, 4049844452, 4234721005, 1739656202, 1790575107, 2108100632, 1890328081, 1402811438, 1586903591, 1233856572, 1149249077, 266959938, 48394827, 369057872, 418672217, 1002783846, 919489135, 567498868, 752375421, 209336225, 24197544, 376187827, 459744698, 945164165, 895287692, 574624663, 793451934, 1679968233, 1764313568, 2117360635, 1933530610, 1343127501, 1560637892, 1243112415, 1192455638, 3704280881, 3519142200, 3336358691, 3419915562, 3907448597, 3857572124, 4075877127, 4294704398, 3029510009, 3113855344, 2927934315, 2744104290, 2159976285, 2377486676, 2594734927, 2544078150], Gp = [0, 151849742, 303699484, 454499602, 607398968, 758720310, 908999204, 1059270954, 1214797936, 1097159550, 1517440620, 1400849762, 1817998408, 1699839814, 2118541908, 2001430874, 2429595872, 2581445614, 2194319100, 2345119218, 3034881240, 3186202582, 2801699524, 2951971274, 3635996816, 3518358430, 3399679628, 3283088770, 4237083816, 4118925222, 4002861748, 3885750714, 1002142683, 850817237, 698445255, 548169417, 529487843, 377642221, 227885567, 77089521, 1943217067, 2061379749, 1640576439, 1757691577, 1474760595, 1592394909, 1174215055, 1290801793, 2875968315, 2724642869, 3111247143, 2960971305, 2405426947, 2253581325, 2638606623, 2487810577, 3808662347, 3926825029, 4044981591, 4162096729, 3342319475, 3459953789, 3576539503, 3693126241, 1986918061, 2137062819, 1685577905, 1836772287, 1381620373, 1532285339, 1078185097, 1229899655, 1040559837, 923313619, 740276417, 621982671, 439452389, 322734571, 137073913, 19308535, 3871163981, 4021308739, 4104605777, 4255800159, 3263785589, 3414450555, 3499326569, 3651041127, 2933202493, 2815956275, 3167684641, 3049390895, 2330014213, 2213296395, 2566595609, 2448830231, 1305906550, 1155237496, 1607244650, 1455525988, 1776460110, 1626319424, 2079897426, 1928707164, 96392454, 213114376, 396673818, 514443284, 562755902, 679998e3, 865136418, 983426092, 3708173718, 3557504664, 3474729866, 3323011204, 4180808110, 4030667424, 3945269170, 3794078908, 2507040230, 2623762152, 2272556026, 2390325492, 2975484382, 3092726480, 2738905026, 2857194700, 3973773121, 3856137295, 4274053469, 4157467219, 3371096953, 3252932727, 3673476453, 3556361835, 2763173681, 2915017791, 3064510765, 3215307299, 2156299017, 2307622919, 2459735317, 2610011675, 2081048481, 1963412655, 1846563261, 1729977011, 1480485785, 1362321559, 1243905413, 1126790795, 878845905, 1030690015, 645401037, 796197571, 274084841, 425408743, 38544885, 188821243, 3613494426, 3731654548, 3313212038, 3430322568, 4082475170, 4200115116, 3780097726, 3896688048, 2668221674, 2516901860, 2366882550, 2216610296, 3141400786, 2989552604, 2837966542, 2687165888, 1202797690, 1320957812, 1437280870, 1554391400, 1669664834, 1787304780, 1906247262, 2022837584, 265905162, 114585348, 499347990, 349075736, 736970802, 585122620, 972512814, 821712160, 2595684844, 2478443234, 2293045232, 2174754046, 3196267988, 3079546586, 2895723464, 2777952454, 3537852828, 3687994002, 3234156416, 3385345166, 4142626212, 4293295786, 3841024952, 3992742070, 174567692, 57326082, 410887952, 292596766, 777231668, 660510266, 1011452712, 893681702, 1108339068, 1258480242, 1343618912, 1494807662, 1715193156, 1865862730, 1948373848, 2100090966, 2701949495, 2818666809, 3004591147, 3122358053, 2235061775, 2352307457, 2535604243, 2653899549, 3915653703, 3764988233, 4219352155, 4067639125, 3444575871, 3294430577, 3746175075, 3594982253, 836553431, 953270745, 600235211, 718002117, 367585007, 484830689, 133361907, 251657213, 2041877159, 1891211689, 1806599355, 1654886325, 1568718495, 1418573201, 1335535747, 1184342925];
function wc(r) {
  const e = [];
  for (let t = 0; t < r.length; t += 4)
    e.push(r[t] << 24 | r[t + 1] << 16 | r[t + 2] << 8 | r[t + 3]);
  return e;
}
class vo {
  get key() {
    return ie(this, ma, "f").slice();
  }
  constructor(e) {
    if (ma.set(this, void 0), Ge.set(this, void 0), ut.set(this, void 0), !(this instanceof vo))
      throw Error("AES must be instanitated with `new`");
    mc(this, ma, new Uint8Array(e), "f");
    const t = Ip[this.key.length];
    if (t == null)
      throw new TypeError("invalid key size (must be 16, 24 or 32 bytes)");
    mc(this, ut, [], "f"), mc(this, Ge, [], "f");
    for (let u = 0; u <= t; u++)
      ie(this, ut, "f").push([0, 0, 0, 0]), ie(this, Ge, "f").push([0, 0, 0, 0]);
    const n = (t + 1) * 4, s = this.key.length / 4, i = wc(this.key);
    let a;
    for (let u = 0; u < s; u++)
      a = u >> 2, ie(this, ut, "f")[a][u % 4] = i[u], ie(this, Ge, "f")[t - a][u % 4] = i[u];
    let c = 0, o = s, f;
    for (; o < n; ) {
      if (f = i[s - 1], i[0] ^= Fe[f >> 16 & 255] << 24 ^ Fe[f >> 8 & 255] << 16 ^ Fe[f & 255] << 8 ^ Fe[f >> 24 & 255] ^ vp[c] << 24, c += 1, s != 8)
        for (let p = 1; p < s; p++)
          i[p] ^= i[p - 1];
      else {
        for (let p = 1; p < s / 2; p++)
          i[p] ^= i[p - 1];
        f = i[s / 2 - 1], i[s / 2] ^= Fe[f & 255] ^ Fe[f >> 8 & 255] << 8 ^ Fe[f >> 16 & 255] << 16 ^ Fe[f >> 24 & 255] << 24;
        for (let p = s / 2 + 1; p < s; p++)
          i[p] ^= i[p - 1];
      }
      let u = 0, d, h;
      for (; u < s && o < n; )
        d = o >> 2, h = o % 4, ie(this, ut, "f")[d][h] = i[u], ie(this, Ge, "f")[t - d][h] = i[u++], o++;
    }
    for (let u = 1; u < t; u++)
      for (let d = 0; d < 4; d++)
        f = ie(this, Ge, "f")[u][d], ie(this, Ge, "f")[u][d] = Fp[f >> 24 & 255] ^ Dp[f >> 16 & 255] ^ Mp[f >> 8 & 255] ^ Gp[f & 255];
  }
  encrypt(e) {
    if (e.length != 16)
      throw new TypeError("invalid plaintext size (must be 16 bytes)");
    const t = ie(this, ut, "f").length - 1, n = [0, 0, 0, 0];
    let s = wc(e);
    for (let c = 0; c < 4; c++)
      s[c] ^= ie(this, ut, "f")[0][c];
    for (let c = 1; c < t; c++) {
      for (let o = 0; o < 4; o++)
        n[o] = kp[s[o] >> 24 & 255] ^ Op[s[(o + 1) % 4] >> 16 & 255] ^ Tp[s[(o + 2) % 4] >> 8 & 255] ^ Rp[s[(o + 3) % 4] & 255] ^ ie(this, ut, "f")[c][o];
      s = n.slice();
    }
    const i = new Uint8Array(16);
    let a = 0;
    for (let c = 0; c < 4; c++)
      a = ie(this, ut, "f")[t][c], i[4 * c] = (Fe[s[c] >> 24 & 255] ^ a >> 24) & 255, i[4 * c + 1] = (Fe[s[(c + 1) % 4] >> 16 & 255] ^ a >> 16) & 255, i[4 * c + 2] = (Fe[s[(c + 2) % 4] >> 8 & 255] ^ a >> 8) & 255, i[4 * c + 3] = (Fe[s[(c + 3) % 4] & 255] ^ a) & 255;
    return i;
  }
  decrypt(e) {
    if (e.length != 16)
      throw new TypeError("invalid ciphertext size (must be 16 bytes)");
    const t = ie(this, Ge, "f").length - 1, n = [0, 0, 0, 0];
    let s = wc(e);
    for (let c = 0; c < 4; c++)
      s[c] ^= ie(this, Ge, "f")[0][c];
    for (let c = 1; c < t; c++) {
      for (let o = 0; o < 4; o++)
        n[o] = Sp[s[o] >> 24 & 255] ^ Bp[s[(o + 3) % 4] >> 16 & 255] ^ Up[s[(o + 2) % 4] >> 8 & 255] ^ Lp[s[(o + 1) % 4] & 255] ^ ie(this, Ge, "f")[c][o];
      s = n.slice();
    }
    const i = new Uint8Array(16);
    let a = 0;
    for (let c = 0; c < 4; c++)
      a = ie(this, Ge, "f")[t][c], i[4 * c] = (ia[s[c] >> 24 & 255] ^ a >> 24) & 255, i[4 * c + 1] = (ia[s[(c + 3) % 4] >> 16 & 255] ^ a >> 16) & 255, i[4 * c + 2] = (ia[s[(c + 2) % 4] >> 8 & 255] ^ a >> 8) & 255, i[4 * c + 3] = (ia[s[(c + 1) % 4] & 255] ^ a) & 255;
    return i;
  }
}
ma = /* @__PURE__ */ new WeakMap(), Ge = /* @__PURE__ */ new WeakMap(), ut = /* @__PURE__ */ new WeakMap();
class pu {
  constructor(e, t, n) {
    if (n && !(this instanceof n))
      throw new Error(`${e} must be instantiated with "new"`);
    Object.defineProperties(this, {
      aes: { enumerable: !0, value: new vo(t) },
      name: { enumerable: !0, value: e }
    });
  }
}
var aa = globalThis && globalThis.__classPrivateFieldSet || function(r, e, t, n, s) {
  if (n === "m")
    throw new TypeError("Private method is not writable");
  if (n === "a" && !s)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? r !== e || !s : !e.has(r))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n === "a" ? s.call(r, t) : s ? s.value = t : e.set(r, t), t;
}, gr = globalThis && globalThis.__classPrivateFieldGet || function(r, e, t, n) {
  if (t === "a" && !n)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? r !== e || !n : !e.has(r))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(r) : n ? n.value : e.get(r);
}, _s, Pt;
class ko extends pu {
  constructor(e, t) {
    if (super("ECC", e, ko), _s.set(this, void 0), Pt.set(this, void 0), t) {
      if (t.length % 16)
        throw new TypeError("invalid iv size (must be 16 bytes)");
      aa(this, _s, new Uint8Array(t), "f");
    } else
      aa(this, _s, new Uint8Array(16), "f");
    aa(this, Pt, this.iv, "f");
  }
  get iv() {
    return new Uint8Array(gr(this, _s, "f"));
  }
  encrypt(e) {
    if (e.length % 16)
      throw new TypeError("invalid plaintext size (must be multiple of 16 bytes)");
    const t = new Uint8Array(e.length);
    for (let n = 0; n < e.length; n += 16) {
      for (let s = 0; s < 16; s++)
        gr(this, Pt, "f")[s] ^= e[n + s];
      aa(this, Pt, this.aes.encrypt(gr(this, Pt, "f")), "f"), t.set(gr(this, Pt, "f"), n);
    }
    return t;
  }
  decrypt(e) {
    if (e.length % 16)
      throw new TypeError("invalid ciphertext size (must be multiple of 16 bytes)");
    const t = new Uint8Array(e.length);
    for (let n = 0; n < e.length; n += 16) {
      const s = this.aes.decrypt(e.subarray(n, n + 16));
      for (let i = 0; i < 16; i++)
        t[n + i] = s[i] ^ gr(this, Pt, "f")[i], gr(this, Pt, "f")[i] = e[n + i];
    }
    return t;
  }
}
_s = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ new WeakMap();
var yr = globalThis && globalThis.__classPrivateFieldSet || function(r, e, t, n, s) {
  if (n === "m")
    throw new TypeError("Private method is not writable");
  if (n === "a" && !s)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? r !== e || !s : !e.has(r))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n === "a" ? s.call(r, t) : s ? s.value = t : e.set(r, t), t;
}, De = globalThis && globalThis.__classPrivateFieldGet || function(r, e, t, n) {
  if (t === "a" && !n)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? r !== e || !n : !e.has(r))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(r) : n ? n.value : e.get(r);
}, Qs, Sn, He;
class Is extends pu {
  constructor(e, t) {
    super("CTR", e, Is), Qs.set(this, void 0), Sn.set(this, void 0), He.set(this, void 0), yr(this, He, new Uint8Array(16), "f"), De(this, He, "f").fill(0), yr(this, Qs, De(this, He, "f"), "f"), yr(this, Sn, 16, "f"), t == null && (t = 1), typeof t == "number" ? this.setCounterValue(t) : this.setCounterBytes(t);
  }
  get counter() {
    return new Uint8Array(De(this, He, "f"));
  }
  setCounterValue(e) {
    if (!Number.isInteger(e) || e < 0 || e > Number.MAX_SAFE_INTEGER)
      throw new TypeError("invalid counter initial integer value");
    for (let t = 15; t >= 0; --t)
      De(this, He, "f")[t] = e % 256, e = Math.floor(e / 256);
  }
  setCounterBytes(e) {
    if (e.length !== 16)
      throw new TypeError("invalid counter initial Uint8Array value length");
    De(this, He, "f").set(e);
  }
  increment() {
    for (let e = 15; e >= 0; e--)
      if (De(this, He, "f")[e] === 255)
        De(this, He, "f")[e] = 0;
      else {
        De(this, He, "f")[e]++;
        break;
      }
  }
  encrypt(e) {
    var t, n;
    const s = new Uint8Array(e);
    for (let i = 0; i < s.length; i++)
      De(this, Sn, "f") === 16 && (yr(this, Qs, this.aes.encrypt(De(this, He, "f")), "f"), yr(this, Sn, 0, "f"), this.increment()), s[i] ^= De(this, Qs, "f")[yr(this, Sn, (n = De(this, Sn, "f"), t = n++, n), "f"), t];
    return s;
  }
  decrypt(e) {
    return this.encrypt(e);
  }
}
Qs = /* @__PURE__ */ new WeakMap(), Sn = /* @__PURE__ */ new WeakMap(), He = /* @__PURE__ */ new WeakMap();
function Hp(r) {
  if (r.length < 16)
    throw new TypeError("PKCS#7 invalid length");
  const e = r[r.length - 1];
  if (e > 16)
    throw new TypeError("PKCS#7 padding byte out of range");
  const t = r.length - e;
  for (let n = 0; n < e; n++)
    if (r[t + n] !== e)
      throw new TypeError("PKCS#7 invalid padding byte");
  return new Uint8Array(r.subarray(0, t));
}
function gu(r) {
  return typeof r == "string" && !r.startsWith("0x") && (r = "0x" + r), be(r);
}
function Fs(r, e) {
  for (r = String(r); r.length < e; )
    r = "0" + r;
  return r;
}
function Vi(r) {
  return typeof r == "string" ? Ee(r, "NFKC") : be(r);
}
function ee(r, e) {
  const t = e.match(/^([a-z0-9$_.-]*)(:([a-z]+))?(!)?$/i);
  b(t != null, "invalid path", "path", e);
  const n = t[1], s = t[3], i = t[4] === "!";
  let a = r;
  for (const c of n.toLowerCase().split(".")) {
    if (Array.isArray(a)) {
      if (!c.match(/^[0-9]+$/))
        break;
      a = a[parseInt(c)];
    } else if (typeof a == "object") {
      let o = null;
      for (const f in a)
        if (f.toLowerCase() === c) {
          o = a[f];
          break;
        }
      a = o;
    } else
      a = null;
    if (a == null)
      break;
  }
  if (b(!i || a != null, "missing required value", "path", n), s && a != null) {
    if (s === "int") {
      if (typeof a == "string" && a.match(/^-?[0-9]+$/))
        return parseInt(a);
      if (Number.isSafeInteger(a))
        return a;
    }
    if (s === "number" && typeof a == "string" && a.match(/^-?[0-9.]*$/))
      return parseFloat(a);
    if (s === "data" && typeof a == "string")
      return gu(a);
    if (s === "array" && Array.isArray(a) || s === typeof a)
      return a;
    b(!1, `wrong type found for ${s} `, "path", n);
  }
  return a;
}
const yu = "m/44'/60'/0'/0/0";
function tf(r) {
  try {
    const e = JSON.parse(r);
    if ((e.version != null ? parseInt(e.version) : 0) === 3)
      return !0;
  } catch {
  }
  return !1;
}
function Kp(r, e, t) {
  if (ee(r, "crypto.cipher:string") === "aes-128-ctr") {
    const s = ee(r, "crypto.cipherparams.iv:data!"), i = new Is(e, s);
    return N(i.decrypt(t));
  }
  A(!1, "unsupported cipher", "UNSUPPORTED_OPERATION", {
    operation: "decrypt"
  });
}
function La(r, e) {
  const t = O(e), n = ee(r, "crypto.ciphertext:data!"), s = N(z(_([t.slice(16, 32), n]))).substring(2);
  b(s === ee(r, "crypto.mac:string!").toLowerCase(), "incorrect password", "password", "[ REDACTED ]");
  const i = Kp(r, t.slice(0, 16), n), a = Mi(i);
  if (r.address) {
    let f = r.address.toLowerCase();
    f.startsWith("0x") || (f = "0x" + f), b(F(f) === a, "keystore address/privateKey mismatch", "address", r.address);
  }
  const c = { address: a, privateKey: i };
  if (ee(r, "x-ethers.version:string") === "0.1") {
    const f = t.slice(32, 64), u = ee(r, "x-ethers.mnemonicCiphertext:data!"), d = ee(r, "x-ethers.mnemonicCounter:data!"), h = new Is(f, d);
    c.mnemonic = {
      path: ee(r, "x-ethers.path:string") || yu,
      locale: ee(r, "x-ethers.locale:string") || "en",
      entropy: N(O(h.decrypt(u)))
    };
  }
  return c;
}
function mu(r) {
  const e = ee(r, "crypto.kdf:string");
  if (e && typeof e == "string") {
    if (e.toLowerCase() === "scrypt") {
      const t = ee(r, "crypto.kdfparams.salt:data!"), n = ee(r, "crypto.kdfparams.n:int!"), s = ee(r, "crypto.kdfparams.r:int!"), i = ee(r, "crypto.kdfparams.p:int!");
      b(n > 0 && (n & n - 1) === 0, "invalid kdf.N", "kdf.N", n), b(s > 0 && i > 0, "invalid kdf", "kdf", e);
      const a = ee(r, "crypto.kdfparams.dklen:int!");
      return b(a === 32, "invalid kdf.dklen", "kdf.dflen", a), { name: "scrypt", salt: t, N: n, r: s, p: i, dkLen: 64 };
    } else if (e.toLowerCase() === "pbkdf2") {
      const t = ee(r, "crypto.kdfparams.salt:data!"), n = ee(r, "crypto.kdfparams.prf:string!"), s = n.split("-").pop();
      b(s === "sha256" || s === "sha512", "invalid kdf.pdf", "kdf.pdf", n);
      const i = ee(r, "crypto.kdfparams.c:int!"), a = ee(r, "crypto.kdfparams.dklen:int!");
      return b(a === 32, "invalid kdf.dklen", "kdf.dklen", a), { name: "pbkdf2", salt: t, count: i, dkLen: a, algorithm: s };
    }
  }
  b(!1, "unsupported key-derivation function", "kdf", e);
}
function Vp(r, e) {
  const t = JSON.parse(r), n = Vi(e), s = mu(t);
  if (s.name === "pbkdf2") {
    const { salt: d, count: h, dkLen: p, algorithm: m } = s, w = Pn(n, d, h, p, m);
    return La(t, w);
  }
  A(s.name === "scrypt", "cannot be reached", "UNKNOWN_ERROR", { params: s });
  const { salt: i, N: a, r: c, p: o, dkLen: f } = s, u = Ts(n, i, a, c, o, f);
  return La(t, u);
}
function nf(r) {
  return new Promise((e) => {
    setTimeout(() => {
      e();
    }, r);
  });
}
async function _p(r, e, t) {
  const n = JSON.parse(r), s = Vi(e), i = mu(n);
  if (i.name === "pbkdf2") {
    t && (t(0), await nf(0));
    const { salt: h, count: p, dkLen: m, algorithm: w } = i, E = Pn(s, h, p, m, w);
    return t && (t(1), await nf(0)), La(n, E);
  }
  A(i.name === "scrypt", "cannot be reached", "UNKNOWN_ERROR", { params: i });
  const { salt: a, N: c, r: o, p: f, dkLen: u } = i, d = await Os(s, a, c, o, f, u, t);
  return La(n, d);
}
function wu(r) {
  const e = r.salt != null ? O(r.salt, "options.salt") : _t(32);
  let t = 1 << 17, n = 8, s = 1;
  return r.scrypt && (r.scrypt.N && (t = r.scrypt.N), r.scrypt.r && (n = r.scrypt.r), r.scrypt.p && (s = r.scrypt.p)), b(typeof t == "number" && t > 0 && Number.isSafeInteger(t) && (BigInt(t) & BigInt(t - 1)) === BigInt(0), "invalid scrypt N parameter", "options.N", t), b(typeof n == "number" && n > 0 && Number.isSafeInteger(n), "invalid scrypt r parameter", "options.r", n), b(typeof s == "number" && s > 0 && Number.isSafeInteger(s), "invalid scrypt p parameter", "options.p", s), { name: "scrypt", dkLen: 32, salt: e, N: t, r: n, p: s };
}
function Au(r, e, t, n) {
  const s = O(t.privateKey, "privateKey"), i = n.iv != null ? O(n.iv, "options.iv") : _t(16);
  b(i.length === 16, "invalid options.iv length", "options.iv", n.iv);
  const a = n.uuid != null ? O(n.uuid, "options.uuid") : _t(16);
  b(a.length === 16, "invalid options.uuid length", "options.uuid", n.iv);
  const c = r.slice(0, 16), o = r.slice(16, 32), f = new Is(c, i), u = O(f.encrypt(s)), d = z(_([o, u])), h = {
    address: t.address.substring(2).toLowerCase(),
    id: td(a),
    version: 3,
    Crypto: {
      cipher: "aes-128-ctr",
      cipherparams: {
        iv: N(i).substring(2)
      },
      ciphertext: N(u).substring(2),
      kdf: "scrypt",
      kdfparams: {
        salt: N(e.salt).substring(2),
        n: e.N,
        dklen: 32,
        p: e.p,
        r: e.r
      },
      mac: d.substring(2)
    }
  };
  if (t.mnemonic) {
    const p = n.client != null ? n.client : `ethers/${of}`, m = t.mnemonic.path || yu, w = t.mnemonic.locale || "en", E = r.slice(32, 64), C = O(t.mnemonic.entropy, "account.mnemonic.entropy"), B = _t(16), I = new Is(E, B), K = O(I.encrypt(C)), R = /* @__PURE__ */ new Date(), se = "UTC--" + (R.getUTCFullYear() + "-" + Fs(R.getUTCMonth() + 1, 2) + "-" + Fs(R.getUTCDate(), 2) + "T" + Fs(R.getUTCHours(), 2) + "-" + Fs(R.getUTCMinutes(), 2) + "-" + Fs(R.getUTCSeconds(), 2) + ".0Z") + "--" + h.address;
    h["x-ethers"] = {
      client: p,
      gethFilename: se,
      path: m,
      locale: w,
      mnemonicCounter: N(B).substring(2),
      mnemonicCiphertext: N(K).substring(2),
      version: "0.1"
    };
  }
  return JSON.stringify(h);
}
function Eu(r, e, t) {
  t == null && (t = {});
  const n = Vi(e), s = wu(t), i = Ts(n, s.salt, s.N, s.r, s.p, 64);
  return Au(O(i), s, r, t);
}
async function Cu(r, e, t) {
  t == null && (t = {});
  const n = Vi(e), s = wu(t), i = await Os(n, s.salt, s.N, s.r, s.p, 64, t.progressCallback);
  return Au(O(i), s, r, t);
}
const Ac = "m/44'/60'/0'/0/0", Qp = new Uint8Array([66, 105, 116, 99, 111, 105, 110, 32, 115, 101, 101, 100]), An = 2147483648, zp = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), Jp = "0123456789abcdef";
function Fa(r, e) {
  let t = "";
  for (; r; )
    t = Jp[r % 16] + t, r = Math.trunc(r / 16);
  for (; t.length < e * 2; )
    t = "0" + t;
  return "0x" + t;
}
function to(r) {
  const e = O(r), t = W(it(it(e)), 0, 4), n = _([e, t]);
  return bf(n);
}
const dt = {};
function Pu(r, e, t, n) {
  const s = new Uint8Array(37);
  r & An ? (A(n != null, "cannot derive child of neutered node", "UNSUPPORTED_OPERATION", {
    operation: "deriveChild"
  }), s.set(O(n), 1)) : s.set(O(t));
  for (let a = 24; a >= 0; a -= 8)
    s[33 + (a >> 3)] = r >> 24 - a & 255;
  const i = O(dr("sha512", e, s));
  return { IL: i.slice(0, 32), IR: i.slice(32) };
}
function Nu(r, e) {
  const t = e.split("/");
  b(t.length > 0 && (t[0] === "m" || r.depth > 0), "invalid path", "path", e), t[0] === "m" && t.shift();
  let n = r;
  for (let s = 0; s < t.length; s++) {
    const i = t[s];
    if (i.match(/^[0-9]+'$/)) {
      const a = parseInt(i.substring(0, i.length - 1));
      b(a < An, "invalid path index", `path[${s}]`, i), n = n.deriveChild(An + a);
    } else if (i.match(/^[0-9]+$/)) {
      const a = parseInt(i);
      b(a < An, "invalid path index", `path[${s}]`, i), n = n.deriveChild(a);
    } else
      b(!1, "invalid path component", `path[${s}]`, i);
  }
  return n;
}
var Ui, no, nr, zs;
const $e = class $e extends Ba {
  /**
   *  @private
   */
  constructor(t, n, s, i, a, c, o, f, u) {
    super(n, u);
    y(this, Ui);
    /**
     *  The compressed public key.
     */
    g(this, "publicKey");
    /**
     *  The fingerprint.
     *
     *  A fingerprint allows quick qay to detect parent and child nodes,
     *  but developers should be prepared to deal with collisions as it
     *  is only 4 bytes.
     */
    g(this, "fingerprint");
    /**
     *  The parent fingerprint.
     */
    g(this, "parentFingerprint");
    /**
     *  The mnemonic used to create this HD Node, if available.
     *
     *  Sources such as extended keys do not encode the mnemonic, in
     *  which case this will be ``null``.
     */
    g(this, "mnemonic");
    /**
     *  The chaincode, which is effectively a public key used
     *  to derive children.
     */
    g(this, "chainCode");
    /**
     *  The derivation path of this wallet.
     *
     *  Since extended keys do not provider full path details, this
     *  may be ``null``, if instantiated from a source that does not
     *  enocde it.
     */
    g(this, "path");
    /**
     *  The child index of this wallet. Values over ``2 *\* 31`` indicate
     *  the node is hardened.
     */
    g(this, "index");
    /**
     *  The depth of this wallet, which is the number of components
     *  in its path.
     */
    g(this, "depth");
    ur(t, dt, "HDNodeWallet"), T(this, { publicKey: n.compressedPublicKey });
    const d = W(ks(it(this.publicKey)), 0, 4);
    T(this, {
      parentFingerprint: s,
      fingerprint: d,
      chainCode: i,
      path: a,
      index: c,
      depth: o
    }), T(this, { mnemonic: f });
  }
  connect(t) {
    return new $e(dt, this.signingKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, this.mnemonic, t);
  }
  /**
   *  Resolves to a [JSON Keystore Wallet](json-wallets) encrypted with
   *  %%password%%.
   *
   *  If %%progressCallback%% is specified, it will receive periodic
   *  updates as the encryption process progreses.
   */
  async encrypt(t, n) {
    return await Cu(P(this, Ui, no).call(this), t, { progressCallback: n });
  }
  /**
   *  Returns a [JSON Keystore Wallet](json-wallets) encryped with
   *  %%password%%.
   *
   *  It is preferred to use the [async version](encrypt) instead,
   *  which allows a [[ProgressCallback]] to keep the user informed.
   *
   *  This method will block the event loop (freezing all UI) until
   *  it is complete, which may be a non-trivial duration.
   */
  encryptSync(t) {
    return Eu(P(this, Ui, no).call(this), t);
  }
  /**
   *  The extended key.
   *
   *  This key will begin with the prefix ``xpriv`` and can be used to
   *  reconstruct this HD Node to derive its children.
   */
  get extendedKey() {
    return A(this.depth < 256, "Depth too deep", "UNSUPPORTED_OPERATION", { operation: "extendedKey" }), to(_([
      "0x0488ADE4",
      Fa(this.depth, 1),
      this.parentFingerprint,
      Fa(this.index, 4),
      this.chainCode,
      _(["0x00", this.privateKey])
    ]));
  }
  /**
   *  Returns true if this wallet has a path, providing a Type Guard
   *  that the path is non-null.
   */
  hasPath() {
    return this.path != null;
  }
  /**
   *  Returns a neutered HD Node, which removes the private details
   *  of an HD Node.
   *
   *  A neutered node has no private key, but can be used to derive
   *  child addresses and other public data about the HD Node.
   */
  neuter() {
    return new xi(dt, this.address, this.publicKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, this.provider);
  }
  /**
   *  Return the child for %%index%%.
   */
  deriveChild(t) {
    const n = L(t, "index");
    b(n <= 4294967295, "invalid index", "index", n);
    let s = this.path;
    s && (s += "/" + (n & ~An), n & An && (s += "'"));
    const { IR: i, IL: a } = Pu(n, this.chainCode, this.publicKey, this.privateKey), c = new Et(zt((Wa(a) + BigInt(this.privateKey)) % zp, 32));
    return new $e(dt, c, this.fingerprint, N(i), s, n, this.depth + 1, this.mnemonic, this.provider);
  }
  /**
   *  Return the HDNode for %%path%% from this node.
   */
  derivePath(t) {
    return Nu(this, t);
  }
  /**
   *  Creates a new HD Node from %%extendedKey%%.
   *
   *  If the %%extendedKey%% will either have a prefix or ``xpub`` or
   *  ``xpriv``, returning a neutered HD Node ([[HDNodeVoidWallet]])
   *  or full HD Node ([[HDNodeWallet) respectively.
   */
  static fromExtendedKey(t) {
    const n = me(Mu(t));
    b(n.length === 82 || to(n.slice(0, 78)) === t, "invalid extended key", "extendedKey", "[ REDACTED ]");
    const s = n[4], i = N(n.slice(5, 9)), a = parseInt(N(n.slice(9, 13)).substring(2), 16), c = N(n.slice(13, 45)), o = n.slice(45, 78);
    switch (N(n.slice(0, 4))) {
      case "0x0488b21e":
      case "0x043587cf": {
        const f = N(o);
        return new xi(dt, Mi(f), f, i, c, null, a, s, null);
      }
      case "0x0488ade4":
      case "0x04358394 ":
        if (o[0] !== 0)
          break;
        return new $e(dt, new Et(o.slice(1)), i, c, null, a, s, null, null);
    }
    b(!1, "invalid extended key prefix", "extendedKey", "[ REDACTED ]");
  }
  /**
   *  Creates a new random HDNode.
   */
  static createRandom(t, n, s) {
    var a;
    t == null && (t = ""), n == null && (n = Ac), s == null && (s = lr.wordlist());
    const i = Ns.fromEntropy(_t(16), t, s);
    return P(a = $e, nr, zs).call(a, i.computeSeed(), i).derivePath(n);
  }
  /**
   *  Create an HD Node from %%mnemonic%%.
   */
  static fromMnemonic(t, n) {
    var s;
    return n || (n = Ac), P(s = $e, nr, zs).call(s, t.computeSeed(), t).derivePath(n);
  }
  /**
   *  Creates an HD Node from a mnemonic %%phrase%%.
   */
  static fromPhrase(t, n, s, i) {
    var c;
    n == null && (n = ""), s == null && (s = Ac), i == null && (i = lr.wordlist());
    const a = Ns.fromPhrase(t, n, i);
    return P(c = $e, nr, zs).call(c, a.computeSeed(), a).derivePath(s);
  }
  /**
   *  Creates an HD Node from a %%seed%%.
   */
  static fromSeed(t) {
    var n;
    return P(n = $e, nr, zs).call(n, t, null);
  }
};
Ui = new WeakSet(), no = function() {
  const t = { address: this.address, privateKey: this.privateKey }, n = this.mnemonic;
  return this.path && n && n.wordlist.locale === "en" && n.password === "" && (t.mnemonic = {
    path: this.path,
    locale: "en",
    entropy: n.entropy
  }), t;
}, nr = new WeakSet(), zs = function(t, n) {
  b(df(t), "invalid seed", "seed", "[REDACTED]");
  const s = O(t, "seed");
  b(s.length >= 16 && s.length <= 64, "invalid seed", "seed", "[REDACTED]");
  const i = O(dr("sha512", Qp, s)), a = new Et(N(i.slice(0, 32)));
  return new $e(dt, a, "0x00000000", N(i.slice(32)), "m", 0, 0, n, null);
}, y($e, nr);
let Xs = $e;
class xi extends Wc {
  /**
   *  @private
   */
  constructor(t, n, s, i, a, c, o, f, u) {
    super(n, u);
    /**
     *  The compressed public key.
     */
    g(this, "publicKey");
    /**
     *  The fingerprint.
     *
     *  A fingerprint allows quick qay to detect parent and child nodes,
     *  but developers should be prepared to deal with collisions as it
     *  is only 4 bytes.
     */
    g(this, "fingerprint");
    /**
     *  The parent node fingerprint.
     */
    g(this, "parentFingerprint");
    /**
     *  The chaincode, which is effectively a public key used
     *  to derive children.
     */
    g(this, "chainCode");
    /**
     *  The derivation path of this wallet.
     *
     *  Since extended keys do not provider full path details, this
     *  may be ``null``, if instantiated from a source that does not
     *  enocde it.
     */
    g(this, "path");
    /**
     *  The child index of this wallet. Values over ``2 *\* 31`` indicate
     *  the node is hardened.
     */
    g(this, "index");
    /**
     *  The depth of this wallet, which is the number of components
     *  in its path.
     */
    g(this, "depth");
    ur(t, dt, "HDNodeVoidWallet"), T(this, { publicKey: s });
    const d = W(ks(it(s)), 0, 4);
    T(this, {
      publicKey: s,
      fingerprint: d,
      parentFingerprint: i,
      chainCode: a,
      path: c,
      index: o,
      depth: f
    });
  }
  connect(t) {
    return new xi(dt, this.address, this.publicKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, t);
  }
  /**
   *  The extended key.
   *
   *  This key will begin with the prefix ``xpub`` and can be used to
   *  reconstruct this neutered key to derive its children addresses.
   */
  get extendedKey() {
    return A(this.depth < 256, "Depth too deep", "UNSUPPORTED_OPERATION", { operation: "extendedKey" }), to(_([
      "0x0488B21E",
      Fa(this.depth, 1),
      this.parentFingerprint,
      Fa(this.index, 4),
      this.chainCode,
      this.publicKey
    ]));
  }
  /**
   *  Returns true if this wallet has a path, providing a Type Guard
   *  that the path is non-null.
   */
  hasPath() {
    return this.path != null;
  }
  /**
   *  Return the child for %%index%%.
   */
  deriveChild(t) {
    const n = L(t, "index");
    b(n <= 4294967295, "invalid index", "index", n);
    let s = this.path;
    s && (s += "/" + (n & ~An), n & An && (s += "'"));
    const { IR: i, IL: a } = Pu(n, this.chainCode, this.publicKey, null), c = Et.addPoints(a, this.publicKey, !0), o = Mi(c);
    return new xi(dt, o, c, this.fingerprint, N(i), s, n, this.depth + 1, this.provider);
  }
  /**
   *  Return the signer for %%path%% from this node.
   */
  derivePath(t) {
    return Nu(this, t);
  }
}
function rf(r) {
  try {
    if (JSON.parse(r).encseed)
      return !0;
  } catch {
  }
  return !1;
}
function sf(r, e) {
  const t = JSON.parse(r), n = Vi(e), s = F(ee(t, "ethaddr:string!")), i = gu(ee(t, "encseed:string!"));
  b(i && i.length % 16 === 0, "invalid encseed", "json", r);
  const a = O(Pn(n, n, 2e3, 32, "sha256")).slice(0, 16), c = i.slice(0, 16), o = i.slice(16), f = new ko(a, c), u = Hp(O(f.decrypt(o)));
  let d = "";
  for (let h = 0; h < u.length; h++)
    d += String.fromCharCode(u[h]);
  return { address: s, privateKey: jt(d) };
}
function af(r) {
  return new Promise((e) => {
    setTimeout(() => {
      e();
    }, r);
  });
}
var Li, ro;
const Un = class Un extends Ba {
  /**
   *  Create a new wallet for the private %%key%%, optionally connected
   *  to %%provider%%.
   */
  constructor(e, t) {
    typeof e == "string" && !e.startsWith("0x") && (e = "0x" + e);
    let n = typeof e == "string" ? new Et(e) : e;
    super(n, t);
  }
  connect(e) {
    return new Un(this.signingKey, e);
  }
  /**
   *  Resolves to a [JSON Keystore Wallet](json-wallets) encrypted with
   *  %%password%%.
   *
   *  If %%progressCallback%% is specified, it will receive periodic
   *  updates as the encryption process progreses.
   */
  async encrypt(e, t) {
    const n = { address: this.address, privateKey: this.privateKey };
    return await Cu(n, e, { progressCallback: t });
  }
  /**
   *  Returns a [JSON Keystore Wallet](json-wallets) encryped with
   *  %%password%%.
   *
   *  It is preferred to use the [async version](encrypt) instead,
   *  which allows a [[ProgressCallback]] to keep the user informed.
   *
   *  This method will block the event loop (freezing all UI) until
   *  it is complete, which may be a non-trivial duration.
   */
  encryptSync(e) {
    const t = { address: this.address, privateKey: this.privateKey };
    return Eu(t, e);
  }
  /**
   *  Creates (asynchronously) a **Wallet** by decrypting the %%json%%
   *  with %%password%%.
   *
   *  If %%progress%% is provided, it is called periodically during
   *  decryption so that any UI can be updated.
   */
  static async fromEncryptedJson(e, t, n) {
    var i;
    let s = null;
    return tf(e) ? s = await _p(e, t, n) : rf(e) && (n && (n(0), await af(0)), s = sf(e, t), n && (n(1), await af(0))), P(i = Un, Li, ro).call(i, s);
  }
  /**
   *  Creates a **Wallet** by decrypting the %%json%% with %%password%%.
   *
   *  The [[fromEncryptedJson]] method is preferred, as this method
   *  will lock up and freeze the UI during decryption, which may take
   *  some time.
   */
  static fromEncryptedJsonSync(e, t) {
    var s;
    let n = null;
    return tf(e) ? n = Vp(e, t) : rf(e) ? n = sf(e, t) : b(!1, "invalid JSON wallet", "json", "[ REDACTED ]"), P(s = Un, Li, ro).call(s, n);
  }
  /**
   *  Creates a new random [[HDNodeWallet]] using the avavilable
   *  [cryptographic random source](randomBytes).
   *
   *  If there is no crytographic random source, this will throw.
   */
  static createRandom(e) {
    const t = Xs.createRandom();
    return e ? t.connect(e) : t;
  }
  /**
   *  Creates a [[HDNodeWallet]] for %%phrase%%.
   */
  static fromPhrase(e, t) {
    const n = Xs.fromPhrase(e);
    return t ? n.connect(t) : n;
  }
};
Li = new WeakSet(), ro = function(e) {
  if (b(e, "invalid JSON wallet", "json", "[ REDACTED ]"), "mnemonic" in e && e.mnemonic && e.mnemonic.locale === "en") {
    const n = Ns.fromEntropy(e.mnemonic.entropy), s = Xs.fromMnemonic(n, e.mnemonic.path);
    if (s.address === e.address && s.privateKey === e.privateKey)
      return s;
    console.log("WARNING: JSON mismatch address/privateKey != mnemonic; fallback onto private key");
  }
  const t = new Un(e.privateKey);
  return b(t.address === e.address, "address/privateKey mismatch", "json", "[ REDACTED ]"), t;
}, y(Un, Li);
let Da = Un;
function jp(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Iu = {}, Oo = {};
Object.defineProperty(Oo, "__esModule", { value: !0 });
Oo.autoSelectMode = function() {
  return typeof window == "object" && window.localStorage ? "browser" : "node";
};
var Ec = { exports: {} }, cf;
function Wp() {
  return cf || (cf = 1, function(r, e) {
    (function(t) {
      var n = {}, s = {};
      n.length = 0, n.getItem = function(i) {
        return i in s ? s[i] : null;
      }, n.setItem = function(i, a) {
        typeof a > "u" ? n.removeItem(i) : (s.hasOwnProperty(i) || n.length++, s[i] = "" + a);
      }, n.removeItem = function(i) {
        s.hasOwnProperty(i) && (delete s[i], n.length--);
      }, n.key = function(i) {
        return Object.keys(s)[i] || null;
      }, n.clear = function() {
        s = {}, n.length = 0;
      }, r.exports = n;
    })();
  }(Ec)), Ec.exports;
}
Object.defineProperty(Iu, "__esModule", { value: !0 });
var Yp = Oo;
function Zp(r) {
  r === void 0 && (r = {});
  var e = r.mode || "auto", t = e === "auto" ? Yp.autoSelectMode() : e;
  if (t === "browser")
    return window.localStorage;
  if (t === "node")
    throw new Error('Can not select "node" mode in browser');
  if (t === "memory")
    return Wp();
  throw new Error("Unknown mode:" + t);
}
var vu = Iu.createLocalStorage = Zp, ku = { exports: {} };
(function(r) {
  var e = Object.prototype.hasOwnProperty, t = "~";
  function n() {
  }
  Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (t = !1));
  function s(o, f, u) {
    this.fn = o, this.context = f, this.once = u || !1;
  }
  function i(o, f, u, d, h) {
    if (typeof u != "function")
      throw new TypeError("The listener must be a function");
    var p = new s(u, d || o, h), m = t ? t + f : f;
    return o._events[m] ? o._events[m].fn ? o._events[m] = [o._events[m], p] : o._events[m].push(p) : (o._events[m] = p, o._eventsCount++), o;
  }
  function a(o, f) {
    --o._eventsCount === 0 ? o._events = new n() : delete o._events[f];
  }
  function c() {
    this._events = new n(), this._eventsCount = 0;
  }
  c.prototype.eventNames = function() {
    var f = [], u, d;
    if (this._eventsCount === 0)
      return f;
    for (d in u = this._events)
      e.call(u, d) && f.push(t ? d.slice(1) : d);
    return Object.getOwnPropertySymbols ? f.concat(Object.getOwnPropertySymbols(u)) : f;
  }, c.prototype.listeners = function(f) {
    var u = t ? t + f : f, d = this._events[u];
    if (!d)
      return [];
    if (d.fn)
      return [d.fn];
    for (var h = 0, p = d.length, m = new Array(p); h < p; h++)
      m[h] = d[h].fn;
    return m;
  }, c.prototype.listenerCount = function(f) {
    var u = t ? t + f : f, d = this._events[u];
    return d ? d.fn ? 1 : d.length : 0;
  }, c.prototype.emit = function(f, u, d, h, p, m) {
    var w = t ? t + f : f;
    if (!this._events[w])
      return !1;
    var E = this._events[w], C = arguments.length, B, I;
    if (E.fn) {
      switch (E.once && this.removeListener(f, E.fn, void 0, !0), C) {
        case 1:
          return E.fn.call(E.context), !0;
        case 2:
          return E.fn.call(E.context, u), !0;
        case 3:
          return E.fn.call(E.context, u, d), !0;
        case 4:
          return E.fn.call(E.context, u, d, h), !0;
        case 5:
          return E.fn.call(E.context, u, d, h, p), !0;
        case 6:
          return E.fn.call(E.context, u, d, h, p, m), !0;
      }
      for (I = 1, B = new Array(C - 1); I < C; I++)
        B[I - 1] = arguments[I];
      E.fn.apply(E.context, B);
    } else {
      var K = E.length, R;
      for (I = 0; I < K; I++)
        switch (E[I].once && this.removeListener(f, E[I].fn, void 0, !0), C) {
          case 1:
            E[I].fn.call(E[I].context);
            break;
          case 2:
            E[I].fn.call(E[I].context, u);
            break;
          case 3:
            E[I].fn.call(E[I].context, u, d);
            break;
          case 4:
            E[I].fn.call(E[I].context, u, d, h);
            break;
          default:
            if (!B)
              for (R = 1, B = new Array(C - 1); R < C; R++)
                B[R - 1] = arguments[R];
            E[I].fn.apply(E[I].context, B);
        }
    }
    return !0;
  }, c.prototype.on = function(f, u, d) {
    return i(this, f, u, d, !1);
  }, c.prototype.once = function(f, u, d) {
    return i(this, f, u, d, !0);
  }, c.prototype.removeListener = function(f, u, d, h) {
    var p = t ? t + f : f;
    if (!this._events[p])
      return this;
    if (!u)
      return a(this, p), this;
    var m = this._events[p];
    if (m.fn)
      m.fn === u && (!h || m.once) && (!d || m.context === d) && a(this, p);
    else {
      for (var w = 0, E = [], C = m.length; w < C; w++)
        (m[w].fn !== u || h && !m[w].once || d && m[w].context !== d) && E.push(m[w]);
      E.length ? this._events[p] = E.length === 1 ? E[0] : E : a(this, p);
    }
    return this;
  }, c.prototype.removeAllListeners = function(f) {
    var u;
    return f ? (u = t ? t + f : f, this._events[u] && a(this, u)) : (this._events = new n(), this._eventsCount = 0), this;
  }, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = t, c.EventEmitter = c, r.exports = c;
})(ku);
var Xp = ku.exports;
const $p = /* @__PURE__ */ jp(Xp), Cc = {
  // oasys
  "0xf8": "https://rpc.mainnet.oasys.games",
  // sandverse
  "0x4ee5": "https://rpc.sandverse.oasys.games/",
  // homeverse
  "0x4a43": "https://rpc.mainnet.oasys.homeverse.games"
};
class qp extends $p {
  constructor(t, n = "0x4a43") {
    super();
    g(this, "localStorage");
    g(this, "prefix", "itw:::");
    g(this, "network_localstorage_key", `${this.prefix}_chainhex_key`);
    g(this, "isMetaMask");
    g(this, "isStatus");
    g(this, "host");
    g(this, "path");
    g(this, "jsonRpcProvider");
    g(this, "wallet");
    g(this, "chainId");
    g(this, "sendAsync");
    g(this, "send");
    this.localStorage = vu(), this.isMetaMask = !1, this.isStatus = !1, this.host = "", this.path = "";
    const s = this.localStorage.getItem(this.network_localstorage_key);
    s ? this.jsonRpcProvider = new sa(Cc[s]) : this.jsonRpcProvider = new sa(Cc[n]), this.wallet = new Da(t, this.jsonRpcProvider), this._initialize();
  }
  async _initialize() {
    const t = await this.jsonRpcProvider.getNetwork();
    this.chainId = Number(t.chainId);
  }
  getAddress() {
    return this.wallet.address;
  }
  getProvider() {
    return this.jsonRpcProvider;
  }
  async request({ method: t, params: n }) {
    switch (t) {
      case "wallet_addEthereumChain":
        if (!n[0].rpcUrls)
          throw new Error("No rpcUrls in params");
        const s = n[0].rpcUrls[0];
        this.jsonRpcProvider = new sa(s);
        const i = await this.jsonRpcProvider.getNetwork();
        this.chainId = Number(i.chainId), this.emitChainChanged();
        return;
      case "wallet_switchEthereumChain":
        const a = Cc[n[0].chainId.toLowerCase()];
        if (!a)
          return;
        this.jsonRpcProvider = new sa(a);
        const c = await this.jsonRpcProvider.getNetwork();
        this.localStorage.setItem(this.network_localstorage_key, n[0].chainId.toLowerCase()), this.chainId = Number(c.chainId), this.emitChainChanged();
        return;
      case "eth_requestAccounts":
      case "eth_accounts":
        return [this.wallet.address];
      case "eth_sendTransaction":
        return (await this.wallet.sendTransaction(n[0])).hash;
      case "personal_sign":
        return await this.wallet.signMessage(me(n[0]));
      case "eth_call":
        return this.handleEthCall(n);
      default:
        return await this.jsonRpcProvider.send(t, n);
    }
  }
  async handleEthCall(t) {
    const n = t[0], s = t[1] || "latest";
    console.log(n);
    const i = {
      to: n.to,
      data: n.input ?? n.data ?? "",
      gasLimit: n.gas,
      gasPrice: n.gasPrice,
      value: n.value,
      nonce: n.nonce,
      chainId: n.chainId,
      blockTag: s
    };
    return console.log(i), await this.jsonRpcProvider.call(i);
  }
  // EIP-1193のイベントをサポートするためのヘルパーメソッド
  emitChainChanged() {
    this.emit("chainChanged", this.chainId);
  }
  emitAccountsChanged(t) {
    this.emit("accountsChanged", t);
  }
}
class n1 {
  constructor(e = "0x4a43") {
    g(this, "localStorage");
    g(this, "prefix", "itw:::");
    g(this, "private_key", `${this.prefix}_private_key`);
    g(this, "mnemonic_key", `${this.prefix}_mnemonic_key`);
    g(this, "wallet");
    this.localStorage = vu(), this.localStorage.getItem(this.private_key) || this.createKey(), this.wallet = new qp(this.getPrivateKey(), e);
  }
  createKey() {
    var t;
    const e = Da.createRandom();
    this.localStorage.setItem(this.mnemonic_key, (t = e.mnemonic) == null ? void 0 : t.phrase), this.localStorage.setItem(this.private_key, e.privateKey);
  }
  getPrivateKey() {
    return this.localStorage.getItem(this.private_key);
  }
  getMnemonic() {
    return this.localStorage.getItem(this.mnemonic_key);
  }
  getProvider() {
    return this.wallet.getProvider();
  }
  getEIP1193Provider() {
    return this.wallet;
  }
  wipe() {
    this.localStorage.removeItem(this.private_key), this.localStorage.removeItem(this.mnemonic_key);
  }
}
export {
  n1 as InstantWallet
};
