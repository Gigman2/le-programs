import { NextApiResponse } from "next"

const success = (res: NextApiResponse, message: String) => res.status(200).json({ statusCode: 200, message })

const successWithData = (res: NextApiResponse, data: unknown, message?: String, statusCode: number = 200) => {
    res.status(statusCode).json({ statusCode, message, data })
}



const error = (res: NextApiResponse, message: string) => {
    return res.status(400).json({ statusCode: 400, error: message })
}

const unauthorized = (res: NextApiResponse) => res.status(401).json({ statusCode: 401, error: 'Unauthorized' })

const forbidden = (res: NextApiResponse) => res.status(403).json({ statusCode: 403, error: 'forbidden' })

const notFound = (res: NextApiResponse) => res.status(404).json({ statusCode: 404, error: 'Not found' })

const methodNotAllowed = (res: NextApiResponse) =>
    res.status(405).json({ statusCode: 405, error: 'Method not allowed' })

const unprocessableEntity = (res: NextApiResponse, error: string = 'Unprocessable Entity') =>
    res.status(422).json({ statusCode: 422, error })

const serverError = (res: NextApiResponse, error: string = 'Unexpected server error') =>
    res.status(500).json({ statusCode: 500, error })


const responses = {
    success,
    successWithData,
    error,
    unauthorized,
    forbidden,
    notFound,
    methodNotAllowed,
    unprocessableEntity,
    serverError
}

export default responses