export const consoleErrorCurried = function (...msg: any[]) {

  return function <T>(x: T) {
    console.error('consoleErrorCurried::', ...msg);
    return x;
  };
};
