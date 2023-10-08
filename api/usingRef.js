const Ref = class {
  constructor(val) {
    this._value = val;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange();
  }

  onChange() { }
};

const usingRef = (initialValue) => new Ref(initialValue);

export default usingRef;
