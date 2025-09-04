import express from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/ai-portal/tools/data/analyze
router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const file = req.file;
    
    if (!file || !prompt) {
      return res.status(400).json({
        ok: false,
        tool: "data_analysis",
        error: "File and analysis prompt are required"
      });
    }

    let data: any[] = [];
    
    // Parse file based on type
    if (file.mimetype === 'text/csv' || file.originalname?.endsWith('.csv')) {
      // Parse CSV
      const csvText = file.buffer.toString('utf-8');
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
               file.originalname?.endsWith('.xlsx')) {
      // Parse Excel
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else {
      return res.status(400).json({
        ok: false,
        tool: "data_analysis",
        error: "Unsupported file type. Please upload CSV or Excel files."
      });
    }

    // TODO: Replace with actual AI analysis (OpenAI, Claude, etc.)
    // Mock analysis response
    const mockSummary = `
      <h3>Data Analysis Results</h3>
      <p><strong>Dataset Overview:</strong> Analyzed ${data.length} rows of data with ${Object.keys(data[0] || {}).length} columns.</p>
      <p><strong>Analysis Request:</strong> ${prompt}</p>
      <h4>Key Findings:</h4>
      <ul>
        <li>Data contains ${data.length} records</li>
        <li>Columns include: ${Object.keys(data[0] || {}).join(', ')}</li>
        <li>Analysis shows interesting patterns and trends</li>
        <li>Recommendations for further investigation are available</li>
      </ul>
      <p>This analysis provides insights based on your specific request: "${prompt}"</p>
    `;

    // Mock chart URL (would be generated based on actual analysis)
    const mockChartUrl = `https://placehold.co/600x400/e2e8f0/475569?text=Chart+for+${encodeURIComponent(prompt)}`;
    
    res.json({
      ok: true,
      tool: "data_analysis",
      data: {
        summary: mockSummary,
        chart: mockChartUrl,
        recordCount: data.length,
        columns: Object.keys(data[0] || {})
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      tool: "data_analysis", 
      error: "Data analysis failed"
    });
  }
});

export default router;