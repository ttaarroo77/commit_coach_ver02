/**
 * js-cookie型定義
 * 代替手段として独自に型定義を提供
 */
declare module 'js-cookie' {
  interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  }

  interface CookiesStatic {
    /**
     * Cookieを取得する
     */
    get(name: string): string | undefined;
    
    /**
     * すべてのCookieを取得する
     */
    get(): { [key: string]: string };
    
    /**
     * Cookieを設定する
     */
    set(name: string, value: string, options?: CookieAttributes): string;
    
    /**
     * Cookieを削除する
     */
    remove(name: string, options?: CookieAttributes): void;
    
    /**
     * Cookieの属性を変更するユーティリティ
     */
    withAttributes(attributes: CookieAttributes): CookiesStatic;
    
    /**
     * Cookieの有効期限を変更するユーティリティ
     */
    withConverter(converter: {
      read: (value: string) => string;
      write: (value: string) => string;
    }): CookiesStatic;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
