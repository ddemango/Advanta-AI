import http from "http";
import { WebSocketServer } from "ws";
import * as url from "url";
import * as fs from "fs";
import * as path from "path";
import pty from "node-pty";
import jwt from "jsonwebtoken";

const PORT = Number(process.env.TERMINAL_PORT || 4001);
const SECRET = process.env.NODE_SECRET || "dev-secret-key-change-in-production";
const ROOT = path.join(process.cwd(), ".operator-sessions");

// Ensure sessions directory exists
if (!fs.existsSync(ROOT)) {
  fs.mkdirSync(ROOT, { recursive: true });
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end("AI Portal Terminal Server - OK");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  try {
    const { query } = url.parse(req.url || "", true);
    const ticket = String(query.ticket || "");
    
    if (!ticket) {
      throw new Error("Missing authentication ticket");
    }
    
    const payload = jwt.verify(ticket, SECRET) as any;
    
    if (payload.scope !== "operator_ws") {
      throw new Error("Invalid ticket scope");
    }
    
    const sid = payload.sid as string;
    const userId = payload.sub as string;
    
    if (!sid || !userId) {
      throw new Error("Invalid session data");
    }
    
    const cwd = path.join(ROOT, sid);
    
    if (!fs.existsSync(cwd)) {
      fs.mkdirSync(cwd, { recursive: true });
      // Create a welcome file
      fs.writeFileSync(path.join(cwd, "README.txt"), 
        `Welcome to AI Portal Virtual Computer!\nSession ID: ${sid}\nUser ID: ${userId}\n\nThis is your isolated workspace.`
      );
    }

    const shell = process.platform === "win32" ? "powershell.exe" : "bash";
    const ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 120,
      rows: 32,
      cwd,
      env: {
        ...process.env,
        PS1: "\\[\\033[01;32m\\]ai-portal\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]$ ",
        TERM: "xterm-256color"
      }
    });

    // Send welcome message
    ptyProcess.write(`echo "🚀 AI Portal Virtual Computer Activated"\necho "Session: ${sid}"\necho "Type 'help' for available commands"\necho "Type 'ls' to see your workspace"\n`);

    ptyProcess.onData(data => {
      if (ws.readyState === ws.OPEN) {
        ws.send(data);
      }
    });

    ws.on("message", (message) => {
      try {
        const msg = JSON.parse(message.toString());
        
        if (msg.type === "data") {
          ptyProcess.write(msg.data);
        } else if (msg.type === "resize") {
          const { cols, rows } = msg.data;
          ptyProcess.resize(
            Math.max(10, Math.min(300, cols)), 
            Math.max(5, Math.min(100, rows))
          );
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      console.log(`Terminal session closed: ${sid}`);
      ptyProcess.kill();
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      ptyProcess.kill();
    });

    console.log(`Terminal session started: ${sid} for user: ${userId}`);

  } catch (error: any) {
    console.error("Authentication error:", error.message);
    ws.send(`\r\n[AUTH ERROR] ${error.message}\r\n`);
    ws.close();
  }
});

server.listen(PORT, () => {
  console.log(`🔌 AI Portal Terminal Server listening on port ${PORT}`);
  console.log(`📁 Workspace directory: ${ROOT}`);
});

process.on('SIGTERM', () => {
  console.log('Terminal server shutting down...');
  server.close(() => {
    process.exit(0);
  });
});