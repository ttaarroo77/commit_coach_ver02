"use client";

import Link from "next/link"
import { CircleIcon } from "lucide-react"

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
          <Link href="/login">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-[#31A9B8] text-[#31A9B8] bg-white hover:bg-[#31A9B8] hover:text-white px-4 py-2"
            >
              ログイン
            </button>
          </Link>
          <Link href="/register">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-[#31A9B8] hover:bg-[#2691a1] text-white px-4 py-2">新規登録</button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="bg-[#f1f5f9] py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-24 px-6">
            {/* 左カラム */}
            <div className="flex flex-col justify-center max-w-xl mx-auto md:mx-0">
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-semibold mb-4">先延ばし撃退ツール</span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                AIコーチングで<br />タスク管理を<br />次のレベルへ
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                GitHubリポジトリをTrello風カンバンで可視化し、AIコーチング機能でタスクコミットを支援する生産性向上ツール。
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-[#31A9B8] hover:bg-[#2691a1] text-white text-base px-8 py-4">無料で始める</button>
                </Link>
              </div>
            </div>
            {/* 右カラム */}
            <div className="flex justify-center items-center w-full">
              <div className="relative bg-white rounded-2xl p-12 w-full max-w-md min-h-[260px] flex flex-col justify-end shadow-2xl border border-blue-100">
                <div className="absolute top-8 right-8 flex items-center gap-2">
                  <div className="bg-[#31A9B8] text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl shadow-lg">AI</div>
                </div>
                <div className="absolute bottom-8 right-8">
                  <div className="bg-blue-50 rounded-xl shadow px-8 py-6 text-lg text-gray-700 min-w-[240px]">
                    「今日のタスクは進んでいますか？」<br />
                    <span className="text-sm text-gray-400">AIコーチがあなたをサポート</span>
                  </div>
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
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col items-center text-center p-6">
                <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">タスク可視化</h3>
                <p className="text-gray-500 text-sm">Trello風カンバンボードでタスクを直感的に管理。ドラッグ＆ドロップで簡単に進捗状況を更新できます。</p>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col items-center text-center p-6">
                <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">AIコーチング</h3>
                <p className="text-gray-500 text-sm">AIがあなたの進捗を分析し、モチベーションを維持するためのアドバイスを提供。特に壁にぶつかったときに頼りになります。</p>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col items-center text-center p-6">
                <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">コミット管理</h3>
                <p className="text-gray-500 text-sm">日次コミットメントで目標達成をサポート。タスク完了率を向上させ、プロジェクト期間を短縮します。</p>
              </div>
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
                <div className="bg-gray-200 rounded-xl shadow px-4 py-3 text-sm text-gray-700 w-fit ml-auto">「あと少しで終わります...」</div>
                <div className="bg-white rounded-xl shadow px-4 py-3 text-sm text-gray-700 w-fit">「頑張ってください！完了したら次のタスクの分析を手伝いますよ！」</div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">先延ばしを徹底的に撃退するAIコーチ</h2>
              <p className="text-gray-600 mb-6">コミットコーチのAIは、あなたの状況に合わせて叱咤と励ましを織り交ぜます。時には厳しく、時には優しく、あなたのタスク完了をサポートします。</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <CircleIcon className="h-5 w-5 text-[#31A9B8]" aria-hidden="true" />
                  <span>細かなタスク分割と期限設定</span>
                </li>
                <li className="flex items-center gap-2">
                  <CircleIcon className="h-5 w-5 text-[#31A9B8]" aria-hidden="true" />
                  <span>キャラクターの切り替えによる多様な叱咤激励</span>
                </li>
                <li className="flex items-center gap-2">
                  <CircleIcon className="h-5 w-5 text-[#31A9B8]" aria-hidden="true" />
                  <span>タスク完了時の褒め言葉生成</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="py-6 text-center text-gray-400 text-sm border-t bg-white">
        © 2025 コミットコーチ - AIタスク管理アプリ
      </footer>
    </div>
  )
}
