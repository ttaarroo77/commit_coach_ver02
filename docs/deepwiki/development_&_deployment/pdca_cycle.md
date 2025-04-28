---
title: PDCA Development Cycle
last_updated: 2025-04-28
---

# PDCA Development Cycle

Commit Coach applies the classic **Plan-Do-Check-Act** loop—augmented with AI agents—to drive continuous improvement across >200 structured development steps.  
For overarching DevOps details, see **Development & Deployment**; for AI tooling, see **AI-Driven Development**.

---


# Relevant source files
The following files were used as context for generating this wiki page:

- docs/_pdca_prompt.md
- docs/overview/development_flow.md

---


## 1  PDCA Cycle Overview

```mermaid
flowchart LR
    P(Plan) --> D(Do) --> C(Check) --> A(Act) --> P
    subgraph Plan
        R1[Understand requirements]
        G1[Set goals]
        T1[Break down tasks]
        P-->R1-->G1-->T1
    end
    subgraph Do
        E1[Execute tasks]
        L1[Log progress]
        D-->E1-->L1
    end
    subgraph Check
        EV[Evaluate outcomes]
        IS[Identify issues]
        C-->EV-->IS
    end
    subgraph Act
        IM[Implement improvements]
        CF[Carry lessons forward]
        A-->IM-->CF
    end
```

---

## 2  Minimal PDCA Flow (per task)

```mermaid
sequenceDiagram
    participant User
    participant AI as PM/Dev/Test Agents
    User->>AI: Idea / Issue
    AI->>AI: Step 1 Plan ↦ intent + goals
    AI->>AI: Step 2 TaskPlanning ↦ task list
    AI->>AI: Step 3 Do ↦ code / docs / logs
    AI->>AI: Step 4 Check ↦ compare vs goals
    AI->>AI: Step 5 Act ↦ improve & queue next
```

---

## 3  Detailed Phase Activities

| Phase | Key Activities | AI Support |
|-------|----------------|------------|
| **Plan** | Requirement analysis, goal setting, risk assessment | Intent recognition, task decomposition |
| **Do** | Implementation, progress logging | Code generation, doc scaffolding |
| **Check** | Testing, review, gap analysis | Test-case generation, metrics |
| **Act** | Refactor, knowledge update | Improvement suggestions, doc updates |

---

## 4  Documentation & File Structure Integration

```mermaid
graph TD
    P1[/docs/ai_dev_flow/_pdca_prompt.md/]
    P2[/docs/ai_dev_flow/prompt_library/_meeting_report.md/]
    Logs[/knowledge_pool/progress_reports_byAI/]
    Think[/knowledge_pool/thinking_logs/]
    P1 -->|template| P2
    DevCycle((PDCA)) --> Logs
    DevCycle --> Think
```

* Every doc starts with YAML front-matter:

```yaml
---
name: "knowledge_pool/progress_reports_byAI/2025-04-28_proj_RPT.md"
title: "Daily Progress Report"
description: "Auto-generated summary"
---
```

* AI logs progress → saved under `progress_reports_byAI/` with `YYYY-MM-DD_CODE_RPT.md`.

---

## 5  Integration with 200-Step Dev Flow

```mermaid
flowchart LR
    subgraph Frontend 1-100
        FE_Init[1-10 Init]
        FE_UI[11-60 UI]
        FE_AI[61-70 AI UI]
        FE_Test[81-90 Tests]
        FE_Deploy[91-100 Deploy]
    end
    subgraph Backend 101-200
        BE_Init[101-110 Init]
        BE_DB[111-120 DB]
        BE_API[121-150 API]
        BE_AI[151-160 AI Endpoints]
        BE_Test[171-180 Tests]
        BE_Deploy[181-200 Deploy]
    end
    PDCA --> FE_Init & BE_Init
    PDCA --> FE_UI & BE_API
    PDCA --> FE_Test & BE_Test
    PDCA --> FE_Deploy & BE_Deploy
```

---

## 6  AI-Enhanced PDCA Matrix

| PDCA | AI Mechanism | Example in Commit Coach |
|------|--------------|-------------------------|
| **Plan** | Requirement parsing | Extract goals from `/docs/overview/` |
| **Do** | Code / template gen | Scaffold React component + Jest test |
| **Check** | Auto-testing | Jest & Cypress suites via Test Agent |
| **Act** | Refactor + docs | AI suggests code clean-up; updates docs |

---

## 7  Best-Practice Guidelines

1. **Keep tasks atomic** – easy to Check.  
2. **Log everything** – AI progress + human comments.  
3. **Review AI output** – human approval gate.  
4. **Carry over issues** – unresolved items feed next Plan.  

---

## Summary

The **PDCA Development Cycle** anchors Commit Coach’s workflow, ensuring every change passes through a tight Plan-Do-Check-Act loop—boosted by AI for speed and knowledge capture. Continuous improvement becomes an automated, traceable habit.
```

図は GitHub／DeepWiki／MkDocs でレンダリングされます。追加の変更や図の調整があればお知らせください！