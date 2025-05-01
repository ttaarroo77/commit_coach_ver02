import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function MyPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 overflow-auto p-6">
          <div className="w-full max-w-4xl">
            <h1 className="mb-6 text-2xl font-bold">マイページ</h1>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>アカウント情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-gray-200"></div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">アカウント名</Label>
                        <Input id="name" defaultValue="山田 太郎" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input id="email" type="email" defaultValue="yamada@example.com" />
                        <p className="text-xs text-gray-500">メールアドレスの変更には確認が必要です</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthdate">生年月日</Label>
                        <Input id="birthdate" type="date" defaultValue="1990-05-15" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">パスワード変更</Label>
                        <div className="grid gap-2">
                          <Input id="current-password" type="password" placeholder="現在のパスワード" />
                          <Input id="new-password" type="password" placeholder="新しいパスワード" />
                          <Input id="confirm-password" type="password" placeholder="新しいパスワード（確認）" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">キャンセル</Button>
                <Button className="bg-[#31A9B8] hover:bg-[#2a8f9c]">変更を保存</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
