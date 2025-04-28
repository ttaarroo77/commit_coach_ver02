'use client';

/**
 * ローカルストレージにデータを保存する
 * @param key ストレージキー
 * @param data 保存するデータ
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    if (typeof window === 'undefined') return;
    
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving data to localStorage (key: ${key}):`, error);
  }
}

/**
 * ローカルストレージからデータを取得する
 * @param key ストレージキー
 * @param defaultValue デフォルト値（データが存在しない場合に返す）
 * @returns 取得したデータまたはデフォルト値
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue;
    
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error(`Error retrieving data from localStorage (key: ${key}):`, error);
    return defaultValue;
  }
}

/**
 * ローカルストレージからデータを削除する
 * @param key ストレージキー
 */
export function removeFromLocalStorage(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from localStorage (key: ${key}):`, error);
  }
}

/**
 * セッションストレージにデータを保存する
 * @param key ストレージキー
 * @param data 保存するデータ
 */
export function saveToSessionStorage<T>(key: string, data: T): void {
  try {
    if (typeof window === 'undefined') return;
    
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving data to sessionStorage (key: ${key}):`, error);
  }
}

/**
 * セッションストレージからデータを取得する
 * @param key ストレージキー
 * @param defaultValue デフォルト値（データが存在しない場合に返す）
 * @returns 取得したデータまたはデフォルト値
 */
export function getFromSessionStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue;
    
    const serializedData = sessionStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error(`Error retrieving data from sessionStorage (key: ${key}):`, error);
    return defaultValue;
  }
}

/**
 * セッションストレージからデータを削除する
 * @param key ストレージキー
 */
export function removeFromSessionStorage(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from sessionStorage (key: ${key}):`, error);
  }
}
