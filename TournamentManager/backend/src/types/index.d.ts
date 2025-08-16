import { TokenPayload } from "../auth/auth.types"
import { NextFunction, Request, Response } from "express"

export {}

declare global {
    namespace Express {
        export interface Request {
            user?: TokenPayload
        }
    }

    // eslint-disable-next-line no-unused-vars
    export type ControllerFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>
}
