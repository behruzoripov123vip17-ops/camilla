/* CAMILLA performance layer — keeps the visual style but removes expensive effects on weaker devices. */
(function () {
  "use strict";
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  const saveData = !!navigator.connection?.saveData;
  const lowPower = saveData || cores <= 4 || memory <= 4;

  document.documentElement.classList.toggle("camilla-low-power", lowPower);

  if (lowPower) {
    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = function (query) {
      if (query === "(prefers-reduced-motion: reduce)") {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() { return false; }
        };
      }
      if (query === "(pointer:fine)") {
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() { return false; }
        };
      }
      return nativeMatchMedia(query);
    };
  }
})();