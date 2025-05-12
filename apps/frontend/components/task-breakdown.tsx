/*
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from 'lucide-react'

export function TaskBreakdown() {
  const [purpose, setPurpose] = useState("")
  const [goal, setGoal] = useState("")
  const [constraints, setConstraints] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    if (!purpose.trim()) return

    setIsLoading(true)
    
    // 実際の実装ではここでAIからの応答を取得します
    setTimeout(() => {
      setResult(`
# 「${purpose}」のタスク分解

## 優先順位付きロードマップ

### 1. 準備フェーズ
- [ ] 必要な情報の収集
- [ ] リソースの確認
- [ ] 初期計画の立案

### 2. 実行フェーズ
- [ ] タスクA：基本設計
- [ ] タスクB：詳細設計
- [ ] タスクC：実装

### 3. 検証フェーズ
- [ ] テスト計画の作成
- [ ] テストの実施
- [ ] フィードバックの収集

## 想定される障害と対処法
1. **時間の制約**: ${constraints}に対して、優先順位を明確にし、必要に応じて範囲を調整
2. **リソースの不足**: 外部リソースの活用や代替手段の検討
3. **技術的な�������題**: 事前に専門家に相談し、リスクを軽減

## 目標達成のためのアドバイス
- 定期的な進捗確認を行い、計画の調整を行う
- 小さな成功を積み重ねることでモチベーションを維持する
- 困難に直面した場合は早めに支援を求める

このロードマップに従って進めることで、「${goal}」という目標に効率的に到達できるでしょう。
      `)
      setIsLoading(false)
    }, 1500)
  }

  const resetForm = () => {
    setPurpose("")
    setGoal("")
    setConstraints("")
    setResult(null)
  }

  return (
    <div className="flex h-full flex-col rounded-lg border bg-white">
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">タスク分解プロンプト</h2>
          <p className="text-sm text-gray-500">タスクを小さなステップに分解し、実行計画を立てます</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">目的</Label>
            <Textarea
              id="purpose"
              placeholder="達成したいことは何ですか？"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">目標値</Label>
            <Input
              id="goal"
              placeholder="具体的な目標値を設定してください"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="constraints">制約</Label>
            <Textarea
              id="constraints"
              placeholder="時間、予算、リソースなどの制約条件"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
          <Button
            className="w-full bg-[#31A9B8] hover:bg-[#2a8f9c]"
            onClick={handleSubmit}
            disabled={isLoading || !purpose.trim()}
          >
            {isLoading ? "処理中..." : "タスクを分解する"}
          </Button>
          
          {result && (
            <div className="mt-4">
              <Card className="overflow-auto">
                <CardContent className="p-4">
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br>') }} />
                  </div>
                </CardContent>
              </Card>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetForm}>
                新しいタスクを分解
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
*/
