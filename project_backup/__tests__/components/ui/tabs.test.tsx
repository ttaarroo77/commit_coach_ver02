import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

describe('Tabs', () => {
  const TestTabs = () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">タブ1</TabsTrigger>
        <TabsTrigger value="tab2">タブ2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">タブ1のコンテンツ</TabsContent>
      <TabsContent value="tab2">タブ2のコンテンツ</TabsContent>
    </Tabs>
  )

  it('正しくレンダリングされること', () => {
    render(<TestTabs />)

    expect(screen.getByText('タブ1')).toBeInTheDocument()
    expect(screen.getByText('タブ2')).toBeInTheDocument()
    expect(screen.getByText('タブ1のコンテンツ')).toBeInTheDocument()
    expect(screen.queryByText('タブ2のコンテンツ')).not.toBeVisible()
  })

  it('タブをクリックすると対応するコンテンツが表示されること', () => {
    render(<TestTabs />)

    // タブ2をクリック
    const tab2 = screen.getByText('タブ2')
    fireEvent.click(tab2)

    // タブ2のコンテンツが表示され、タブ1のコンテンツが非表示になることを確認
    expect(screen.getByText('タブ2のコンテンツ')).toBeVisible()
    expect(screen.queryByText('タブ1のコンテンツ')).not.toBeVisible()
  })

  it('アクティブなタブが正しいスタイルを持つこと', () => {
    render(<TestTabs />)

    const tab1 = screen.getByText('タブ1')
    const tab2 = screen.getByText('タブ2')

    // 初期状態ではタブ1がアクティブ
    expect(tab1).toHaveAttribute('data-state', 'active')
    expect(tab2).toHaveAttribute('data-state', 'inactive')

    // タブ2をクリック
    fireEvent.click(tab2)

    // タブ2がアクティブになり、タブ1が非アクティブになることを確認
    expect(tab2).toHaveAttribute('data-state', 'active')
    expect(tab1).toHaveAttribute('data-state', 'inactive')
  })
}) 