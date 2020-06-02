const stepCounter = {
  step: 0,
  increase: function () { this.step++; },
  get: function () { return this.step; },
  reset: function () { this.step = 0; }
};

export {stepCounter};
