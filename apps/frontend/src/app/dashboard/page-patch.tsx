// このファイルには必要な修正部分のみを含めています
// 全ての<Droppable>コンポーネントにisDropDisabled={false}を追加する必要があります

// 1. 既存の<Droppable>タグを探します:
// <Droppable droppableId={group.id} type="task">

// 2. 以下のように修正します:
// <Droppable droppableId={group.id} type="task" isDropDisabled={false}>

// 3. 具体的には以下の場所を修正します:
// - グループタスクの<Droppable>（複数箇所、各タスクグループごと）
// - 「今日のタスク」の<Droppable>
// - 「未計画タスク」の<Droppable>

// Draggableのコンテキストが0か1かの問題は、クライアントサイドレンダリングに関連しています
// useEffectとisMountedを使用することで解決できます
