import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CircleIcon } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#31A9B8] text-white">C</div>
          <span className="text-lg font-semibold">コミットコーチ</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium">
            ログイン
          </Link>
          <Link href="/register">
            <Button className="bg-[#31A9B8] hover:bg-[#2a8f9c]">新規登録</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-800">
                  先延ばし撃退ツール
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  AIコーチングで
                  <br />
                  タスク管理を
                  <br />
                  次のレベルへ
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  GitHubリポジトリをTrello風カンバンで可視化し、AIコーチング機能でタスクコミットを支援する生産性向上ツール。
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button className="bg-[#31A9B8] hover:bg-[#2a8f9c]">無料で始める</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-[400px] overflow-hidden rounded-lg bg-gray-100 p-4">
                  <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#31A9B8] text-white">
                      AI
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 max-w-[250px] rounded-lg bg-white p-3 shadow-lg">
                    <p className="text-sm">「今日のタスクは進んでいますか？」</p>
                    <p className="text-xs text-gray-500">AIコーチがあなたをサポート</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">先延ばしを撃退する3つの機能</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                コミットコーチは、あなたの生産性を最大化するための強力な機能を提供します
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold">タスク可視化</h3>
                  <p className="text-sm text-gray-500">
                    Trello風カンバンボードでタスクを直感的に管理。ドラッグ＆ドロップで簡単に進捗状況を更新できます。
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold">AIコーチング</h3>
                  <p className="text-sm text-gray-500">
                    AIがあなたの進捗を分析し、モチベーションを維持するためのアドバイスを提供。特に壁にぶつかったときに頼りになります。
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold">コミット管理</h3>
                  <p className="text-sm text-gray-500">
                    日次コミットメントで目標達成をサポート。タスク完了率を向上させ、プロジェクト期間を短縮します。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-[500px] overflow-hidden rounded-lg bg-gray-100 p-4">
                  <div className="absolute left-8 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#31A9B8] text-white">
                    <span className="text-sm">AI</span>
                  </div>
                  <div className="absolute left-8 top-24 max-w-[300px] rounded-lg bg-white p-3 shadow-lg">
                    <p className="text-sm">「まだ終わってないんですか？締め切りまであと3時間ですよ！」</p>
                  </div>
                  <div className="absolute right-8 top-40 max-w-[200px] rounded-lg bg-gray-200 p-3 shadow-lg">
                    <p className="text-sm">「あと少しで終わります...」</p>
                  </div>
                  <div className="absolute left-8 top-56 max-w-[300px] rounded-lg bg-white p-3 shadow-lg">
                    <p className="text-sm">「頑張ってください！完了したら次のタスクの分析を手伝いしますよ！」</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  先延ばしを徹底的に
                  <br />
                  撃退するAIコーチ
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  コミットコーチのAIは、あなたの状況に合わせて叱咤と励ましを織り交ぜます。時には厳しく、時には優しく、あなたのタスク完了をサポートします。
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <CircleIcon className="h-5 w-5 text-[#31A9B8]" />
                    <span>細かなタスク分割と期限設定</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleIcon className="h-5 w-5 text-[#31A9B8]" />
                    <span>キャラクターの切り替えによる多様な叱咤激励</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleIcon className="h-5 w-5 text-[#31A9B8]" />
                    <span>タスク完了時の褒め言葉生成</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex h-16 items-center justify-center border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2025 コミットコーチ - AIタスク管理アプリ</p>
      </footer>
    </div>
  )
}
