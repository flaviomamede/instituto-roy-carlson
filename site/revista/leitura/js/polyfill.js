'use strict';

/* Safari / iOS antigos não têm Promise.withResolvers (PDF.js 4.x exige). */
if (typeof Promise.withResolvers !== 'function') {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}
