export function AIChat() {
   return (
      <div className="flex flex-col h-full">
         {/* チャットメッセージエリア */}
         <div className="flex-1 overflow-auto p-3 space-y-4">
            {/* システムメッセージ */}
            <div className="flex items-start gap-2">
               <div className="w-8 h-8 rounded-full bg-[#31A9B8] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">AI</span>
               </div>
               <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                     <p className="text-sm text-gray-700">
                        こんにちは！今日のタスクの進捗はどうですか？何かお手伝いできることはありますか？
                     </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">10:00</p>
               </div>
            </div>

            {/* ユーザーメッセージ */}
            <div className="flex items-start gap-2 justify-end">
               <div className="flex-1">
                  <div className="bg-[#31A9B8] rounded-lg p-3">
                     <p className="text-sm text-white">
                        今日のタスクを確認したいです。
                     </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">10:01</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-gray-500" />
               </div>
            </div>
         </div>

         {/* 入力エリア */}
         <div className="border-t border-gray-100 p-3">
            <div className="flex items-center gap-2">
               <div className="flex-1 relative">
                  <input
                     type="text"
                     placeholder="メッセージを入力..."
                     className="w-full px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-[#31A9B8] focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                     <Paperclip className="h-4 w-4" />
                  </button>
               </div>
               <button className="p-2 rounded-full bg-[#31A9B8] text-white hover:bg-[#2A95A2] transition-colors">
                  <Send className="h-4 w-4" />
               </button>
            </div>
         </div>
      </div>
   );
} 