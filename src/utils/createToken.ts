import jwt from 'jsonwebtoken';

const createToken = async(payload: any, secrete: string) => {
    
    const authToken = await jwt.sign(payload, secrete, { expiresIn: '7d' });

    return authToken
}

export default createToken