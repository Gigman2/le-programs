
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'



const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const data = JSON.parse(req.body)
    if (data._id && typeof data._id === 'string') data._id = JSON.stringify(data._id)
    return res.status(200).json({ message: 'created Successfully', data })
  } catch (error) {
    return res.status(400).json({ error: error })
  }
}



export default handler;