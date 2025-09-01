import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, BarChart3, Download, FileSpreadsheet } from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  type: string;
  columns: string[];
  rowCount: number;
  preview: any[];
}

interface DataPanelProps {
  projectId?: string;
}

export function DataPanel({ projectId }: DataPanelProps) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [chartConfig, setChartConfig] = useState({
    xColumn: '',
    yColumn: '',
    chartType: 'bar'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (projectId) formData.append('projectId', projectId);

      const response = await fetch('/api/data/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.ok) {
        const newDataset: Dataset = {
          id: data.dataset.id,
          name: data.dataset.name,
          type: data.dataset.type,
          columns: data.dataset.preview.columns,
          rowCount: data.dataset.preview.rows.length,
          preview: data.dataset.preview.rows
        };
        setDatasets(prev => [...prev, newDataset]);
        setSelectedDataset(newDataset);

        // Auto-set chart config if possible
        if (newDataset.columns.length >= 2) {
          setChartConfig({
            xColumn: newDataset.columns[0],
            yColumn: newDataset.columns[1],
            chartType: 'bar'
          });
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const generateChart = async () => {
    if (!selectedDataset || !chartConfig.xColumn || !chartConfig.yColumn) return;

    try {
      const response = await fetch('/api/data/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: selectedDataset.id,
          config: chartConfig
        })
      });

      const data = await response.json();
      if (data.ok) {
        // Chart generation successful - could trigger a download or display
        alert('Chart generated successfully!');
      }
    } catch (error) {
      console.error('Chart generation error:', error);
    }
  };

  const downloadData = (dataset: Dataset) => {
    const csv = [
      dataset.columns.join(','),
      ...dataset.preview.map(row => 
        dataset.columns.map(col => JSON.stringify(row[col] || '')).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Data Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
          <div className="text-sm text-zinc-400 mb-2">
            Upload CSV or Excel files for analysis
          </div>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
        </div>

        {/* Datasets List */}
        {datasets.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Uploaded Datasets</h4>
            <div className="space-y-2">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    selectedDataset?.id === dataset.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                  onClick={() => setSelectedDataset(dataset)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{dataset.name}</div>
                      <div className="text-sm text-zinc-400">
                        {dataset.rowCount} rows • {dataset.columns.length} columns
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{dataset.type}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadData(dataset);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart Configuration */}
        {selectedDataset && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Create Visualization</h4>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="text-sm text-zinc-400">X-axis</label>
                <select
                  value={chartConfig.xColumn}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, xColumn: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
                >
                  <option value="">Select column</option>
                  {selectedDataset.columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Y-axis</label>
                <select
                  value={chartConfig.yColumn}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, yColumn: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
                >
                  <option value="">Select column</option>
                  {selectedDataset.columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Chart Type</label>
                <select
                  value={chartConfig.chartType}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, chartType: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="scatter">Scatter Plot</option>
                </select>
              </div>
            </div>
            <Button
              onClick={generateChart}
              disabled={!chartConfig.xColumn || !chartConfig.yColumn}
              className="w-full"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Chart
            </Button>
          </div>
        )}

        {/* Data Preview */}
        {selectedDataset && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Data Preview</h4>
            <div className="overflow-auto max-h-64">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700">
                    {selectedDataset.columns.map(col => (
                      <th key={col} className="text-left p-2 font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedDataset.preview.slice(0, 10).map((row, index) => (
                    <tr key={index} className="border-b border-zinc-800">
                      {selectedDataset.columns.map(col => (
                        <td key={col} className="p-2">
                          {String(row[col] || '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}