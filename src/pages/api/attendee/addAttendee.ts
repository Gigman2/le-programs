import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {

    let data = req.body
    data = JSON.parse(data)
    return res.status(200).json({ message: 'created Successfully', data, })
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error })
  }

}

export default handler;