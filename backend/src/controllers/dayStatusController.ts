import { Request, Response } from 'express';
import { z } from 'zod';
import * as dayStatusService from '../services/dayStatusService';
import { AuthRequest } from '../middleware/authMiddleware';

const dateParamSchema = z.object({
  date: z.string(),
});

const querySchema = z.object({
  year: z.string().regex(/^\d{4}$/).transform(Number),
  month: z.string().regex(/^\d{1,2}$/).transform(Number).optional(),
});

const updateSchema = z.object({
  status: z.string().min(1, 'Status cannot be empty'),
});

export const getStatusByDate = async (req: Request, res: Response) => {
  try {
    const parsedParams = dateParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid date parameter' } });
    }

    const result = await dayStatusService.getStatusByDate(parsedParams.data.date);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('getStatusByDate error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' } });
  }
};

export const getStatuses = async (req: Request, res: Response) => {
  try {
    const parsedQuery = querySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid query parameters' } });
    }

    const { year, month } = parsedQuery.data;
    const result = await dayStatusService.getStatuses(year, month);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('getStatuses error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' } });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
    }

    const parsedParams = dateParamSchema.safeParse(req.params);
    const parsedBody = updateSchema.safeParse(req.body);

    if (!parsedParams.success || !parsedBody.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } });
    }

    const { date } = parsedParams.data;
    const { status } = parsedBody.data;

    const result = await dayStatusService.updateStatus(date, status, req.user.id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('updateStatus error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' } });
  }
};
