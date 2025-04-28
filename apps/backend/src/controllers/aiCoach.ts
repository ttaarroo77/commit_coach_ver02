import { Request, Response } from 'express';
import { aiCoachService } from '../services/aiCoach';
import { ApiError } from '../utils/error';

export const chat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const response = await aiCoachService.chat(message);
    res.json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}; 