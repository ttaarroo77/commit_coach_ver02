import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { userProfileSchema, UserProfile } from '../models/userProfile';
import { ApiError } from '../middleware/errorHandler';
import { cache } from '../config/cache';

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const cacheKey = `userProfile:${userId}`;

    // キャッシュからプロファイルを取得
    const cachedProfile = await cache.get<UserProfile>(cacheKey);
    if (cachedProfile) {
      return res.json(cachedProfile);
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      throw new ApiError(404, 'プロファイルが見つかりません');
    }

    // キャッシュに保存
    await cache.set(cacheKey, data, 3600); // 1時間キャッシュ

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const profileData = userProfileSchema.parse({
      ...req.body,
      userId,
      updatedAt: new Date(),
    });

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profileData)
      .select()
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    // キャッシュを更新
    const cacheKey = `userProfile:${userId}`;
    await cache.set(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;

    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('userId', userId);

    if (error) {
      throw new ApiError(400, error.message);
    }

    // キャッシュを削除
    const cacheKey = `userProfile:${userId}`;
    await cache.del(cacheKey);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 