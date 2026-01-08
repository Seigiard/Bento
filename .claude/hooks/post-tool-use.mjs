#!/usr/bin/env node
import { execSync } from "node:child_process";

/**
 * Run ESLint fix on the file
 */
async function runESLintFix(filePath) {
  // Check if file is a JS/TS file
  const isJSFile = filePath && /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(filePath);

  if (!isJSFile) return { success: true, message: "Skipped - not a JS/TS file" };

  try {
    execSync(`npx eslint --fix "${filePath}"`, {
      stdio: "pipe",
      encoding: "utf8",
    });
    return {
      success: true,
      message: `✅ ESLint formatting completed on ${filePath}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `⚠️ ESLint completed with warnings on ${filePath}`,
      details: error.stdout || error.stderr,
    };
  }
}

/**
 * Run TypeScript check on the project
 */
async function runTypeScriptCheck(filePath) {
  // Check if file is a JS/TS file
  const isJSFile = filePath && /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(filePath);

  if (!isJSFile) return { success: true, message: "Skipped - not a JS/TS file" };

  try {
    execSync("npx tsc --noEmit", {
      stdio: "pipe",
      encoding: "utf8",
    });

    return {
      success: true,
      message: "✅ TypeScript check passed",
    };
  } catch (error) {
    const errorOutput = (error.stdout || "") + (error.stderr || "");

    return {
      success: false,
      message: "❌ TYPESCRIPT ERRORS FOUND:",
      details: errorOutput,
    };
  }
}

/**
 * Main function - runs all checks in parallel
 */
async function main() {
  // Read tool input from stdin first
  let stdinData = "";

  // Always try to read from stdin, regardless of TTY status
  process.stdin.setEncoding("utf8");

  // Set a timeout to avoid hanging if no data is available
  const timeout = setTimeout(() => {
    // Continue without stdin data
  }, 100);

  try {
    for await (const chunk of process.stdin) {
      stdinData += chunk;
    }
    clearTimeout(timeout);
  } catch {
    clearTimeout(timeout);
    // Continue without stdin data if there's an error
  }

  // Parse tool input
  let toolInput = {};
  let filePath = null;

  try {
    if (stdinData) {
      toolInput = JSON.parse(stdinData);
      filePath = toolInput.tool_input?.file_path;
    } else {
      // Fallback to environment variable
      toolInput = JSON.parse(process.env.TOOL_INPUT || "{}");
      filePath = toolInput.tool_input?.file_path;
    }
  } catch (error) {
    console.error("Failed to parse tool input:", error.message);
    process.exit(1);
  }

  // Check if file is a JS/TS file
  const isJSFile = filePath && /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(filePath);

  if (!isJSFile) {
    const toolName = toolInput.tool_name || "Unknown";
    console.error(`⏭️ Skipping ${toolName} hooks - not a JS/TS file: ${filePath || "no file"}`);
    return;
  }

  const toolName = toolInput.tool_name || "Unknown";
  const hookEvent = toolInput.hook_event_name || "PostToolUse";

  console.error(`🔧 Running ${hookEvent} hooks for ${toolName} on: ${filePath}`);

  // Run both checks in parallel
  const [eslintResult, typescriptResult] = await Promise.all([
    runESLintFix(filePath),
    runTypeScriptCheck(filePath),
  ]);

  // ESLint result
  console.error(`🔧 ESLint: ${eslintResult.message}`);
  if (!eslintResult.success && eslintResult.details) {
    console.error(eslintResult.details);
  }

  // TypeScript result
  console.error(`🔍 TypeScript: ${typescriptResult.message}`);
  if (!typescriptResult.success && typescriptResult.details) {
    console.error(typescriptResult.details);
  }

  // Exit with error code if TypeScript check failed
  if (!typescriptResult.success) {
    process.exit(2);
  }
}

// Run main function
main().catch((error) => {
  console.error("Hook execution failed:", error);
  process.exit(1);
});
