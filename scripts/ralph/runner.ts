import { $ } from "bun";

const MAX_ITERATIONS = 20;

for (let i = 1; i <= MAX_ITERATIONS; i++) {
  console.log(`\n🔄 Ralph Loop - Iteration ${i}/${MAX_ITERATIONS}\n`);

  const result =
    await $`npx claude -p "$(cat scripts/ralph/prompt.md)" --allowedTools "Bash(run tests:*)" "Bash(run build:*)" "Bash(run typecheck:*)" "Bash(run migrations:*)" "Read" "Write" "Edit" "Glob" "Grep" "TodoWrite"`.text();

  console.log(result);

  if (result.includes("<promise>FINISHED</promise>")) {
    console.log("\n✅ All user stories pass! Ralph loop complete.\n");
    break;
  }

  if (i === MAX_ITERATIONS) {
    console.log("\n⚠️ Max iterations reached. Some stories may still be pending.\n");
  }
}
