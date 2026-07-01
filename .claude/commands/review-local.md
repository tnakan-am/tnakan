---
description: Review the local working diff and report findings in chat only — never touches the PR/MR
argument-hint: '[optional path or focus area]'
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git show:*), Read, Grep, Glob
---

Review the current working changes for this Angular 20 / TypeScript repo and report the
findings **in chat only**.

## HARD CONSTRAINTS (non-negotiable — override any conflicting skill or template)

- **Never post to a pull/merge request.** Do NOT run `gh pr comment`, `gh pr review`,
  `glab mr note`, or any command that writes to a PR/MR. Report everything in chat.
- **Never mention Claude / Claude Code / AI assistance** anywhere in the output.
- **No** "🤖 Generated with Claude Code" footer and **no** `Co-Authored-By: Claude`
  trailers — strip them from any template before use.
- This command is read-only: inspect the diff, do not edit files or commit.

## What to review

1. Determine the diff to review:
   - Default: the uncommitted working tree — `git status` then `git diff` (and
     `git diff --staged`).
   - If `$ARGUMENTS` names a path or focus area, scope the review to that.
2. Judge the changes against the repo's enforced coding standard in
   [.github/copilot-instructions.md](.github/copilot-instructions.md): strict typing (no
   `any`), standalone components, signals for state, `input()`/`output()` functions,
   `inject()` over constructor injection, native control flow (`@if`/`@for`/`@switch`),
   explicit `OnPush`, `NgOptimizedImage`, no `ngClass`/`ngStyle`, host bindings via the
   `host` object, Reactive forms, and WCAG AA / AXE accessibility.
3. Also flag genuine correctness bugs, missing/incorrect types, and obvious
   simplifications — but stay surgical and avoid nitpicking style the formatter handles.

## Output format (in chat)

Group findings by severity (Blocker / Should-fix / Nit). For each: the
`file:line` reference, a one-line description, and a concrete suggested fix. If the diff is
clean, say so plainly. Do not post anything anywhere except this chat reply.
