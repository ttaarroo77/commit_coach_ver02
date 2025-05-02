import { Sidebar } from "@/components/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 overflow-auto p-6">
          <div className="w-full max-w-4xl">
            <h1 className="mb-6 text-2xl font-bold">設定</h1>
            <Tabs defaultValue="ai-coach">
              <TabsList className="mb-4">
                <TabsTrigger value="ai-coach">AIコーチ設定</TabsTrigger>
              </TabsList>
              <TabsContent value="ai-coach">
                <Card>
                  <CardHeader>
                    <CardTitle>AIコーチ設定</CardTitle>
                    <CardDescription>AIコーチの人格や知識をカスタマイズします</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="mb-2 font-medium">プロンプト設定</h3>
                        <Textarea
                          className="min-h-[300px]"
                          placeholder="AIコーチのプロンプトをカスタマイズ"
                          defaultValue={`# AIコーチの人格設定

## 基本性格
- プロフェッショナルで信頼感のあるコーチ
- ユーザーの目標達成を最優先に考える
- 適度な厳しさと励ましのバランスを持つ

## 話し方の特徴
- 簡潔で明確な指示
- 具体的な例を用いた説明
- 時には穏やかに、時には厳しく

## 知識ベース
- タスク管理の専門知識
- 生産性向上テクニック
- モチベーション維持の心理学

## 対応スタイル
- タスクの遅れには適度な厳しさで指摘`}
                        />
                      </div>
                      <div>
                        <h3 className="mb-2 font-medium">プレビュー</h3>
                        <div className="rounded-lg border p-4">
                          <div className="mb-4 flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#31A9B8] text-white">
                              AI
                            </div>
                            <div className="rounded-lg bg-gray-100 p-3">
                              <p className="text-sm">何かお手伝いできることはありますか？</p>
                              <p className="mt-1 text-xs text-gray-500">10:30</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch id="notifications" />
                            <Label htmlFor="notifications">リマインダー通知</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="strict-mode" />
                            <Label htmlFor="strict-mode">厳格モード（より厳しい指摘）</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="auto-suggestions" />
                            <Label htmlFor="auto-suggestions">自動タスク提案</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#31A9B8] hover:bg-[#2a8f9c]">保存</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
