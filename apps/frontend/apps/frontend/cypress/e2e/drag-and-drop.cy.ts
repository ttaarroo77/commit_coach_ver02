describe('ドラッグ＆ドロップ機能', () => {
  beforeEach(() => {
    cy.visit('/projects/1') // プロジェクト詳細ページに移動
  })

  it('タスクを別のカラムにドラッグ＆ドロップできること', () => {
    // タスクをドラッグ
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 600, clientY: 0 })
      .trigger('mouseup')

    // タスクが移動したことを確認
    cy.get('[data-testid="column-in-progress"]')
      .find('[data-testid="task-1"]')
      .should('exist')
  })

  it('タスクの順序を変更できること', () => {
    // 同じカラム内でタスクを移動
    cy.get('[data-testid="task-2"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientY: -100 })
      .trigger('mouseup')

    // タスクの順序が変更されたことを確認
    cy.get('[data-testid="column-todo"]')
      .find('[data-testid="task-list"]')
      .children()
      .first()
      .should('have.attr', 'data-testid', 'task-2')
  })
})