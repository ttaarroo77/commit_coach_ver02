"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-8 py-6 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#31A9B8] text-white font-bold text-xl">C</div>
          <span className="text-xl font-semibold">コミットコーチ</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-700 hover:underline font-medium">ログイン</Link>
          <Link href="/register">
            <Button className="bg-[#31A9B8] hover:bg-[#2691a1]">新規登録</Button>
          </Link>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-between px-8 py-16 gap-8">
        <div className="max-w-xl">
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-semibold">先延ばし撃退ツール</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            AIコーチングで<br />タスク管理を<br />次のレベルへ
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            GitHubリポジトリをTrello風カンバンで可視化し、AIコーチング機能でタスクコミットを支援する生産性向上ツール。
          </p>
          <Link href="/register">
            <Button className="bg-[#31A9B8] hover:bg-[#2691a1] text-base px-8 py-4">無料で始める</Button>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative bg-[#f1f5f9] rounded-2xl p-8 min-w-[340px] min-h-[180px] flex flex-col justify-end shadow-md">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="bg-[#31A9B8] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">AI</div>
            </div>
            <div className="absolute bottom-4 right-4">
              <div className="bg-white rounded-xl shadow px-4 py-3 text-sm text-gray-700">
                「今日のタスクは進んでいますか？」<br />
                <span className="text-xs text-gray-400">AIコーチがあなたをサポート</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="bg-[#f1f5f9] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">先延ばしを撃退する3つの機能</h2>
          <p className="text-center text-gray-500 mb-12">コミットコーチは、あなたの生産性を最大化するための強力な機能を提供します</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">タスク可視化</h3>
              <p className="text-gray-500 text-sm">Trello風カンバンボードでタスクを直感的に管理。ドラッグ＆ドロップで簡単に進捗状況を更新できます。</p>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">AIコーチング</h3>
              <p className="text-gray-500 text-sm">AIがあなたの進捗を分析し、モチベーションを維持するためのアドバイスを提供。特に壁にぶつかったときに頼りになります。</p>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">コミット管理</h3>
              <p className="text-gray-500 text-sm">日次コミットメントで目標達成をサポート。タスク完了率を向上させ、プロジェクト期間を短縮します。</p>
            </Card>
          </div>
        </div>
      </section>

      {/* AIコーチ紹介セクション */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 bg-[#f1f5f9] rounded-2xl p-8 min-h-[220px] flex flex-col gap-4 shadow-md relative">
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="bg-[#31A9B8] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">AI</div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <div className="bg-white rounded-xl shadow px-4 py-3 text-sm text-gray-700 w-fit">「まだ終わってないんですか？締め切りまであと3時間ですよ！」</div>
              <div className="bg-white rounded-xl shadow px-4 py-3 text-sm text-gray-700 w-fit">「あと少しで終わります…」</div>
              <div className="bg-white rounded-xl shadow px-4 py-3 text-sm text-gray-700 w-fit">「頑張ってください！完了したら次のタスクの分析を手伝いますよ！」</div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">先延ばしを徹底的に撃退するAIコーチ</h2>
            <p className="text-gray-600 mb-6">コミットコーチのAIは、あなたの状況に合わせて叱咤と励ましを織り交ぜます。時には厳しく、時には優しく、あなたのタスク完了をサポートします。</p>
            <ul className="space-y-2 text-gray-700">
              <li>◯ 細かなタスク分割と期限設定</li>
              <li>◯ キャラクターの切り替えによる多様な叱咤激励</li>
              <li>◯ タスク完了時の褒め言葉生成</li>
            </ul>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-6 text-center text-gray-400 text-sm border-t bg-white">
        © 2025 コミットコーチ - AIタスク管理アプリ
      </footer>
    </div>
  );
}