import { execSync } from "child_process";
import "dotenv/config";

const command = process.argv.slice(2).join(" ");
execSync(`npx prisma ${command}`, { stdio: "inherit" });

