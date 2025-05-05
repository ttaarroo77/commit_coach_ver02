import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function MyPage() {
  return (
    <div className="flex h-screen bg-[#fafbfc]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 overflow-auto items-center justify-center">
          <div className="w-full max-w-2xl mx-auto">
            <h1 className="mb-8 text-3xl font-bold text-center">マイページ</h1>
            <Card className="rounded-2xl shadow-lg p-10 bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-semibold">アカウント情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400">＋</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute left-1/2 -translate-x-1/2 bottom-0 h-9 w-9 rounded-full p-0 border-2 border-white shadow-md bg-white"
                    >
                      +
                    </Button>
                  </div>
                  <div className="w-full max-w-md mx-auto space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">アカウント名</Label>
                      <Input id="name" defaultValue="山田 太郎" className="border-gray-300 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">メールアドレス</Label>
                      <Input id="email" type="email" defaultValue="yamada@example.com" className="border-gray-300 rounded-lg" />
                      <p className="text-xs text-gray-500">メールアドレスの変更には確認が必要です</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">生年月日</Label>
                      <Input id="birthdate" type="date" defaultValue="1990-05-15" className="border-gray-300 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">パスワード変更</Label>
                      <div className="grid gap-2">
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="現在のパスワード"
                          className="border-gray-300 rounded-lg placeholder-gray-400"
                        />
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="新しいパスワード"
                          className="border-gray-300 rounded-lg placeholder-gray-400"
                        />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="新しいパスワード（確認）"
                          className="border-gray-300 rounded-lg placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-8">
                  <Button variant="outline" className="py-3 px-8 rounded-full text-base bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200">キャンセル</Button>
                  <Button className="bg-[#31A9B8] hover:bg-[#2a8f9c] py-3 px-8 rounded-full text-base text-white">変更を保存</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
