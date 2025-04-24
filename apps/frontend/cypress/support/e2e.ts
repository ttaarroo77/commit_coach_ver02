// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

import '@testing-library/cypress/add-commands'

// モック認証関数
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password') => {
  // 実際のアプリケーションでの認証方法に合わせて調整
  // ここではモックの認証を行う
  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200,
    body: {
      user: {
        id: '1',
        email,
        name: 'Test User',
      },
      token: 'mock-jwt-token',
    },
  }).as('loginRequest')

  // ログインページを訪問してログインフォームを送信
  cy.visit('/login')
  cy.findByLabelText(/メールアドレス/).type(email)
  cy.findByLabelText(/パスワード/).type(password)
  cy.findByRole('button', { name: /ログイン/ }).click()
  cy.wait('@loginRequest')
  
  // JWT をクッキーに設定
  cy.setCookie('auth-token', 'mock-jwt-token')
  
  // ダッシュボードにリダイレクトされることを確認
  cy.url().should('include', '/dashboard')
})

// モックタスクデータのインターセプト
Cypress.Commands.add('mockTaskData', () => {
  cy.intercept('GET', '/api/v1/tasks/**', {
    statusCode: 200,
    fixture: 'tasks.json',
  }).as('getTasks')
  
  cy.intercept('GET', '/api/v1/projects/**', {
    statusCode: 200,
    fixture: 'projects.json',
  }).as('getProjects')
})

// グローバルのタイプ宣言
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      mockTaskData(): Chainable<void>
    }
  }
}
