// curry from crocks. copied here as es module

/** @license ISC License (c) copyright 2016 crocks original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

// isFunction : a -> Boolean
function isFunction(fn) {
  return typeof fn === 'function';
}

function applyCurry(fn, arg) {
  if (!isFunction(fn)) {
    return fn;
  }
  return fn.length > 1 ? fn.bind(null, arg) : fn.call(null, arg);
}

// curry : ((a, b, c) -> d) -> a -> b -> c -> d
export function curry(fn) {
  return function(...xs) {
    const args =
      xs.length ? xs : [undefined];

    if (args.length < fn.length) {
      return curry(Function.bind.apply(fn, [null].concat(args)));
    }

    const val = args.length === fn.length ?
      fn(...args) :
      args.reduce(applyCurry, fn);

    if (isFunction(val)) {
      return curry(val);
    }

    return val;
  };
}
