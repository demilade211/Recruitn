import jwt from "jsonwebtoken";


const createToken = async (payload: any) => {
  const secret = process.env.SECRETE;
  if (secret) {
    const authToken = await jwt.sign(payload, secret, {
      expiresIn: "7d",
    });
    return authToken;
  }
};

export default createToken;
