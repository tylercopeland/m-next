/* eslint-disable no-bitwise */
export default class Guid {
  static S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  static create() {
    return `${this.S4() + this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
  }

  static valid(guid) {
    return /^\{?[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}\}?$/.test(guid);
  }

  static empty() {
    return '00000000-0000-0000-0000-000000000000';
  }
}
