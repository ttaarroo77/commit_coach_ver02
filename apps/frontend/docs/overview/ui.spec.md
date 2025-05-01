---
id: ui
title: Design Tokens & Components
owner: o3
stakeholders: [windsurf]
branding:
  palette:
    base: "#FFFFFF"
    accent: "#31A9B8"
  fonts:
    heading: "system‑ui Bold"
    body: "system‑ui Regular"
  radius: "0.75rem"
layout:
  common: [Layout, Header, Sidebar, Footer]
  screens: [auth, dashboard, project, task, profile, settings]
components:
  atoms: [Button, Input, Select, Badge]
  molecules: [TaskCard, ProjectCard, AIMessage]
  organisms: [TaskBoard, ProjectList]
accessibility:
  contrast_ratio: ">=4.5"
  keyboard_navigation: true
performance:
  memoization: required
  lazy_loading: encouraged
---

# UI / UX Principles

デザインは シンプル / 直感的 / アクセシブル を最優先とし、ダークモードとレスポンシブ対応を必須とします。Tailwind CSS でトークンをカスタムプロパティとして定義し、Storybook で UI をカタログ化します。