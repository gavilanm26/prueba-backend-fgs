import { registerAs } from '@nestjs/config';
import { Algorithm } from 'jsonwebtoken';

export default registerAs('jwt', () => {
    const privateKeyBase64: string =
        process.env.JWT_PRIVATE_KEY ?? '';
    const publicKeyBase64: string =
        process.env.JWT_PUBLIC_KEY ?? '';

    return {
        privateKey: privateKeyBase64
            ? Buffer.from(privateKeyBase64, 'base64').toString('utf8')
            : 'secret',
        publicKey: publicKeyBase64
            ? Buffer.from(publicKeyBase64, 'base64').toString('utf8')
            : 'public',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
        algorithm: 'RS256' as Algorithm,
    };
});
