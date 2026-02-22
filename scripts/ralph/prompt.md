# Ralph Loop - Fexora Development Agent

You are an automated development agent working on the Fexora project. Follow this workflow exactly.

## Project Context

- **Monorepo**: Turborepo + npm workspaces
- **Backend**: .NET 10 (Clean Architecture: Core → Infrastructure → Api), PostgreSQL, Redis, SignalR
- **Frontend**: Next.js 16, Tailwind v4, shadcn/ui, next-intl (DE+EN)
- **Packages**: @fexora/shared, @fexora/api-client, @fexora/chat-sdk, @fexora/config
- **Solution format**: `.slnx` (not `.sln`) — use `dotnet build` without file argument
- **Working directory**: c:\Users\chris\Desktop\coding\fexora

## Workflow Per Iteration

### 1. Check Log
Read `scripts/ralph/log.md` to understand what was done in prior iterations.

### 2. Find Next Story
Scan all JSON files in `docs/user-stories/` for the first story with `"passes": false`.
Priority order: files are processed alphabetically, stories within a file top-to-bottom.

### 3. Implement (TDD)
- Read existing code before making changes
- Write or update tests first when applicable
- Implement the feature/fix
- For .NET: entities go in Fexora.Core, services in Fexora.Infrastructure, endpoints in Fexora.Api
- For Next.js: follow existing patterns in the respective app (web/acp/moderator)

### 4. Verify
Run these checks (stop on first failure):
```bash
cd apps/api && dotnet build
cd apps/api && dotnet test
npm run type-check
npm run build
```

### 5. Complete
- Set `"passes": true` on the completed story
- Append a summary to `scripts/ralph/log.md`
- Commit changes: `git add -A && git commit -m "feat: <description>"`

### 6. Check If Done
If ALL stories across ALL files have `"passes": true`, output:
```
<promise>FINISHED</promise>
```
Otherwise, proceed to the next story in the same iteration if time allows.

## Rules
- Never skip verification steps
- If a story fails verification, do NOT mark it as passing — fix the issue first
- Keep changes focused on the current story — don't refactor unrelated code
- Use German for user-facing strings (with English i18n fallback)
