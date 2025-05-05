import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectForm } from '@/components/projects/project-form';

// プロジェクト作成フォームのバリデーションテスト

describe('ProjectForm', () => {
  it('必須項目が未入力の場合、バリデーションエラーが表示される', () => {
    render(<ProjectForm />);

    // 「保存」ボタンをクリック
    const saveButton = screen.getByRole('button', { name: /保存/ });
    fireEvent.click(saveButton);

    // プロジェクト名のエラー
    expect(screen.getByLabelText('プロジェクト名')).toBeInvalid();
    // 説明のエラー
    expect(screen.getByLabelText('説明')).toBeInvalid();
  });

  it('全ての必須項目を入力すればバリデーションエラーは出ない', () => {
    render(<ProjectForm />);

    fireEvent.change(screen.getByLabelText('プロジェクト名'), { target: { value: 'テストプロジェクト' } });
    fireEvent.change(screen.getByLabelText('説明'), { target: { value: '説明文' } });

    const saveButton = screen.getByRole('button', { name: /保存/ });
    fireEvent.click(saveButton);

    // エラーが表示されていないこと
    expect(screen.getByLabelText('プロジェクト名')).toBeValid();
    expect(screen.getByLabelText('説明')).toBeValid();
  });
});
