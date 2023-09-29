
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from 'jsonwebtoken';
import { SECRET } from "../utils/constants";





export const authenticateUser = (handler: any) => (req: NextApiRequest,
    res: NextApiResponse<any>) => {

    // const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET



    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        // Verify the token using your secret key
        const user = jwt.verify(token, SECRET);


        // Proceed to the API route handler
        return handler(req, res);
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
        return;
    }
};


