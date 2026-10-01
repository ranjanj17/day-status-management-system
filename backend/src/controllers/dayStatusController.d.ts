import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const getStatusByDate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getStatuses: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=dayStatusController.d.ts.map