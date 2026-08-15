#!/usr/bin/env node

/**
 * SamyamLM CLI Tool
 * Interactive Quickstart & Environment Installer for Laptop/Local Machine
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync, spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const cyan = (str) => `\x1b[36m${str}\x1b[0m`;
const green = (str) => `\x1b[32m${str}\x1b[0m`;
const yellow = (str) => `\x1b[33m${str}\x1b[0m`;
const red = (str) => `\x1b[31m${str}\x1b[0m`;
const bold = (str) => `\x1b[1m${str}\x1b[0m`;
const dim = (str) => `\x1b[2m${str}\x1b[0m`;

function printBanner() {
  console.log("\n" + cyan(bold(`
  ███████╗ █████╗ ███╗   ███╗██╗   ██╗██████╗ ███╗   ███╗██╗     ███╗   ███╗
  ██╔════╝██╔══██╗████╗ ████║╚██╗ ██╔╝██╔══██╗████╗ ████║██║     ████╗ ████║
  ███████╗███████║██╔████╔██║ ╚████╔╝ ██████╔╝██╔████╔██║██║     ██╔████╔██║
  ╚════██║██╔══██║██║╚██╔╝██║  ╚██╔╝  ██╔══██╗██║╚██╔╝██║██║     ██║╚██╔╝██║
  ███████║██║  ██║██║ ╚═╝ ██║   ██║   ██║  ██║██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║
  ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝
  `)));
  console.log(bold("  🌍 SamyamLM — Multimodal Satellite & Indian AI Platform"));
  console.log(dim("  -------------------------------------------------------------"));
}

function checkRequirement(cmd, name) {
  try {
    const version = execSync(`${cmd} --version`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    console.log(`  ${green("✔")} ${name}: ${dim(version.split("\n")[0])}`);
    return true;
  } catch (e) {
    console.log(`  ${red("✖")} ${name}: ${yellow("Not found")}`);
    return false;
  }
}

function runDiagnostics() {
  console.log(`\n${bold("🔍 System Diagnostic Check:")}`);
  const nodeOk = checkRequirement("node", "Node.js Environment");
  const npmOk = checkRequirement("npm", "Node Package Manager (npm)");
  const gitOk = checkRequirement("git", "Git Version Control");
  const pythonOk = checkRequirement("python3", "Python 3 Engine") || checkRequirement("python", "Python Engine");
  const dockerOk = checkRequirement("docker", "Docker Engine");

  console.log(`\n${bold("📄 Environment File Check:")}`);
  const envPath = path.join(rootDir, ".env");
  const envExamplePath = path.join(rootDir, ".env.example");

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log(`  ${green("✔")} Created ${bold(".env")} automatically from .env.example!`);
    } else {
      console.log(`  ${yellow("⚠")} ${bold(".env.example")} missing.`);
    }
  } else {
    console.log(`  ${green("✔")} ${bold(".env")} configuration file present.`);
  }

  return { nodeOk, npmOk, gitOk, pythonOk, dockerOk };
}

function startDevServer() {
  console.log(`\n${cyan("🚀 Starting SamyamLM Development Server...")}\n`);
  const child = spawn("npm", ["run", "dev"], { cwd: rootDir, stdio: "inherit", shell: true });
  child.on("exit", (code) => {
    process.exit(code || 0);
  });
}

function installDependencies() {
  console.log(`\n${cyan("📦 Installing Node.js dependencies...")}\n`);
  try {
    execSync("npm install", { cwd: rootDir, stdio: "inherit" });
    console.log(`\n${green("✔ Node.js dependencies installed successfully!")}`);
  } catch (e) {
    console.error(`\n${red("✖ Failed to install dependencies.")}`);
  }
}

function main() {
  printBanner();

  const args = process.argv.slice(2);
  const command = args[0] || "start";

  switch (command) {
    case "--doctor":
    case "doctor":
      runDiagnostics();
      break;

    case "--install":
    case "install":
      runDiagnostics();
      installDependencies();
      break;

    case "--help":
    case "help":
      console.log(`
${bold("Usage:")}
  npx samyamlm [command]
  npm run samyamlm [command]

${bold("Commands:")}
  start      Start development server (default)
  doctor     Run diagnostic check on your laptop
  install    Install all npm and project dependencies
  help       Show this help screen
      `);
      break;

    case "start":
    default:
      const diag = runDiagnostics();
      if (!diag.nodeOk) {
        console.log(`\n${red("✖ Please install Node.js (v18+) to run SamyamLM.")}`);
        process.exit(1);
      }
      startDevServer();
      break;
  }
}

main();
