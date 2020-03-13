import { IMiddleware } from '../Interfaces/IMiddleware';
import UnauthorizedException from '../exception/UnauthorizedException';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

class IsAuthenticated implements IMiddleware {
  async handle(request: any, response: any, next: any): Promise<any> {
    console.log('AUTH', request.headers);

    const token = request.headers['authorization'].replace('Bearer', '').trim();
    try {
      const publicKey = await fs.readFile(
        path.join(__dirname, '../keys/jwtRS256.key.pub')
      );
      const decoded = await jwt.verify(token, publicKey);
      request.user = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('Wrong Credentials');
    }
  }
}

export default new IsAuthenticated().handle;
