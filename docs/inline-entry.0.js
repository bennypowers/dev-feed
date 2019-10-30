const e = new WeakMap; const t = t=>'function' === typeof t && e.has(t); const n = void 0 !== window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback; const r = function(e, t) {
  const n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null; const r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null; for (;t !== n;) {
    const n = t.nextSibling; e.insertBefore(t, r), t = n;
  }
}; const i = function(e, t) {
  const n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null; for (;t !== n;) {
    const n = t.nextSibling; e.removeChild(t), t = n;
  }
}; const a = {}; const o = {}; const s = `{{lit-${String(Math.random()).slice(2)}}}`; const u = `\x3c!--${s}--\x3e`; const l = new RegExp(`${s}|${u}`); const c = '$lit$'; class d {
  constructor(e, t) {
    this.parts = [], this.element = t; const n = []; const r = []; const i = document.createTreeWalker(t.content, 133, null, !1); let a = 0; let o = -1; let u = 0; const { strings: d, values: { length: p } } = e; for (;u < p;) {
      const e = i.nextNode(); if (null !== e) {
        if (o++, 1 === e.nodeType) {
          if (e.hasAttributes()) {
            const t = e.attributes; const { length: n } = t; let r = 0; for (let e = 0; e < n; e++)h(t[e].name, c) && r++; for (;r-- > 0;) {
              const t = d[u]; const n = m.exec(t)[2]; const r = n.toLowerCase() + c; const i = e.getAttribute(r); e.removeAttribute(r); const a = i.split(l); this.parts.push({ type: 'attribute', index: o, name: n, strings: a }), u += a.length - 1;
            }
          }'TEMPLATE' === e.tagName && (r.push(e), i.currentNode = e.content);
        } else if (3 === e.nodeType) {
          const t = e.data; if (t.indexOf(s) >= 0) {
            const r = e.parentNode; const i = t.split(l); const a = i.length - 1; for (let t = 0; t < a; t++) {
              let n; let a = i[t]; if ('' === a)n = f(); else {
                const e = m.exec(a); null !== e && h(e[2], c) && (a = a.slice(0, e.index) + e[1] + e[2].slice(0, -c.length) + e[3]), n = document.createTextNode(a);
              }r.insertBefore(n, e), this.parts.push({ type: 'node', index: ++o });
            }'' === i[a] ? (r.insertBefore(f(), e), n.push(e)) : e.data = i[a], u += a;
          }
        } else if (8 === e.nodeType) {
          if (e.data === s) {
            const t = e.parentNode; null !== e.previousSibling && o !== a || (o++, t.insertBefore(f(), e)), a = o, this.parts.push({ type: 'node', index: o }), null === e.nextSibling ? e.data = '' : (n.push(e), o--), u++;
          } else {
            let t = -1; for (;-1 !== (t = e.data.indexOf(s, t + 1));) this.parts.push({ type: 'node', index: -1 }), u++;
          }
        }
      } else i.currentNode = r.pop();
    } for (const e of n)e.parentNode.removeChild(e);
  }
} const h = (e, t)=>{
  const n = e.length - t.length; return n >= 0 && e.slice(n) === t;
}; const p = e=>-1 !== e.index; const f = ()=>document.createComment(''); const m = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/; class g {
  constructor(e, t, n) {
    this.__parts = [], this.template = e, this.processor = t, this.options = n;
  }

  update(e) {
    let t = 0; for (const n of this.__parts) void 0 !== n && n.setValue(e[t]), t++; for (const e of this.__parts) void 0 !== e && e.commit();
  }

  _clone() {
    const e = n ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0); const t = []; const r = this.template.parts; const i = document.createTreeWalker(e, 133, null, !1); let a; let o = 0; let s = 0; let u = i.nextNode(); for (;o < r.length;) {
      if (a = r[o], p(a)) {
        for (;s < a.index;)s++, 'TEMPLATE' === u.nodeName && (t.push(u), i.currentNode = u.content), null === (u = i.nextNode()) && (i.currentNode = t.pop(), u = i.nextNode()); if ('node' === a.type) {
          const e = this.processor.handleTextExpression(this.options); e.insertAfterNode(u.previousSibling), this.__parts.push(e);
        } else this.__parts.push(...this.processor.handleAttributeExpressions(u, a.name, a.strings, this.options)); o++;
      } else this.__parts.push(void 0), o++;
    } return n && (document.adoptNode(e), customElements.upgrade(e)), e;
  }
} const w = ` ${s} `; class v {
  constructor(e, t, n, r) {
    this.strings = e, this.values = t, this.type = n, this.processor = r;
  }

  getHTML() {
    const e = this.strings.length - 1; let t = ''; let n = !1; for (let r = 0; r < e; r++) {
      const e = this.strings[r]; const i = e.lastIndexOf('\x3c!--'); n = (i > -1 || n) && -1 === e.indexOf('--\x3e', i + 1); const a = m.exec(e); t += null === a ? e + (n ? w : u) : e.substr(0, a.index) + a[1] + a[2] + c + a[3] + s;
    } return t += this.strings[e];
  }

  getTemplateElement() {
    const e = document.createElement('template'); return e.innerHTML = this.getHTML(), e;
  }
} class y extends v {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const e = super.getTemplateElement(); const t = e.content; const n = t.firstChild; return t.removeChild(n), r(t, n.firstChild), e;
  }
} const b = e=>null === e || !('object' === typeof e || 'function' === typeof e); const _ = e=>Array.isArray(e) || !(!e || !e[Symbol.iterator]); class x {
  constructor(e, t, n) {
    this.dirty = !0, this.element = e, this.name = t, this.strings = n, this.parts = []; for (let e = 0; e < n.length - 1; e++) this.parts[e] = this._createPart();
  }

  _createPart() {
    return new S(this);
  }

  _getValue() {
    const e = this.strings; const t = e.length - 1; let n = ''; for (let r = 0; r < t; r++) {
      n += e[r]; const t = this.parts[r]; if (void 0 !== t) {
        const e = t.value; if (b(e) || !_(e))n += 'string' === typeof e ? e : String(e); else for (const t of e)n += 'string' === typeof t ? t : String(t);
      }
    } return n += e[t];
  }

  commit() {
    this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue()));
  }
} class S {
  constructor(e) {
    this.value = void 0, this.committer = e;
  }

  setValue(e) {
    e === a || b(e) && e === this.value || (this.value = e, t(e) || (this.committer.dirty = !0));
  }

  commit() {
    for (;t(this.value);) {
      const e = this.value; this.value = a, e(this);
    } this.value !== a && this.committer.commit();
  }
} class T {
  constructor(e) {
    this.value = void 0, this.__pendingValue = void 0, this.options = e;
  }

  appendInto(e) {
    this.startNode = e.appendChild(f()), this.endNode = e.appendChild(f());
  }

  insertAfterNode(e) {
    this.startNode = e, this.endNode = e.nextSibling;
  }

  appendIntoPart(e) {
    e.__insert(this.startNode = f()), e.__insert(this.endNode = f());
  }

  insertAfterPart(e) {
    e.__insert(this.startNode = f()), this.endNode = e.endNode, e.endNode = this.startNode;
  }

  setValue(e) {
    this.__pendingValue = e;
  }

  commit() {
    for (;t(this.__pendingValue);) {
      const e = this.__pendingValue; this.__pendingValue = a, e(this);
    } const e = this.__pendingValue; e !== a && (b(e) ? e !== this.value && this.__commitText(e) : e instanceof v ? this.__commitTemplateResult(e) : e instanceof Node ? this.__commitNode(e) : _(e) ? this.__commitIterable(e) : e === o ? (this.value = o, this.clear()) : this.__commitText(e));
  }

  __insert(e) {
    this.endNode.parentNode.insertBefore(e, this.endNode);
  }

  __commitNode(e) {
    this.value !== e && (this.clear(), this.__insert(e), this.value = e);
  }

  __commitText(e) {
    const t = this.startNode.nextSibling; const n = 'string' === typeof (e = null == e ? '' : e) ? e : String(e); t === this.endNode.previousSibling && 3 === t.nodeType ? t.data = n : this.__commitNode(document.createTextNode(n)), this.value = e;
  }

  __commitTemplateResult(e) {
    const t = this.options.templateFactory(e); if (this.value instanceof g && this.value.template === t) this.value.update(e.values); else {
      const n = new g(t, e.processor, this.options); const r = n._clone(); n.update(e.values), this.__commitNode(r), this.value = n;
    }
  }

  __commitIterable(e) {
    Array.isArray(this.value) || (this.value = [], this.clear()); const t = this.value; let n; let r = 0; for (const i of e) void 0 === (n = t[r]) && (n = new T(this.options), t.push(n), 0 === r ? n.appendIntoPart(this) : n.insertAfterPart(t[r - 1])), n.setValue(i), n.commit(), r++; r < t.length && (t.length = r, this.clear(n && n.endNode));
  }

  clear() {
    const e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.startNode; i(this.startNode.parentNode, e.nextSibling, this.endNode);
  }
} class C {
  constructor(e, t, n) {
    if (this.value = void 0, this.__pendingValue = void 0, 2 !== n.length || '' !== n[0] || '' !== n[1]) throw new Error('Boolean attributes can only contain a single expression'); this.element = e, this.name = t, this.strings = n;
  }

  setValue(e) {
    this.__pendingValue = e;
  }

  commit() {
    for (;t(this.__pendingValue);) {
      const e = this.__pendingValue; this.__pendingValue = a, e(this);
    } if (this.__pendingValue === a) return; const e = !!this.__pendingValue; this.value !== e && (e ? this.element.setAttribute(this.name, '') : this.element.removeAttribute(this.name), this.value = e), this.__pendingValue = a;
  }
} class P extends x {
  constructor(e, t, n) {
    super(e, t, n), this.single = 2 === n.length && '' === n[0] && '' === n[1];
  }

  _createPart() {
    return new M(this);
  }

  _getValue() {
    return this.single ? this.parts[0].value : super._getValue();
  }

  commit() {
    this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue());
  }
} class M extends S {} let D = !1; try {
  const e = { get capture() {
    return D = !0, !1;
  } }; window.addEventListener('test', e, e), window.removeEventListener('test', e, e);
} catch (e) {} class N {
  constructor(e, t, n) {
    this.value = void 0, this.__pendingValue = void 0, this.element = e, this.eventName = t, this.eventContext = n, this.__boundHandleEvent = (e=>this.handleEvent(e));
  }

  setValue(e) {
    this.__pendingValue = e;
  }

  commit() {
    for (;t(this.__pendingValue);) {
      const e = this.__pendingValue; this.__pendingValue = a, e(this);
    } if (this.__pendingValue === a) return; const e = this.__pendingValue; const n = this.value; const r = null == e || null != n && (e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive); const i = null != e && (null == n || r); r && this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options), i && (this.__options = A(e), this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)), this.value = e, this.__pendingValue = a;
  }

  handleEvent(e) {
'function' === typeof this.value ? this.value.call(this.eventContext || this.element, e) : this.value.handleEvent(e);
  }
} const A = e=>e && (D ? { capture: e.capture, passive: e.passive, once: e.once } : e.capture); const E = new class {
  handleAttributeExpressions(e, t, n, r) {
    const i = t[0]; return '.' === i ? new P(e, t.slice(1), n).parts : '@' === i ? [new N(e, t.slice(1), r.eventContext)] : '?' === i ? [new C(e, t.slice(1), n)] : new x(e, t, n).parts;
  }

  handleTextExpression(e) {
    return new T(e);
  }
}; function k(e) {
  let t = U.get(e.type); void 0 === t && (t = { stringsArray: new WeakMap, keyString: new Map }, U.set(e.type, t)); let n = t.stringsArray.get(e.strings); if (void 0 !== n) return n; const r = e.strings.join(s); return void 0 === (n = t.keyString.get(r)) && (n = new d(e, e.getTemplateElement()), t.keyString.set(r, n)), t.stringsArray.set(e.strings, n), n;
} const U = new Map; const O = new WeakMap; const B = (e, t, n)=>{
  let r = O.get(t); void 0 === r && (i(t, t.firstChild), O.set(t, r = new T({ templateFactory: k, ...n })), r.appendInto(t)), r.setValue(e), r.commit();
}; (window.litHtmlVersions || (window.litHtmlVersions = [])).push('1.1.2'); const q = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)n[r - 1] = arguments[r]; return new v(e, n, 'html', E);
}; function W(e) {
  return 'function' === typeof e;
} function $(e, t) {
  return W(e) ? e.length > 1 ? e.bind(null, t) : e.call(null, t) : e;
} function z(e) {
  return function() {
    for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)n[r] = arguments[r]; const i = n.length ? n : [void 0]; if (i.length < e.length) return z(Function.bind.apply(e, [null].concat(i))); const a = i.length === e.length ? e.apply(null, i) : i.reduce($, e); return W(a) ? z(a) : a;
  };
} const F = 133; function Y(e, t) {
  const { element: { content: n }, parts: r } = e; const i = document.createTreeWalker(n, F, null, !1); let a = V(r); let o = r[a]; let s = -1; let u = 0; const l = []; let c = null; for (;i.nextNode();) {
    s++; const e = i.currentNode; for (e.previousSibling === c && (c = null), t.has(e) && (l.push(e), null === c && (c = e)), null !== c && u++; void 0 !== o && o.index === s;)o.index = null !== c ? -1 : o.index - u, o = r[a = V(r, a)];
  }l.forEach(e=>e.parentNode.removeChild(e));
} const j = e=>{
  let t = 11 === e.nodeType ? 0 : 1; const n = document.createTreeWalker(e, F, null, !1); for (;n.nextNode();)t++; return t;
}; const V = function(e) {
  for (let t = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1) + 1; t < e.length; t++) {
    const n = e[t]; if (p(n)) return t;
  } return -1;
}; const R = (e, t)=>`${e}--${t}`; let H = !0; void 0 === window.ShadyCSS ? H = !1 : void 0 === window.ShadyCSS.prepareTemplateDom && (console.warn('Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1.'), H = !1); const L = e=>t=>{
  const n = R(t.type, e); let r = U.get(n); void 0 === r && (r = { stringsArray: new WeakMap, keyString: new Map }, U.set(n, r)); let i = r.stringsArray.get(t.strings); if (void 0 !== i) return i; const a = t.strings.join(s); if (void 0 === (i = r.keyString.get(a))) {
    const n = t.getTemplateElement(); H && window.ShadyCSS.prepareTemplateDom(n, e), i = new d(t, n), r.keyString.set(a, i);
  } return r.stringsArray.set(t.strings, i), i;
}; const X = ['html', 'svg']; const I = new Set; const Q = (e, t, n)=>{
  I.add(e); const r = n ? n.element : document.createElement('template'); const i = t.querySelectorAll('style'); const { length: a } = i; if (0 === a) return void window.ShadyCSS.prepareTemplateStyles(r, e); const o = document.createElement('style'); for (let e = 0; e < a; e++) {
    const t = i[e]; t.parentNode.removeChild(t), o.textContent += t.textContent;
  }(e=>{
    X.forEach(t=>{
      const n = U.get(R(t, e)); void 0 !== n && n.keyString.forEach(e=>{
        const { element: { content: t } } = e; const n = new Set; Array.from(t.querySelectorAll('style')).forEach(e=>{
          n.add(e);
        }), Y(e, n);
      });
    });
  })(e); const s = r.content; n ? function(e, t) {
    const n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null; const { element: { content: r }, parts: i } = e; if (null == n) return void r.appendChild(t); const a = document.createTreeWalker(r, F, null, !1); let o = V(i); let s = 0; let u = -1; for (;a.nextNode();) {
      for (u++, a.currentNode === n && (s = j(t), n.parentNode.insertBefore(t, n)); -1 !== o && i[o].index === u;) {
        if (s > 0) {
          for (;-1 !== o;)i[o].index += s, o = V(i, o); return;
        }o = V(i, o);
      }
    }
  }(n, o, s.firstChild) : s.insertBefore(o, s.firstChild), window.ShadyCSS.prepareTemplateStyles(r, e); const u = s.querySelector('style'); if (window.ShadyCSS.nativeShadow && null !== u)t.insertBefore(u.cloneNode(!0), t.firstChild); else if (n) {
    s.insertBefore(o, s.firstChild); const e = new Set; e.add(o), Y(n, e);
  }
}; window.JSCompiler_renameProperty = ((e, t)=>e); const G = { toAttribute(e, t) {
  switch (t) {
    case Boolean: return e ? '' : null; case Object: case Array: return null == e ? e : JSON.stringify(e);
  } return e;
}, fromAttribute(e, t) {
  switch (t) {
    case Boolean: return null !== e; case Number: return null === e ? null : Number(e); case Object: case Array: return JSON.parse(e);
  } return e;
} }; const J = (e, t)=>t !== e && (t == t || e == e); const Z = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: J }; const K = Promise.resolve(!0); const ee = 1; const te = 4; const ne = 8; const re = 16; const ie = 32; const ae = 'finalized'; class oe extends HTMLElement {
  constructor() {
    super(), this._updateState = 0, this._instanceProperties = void 0, this._updatePromise = K, this._hasConnectedResolver = void 0, this._changedProperties = new Map, this._reflectingProperties = void 0, this.initialize();
  }

  static get observedAttributes() {
    this.finalize(); const e = []; return this._classProperties.forEach((t, n)=>{
      const r = this._attributeNameForProperty(n, t); void 0 !== r && (this._attributeToPropertyMap.set(r, n), e.push(r));
    }), e;
  }

  static _ensureClassProperties() {
    if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
      this._classProperties = new Map; const e = Object.getPrototypeOf(this)._classProperties; void 0 !== e && e.forEach((e, t)=>this._classProperties.set(t, e));
    }
  }

  static createProperty(e) {
    const t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Z; if (this._ensureClassProperties(), this._classProperties.set(e, t), t.noAccessor || this.prototype.hasOwnProperty(e)) return; const n = 'symbol' === typeof e ? Symbol() : `__${e}`; Object.defineProperty(this.prototype, e, { get() {
      return this[n];
    }, set(t) {
      const r = this[e]; this[n] = t, this._requestUpdate(e, r);
    }, configurable: !0, enumerable: !0 });
  }

  static finalize() {
    const e = Object.getPrototypeOf(this); if (e.hasOwnProperty(ae) || e.finalize(), this[ae] = !0, this._ensureClassProperties(), this._attributeToPropertyMap = new Map, this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
      const e = this.properties; const t = [...Object.getOwnPropertyNames(e), ...'function' === typeof Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e) : []]; for (const n of t) this.createProperty(n, e[n]);
    }
  }

  static _attributeNameForProperty(e, t) {
    const n = t.attribute; return !1 === n ? void 0 : 'string' === typeof n ? n : 'string' === typeof e ? e.toLowerCase() : void 0;
  }

  static _valueHasChanged(e, t) {
    return (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : J)(e, t);
  }

  static _propertyValueFromAttribute(e, t) {
    const n = t.type; const r = t.converter || G; const i = 'function' === typeof r ? r : r.fromAttribute; return i ? i(e, n) : e;
  }

  static _propertyValueToAttribute(e, t) {
    if (void 0 === t.reflect) return; const n = t.type; const r = t.converter; return (r && r.toAttribute || G.toAttribute)(e, n);
  }

  initialize() {
    this._saveInstanceProperties(), this._requestUpdate();
  }

  _saveInstanceProperties() {
    this.constructor._classProperties.forEach((e, t)=>{
      if (this.hasOwnProperty(t)) {
        const e = this[t]; delete this[t], this._instanceProperties || (this._instanceProperties = new Map), this._instanceProperties.set(t, e);
      }
    });
  }

  _applyInstanceProperties() {
    this._instanceProperties.forEach((e, t)=>this[t] = e), this._instanceProperties = void 0;
  }

  connectedCallback() {
    this._updateState = this._updateState | ie, this._hasConnectedResolver && (this._hasConnectedResolver(), this._hasConnectedResolver = void 0);
  }

  disconnectedCallback() {}

  attributeChangedCallback(e, t, n) {
    t !== n && this._attributeToProperty(e, n);
  }

  _propertyToAttribute(e, t) {
    const n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Z; const r = this.constructor; const i = r._attributeNameForProperty(e, n); if (void 0 !== i) {
      const e = r._propertyValueToAttribute(t, n); if (void 0 === e) return; this._updateState = this._updateState | ne, null == e ? this.removeAttribute(i) : this.setAttribute(i, e), this._updateState = this._updateState & ~ne;
    }
  }

  _attributeToProperty(e, t) {
    if (this._updateState & ne) return; const n = this.constructor; const r = n._attributeToPropertyMap.get(e); if (void 0 !== r) {
      const e = n._classProperties.get(r) || Z; this._updateState = this._updateState | re, this[r] = n._propertyValueFromAttribute(t, e), this._updateState = this._updateState & ~re;
    }
  }

  _requestUpdate(e, t) {
    let n = !0; if (void 0 !== e) {
      const r = this.constructor; const i = r._classProperties.get(e) || Z; r._valueHasChanged(this[e], t, i.hasChanged) ? (this._changedProperties.has(e) || this._changedProperties.set(e, t), !0 !== i.reflect || this._updateState & re || (void 0 === this._reflectingProperties && (this._reflectingProperties = new Map), this._reflectingProperties.set(e, i))) : n = !1;
    }!this._hasRequestedUpdate && n && this._enqueueUpdate();
  }

  requestUpdate(e, t) {
    return this._requestUpdate(e, t), this.updateComplete;
  }

  async _enqueueUpdate() {
    let e; let t; this._updateState = this._updateState | te; const n = this._updatePromise; this._updatePromise = new Promise((n, r)=>{
      e = n, t = r;
    }); try {
      await n;
    } catch (e) {} this._hasConnected || await new Promise(e=>this._hasConnectedResolver = e); try {
      const e = this.performUpdate(); null != e && await e;
    } catch (e) {
      t(e);
    }e(!this._hasRequestedUpdate);
  }

  get _hasConnected() {
    return this._updateState & ie;
  }

  get _hasRequestedUpdate() {
    return this._updateState & te;
  }

  get hasUpdated() {
    return this._updateState & ee;
  }

  performUpdate() {
    this._instanceProperties && this._applyInstanceProperties(); let e = !1; const t = this._changedProperties; try {
      (e = this.shouldUpdate(t)) && this.update(t);
    } catch (t) {
      throw e = !1, t;
    } finally {
      this._markUpdated();
    }e && (this._updateState & ee || (this._updateState = this._updateState | ee, this.firstUpdated(t)), this.updated(t));
  }

  _markUpdated() {
    this._changedProperties = new Map, this._updateState = this._updateState & ~te;
  }

  get updateComplete() {
    return this._getUpdateComplete();
  }

  _getUpdateComplete() {
    return this._updatePromise;
  }

  shouldUpdate(e) {
    return !0;
  }

  update(e) {
    void 0 !== this._reflectingProperties && this._reflectingProperties.size > 0 && (this._reflectingProperties.forEach((e, t)=>this._propertyToAttribute(t, this[t], e)), this._reflectingProperties = void 0);
  }

  updated(e) {}

  firstUpdated(e) {}
}oe[ae] = !0; const se = 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype; const ue = Symbol(); class le {
  constructor(e, t) {
    if (t !== ue) throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.'); this.cssText = e;
  }

  get styleSheet() {
    return void 0 === this._styleSheet && (se ? (this._styleSheet = new CSSStyleSheet, this._styleSheet.replaceSync(this.cssText)) : this._styleSheet = null), this._styleSheet;
  }

  toString() {
    return this.cssText;
  }
} const ce = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)n[r - 1] = arguments[r]; const i = n.reduce((t, n, r)=>t + (e=>{
    if (e instanceof le) return e.cssText; if ('number' === typeof e) return e; throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`);
  })(n) + e[r + 1], e[0]); return new le(i, ue);
}; (window.litElementVersions || (window.litElementVersions = [])).push('2.2.1'); const de = e=>e.flat ? e.flat(1 / 0) : function e(t) {
  const n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : []; for (let r = 0, i = t.length; r < i; r++) {
    const i = t[r]; Array.isArray(i) ? e(i, n) : n.push(i);
  } return n;
}(e); class he extends oe {
  static finalize() {
    super.finalize.call(this), this._styles = this.hasOwnProperty(JSCompiler_renameProperty('styles', this)) ? this._getUniqueStyles() : this._styles || [];
  }

  static _getUniqueStyles() {
    const e = this.styles; const t = []; if (Array.isArray(e)) {
      de(e).reduceRight((e, t)=>(e.add(t), e), new Set).forEach(e=>t.unshift(e));
    } else e && t.push(e); return t;
  }

  initialize() {
    super.initialize(), this.renderRoot = this.createRenderRoot(), window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot && this.adoptStyles();
  }

  createRenderRoot() {
    return this.attachShadow({ mode: 'open' });
  }

  adoptStyles() {
    const e = this.constructor._styles; 0 !== e.length && (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow ? se ? this.renderRoot.adoptedStyleSheets = e.map(e=>e.styleSheet) : this._needsShimAdoptedStyleSheets = !0 : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText), this.localName));
  }

  connectedCallback() {
    super.connectedCallback(), this.hasUpdated && void 0 !== window.ShadyCSS && window.ShadyCSS.styleElement(this);
  }

  update(e) {
    super.update(e); const t = this.render(); t instanceof v && this.constructor.render(t, this.renderRoot, { scopeName: this.localName, eventContext: this }), this._needsShimAdoptedStyleSheets && (this._needsShimAdoptedStyleSheets = !1, this.constructor._styles.forEach(e=>{
      const t = document.createElement('style'); t.textContent = e.cssText, this.renderRoot.appendChild(t);
    }));
  }

  render() {}
} function pe(e) {
  return 'function' === typeof e;
} function fe(e, t) {
  return pe(e) ? e.length > 1 ? e.bind(null, t) : e.call(null, t) : e;
} function me(e) {
  if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const t = Object.prototype.toString.call(e); return e instanceof Date || 'object' === typeof e && '[object Date]' === t ? new Date(e.getTime()) : 'number' === typeof e || '[object Number]' === t ? new Date(e) : ('string' !== typeof e && '[object String]' !== t || 'undefined' === typeof console || (console.warn('Starting with v2.0.0-beta.1 date-fns doesn\'t accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule'), console.warn((new Error).stack)), new Date(NaN));
}he.finalized = !0, he.render = ((e, t, n)=>{
  if (!n || 'object' !== typeof n || !n.scopeName) throw new Error('The `scopeName` option is required.'); const r = n.scopeName; const a = O.has(t); const o = H && 11 === t.nodeType && !!t.host; const s = o && !I.has(r); const u = s ? document.createDocumentFragment() : t; if (B(e, u, { templateFactory: L(r), ...n }), s) {
    const e = O.get(u); O.delete(u); const n = e.value instanceof g ? e.value.template : void 0; Q(r, u, n), i(t, t.firstChild), t.appendChild(u), O.set(t, e);
  }!a && o && window.ShadyCSS.styleElement(t.host);
}); const ge = { lessThanXSeconds: { one: 'less than a second', other: 'less than {{count}} seconds' }, xSeconds: { one: '1 second', other: '{{count}} seconds' }, halfAMinute: 'half a minute', lessThanXMinutes: { one: 'less than a minute', other: 'less than {{count}} minutes' }, xMinutes: { one: '1 minute', other: '{{count}} minutes' }, aboutXHours: { one: 'about 1 hour', other: 'about {{count}} hours' }, xHours: { one: '1 hour', other: '{{count}} hours' }, xDays: { one: '1 day', other: '{{count}} days' }, aboutXMonths: { one: 'about 1 month', other: 'about {{count}} months' }, xMonths: { one: '1 month', other: '{{count}} months' }, aboutXYears: { one: 'about 1 year', other: 'about {{count}} years' }, xYears: { one: '1 year', other: '{{count}} years' }, overXYears: { one: 'over 1 year', other: 'over {{count}} years' }, almostXYears: { one: 'almost 1 year', other: 'almost {{count}} years' } }; function we(e) {
  return function(t) {
    const n = t || {}; const r = n.width ? String(n.width) : e.defaultWidth; return e.formats[r] || e.formats[e.defaultWidth];
  };
} const ve = { date: we({ formats: { full: 'EEEE, MMMM do, y', long: 'MMMM do, y', medium: 'MMM d, y', short: 'MM/dd/yyyy' }, defaultWidth: 'full' }), time: we({ formats: { full: 'h:mm:ss a zzzz', long: 'h:mm:ss a z', medium: 'h:mm:ss a', short: 'h:mm a' }, defaultWidth: 'full' }), dateTime: we({ formats: { full: '{{date}} \'at\' {{time}}', long: '{{date}} \'at\' {{time}}', medium: '{{date}}, {{time}}', short: '{{date}}, {{time}}' }, defaultWidth: 'full' }) }; const ye = { lastWeek: '\'last\' eeee \'at\' p', yesterday: '\'yesterday at\' p', today: '\'today at\' p', tomorrow: '\'tomorrow at\' p', nextWeek: 'eeee \'at\' p', other: 'P' }; function be(e) {
  return function(t, n) {
    let r; const i = n || {}; if ('formatting' === (i.context ? String(i.context) : 'standalone') && e.formattingValues) {
      const a = e.defaultFormattingWidth || e.defaultWidth; const o = i.width ? String(i.width) : a; r = e.formattingValues[o] || e.formattingValues[a];
    } else {
      const s = e.defaultWidth; const u = i.width ? String(i.width) : e.defaultWidth; r = e.values[u] || e.values[s];
    } return r[e.argumentCallback ? e.argumentCallback(t) : t];
  };
} function _e(e) {
  return function(t, n) {
    const r = String(t); const i = n || {}; const a = i.width; const o = a && e.matchPatterns[a] || e.matchPatterns[e.defaultMatchWidth]; const s = r.match(o); if (!s) return null; let u; const l = s[0]; const c = a && e.parsePatterns[a] || e.parsePatterns[e.defaultParseWidth]; return u = '[object Array]' === Object.prototype.toString.call(c) ? function(e, t) {
      for (let n = 0; n < e.length; n++) if (t(e[n])) return n;
    }(c, function(e) {
      return e.test(r);
    }) : function(e, t) {
      for (const n in e) if (e.hasOwnProperty(n) && t(e[n])) return n;
    }(c, function(e) {
      return e.test(r);
    }), u = e.valueCallback ? e.valueCallback(u) : u, { value: u = i.valueCallback ? i.valueCallback(u) : u, rest: r.slice(l.length) };
  };
} let xe; const Se = { code: 'en-US', formatDistance: function(e, t, n) {
  let r; return n = n || {}, r = 'string' === typeof ge[e] ? ge[e] : 1 === t ? ge[e].one : ge[e].other.replace('{{count}}', t), n.addSuffix ? n.comparison > 0 ? `in ${r}` : `${r} ago` : r;
}, formatLong: ve, formatRelative: function(e, t, n, r) {
  return ye[e];
}, localize: { ordinalNumber: function(e, t) {
  const n = Number(e); const r = n % 100; if (r > 20 || r < 10) {
    switch (r % 10) {
      case 1: return `${n}st`; case 2: return `${n}nd`; case 3: return `${n}rd`;
    }
  } return `${n}th`;
}, era: be({ values: { narrow: ['B', 'A'], abbreviated: ['BC', 'AD'], wide: ['Before Christ', 'Anno Domini'] }, defaultWidth: 'wide' }), quarter: be({ values: { narrow: ['1', '2', '3', '4'], abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'], wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'] }, defaultWidth: 'wide', argumentCallback: function(e) {
  return Number(e) - 1;
} }), month: be({ values: { narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] }, defaultWidth: 'wide' }), day: be({ values: { narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'], short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, defaultWidth: 'wide' }), dayPeriod: be({ values: { narrow: { am: 'a', pm: 'p', midnight: 'mi', noon: 'n', morning: 'morning', afternoon: 'afternoon', evening: 'evening', night: 'night' }, abbreviated: { am: 'AM', pm: 'PM', midnight: 'midnight', noon: 'noon', morning: 'morning', afternoon: 'afternoon', evening: 'evening', night: 'night' }, wide: { am: 'a.m.', pm: 'p.m.', midnight: 'midnight', noon: 'noon', morning: 'morning', afternoon: 'afternoon', evening: 'evening', night: 'night' } }, defaultWidth: 'wide', formattingValues: { narrow: { am: 'a', pm: 'p', midnight: 'mi', noon: 'n', morning: 'in the morning', afternoon: 'in the afternoon', evening: 'in the evening', night: 'at night' }, abbreviated: { am: 'AM', pm: 'PM', midnight: 'midnight', noon: 'noon', morning: 'in the morning', afternoon: 'in the afternoon', evening: 'in the evening', night: 'at night' }, wide: { am: 'a.m.', pm: 'p.m.', midnight: 'midnight', noon: 'noon', morning: 'in the morning', afternoon: 'in the afternoon', evening: 'in the evening', night: 'at night' } }, defaultFormattingWidth: 'wide' }) }, match: { ordinalNumber: (xe = { matchPattern: /^(\d+)(th|st|nd|rd)?/i, parsePattern: /\d+/i, valueCallback: function(e) {
  return parseInt(e, 10);
} }, function(e, t) {
  const n = String(e); const r = t || {}; const i = n.match(xe.matchPattern); if (!i) return null; const a = i[0]; const o = n.match(xe.parsePattern); if (!o) return null; let s = xe.valueCallback ? xe.valueCallback(o[0]) : o[0]; return { value: s = r.valueCallback ? r.valueCallback(s) : s, rest: n.slice(a.length) };
}), era: _e({ matchPatterns: { narrow: /^(b|a)/i, abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i, wide: /^(before christ|before common era|anno domini|common era)/i }, defaultMatchWidth: 'wide', parsePatterns: { any: [/^b/i, /^(a|c)/i] }, defaultParseWidth: 'any' }), quarter: _e({ matchPatterns: { narrow: /^[1234]/i, abbreviated: /^q[1234]/i, wide: /^[1234](th|st|nd|rd)? quarter/i }, defaultMatchWidth: 'wide', parsePatterns: { any: [/1/i, /2/i, /3/i, /4/i] }, defaultParseWidth: 'any', valueCallback: function(e) {
  return e + 1;
} }), month: _e({ matchPatterns: { narrow: /^[jfmasond]/i, abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i, wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i }, defaultMatchWidth: 'wide', parsePatterns: { narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i], any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i] }, defaultParseWidth: 'any' }), day: _e({ matchPatterns: { narrow: /^[smtwf]/i, short: /^(su|mo|tu|we|th|fr|sa)/i, abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i, wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i }, defaultMatchWidth: 'wide', parsePatterns: { narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i], any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i] }, defaultParseWidth: 'any' }), dayPeriod: _e({ matchPatterns: { narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i, any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i }, defaultMatchWidth: 'any', parsePatterns: { any: { am: /^a/i, pm: /^p/i, midnight: /^mi/i, noon: /^no/i, morning: /morning/i, afternoon: /afternoon/i, evening: /evening/i, night: /night/i } }, defaultParseWidth: 'any' }) }, options: { weekStartsOn: 0, firstWeekContainsDate: 1 } }; function Te(e) {
  if (null === e || !0 === e || !1 === e) return NaN; const t = Number(e); return isNaN(t) ? t : t < 0 ? Math.ceil(t) : Math.floor(t);
} function Ce(e, t) {
  if (arguments.length < 2) throw new TypeError(`2 arguments required, but only ${arguments.length} present`); return function(e, t) {
    if (arguments.length < 2) throw new TypeError(`2 arguments required, but only ${arguments.length} present`); const n = me(e).getTime(); const r = Te(t); return new Date(n + r);
  }(e, -Te(t));
} function Pe(e, t) {
  for (var n = e < 0 ? '-' : '', r = Math.abs(e).toString(); r.length < t;)r = `0${r}`; return n + r;
} const Me = function(e, t) {
  const n = e.getUTCFullYear(); const r = n > 0 ? n : 1 - n; return Pe('yy' === t ? r % 100 : r, t.length);
}; const De = function(e, t) {
  const n = e.getUTCMonth(); return 'M' === t ? String(n + 1) : Pe(n + 1, 2);
}; const Ne = function(e, t) {
  return Pe(e.getUTCDate(), t.length);
}; const Ae = function(e, t) {
  return Pe(e.getUTCHours() % 12 || 12, t.length);
}; const Ee = function(e, t) {
  return Pe(e.getUTCHours(), t.length);
}; const ke = function(e, t) {
  return Pe(e.getUTCMinutes(), t.length);
}; const Ue = function(e, t) {
  return Pe(e.getUTCSeconds(), t.length);
}; const Oe = function(e, t) {
  const n = t.length; const r = e.getUTCMilliseconds(); return Pe(Math.floor(r * Math.pow(10, n - 3)), t.length);
}; const Be = 864e5; function qe(e) {
  if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const t = me(e); const n = t.getUTCDay(); const r = (n < 1 ? 7 : 0) + n - 1; return t.setUTCDate(t.getUTCDate() - r), t.setUTCHours(0, 0, 0, 0), t;
} function We(e) {
  if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const t = me(e); const n = t.getUTCFullYear(); const r = new Date(0); r.setUTCFullYear(n + 1, 0, 4), r.setUTCHours(0, 0, 0, 0); const i = qe(r); const a = new Date(0); a.setUTCFullYear(n, 0, 4), a.setUTCHours(0, 0, 0, 0); const o = qe(a); return t.getTime() >= i.getTime() ? n + 1 : t.getTime() >= o.getTime() ? n : n - 1;
} const $e = 6048e5; function ze(e) {
  if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const t = me(e); const n = qe(t).getTime() - function(e) {
    if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const t = We(e); const n = new Date(0); return n.setUTCFullYear(t, 0, 4), n.setUTCHours(0, 0, 0, 0), qe(n);
  }(t).getTime(); return Math.round(n / $e) + 1;
} function Fe(e, t) {
  if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const n = t || {}; const r = n.locale; const i = r && r.options && r.options.weekStartsOn; const a = null == i ? 0 : Te(i); const o = null == n.weekStartsOn ? a : Te(n.weekStartsOn); if (!(o >= 0 && o <= 6)) throw new RangeError('weekStartsOn must be between 0 and 6 inclusively'); const s = me(e); const u = s.getUTCDay(); const l = (u < o ? 7 : 0) + u - o; return s.setUTCDate(s.getUTCDate() - l), s.setUTCHours(0, 0, 0, 0), s;
} function Ye(e, t) {
  if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const n = me(e, t); const r = n.getUTCFullYear(); const i = t || {}; const a = i.locale; const o = a && a.options && a.options.firstWeekContainsDate; const s = null == o ? 1 : Te(o); const u = null == i.firstWeekContainsDate ? s : Te(i.firstWeekContainsDate); if (!(u >= 1 && u <= 7)) throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively'); const l = new Date(0); l.setUTCFullYear(r + 1, 0, u), l.setUTCHours(0, 0, 0, 0); const c = Fe(l, t); const d = new Date(0); d.setUTCFullYear(r, 0, u), d.setUTCHours(0, 0, 0, 0); const h = Fe(d, t); return n.getTime() >= c.getTime() ? r + 1 : n.getTime() >= h.getTime() ? r : r - 1;
} const je = 6048e5; function Ve(e, t) {
  if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const n = me(e); const r = Fe(n, t).getTime() - function(e, t) {
    if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const n = t || {}; const r = n.locale; const i = r && r.options && r.options.firstWeekContainsDate; const a = null == i ? 1 : Te(i); const o = null == n.firstWeekContainsDate ? a : Te(n.firstWeekContainsDate); const s = Ye(e, t); const u = new Date(0); return u.setUTCFullYear(s, 0, o), u.setUTCHours(0, 0, 0, 0), Fe(u, t);
  }(n, t).getTime(); return Math.round(r / je) + 1;
} const Re = 'midnight'; const He = 'noon'; const Le = 'morning'; const Xe = 'afternoon'; const Ie = 'evening'; const Qe = 'night'; const Ge = { G: function(e, t, n) {
  const r = e.getUTCFullYear() > 0 ? 1 : 0; switch (t) {
    case 'G': case 'GG': case 'GGG': return n.era(r, { width: 'abbreviated' }); case 'GGGGG': return n.era(r, { width: 'narrow' }); case 'GGGG': default: return n.era(r, { width: 'wide' });
  }
}, y: function(e, t, n) {
  if ('yo' === t) {
    const r = e.getUTCFullYear(); const i = r > 0 ? r : 1 - r; return n.ordinalNumber(i, { unit: 'year' });
  } return Me(e, t);
}, Y: function(e, t, n, r) {
  const i = Ye(e, r); const a = i > 0 ? i : 1 - i; return 'YY' === t ? Pe(a % 100, 2) : 'Yo' === t ? n.ordinalNumber(a, { unit: 'year' }) : Pe(a, t.length);
}, R: function(e, t) {
  return Pe(We(e), t.length);
}, u: function(e, t) {
  return Pe(e.getUTCFullYear(), t.length);
}, Q: function(e, t, n) {
  const r = Math.ceil((e.getUTCMonth() + 1) / 3); switch (t) {
    case 'Q': return String(r); case 'QQ': return Pe(r, 2); case 'Qo': return n.ordinalNumber(r, { unit: 'quarter' }); case 'QQQ': return n.quarter(r, { width: 'abbreviated', context: 'formatting' }); case 'QQQQQ': return n.quarter(r, { width: 'narrow', context: 'formatting' }); case 'QQQQ': default: return n.quarter(r, { width: 'wide', context: 'formatting' });
  }
}, q: function(e, t, n) {
  const r = Math.ceil((e.getUTCMonth() + 1) / 3); switch (t) {
    case 'q': return String(r); case 'qq': return Pe(r, 2); case 'qo': return n.ordinalNumber(r, { unit: 'quarter' }); case 'qqq': return n.quarter(r, { width: 'abbreviated', context: 'standalone' }); case 'qqqqq': return n.quarter(r, { width: 'narrow', context: 'standalone' }); case 'qqqq': default: return n.quarter(r, { width: 'wide', context: 'standalone' });
  }
}, M: function(e, t, n) {
  const r = e.getUTCMonth(); switch (t) {
    case 'M': case 'MM': return De(e, t); case 'Mo': return n.ordinalNumber(r + 1, { unit: 'month' }); case 'MMM': return n.month(r, { width: 'abbreviated', context: 'formatting' }); case 'MMMMM': return n.month(r, { width: 'narrow', context: 'formatting' }); case 'MMMM': default: return n.month(r, { width: 'wide', context: 'formatting' });
  }
}, L: function(e, t, n) {
  const r = e.getUTCMonth(); switch (t) {
    case 'L': return String(r + 1); case 'LL': return Pe(r + 1, 2); case 'Lo': return n.ordinalNumber(r + 1, { unit: 'month' }); case 'LLL': return n.month(r, { width: 'abbreviated', context: 'standalone' }); case 'LLLLL': return n.month(r, { width: 'narrow', context: 'standalone' }); case 'LLLL': default: return n.month(r, { width: 'wide', context: 'standalone' });
  }
}, w: function(e, t, n, r) {
  const i = Ve(e, r); return 'wo' === t ? n.ordinalNumber(i, { unit: 'week' }) : Pe(i, t.length);
}, I: function(e, t, n) {
  const r = ze(e); return 'Io' === t ? n.ordinalNumber(r, { unit: 'week' }) : Pe(r, t.length);
}, d: function(e, t, n) {
  return 'do' === t ? n.ordinalNumber(e.getUTCDate(), { unit: 'date' }) : Ne(e, t);
}, D: function(e, t, n) {
  const r = function(e) {
    if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const t = me(e); const n = t.getTime(); t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0); const r = n - t.getTime(); return Math.floor(r / Be) + 1;
  }(e); return 'Do' === t ? n.ordinalNumber(r, { unit: 'dayOfYear' }) : Pe(r, t.length);
}, E: function(e, t, n) {
  const r = e.getUTCDay(); switch (t) {
    case 'E': case 'EE': case 'EEE': return n.day(r, { width: 'abbreviated', context: 'formatting' }); case 'EEEEE': return n.day(r, { width: 'narrow', context: 'formatting' }); case 'EEEEEE': return n.day(r, { width: 'short', context: 'formatting' }); case 'EEEE': default: return n.day(r, { width: 'wide', context: 'formatting' });
  }
}, e: function(e, t, n, r) {
  const i = e.getUTCDay(); const a = (i - r.weekStartsOn + 8) % 7 || 7; switch (t) {
    case 'e': return String(a); case 'ee': return Pe(a, 2); case 'eo': return n.ordinalNumber(a, { unit: 'day' }); case 'eee': return n.day(i, { width: 'abbreviated', context: 'formatting' }); case 'eeeee': return n.day(i, { width: 'narrow', context: 'formatting' }); case 'eeeeee': return n.day(i, { width: 'short', context: 'formatting' }); case 'eeee': default: return n.day(i, { width: 'wide', context: 'formatting' });
  }
}, c: function(e, t, n, r) {
  const i = e.getUTCDay(); const a = (i - r.weekStartsOn + 8) % 7 || 7; switch (t) {
    case 'c': return String(a); case 'cc': return Pe(a, t.length); case 'co': return n.ordinalNumber(a, { unit: 'day' }); case 'ccc': return n.day(i, { width: 'abbreviated', context: 'standalone' }); case 'ccccc': return n.day(i, { width: 'narrow', context: 'standalone' }); case 'cccccc': return n.day(i, { width: 'short', context: 'standalone' }); case 'cccc': default: return n.day(i, { width: 'wide', context: 'standalone' });
  }
}, i: function(e, t, n) {
  const r = e.getUTCDay(); const i = 0 === r ? 7 : r; switch (t) {
    case 'i': return String(i); case 'ii': return Pe(i, t.length); case 'io': return n.ordinalNumber(i, { unit: 'day' }); case 'iii': return n.day(r, { width: 'abbreviated', context: 'formatting' }); case 'iiiii': return n.day(r, { width: 'narrow', context: 'formatting' }); case 'iiiiii': return n.day(r, { width: 'short', context: 'formatting' }); case 'iiii': default: return n.day(r, { width: 'wide', context: 'formatting' });
  }
}, a: function(e, t, n) {
  const r = e.getUTCHours() / 12 >= 1 ? 'pm' : 'am'; switch (t) {
    case 'a': case 'aa': case 'aaa': return n.dayPeriod(r, { width: 'abbreviated', context: 'formatting' }); case 'aaaaa': return n.dayPeriod(r, { width: 'narrow', context: 'formatting' }); case 'aaaa': default: return n.dayPeriod(r, { width: 'wide', context: 'formatting' });
  }
}, b: function(e, t, n) {
  let r; const i = e.getUTCHours(); switch (r = 12 === i ? He : 0 === i ? Re : i / 12 >= 1 ? 'pm' : 'am', t) {
    case 'b': case 'bb': case 'bbb': return n.dayPeriod(r, { width: 'abbreviated', context: 'formatting' }); case 'bbbbb': return n.dayPeriod(r, { width: 'narrow', context: 'formatting' }); case 'bbbb': default: return n.dayPeriod(r, { width: 'wide', context: 'formatting' });
  }
}, B: function(e, t, n) {
  let r; const i = e.getUTCHours(); switch (r = i >= 17 ? Ie : i >= 12 ? Xe : i >= 4 ? Le : Qe, t) {
    case 'B': case 'BB': case 'BBB': return n.dayPeriod(r, { width: 'abbreviated', context: 'formatting' }); case 'BBBBB': return n.dayPeriod(r, { width: 'narrow', context: 'formatting' }); case 'BBBB': default: return n.dayPeriod(r, { width: 'wide', context: 'formatting' });
  }
}, h: function(e, t, n) {
  if ('ho' === t) {
    let r = e.getUTCHours() % 12; return 0 === r && (r = 12), n.ordinalNumber(r, { unit: 'hour' });
  } return Ae(e, t);
}, H: function(e, t, n) {
  return 'Ho' === t ? n.ordinalNumber(e.getUTCHours(), { unit: 'hour' }) : Ee(e, t);
}, K: function(e, t, n) {
  const r = e.getUTCHours() % 12; return 'Ko' === t ? n.ordinalNumber(r, { unit: 'hour' }) : Pe(r, t.length);
}, k: function(e, t, n) {
  let r = e.getUTCHours(); return 0 === r && (r = 24), 'ko' === t ? n.ordinalNumber(r, { unit: 'hour' }) : Pe(r, t.length);
}, m: function(e, t, n) {
  return 'mo' === t ? n.ordinalNumber(e.getUTCMinutes(), { unit: 'minute' }) : ke(e, t);
}, s: function(e, t, n) {
  return 'so' === t ? n.ordinalNumber(e.getUTCSeconds(), { unit: 'second' }) : Ue(e, t);
}, S: function(e, t) {
  return Oe(e, t);
}, X: function(e, t, n, r) {
  const i = (r._originalDate || e).getTimezoneOffset(); if (0 === i) return 'Z'; switch (t) {
    case 'X': return Ze(i); case 'XXXX': case 'XX': return Ke(i); case 'XXXXX': case 'XXX': default: return Ke(i, ':');
  }
}, x: function(e, t, n, r) {
  const i = (r._originalDate || e).getTimezoneOffset(); switch (t) {
    case 'x': return Ze(i); case 'xxxx': case 'xx': return Ke(i); case 'xxxxx': case 'xxx': default: return Ke(i, ':');
  }
}, O: function(e, t, n, r) {
  const i = (r._originalDate || e).getTimezoneOffset(); switch (t) {
    case 'O': case 'OO': case 'OOO': return `GMT${Je(i, ':')}`; case 'OOOO': default: return `GMT${Ke(i, ':')}`;
  }
}, z: function(e, t, n, r) {
  const i = (r._originalDate || e).getTimezoneOffset(); switch (t) {
    case 'z': case 'zz': case 'zzz': return `GMT${Je(i, ':')}`; case 'zzzz': default: return `GMT${Ke(i, ':')}`;
  }
}, t: function(e, t, n, r) {
  const i = r._originalDate || e; return Pe(Math.floor(i.getTime() / 1e3), t.length);
}, T: function(e, t, n, r) {
  return Pe((r._originalDate || e).getTime(), t.length);
} }; function Je(e, t) {
  const n = e > 0 ? '-' : '+'; const r = Math.abs(e); const i = Math.floor(r / 60); const a = r % 60; if (0 === a) return n + String(i); const o = t || ''; return n + String(i) + o + Pe(a, 2);
} function Ze(e, t) {
  return e % 60 == 0 ? (e > 0 ? '-' : '+') + Pe(Math.abs(e) / 60, 2) : Ke(e, t);
} function Ke(e, t) {
  const n = t || ''; const r = e > 0 ? '-' : '+'; const i = Math.abs(e); return r + Pe(Math.floor(i / 60), 2) + n + Pe(i % 60, 2);
} function et(e, t) {
  switch (e) {
    case 'P': return t.date({ width: 'short' }); case 'PP': return t.date({ width: 'medium' }); case 'PPP': return t.date({ width: 'long' }); case 'PPPP': default: return t.date({ width: 'full' });
  }
} function tt(e, t) {
  switch (e) {
    case 'p': return t.time({ width: 'short' }); case 'pp': return t.time({ width: 'medium' }); case 'ppp': return t.time({ width: 'long' }); case 'pppp': default: return t.time({ width: 'full' });
  }
} const nt = { p: tt, P: function(e, t) {
  let n; const r = e.match(/(P+)(p+)?/); const i = r[1]; const a = r[2]; if (!a) return et(e, t); switch (i) {
    case 'P': n = t.dateTime({ width: 'short' }); break; case 'PP': n = t.dateTime({ width: 'medium' }); break; case 'PPP': n = t.dateTime({ width: 'long' }); break; case 'PPPP': default: n = t.dateTime({ width: 'full' });
  } return n.replace('{{date}}', et(i, t)).replace('{{time}}', tt(a, t));
} }; const rt = 6e4; function it(e) {
  const t = new Date(e.getTime()); const n = t.getTimezoneOffset(); t.setSeconds(0, 0); const r = t.getTime() % rt; return n * rt + r;
} const at = ['D', 'DD']; const ot = ['YY', 'YYYY']; function st(e) {
  if ('YYYY' === e) throw new RangeError('Use `yyyy` instead of `YYYY` for formatting years; see: https://git.io/fxCyr'); if ('YY' === e) throw new RangeError('Use `yy` instead of `YY` for formatting years; see: https://git.io/fxCyr'); if ('D' === e) throw new RangeError('Use `d` instead of `D` for formatting days of the month; see: https://git.io/fxCyr'); if ('DD' === e) throw new RangeError('Use `dd` instead of `DD` for formatting days of the month; see: https://git.io/fxCyr');
} const ut = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g; const lt = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g; const ct = /^'([^]*?)'?$/; const dt = /''/g; const ht = /[a-zA-Z]/; function pt(e, t, n) {
  return (n = n || []).length >= t ? e.apply(null, n.slice(0, t).reverse()) : function() {
    const r = Array.prototype.slice.call(arguments); return pt(e, t, n.concat(r));
  };
} const ft = pt(function(e, t, n) {
  if (arguments.length < 2) throw new TypeError(`2 arguments required, but only ${arguments.length} present`); const r = String(t); const i = n || {}; const a = i.locale || Se; const o = a.options && a.options.firstWeekContainsDate; const s = null == o ? 1 : Te(o); const u = null == i.firstWeekContainsDate ? s : Te(i.firstWeekContainsDate); if (!(u >= 1 && u <= 7)) throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively'); const l = a.options && a.options.weekStartsOn; const c = null == l ? 0 : Te(l); const d = null == i.weekStartsOn ? c : Te(i.weekStartsOn); if (!(d >= 0 && d <= 6)) throw new RangeError('weekStartsOn must be between 0 and 6 inclusively'); if (!a.localize) throw new RangeError('locale must contain localize property'); if (!a.formatLong) throw new RangeError('locale must contain formatLong property'); const h = me(e); if (!function(e) {
    if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const t = me(e); return !isNaN(t);
  }(h)) throw new RangeError('Invalid time value'); const p = Ce(h, it(h)); const f = { firstWeekContainsDate: u, weekStartsOn: d, locale: a, _originalDate: h }; return r.match(lt).map(function(e) {
    const t = e[0]; return 'p' === t || 'P' === t ? (0, nt[t])(e, a.formatLong, f) : e;
  }).join('').match(ut).map(function(e) {
    if ('\'\'' === e) return '\''; const t = e[0]; if ('\'' === t) return e.match(ct)[1].replace(dt, '\''); let n; const r = Ge[t]; if (r) {
      return i.useAdditionalWeekYearTokens || (n = e, -1 === ot.indexOf(n)) || st(e), !i.useAdditionalDayOfYearTokens && function(e) {
        return -1 !== at.indexOf(e);
      }(e) && st(e), r(p, e, a.localize, f);
    } if (t.match(ht)) throw new RangeError(`Format string contains an unescaped latin alphabet character \`${t}\``); return e;
  }).join('');
}, 3); function mt(e, t) {
  if (arguments.length < 2) throw new TypeError(`2 arguments required, but only ${arguments.length} present`); const n = me(e); const r = me(t); const i = n.getTime() - r.getTime(); return i < 0 ? -1 : i > 0 ? 1 : i;
} function gt(e, t) {
  if (arguments.length < 2) throw new TypeError(`2 arguments required, but only ${arguments.length} present`); const n = me(e); const r = me(t); const i = mt(n, r); const a = Math.abs(function(e, t) {
    if (arguments.length < 2) throw new TypeError(`2 arguments required, but only ${arguments.length} present`); const n = me(e); const r = me(t); return 12 * (n.getFullYear() - r.getFullYear()) + (n.getMonth() - r.getMonth());
  }(n, r)); n.setMonth(n.getMonth() - i * a); const o = i * (a - (mt(n, r) === -i)); return 0 === o ? 0 : o;
} function wt(e, t) {
  if (arguments.length < 2) throw new TypeError(`2 arguments required, but only ${arguments.length} present`); const n = function(e, t) {
    if (arguments.length < 2) throw new TypeError(`2 arguments required, but only ${arguments.length} present`); const n = me(e); const r = me(t); return n.getTime() - r.getTime();
  }(e, t) / 1e3; return n > 0 ? Math.floor(n) : Math.ceil(n);
} function vt(e) {
  return function(e, t) {
    if (null == e) throw new TypeError('assign requires that input parameter not be null or undefined'); for (const n in t = t || {})t.hasOwnProperty(n) && (e[n] = t[n]); return e;
  }({}, e);
} const yt = 1440; const bt = 2520; const _t = 43200; const xt = 86400; const St = pt(function(e, t, n) {
  if (arguments.length < 2) throw new TypeError(`2 arguments required, but only ${arguments.length} present`); const r = n || {}; const i = r.locale || Se; if (!i.formatDistance) throw new RangeError('locale must contain formatDistance property'); const a = mt(e, t); if (isNaN(a)) throw new RangeError('Invalid time value'); let o; let s; const u = vt(r); u.addSuffix = Boolean(r.addSuffix), u.comparison = a, a > 0 ? (o = me(t), s = me(e)) : (o = me(e), s = me(t)); let l; const c = wt(s, o); const d = (it(s) - it(o)) / 1e3; const h = Math.round((c - d) / 60); if (h < 2) return r.includeSeconds ? c < 5 ? i.formatDistance('lessThanXSeconds', 5, u) : c < 10 ? i.formatDistance('lessThanXSeconds', 10, u) : c < 20 ? i.formatDistance('lessThanXSeconds', 20, u) : c < 40 ? i.formatDistance('halfAMinute', null, u) : c < 60 ? i.formatDistance('lessThanXMinutes', 1, u) : i.formatDistance('xMinutes', 1, u) : 0 === h ? i.formatDistance('lessThanXMinutes', 1, u) : i.formatDistance('xMinutes', h, u); if (h < 45) return i.formatDistance('xMinutes', h, u); if (h < 90) return i.formatDistance('aboutXHours', 1, u); if (h < yt) {
    const p = Math.round(h / 60); return i.formatDistance('aboutXHours', p, u);
  } if (h < bt) return i.formatDistance('xDays', 1, u); if (h < _t) {
    const f = Math.round(h / yt); return i.formatDistance('xDays', f, u);
  } if (h < xt) return l = Math.round(h / _t), i.formatDistance('aboutXMonths', l, u); if ((l = gt(s, o)) < 12) {
    const m = Math.round(h / _t); return i.formatDistance('xMonths', m, u);
  } const g = l % 12; const w = Math.floor(l / 12); return g < 3 ? i.formatDistance('aboutXYears', w, u) : g < 9 ? i.formatDistance('overXYears', w, u) : i.formatDistance('almostXYears', w + 1, u);
}, 3); const Tt = 36e5; const Ct = 6e4; const Pt = 2; const Mt = { dateTimeDelimiter: /[T ]/, timeZoneDelimiter: /[Z ]/i, timezone: /([Z+-].*)$/ }; const Dt = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/; const Nt = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/; const At = /^([+-])(\d{2})(?::?(\d{2}))?$/; function Et(e) {
  return e ? parseInt(e) : 1;
} function kt(e) {
  return e && parseFloat(e.replace(',', '.')) || 0;
} const Ut = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; function Ot(e) {
  return e % 400 == 0 || e % 4 == 0 && e % 100;
} const Bt = pt(function(e, t) {
  if (arguments.length < 1) throw new TypeError(`1 argument required, but only ${arguments.length} present`); const n = t || {}; const r = null == n.additionalDigits ? Pt : Te(n.additionalDigits); if (2 !== r && 1 !== r && 0 !== r) throw new RangeError('additionalDigits must be 0, 1 or 2'); if ('string' !== typeof e && '[object String]' !== Object.prototype.toString.call(e)) return new Date(NaN); let i; const a = function(e) {
    let t; const n = {}; const r = e.split(Mt.dateTimeDelimiter); if (/:/.test(r[0]) ? (n.date = null, t = r[0]) : (n.date = r[0], t = r[1], Mt.timeZoneDelimiter.test(n.date) && (n.date = e.split(Mt.timeZoneDelimiter)[0], t = e.substr(n.date.length, e.length))), t) {
      const i = Mt.timezone.exec(t); i ? (n.time = t.replace(i[1], ''), n.timezone = i[1]) : n.time = t;
    } return n;
  }(e); if (a.date) {
    const o = function(e, t) {
      const n = new RegExp(`^(?:(\\d{4}|[+-]\\d{${4 + t}})|(\\d{2}|[+-]\\d{${2 + t}})$)`); const r = e.match(n); if (!r) return { year: null }; const i = r[1] && parseInt(r[1]); const a = r[2] && parseInt(r[2]); return { year: null == a ? i : 100 * a, restDateString: e.slice((r[1] || r[2]).length) };
    }(a.date, r); i = function(e, t) {
      if (null === t) return null; const n = e.match(Dt); if (!n) return null; const r = !!n[4]; const i = Et(n[1]); const a = Et(n[2]) - 1; const o = Et(n[3]); const s = Et(n[4]); const u = Et(n[5]) - 1; if (r) {
        return function(e, t, n) {
          return t >= 1 && t <= 53 && n >= 0 && n <= 6;
        }(0, s, u) ? function(e, t, n) {
          const r = new Date(0); r.setUTCFullYear(e, 0, 4); const i = r.getUTCDay() || 7; const a = 7 * (t - 1) + n + 1 - i; return r.setUTCDate(r.getUTCDate() + a), r;
        }(t, s, u) : new Date(NaN);
      } const l = new Date(0); return function(e, t, n) {
        return t >= 0 && t <= 11 && n >= 1 && n <= (Ut[t] || (Ot(e) ? 29 : 28));
      }(t, a, o) && function(e, t) {
        return t >= 1 && t <= (Ot(e) ? 366 : 365);
      }(t, i) ? (l.setUTCFullYear(t, a, Math.max(i, o)), l) : new Date(NaN);
    }(o.restDateString, o.year);
  } if (isNaN(i) || !i) return new Date(NaN); let s; const u = i.getTime(); let l = 0; if (a.time && (l = function(e) {
    const t = e.match(Nt); if (!t) return null; const n = kt(t[1]); const r = kt(t[2]); const i = kt(t[3]); return function(e, t, n) {
      return 24 === e ? 0 === t && 0 === n : n >= 0 && n < 60 && t >= 0 && t < 60 && e >= 0 && e < 25;
    }(n, r, i) ? n * Tt + r * Ct + 1e3 * i : NaN;
  }(a.time), isNaN(l) || null === l)) return new Date(NaN); if (a.timezone) {
    if (s = function(e) {
      if ('Z' === e) return 0; const t = e.match(At); if (!t) return 0; const n = '+' === t[1] ? -1 : 1; const r = parseInt(t[2]); const i = t[3] && parseInt(t[3]) || 0; return function(e, t) {
        return t >= 0 && t <= 59;
      }(0, i) ? n * (r * Tt + i * Ct) : NaN;
    }(a.timezone), isNaN(s)) return new Date(NaN);
  } else {
    const c = u + l; const d = new Date(c); s = it(d); const h = new Date(c); s > 0 ? h.setDate(d.getDate() + 1) : h.setDate(d.getDate() - 1); const p = it(h) - s; p > 0 && (s += p);
  } return new Date(u + l + s);
}, 1); const qt = (e, t)=>n=>e(t(n)); const Wt = qt(ft({ awareOfUnicodeTokens: !0 }, 'MMM d'), Bt); const $t = qt(St({ addSuffix: !0 }, new Date), Bt); const zt = e=>q`<li><a href="https://dev.to/t/${e}" rel="noopener nofollow">#${e}</a></li>`; class Ft extends he {
  static get is() {
    return 'dev-article';
  }

  static get properties() {
    return { article: { type: Object }, showDescription: { type: Boolean, attribute: 'show-description', reflect: !0 } };
  }

  static get styles() {
    return ce`:host{display:block;overflow:hidden;border:1px solid hsla(0,0%,72.9%,.5);border-radius:3px;box-shadow:hsl(0,0%,72.9%) 3px 3px 0 0;margin:10px 0 0 0;padding:0;position:relative;transition-delay:0s;transition-duration:.35s;transition-property:opacity;transition-timing-function:ease-in;width:100%;max-width:var(--dev-article-max-width);--dev-article-avatar-size:48px;--dev-article-padding:12px}article{display:grid;grid-template-columns:calc(var(--dev-article-avatar-size) + (2 * var(--dev-article-padding))) auto;grid-template-areas:'figure figure figure' 'avatar metadata metadata' 'description description description' 'count actions actions'}figure{grid-area:figure;margin:0;width:100%}figcaption{padding:0 var(--dev-article-padding)}#tags a,figcaption a{color:inherit;text-decoration:none}#cover{grid-area:cover}:host(:hover) #cover{opacity:.9}#cover img{width:100%}#title{grid-area:title}#title h3{font-size:calc(22px + 1.7vw);font-weight:500;margin:8px 0;padding:0}#metadata{margin-left:7px;grid-area:metadata}#metadata > a{text-decoration:none;color:#666}#metadata > a:hover{color:#4c4c4c}#tags a:hover,#metadata a:hover :not(#relative-time){text-decoration:underline}#avatar{border-radius:100%;justify-self:center;overflow:hidden;height:var(--dev-article-avatar-size);width:var(--dev-article-avatar-size)}#avatar img{width:var(--dev-article-avatar-size)}#relative-time{font-size:80%;font-weight:400;text-decoration:none}#tags{list-style-type:none;font-size:16px;margin:4px 0 0 0;padding:0}#tags li{display:inline}#positive-reactions{display:flex;align-items:center;color:var(--theme-secondary-color,#666);font-size:15px;grid-area:count;padding:var(--dev-article-padding)}#positive-reactions img{width:26px;height:20px;margin-right:7px}#actions{display:flex;grid-area:actions;justify-content:end}#actions button{border:none;background:0 0}details{grid-area:description}`;
  }

  render() {
    const { cover_image: e, description: t, positive_reactions_count: n, published_at: r = `${new Date}`, tag_list: i = [], title: a, url: o, user: s } = this.article || {}; const { name: u, profile_image_90: l, username: c } = s || {}; return q`<article aria-labelledby="title"><figure><a id="cover" ?hidden="${!e}" href="${o}" rel="norefer noopener nofollow"><img src="${e}" role="presentation"></a><figcaption><a id="title" href="${o}" rel="noopener norefer"><h3>${a}</h3></a></figcaption></figure><a id="avatar" href="https://dev.to/${c}" rel="norefer noopener nofollow"><img src="${l}" alt="${u || c}'s Avatar"></a><section id="metadata"><a href="https://dev.to/${c}" rel="norefer noopener nofollow"><span>${u || c} • <time>${Wt(r)}</time></span> <span id="relative-time">(${$t(r)})</span></a><ul id="tags">${i.map(zt)}</ul><details ?open="${this.showDescription}"><summary hidden></summary>${t}</details></section><span id="positive-reactions"><img src="https://practicaldev-herokuapp-com.freetls.fastly.net/assets/reactions-stack-4bb9c1e4b3e71b7aa135d6f9a5ef29a6494141da882edd4fa971a77abe13dbe7.png" alt="Circled heart on a stack of similar circles" title="Number of Positive Reactions"> ${n}</span><section id="actions"><button @click="${this.toggleDescription}" title="Show Description">💬</button></section></article>`;
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }
}window.customElements.define(Ft.is, Ft); const Yt = e=>e.json(); const jt = e=>new Date(e).getTime(); const Vt = e=>e; const Rt = (e, t)=>e - t; const Ht = function e(t) {
  return function() {
    for (var n = arguments.length, r = new Array(n), i = 0; i < n; i++)r[i] = arguments[i]; const a = r.length ? r : [void 0]; if (a.length < t.length) return e(Function.bind.apply(t, [null].concat(a))); const o = a.length === t.length ? t.apply(null, a) : a.reduce(fe, t); return pe(o) ? e(o) : o;
  };
}((e, t, n, r, i)=>e(t(i[n]), t(r[n]))); const Lt = Ht(Rt); const Xt = Ht((e=>(function(t, n) {
  for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), a = 2; a < r; a++)i[a - 2] = arguments[a]; return e(n, t, ...i);
}))(Rt)); const It = Lt(Vt); const Qt = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)n[r - 1] = arguments[r]; return new y(e, n, 'svg', E);
}`
<svg id="loading-content" viewBox="0 0 609 476" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <rect id="a" x="1" y="1" width="604" height="471.017" rx="3"/>
    <filter x="-.3%" y="-.4%" width="101.2%" height="101.5%" filterUnits="objectBoundingBox" id="b">
      <feMorphology radius=".5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/>
      <feOffset dx="3" dy="3" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
      <feComposite in="shadowOffsetOuter1" in2="SourceAlpha" operator="out" result="shadowOffsetOuter1"/>
      <feColorMatrix values="0 0 0 0 0.729 0 0 0 0 0.729 0 0 0 0 0.729 0 0 0 1 0" in="shadowOffsetOuter1"/>
    </filter>
    <rect id="e" x="1" y="1" width="604" height="471.017" rx="3"/>
    <filter x="-.3%" y="-.4%" width="101.2%" height="101.5%" filterUnits="objectBoundingBox" id="d">
      <feMorphology radius=".5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/>
      <feOffset dx="3" dy="3" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
      <feComposite in="shadowOffsetOuter1" in2="SourceAlpha" operator="out" result="shadowOffsetOuter1"/>
      <feColorMatrix values="0 0 0 0 0.729 0 0 0 0 0.729 0 0 0 0 0.729 0 0 0 1 0" in="shadowOffsetOuter1"/>
    </filter>
  </defs>
  <g fill="none" fill-rule="evenodd">
    <mask id="c" fill="#fff">
      <use xlink:href="#a"/>
    </mask>
    <use fill="#000" filter="url(#b)" xlink:href="#a"/>
    <use stroke-opacity=".5" stroke="#BABABA" fill="#FFF" xlink:href="#a"/>
    <g mask="url(#c)">
      <use fill="#000" filter="url(#d)" xlink:href="#e"/>
      <use stroke-opacity=".5" stroke="#BABABA" fill="#FFF" xlink:href="#e"/>
    </g>
    <path fill="#BABABA" mask="url(#c)" d="M1 1h604v253.667H1z"/>
    <rect fill="#BABABA" mask="url(#c)" x="15" y="276" width="536" height="34" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="15" y="325" width="388" height="34" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="81" y="380" width="292" height="16" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="81" y="405" width="128" height="16" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="216" y="405" width="96" height="16" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="319" y="405" width="128" height="16" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="454" y="405" width="47" height="16" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="46" y="437" width="35" height="16" rx="3"/>
    <circle fill="#BABABA" mask="url(#c)" cx="38" cy="400" r="24"/>
    <circle fill="#BABABA" mask="url(#c)" cx="25" cy="445" r="10"/>
  </g>
</svg>
`;class Gt extends he {
  static get is() {
    return 'dev-feed';
  }

  static get styles() {
    return ce`[hidden]{display:none!important}:host{display:block;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";font-size:18px;margin:15px;color:hsl(0,0%,3.9%);padding:25px;position:relativei;--dev-article-max-width:604px}ul{list-style-type:none;margin:0;padding:0}#loading-content{max-width:var(--dev-article-max-width)}`;
  }

  static get properties() {
    return { sort: { type: String, reflect: !0 }, posts: { type: Array }, username: { type: String }, loading: { type: Boolean, reflect: !0 }, showDescriptions: { type: Boolean, attribute: 'show-descriptions' } };
  }

  get apiEndpoint() {
    const { username: e } = this; if (!e) return null; const t = new URLSearchParams({ username: e }); const n = new URL('api/articles', 'https://dev.to'); return n.search = t, n;
  }

  constructor() {
    let e; let t; let n; let r; super(), this.posts = [], this.sort = 'popularity', this.assignPosts = this.assignPosts.bind(this), this.postTemplate = this.postTemplate.bind(this), this.fetchPosts = (e = this.fetchPosts.bind(this), t = 500, n = !0, function() {
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)a[o] = arguments[o]; const s = this; const u = n && !r; clearTimeout(r), r = setTimeout(function() {
        r = null, n || e.apply(s, a);
      }, t), u && e.apply(s, a);
    });
  }

  render() {
    const { loading: e, posts: t, postTemplate: n, sort: r } = this; const i = 'popularity' === r ? It('positive_reactions_count') : 'date' === r ? Lt(jt, 'published_at') : 'date-asc' === r ? Xt(jt, 'published_at') : Vt; return q`<div ?hidden="${!e}">${Qt}</div><ul id="posts" ?hidden="${e}">${t.sort(i).map(n)}</ul>`;
  }

  postTemplate(e) {
    return q`<li><dev-article .article="${e}" ?show-description="${this.showDescriptions}"></dev-article></li>`;
  }

  async updated(e) {
    e.has('username') && this.username && this.fetchPosts();
  }

  assignPosts(e) {
    return this.posts = e || [], this.loading = !1, e;
  }

  async fetchPosts() {
    const { apiEndpoint: e } = this; if (e) return this.loading = !0, fetch(e).then(Yt).then(this.assignPosts).catch(console.error);
  }
}window.customElements.define(Gt.is, Gt); const Jt = new Proxy({ showDescriptions: !1, sort: 'popularity', username: 'bennypowers' }, { set: (e, t, n)=>(e[t] = n, an(), !0) }); const Zt = (e, t)=>n=>e(t(n)); const Kt = z(function(e, t) {
  Jt[e] = t;
}); const en = z(function(e, t, n) {
  try {
    return t.reduce((e, t)=>e[t], n);
  } catch (t) {
    return e;
  }
}); const tn = Zt(Kt('username'), en('', ['target', 'value'])); const nn = Zt(Kt('showDescriptions'), en(!1, ['target', 'checked'])); const rn = Zt(Kt('sort'), en('popularity', ['target', 'value'])); document.querySelector('main'), document.querySelector('footer'); function an() {
  const { sort: e, showDescriptions: t, username: n } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Jt; const r = q`<dev-feed id="component" username="${n}" sort="${e}" ?show-descriptions="${t}"></dev-feed>`; const i = q`<h2>Properties</h2><label for="username"><code>username</code></label> <input id="username" @keyup="${tn}" value="${n}"> <label for="show-descriptions"><code>show-descriptions</code></label> <input id="show-descriptions" type="checkbox" @change="${nn}" ?checked="${t}"> <label for="sort"><code>sort</code></label> <select id="sort" @change="${rn}" value="${e}"><option value="popularity">Popularity</option><option value="date">Date, Descending</option><option value="date-asc">Date, Ascending</option></select>`; B(r, document.querySelector('main')), B(i, document.querySelector('footer'));
}an();
// # sourceMappingURL=inline-entry.0.js.map
