'use client';

// 音声認識の結果型定義
interface SpeechRecognitionResult {
  text: string;
  isFinal: boolean;
}

// 音声認識のコールバック型定義
type SpeechRecognitionCallback = (result: SpeechRecognitionResult) => void;

// SpeechRecognitionのブラウザ互換性対応
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

// グローバルに型を宣言してエラーを回避
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/**
 * 音声認識サービスクラス
 * Web Speech APIを使用して音声入力を処理する
 */
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private callback: SpeechRecognitionCallback | null = null;
  private errorCallback: ((error: string) => void) | null = null;

  constructor() {
    // ブラウザ環境でのみ初期化
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = (
        window.SpeechRecognition ||
        window.webkitSpeechRecognition
      ) as SpeechRecognitionConstructor;

      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.configureRecognition();
      }
    }
  }

  /**
   * 音声認識の設定
   */
  private configureRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'ja-JP'; // 日本語に設定

    // 結果イベントのハンドラ
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!this.callback) return;

      const result = event.results[event.resultIndex];
      const text = result[0].transcript;
      const isFinal = result.isFinal;

      this.callback({ text, isFinal });
    };

    // エラーイベントのハンドラ
    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (this.errorCallback) {
        this.errorCallback(event.error);
      }
      console.error('Speech recognition error:', event.error, event.message);
    };

    // 終了イベントのハンドラ
    this.recognition.onend = () => {
      if (this.isListening) {
        // 自動的に終了した場合は再開
        this.recognition?.start();
      }
    };
  }

  /**
   * 音声認識の開始
   * @param callback 認識結果を受け取るコールバック関数
   * @param errorCallback エラー発生時のコールバック関数
   * @returns 音声認識がサポートされているかどうか
   */
  public start(
    callback: SpeechRecognitionCallback,
    errorCallback?: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      console.error('Speech recognition is not supported in this browser');
      return false;
    }

    this.callback = callback;
    if (errorCallback) {
      this.errorCallback = errorCallback;
    }

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  /**
   * 音声認識の停止
   */
  public stop(): void {
    if (!this.recognition) return;

    this.isListening = false;
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  }

  /**
   * 音声認識がサポートされているかどうかを確認
   * @returns サポート状況
   */
  public isSupported(): boolean {
    return !!this.recognition;
  }

  /**
   * 現在音声認識中かどうかを確認
   * @returns 認識状態
   */
  public isRecording(): boolean {
    return this.isListening;
  }
}

// シングルトンインスタンスを作成
let speechRecognitionInstance: SpeechRecognitionService | null = null;

/**
 * 音声認識サービスのインスタンスを取得
 * @returns SpeechRecognitionServiceのインスタンス
 */
export function getSpeechRecognition(): SpeechRecognitionService {
  if (!speechRecognitionInstance) {
    speechRecognitionInstance = new SpeechRecognitionService();
  }
  return speechRecognitionInstance;
}
