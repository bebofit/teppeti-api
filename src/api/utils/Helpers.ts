import crypto from 'crypto';

class Helpers {
  // tslint:disable-next-line: typedef
  async generateToken(length = 64) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex') // convert to hexadecimal format
      .slice(0, length); // return required number of characters
  }
}

export default new Helpers();
