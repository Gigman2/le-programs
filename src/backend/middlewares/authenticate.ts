
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from 'jsonwebtoken';

export const jwtSecret:string = `${process.env.JWT_SECRET}`;

//const jwt = require('jsonwebtoken');

export const authenticateUser = (handler: any) => (req: NextApiRequest,
    res: NextApiResponse<any>) => {
    const token = req.headers.authorization?.replace('Bearer ', ''); // Get the token from the request headers

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        // Verify the token using your secret key

        const user = jwt.verify(token, jwtSecret);
        console.log(user)


        // if(!user){

        //     res.status(201).json({ message: 'Unauthorized: No token provided' }); 
        // }

        // Attach user information to the request for later use
        // req.user = user;

        // Proceed to the API route handler
        return handler(req, res);
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
        return;
    }
};


// export const authenticateUser((req: NextApiRequest, res:NextApiResponse<any>) => {
//     // Access the authenticated user through req.user
//     // console.log('Authenticated User:', req.user);

//     // Your API logic here
//     res.status(200).json({ message: 'This is a protected API route.' });
// });