"use client";

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export default function MyPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ヘッダーはコメントアウト - サイドバーのみを使用
        <header className="border-b px-6 py-3">
          <h1 className="text-lg font-medium">マイページ</h1>
        </header>
        */}
        <main className="flex flex-1 overflow-auto p-6">
          <div className="w-full max-w-4xl">
            <h1 className="mb-6 text-2xl font-bold">マイページ</h1>
            <Card className="border border-gray-200 rounded-lg shadow-sm">
              <CardHeader className="border-b bg-white">
                <CardTitle>アカウント情報</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-6">
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full bg-gray-200"></div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-0 right-0 h-6 w-6 rounded-full p-0 bg-white border-gray-200"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="name">アカウント名</Label>
                        <Input id="name" defaultValue="山田 太郎" className="border-gray-200" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input id="email" type="email" defaultValue="yamada@example.com" className="border-gray-200" />
                        <p className="text-xs text-gray-500">メールアドレスの変更には確認が必要です</p>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="birthdate">生年月日</Label>
                        <Input id="birthdate" type="date" defaultValue="1990-05-15" className="border-gray-200" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="password">パスワード変更</Label>
                    <Input id="current-password" type="password" placeholder="現在のパスワード" className="border-gray-200" />
                    <Input id="new-password" type="password" placeholder="新しいパスワード" className="mt-2 border-gray-200" />
                    <Input id="confirm-password" type="password" placeholder="新しいパスワード（確認）" className="mt-2 border-gray-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" className="border-gray-200">キャンセル</Button>
              <Button className="bg-[#31A9B8] hover:bg-[#2a8f9c] text-white">変更を保存</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
