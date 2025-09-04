import express from 'express';
import { exec } from 'child_process';
import { writeFileSync, unlinkSync, mkdtempSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const router = express.Router();

// POST /api/ai-portal/tools/code/run
router.post('/run', async (req, res) => {
  try {
    const { language, code } = req.body;
    
    if (!language || !code) {
      return res.status(400).json({
        ok: false,
        tool: "code_runner",
        error: "Language and code are required"
      });
    }

    let output = '';
    let command = '';
    let filename = '';
    let tempDir = '';

    try {
      // Create temporary directory
      tempDir = mkdtempSync(join(tmpdir(), 'code-runner-'));
      
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
          filename = join(tempDir, 'script.js');
          writeFileSync(filename, code);
          command = `node "${filename}"`;
          break;
          
        case 'python':
        case 'py':
          filename = join(tempDir, 'script.py');
          writeFileSync(filename, code);
          command = `python3 "${filename}"`;
          break;
          
        case 'typescript':
        case 'ts':
          filename = join(tempDir, 'script.ts');
          writeFileSync(filename, code);
          command = `npx tsx "${filename}"`;
          break;
          
        case 'bash':
        case 'sh':
          filename = join(tempDir, 'script.sh');
          writeFileSync(filename, code);
          command = `bash "${filename}"`;
          break;
          
        default:
          return res.status(400).json({
            ok: false,
            tool: "code_runner",
            error: `Unsupported language: ${language}`
          });
      }

      // Execute with timeout
      exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
        // Cleanup
        try {
          if (filename) unlinkSync(filename);
        } catch (e) {
          // Ignore cleanup errors
        }

        if (error) {
          output = `Error: ${error.message}\n${stderr}`;
        } else {
          output = stdout || stderr || 'Code executed successfully (no output)';
        }

        res.json({
          ok: true,
          tool: "code_runner",
          data: {
            output: output.trim(),
            language
          }
        });
      });

    } catch (execError) {
      // Cleanup on error
      try {
        if (filename) unlinkSync(filename);
      } catch (e) {
        // Ignore cleanup errors
      }
      
      throw execError;
    }

  } catch (error) {
    res.status(500).json({
      ok: false,
      tool: "code_runner",
      error: "Code execution failed"
    });
  }
});

export default router;