describe('ダッシュボード画面', () => {
  beforeEach(() => {
    // テスト前の共通設定
    cy.login() // カスタムコマンドでログイン
    cy.mockTaskData() // タスクデータをモック
  })

  it('ダッシュボードが正しく表示される', () => {
    // ダッシュボードへのアクセス確認
    cy.url().should('include', '/dashboard')
    
    // ヘッダーが表示されていることを確認
    cy.findByText('ダッシュボード').should('exist')
    cy.findByText('現在時刻').should('exist')
    
    // タスクグループが表示されていることを確認
    cy.findByText('今日のタスク').should('exist')
    cy.findByText('明日の予定').should('exist')
    
    // タスクカードの内容確認
    cy.findByText('ミーティング資料の準備').should('exist')
    cy.findByText('週報提出').should('exist')
    
    // 時刻表示が正しいフォーマットであることを確認
    cy.get('[data-testid="clock-display"]').should('match', /^\d{2}:\d{2}$/)
  })

  it('タスクの完了状態を切り替えられる', () => {
    // 未完了タスクをクリックして完了状態に変更
    cy.findByText('ミーティング資料の準備')
      .parent()
      .find('input[type="checkbox"]')
      .click()
      .should('be.checked')
    
    // 既に完了しているタスクをクリックして未完了状態に変更
    cy.findByText('週報提出')
      .parent()
      .find('input[type="checkbox"]')
      .click()
      .should('not.be.checked')
  })

  it('タスクグループの展開/折りたたみができる', () => {
    // 初期状態で展開されているグループを確認
    cy.findByText('今日のタスク')
      .parent()
      .parent()
      .find('.task-item')
      .should('be.visible')
    
    // グループを折りたたむ
    cy.findByText('今日のタスク')
      .parent()
      .find('button')
      .click()
    
    // グループが折りたたまれたことを確認
    cy.findByText('今日のタスク')
      .parent()
      .parent()
      .find('.task-item')
      .should('not.be.visible')
    
    // 再度グループを展開
    cy.findByText('今日のタスク')
      .parent()
      .find('button')
      .click()
    
    // グループが展開されたことを確認
    cy.findByText('今日のタスク')
      .parent()
      .parent()
      .find('.task-item')
      .should('be.visible')
  })

  it('タスクカードの詳細を表示できる', () => {
    // タスクカードをクリックして詳細モーダルを表示
    cy.findByText('ミーティング資料の準備').click()
    
    // モーダルが表示されていることを確認
    cy.findByRole('dialog').should('be.visible')
    
    // モーダル内の情報を確認
    cy.findByText('優先度: 高').should('exist')
    cy.findByText('13:00 - 14:30').should('exist')
    
    // モーダルを閉じる
    cy.findByRole('button', { name: /閉じる/ }).click()
    
    // モーダルが閉じられたことを確認
    cy.findByRole('dialog').should('not.exist')
  })

  it('新しいタスクを追加できる', () => {
    // 「タスクを追加」ボタンをクリック
    cy.findByText('今日のタスク')
      .parent()
      .parent()
      .find('button')
      .contains('タスクを追加')
      .click()
    
    // 入力フィールドが表示されることを確認
    cy.findByPlaceholderText('新しいタスクを入力...').should('exist')
    
    // 新しいタスク名を入力
    cy.findByPlaceholderText('新しいタスクを入力...')
      .type('新規テストタスク{enter}')
    
    // 新しいタスクが追加されたことを確認
    cy.findByText('新規テストタスク').should('exist')
  })

  it('カレンダーが正しく表示される', () => {
    // ミニカレンダーの存在を確認
    cy.findByTestId('mini-calendar').should('exist')
    
    // 現在の月と年が表示されていることを確認
    const today = new Date()
    const monthYear = today.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
    cy.findByText(monthYear).should('exist')
    
    // カレンダー内の日付セルが存在することを確認
    cy.findByTestId('mini-calendar')
      .find('.calendar-day')
      .should('have.length.at.least', 28)
    
    // 今日の日付がハイライトされていることを確認
    const day = today.getDate().toString()
    cy.findByTestId('mini-calendar')
      .find('.calendar-day.today')
      .should('contain', day)
  })

  it('レスポンシブデザインが機能する', () => {
    // モバイルビューポートにリサイズ
    cy.viewport('iphone-x')
    
    // モバイルメニューボタンが表示されることを確認
    cy.findByLabelText('メニューを開く').should('be.visible').click()
    
    // メニューが開くことを確認
    cy.findByRole('navigation').should('be.visible')
    
    // メニュー内の項目を確認
    cy.findByText('プロジェクト').should('exist')
    cy.findByText('タスク管理').should('exist')
    
    // メニューを閉じる
    cy.findByLabelText('メニューを閉じる').click()
    
    // デスクトップビューポートに戻す
    cy.viewport(1280, 720)
  })
})
