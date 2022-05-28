import jwt from 'jsonwebtoken';

export default function generateMagicLink(email: string): string {
  return jwt.sign({ email }, process.env.USER_TOKEN_SECRET as string, {
    expiresIn: '2day',
  });
}