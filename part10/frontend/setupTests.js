import '@testing-library/jest-native/extend-expect';

// Polyfill for setImmediate in Jest
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn) => setTimeout(fn, 0);
}
