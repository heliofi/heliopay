export class JWTService {
  static decodeToken(token: string): {
    rate: number;
    exp: number;
    iat: number;
  } {
    return JSON.parse(Buffer.from(token?.split('.')[1], 'base64').toString());
  }
}
