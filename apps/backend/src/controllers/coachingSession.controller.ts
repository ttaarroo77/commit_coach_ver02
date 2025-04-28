import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { coachingSessionSchema, CoachingSession } from '../models/coachingSession';
import { ApiError } from '../middleware/errorHandler';
import { cache } from '../config/cache';

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

export const createCoachingSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionData = coachingSessionSchema.parse({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const { data, error } = await supabase
      .from('coaching_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getCoachingSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.sessionId;
    const cacheKey = `coachingSession:${sessionId}`;

    // キャッシュからセッションを取得
    const cachedSession = await cache.get<CoachingSession>(cacheKey);
    if (cachedSession) {
      return res.json(cachedSession);
    }

    const { data, error } = await supabase
      .from('coaching_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      throw new ApiError(404, 'セッションが見つかりません');
    }

    // キャッシュに保存
    await cache.set(cacheKey, data, 3600); // 1時間キャッシュ

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateCoachingSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.sessionId;
    const sessionData = coachingSessionSchema.parse({
      ...req.body,
      updatedAt: new Date(),
    });

    const { data, error } = await supabase
      .from('coaching_sessions')
      .update(sessionData)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    // キャッシュを更新
    const cacheKey = `coachingSession:${sessionId}`;
    await cache.set(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteCoachingSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.sessionId;

    const { error } = await supabase
      .from('coaching_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      throw new ApiError(400, error.message);
    }

    // キャッシュを削除
    const cacheKey = `coachingSession:${sessionId}`;
    await cache.del(cacheKey);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getClientSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientId = req.params.clientId;
    const cacheKey = `clientSessions:${clientId}`;

    // キャッシュからセッションを取得
    const cachedSessions = await cache.get<CoachingSession[]>(cacheKey);
    if (cachedSessions) {
      return res.json(cachedSessions);
    }

    const { data, error } = await supabase
      .from('coaching_sessions')
      .select('*')
      .eq('clientId', clientId)
      .order('startTime', { ascending: true });

    if (error) {
      throw new ApiError(400, error.message);
    }

    // キャッシュに保存
    await cache.set(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getCoachSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coachId = req.params.coachId;
    const cacheKey = `coachSessions:${coachId}`;

    // キャッシュからセッションを取得
    const cachedSessions = await cache.get<CoachingSession[]>(cacheKey);
    if (cachedSessions) {
      return res.json(cachedSessions);
    }

    const { data, error } = await supabase
      .from('coaching_sessions')
      .select('*')
      .eq('coachId', coachId)
      .order('startTime', { ascending: true });

    if (error) {
      throw new ApiError(400, error.message);
    }

    // キャッシュに保存
    await cache.set(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    next(error);
  }
};