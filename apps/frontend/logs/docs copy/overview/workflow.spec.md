---
id: workflow
title: Development & AI Workflow
owner: o3
stakeholders: [cursor, windsurf]
phases:
  1_requirements: { lead: o3, duration_weeks: 2 }
  2_development: { lead: cursor+windsurf, duration_weeks: 6 }
  3_test: { lead: cursor+windsurf, duration_weeks: 2 }
  4_launch: { lead: o3, duration_weeks: 1 }
ai_roles:
  planner_o3:
    duties: [spec_consistency_check, question_generation, patch_application]
  devin:
    duties: [code_generation, unit_test, pr]
  qa_agent:
    duties: [test_case_generation, regression_test]
checklist_templates:
  pr:
    - "[ ] 関連 spec.md のリンクを貼る"
    - "[ ] type/bug or type/feature ラベル設定"
  issue:
    - "[ ] acceptance criteria 記載"
    - "[ ] definition of done を満たす"
risks:
  - ai_accuracy
  - schedule_delay
  - scope_creep
mitigations:
  ai_accuracy: "human review gate on staging"
  schedule_delay: "time‑boxed sprints"
  scope_creep: "strict MVP scope in product.spec.md"
---

# Workflow Details

各フェーズ終了時に o3 が spec 整合性を確認後、Devin が実装→PR を作成します。マージ前に QA Agent が自動テストを回し、人間が最終承認します。
