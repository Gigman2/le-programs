import External from "@backend/controllers/External";
import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next'

const handler: NextApiHandler = async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        switch (req.method) {
            case 'POST':
                switch (req.headers?.action) {
                    case 'user-to-group':
                        return External.addUserToGroup(req, res)
                    // case 'aggregator':
                    //     return External.createUser(req, res);
                    default:
                        return External.createUser(req, res);
                }
            case 'GET':

        }
    } catch (error) {
        return res.status(400).json({error: error})
    }
}


export default handler;