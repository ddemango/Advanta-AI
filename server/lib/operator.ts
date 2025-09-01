import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { db } from "../db";
import { operatorSessions } from "@shared/schema";
import { eq } from "drizzle-orm";

const pexec = promisify(execFile);
const ROOT = path.join(process.cwd(), ".operator-sessions");

// Ensure the operator sessions directory exists
if (!fs.existsSync(ROOT)) {
  fs.mkdirSync(ROOT, { recursive: true });
}

async function hasDocker(): Promise<boolean> {
  try {
    await pexec("docker", ["version"]);
    return true;
  } catch {
    return false;
  }
}

export interface OperatorSession {
  id: string;
  sessionId: string;
  dir: string;
}

export async function createSession(userId: number): Promise<OperatorSession> {
  const sessionId = randomUUID();
  const dir = path.join(ROOT, sessionId);
  
  fs.mkdirSync(dir, { recursive: true });
  
  // Create basic workspace structure
  fs.writeFileSync(path.join(dir, "README.md"), "# AI Portal Workspace\nThis is your isolated workspace for code execution.\n");
  fs.mkdirSync(path.join(dir, "data"), { recursive: true });
  
  // Save session to database
  const [session] = await db.insert(operatorSessions).values({
    sessionId,
    userId,
    workspaceDir: dir,
    status: "active"
  }).returning();
  
  return { 
    id: session.id.toString(), 
    sessionId, 
    dir 
  };
}

export async function destroySession(sessionId: string, userId: number): Promise<boolean> {
  try {
    // Update database status
    await db
      .update(operatorSessions)
      .set({ status: "destroyed" })
      .where(eq(operatorSessions.sessionId, sessionId));
    
    // Remove directory
    const dir = path.join(ROOT, sessionId);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    
    return true;
  } catch (error) {
    console.error("Failed to destroy session:", error);
    return false;
  }
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  cwd: string;
  listing: string[];
  executionTime: number;
  dockerUsed: boolean;
}

export async function runCommand(sessionId: string, cmd: string, userId: number): Promise<CommandResult> {
  const startTime = Date.now();
  const dir = path.join(ROOT, sessionId);
  
  if (!fs.existsSync(dir)) {
    throw new Error("Invalid or expired session");
  }
  
  // Update last used time
  await db
    .update(operatorSessions)
    .set({ lastUsed: new Date() })
    .where(eq(operatorSessions.sessionId, sessionId));
  
  const dockerAvailable = await hasDocker();
  const dockerImage = process.env.OPERATOR_IMAGE || "python:3.11-alpine";
  
  let stdout = "";
  let stderr = "";
  
  try {
    if (dockerAvailable && process.env.NODE_ENV === 'production') {
      // Use Docker in production for security
      const dockerCmd = [
        "docker", "run", "--rm",
        "-v", `${dir}:/work`,
        "-w", "/work",
        "--network", "none", // No network access for security
        "--memory", "512m", // Memory limit
        "--cpus", "1", // CPU limit
        dockerImage,
        "/bin/sh", "-c", cmd
      ];
      
      const result = await pexec(dockerCmd[0], dockerCmd.slice(1), {
        cwd: dir,
        timeout: 30_000, // 30 second timeout
        maxBuffer: 2_000_000 // 2MB buffer
      });
      
      stdout = result.stdout;
      stderr = result.stderr;
    } else {
      // Fallback to local execution with restrictions
      const safeCmd = sanitizeCommand(cmd);
      const result = await pexec("/bin/sh", ["-c", safeCmd], {
        cwd: dir,
        timeout: 15_000, // 15 second timeout for local
        maxBuffer: 1_000_000, // 1MB buffer
        env: {
          ...process.env,
          PATH: "/usr/bin:/bin", // Restricted PATH
          HOME: dir,
          PWD: dir
        }
      });
      
      stdout = result.stdout;
      stderr = result.stderr;
    }
  } catch (error: any) {
    stderr = error.message || "Command execution failed";
    if (error.code === 'ETIMEDOUT') {
      stderr = "Command timed out";
    }
  }
  
  // Get directory listing
  let listing: string[] = [];
  try {
    listing = fs.readdirSync(dir, { withFileTypes: true })
      .map(d => (d.isDirectory() ? "d " : "- ") + d.name)
      .slice(0, 20); // Limit to 20 items
  } catch (error) {
    listing = ["Error reading directory"];
  }
  
  const executionTime = Date.now() - startTime;
  
  return {
    stdout,
    stderr,
    cwd: "/work",
    listing,
    executionTime,
    dockerUsed: dockerAvailable && process.env.NODE_ENV === 'production'
  };
}

function sanitizeCommand(cmd: string): string {
  // Basic command sanitization for local execution
  // Remove potentially dangerous commands
  const dangerous = [
    'rm -rf /',
    'sudo',
    'su -',
    'passwd',
    'useradd',
    'userdel',
    'chmod 777',
    'chown',
    'mount',
    'umount',
    'iptables',
    'systemctl',
    'service',
    'kill -9',
    'pkill',
    'killall',
    'reboot',
    'shutdown',
    'halt'
  ];
  
  const lowerCmd = cmd.toLowerCase();
  for (const danger of dangerous) {
    if (lowerCmd.includes(danger)) {
      throw new Error(`Command contains restricted operation: ${danger}`);
    }
  }
  
  return cmd;
}

export async function getUserSessions(userId: number) {
  return await db
    .select()
    .from(operatorSessions)
    .where(eq(operatorSessions.userId, userId));
}

export async function cleanupExpiredSessions() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  // Find expired sessions
  const expiredSessions = await db
    .select()
    .from(operatorSessions)
    .where(eq(operatorSessions.status, "active"));
  
  for (const session of expiredSessions) {
    if (new Date(session.lastUsed!) < oneDayAgo) {
      await destroySession(session.sessionId, session.userId);
    }
  }
}