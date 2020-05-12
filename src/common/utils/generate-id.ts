const generateId = () => {
  const numbers = '0123456789';
  const ID_LENGTH = 4;
  let rtn = '';
  // tslint:disable-next-line: no-increment-decrement
  for (let i = 0; i < ID_LENGTH; i++) {
    rtn += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  rtn = rtn + new Date().valueOf();
  return rtn.slice(0, 8);
};

export { generateId };
