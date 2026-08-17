<div align="center">

# ZY's Anti-Slop Frontend Design

### ZY 的反同质化 AI 前端设计知识库

An AI frontend design knowledge base for Chinese and English creative workflows.<br>
一个面向中英文创作的 AI 前端设计知识库。

[简体中文](README.md) · [English](README.en.md)

[![License: CC--BY--NC--4.0](https://img.shields.io/badge/License-CC--BY--NC--4.0-lightgrey.svg)](LICENSE)

<sub>Maintained by ZY（智宇）</sub>

</div>

---

## Why this exists

The central problem with AI-generated frontends is rarely the ability to write code. It is the tendency to regress to statistical averages: Inter, a purple-blue gradient, and three rounded cards. This library turns 170+ research-informed design documents into three practical capabilities:

1. **Taste** — visual principles, vocabulary, and formulas that make “looks good” actionable.
2. **Differentiation** — anti-genericness and reference-to-originality methods that help a design move beyond common defaults.
3. **Validation** — an audit loop and measurement system that make quality reviewable and iterative.

## A note from ZY

> Generating an interface with AI is easy. Generating one with judgment, character, and a credible path to implementation is the real goal of this library.

This is a reference collection distilled from the prompts, visual decisions, and review checks I repeatedly use in real AI-assisted frontend work. It does not design a product for you; it helps turn a vague request to “make it look good” into decisions that can be chosen, combined, implemented, and checked.

Different models, contexts, stacks, and implementation skills produce different results. The library does not guarantee a strong outcome from every model. Use it with your product context, then validate and iterate.

The document set is currently Chinese-led. English documentation will grow over time; the language switch is here so both communities have a clear entry point from the start.

This library is free to access and licensed under [CC BY-NC 4.0](LICENSE). You may share and adapt it for non-commercial use with attribution; resale, paid redistribution, and use primarily intended for commercial advantage require ZY's prior written permission.

## Quick start

1. Add `00-总索引.md` and `AGENTS.md` to your project context.
2. Define the product context, then use [Z2](docs/Z2-Prompt检索与组合编排.md) to select 5–12 relevant documents before generating with [M1](docs/M1-AI生成顶级前端方法论.md).
3. Run the [Z3](docs/Z3-前端质量审计与迭代闭环.md) five-round audit and fix P0/P1 findings in the result.

## Library map

| Area | Focus |
|---|---|
| `00-*` | Index and planning |
| `A`–`B` | Visual fundamentals and deep visual craft |
| `C`–`D` | UX/content patterns and design systems |
| `E`–`H` | Trends, engineering resources, product contexts, behavior and conversion |
| `M` / `P` | Methods, governance, typography, and layout |
| `R` | Directly usable visual-prompt vocabulary, composition rules, and technical constraints |
| `S` / `T` / `V` / `Z` | Desktop design, measurement, visual effects, and prompt control |

The full navigable index is [00-总索引.md](00-总索引.md).

## Workflow

```text
Product need
  → M2: understand and maintain the knowledge base
  → Z2: retrieve only the most relevant knowledge
  → M1 / Z1: plan and generate
  → Z3: audit and repair the result
  → record failure modes and improve the library
```

## For AI coding tools

Place `AGENTS.md` in a project root so tools such as Codex, Claude Code, Cursor, and Copilot can retrieve the library by area, generate against an explicit method, and run the audit checklist afterward.

## Contributing

Contributions are welcome: new visual dimensions, verifiable engineering rules, corrections, and especially failure modes learned from real projects. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
