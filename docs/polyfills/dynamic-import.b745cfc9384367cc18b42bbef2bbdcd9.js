window.importShim = function(e) {
  return new Promise((o, r)=>{
    const t = `$importModule$${Math.random().toString(32).slice(2)}`; const n = document.createElement('script'); const c = ()=>{
      delete window[t], n.onerror = null, n.onload = null, n.remove(), URL.revokeObjectURL(n.src), n.src = '';
    }; n.defer = 'defer', n.type = 'module', n.onerror = ()=>{
      r(new Error(`Failed to import: ${e}`)), c();
    }, n.onload = ()=>{
      o(window[t]), c();
    }; const d = function(e) {
      const o = document.createElement('a'); return o.setAttribute('href', e), o.cloneNode(!1).href;
    }(e); const i = new Blob([`import * as m from "${d}"; window.${t} = m;`], { type: 'text/javascript' }); n.src = URL.createObjectURL(i), document.head.appendChild(n);
  });
};
