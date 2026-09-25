/* CAMILLA performance layer — keeps the visual style while avoiding fragile browser API overrides. */
(function () {
  "use strict";
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  const saveData = !!navigator.connection?.saveData;
  window.CAMILLA_LOW_POWER = saveData || cores <= 4 || memory <= 4;
  document.documentElement.classList.toggle("camilla-low-power", window.CAMILLA_LOW_POWER);
})();
