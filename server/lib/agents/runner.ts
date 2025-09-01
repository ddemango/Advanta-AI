import { compileGraphToSteps, executeCompiledSteps } from './graphCompiler';
import { generateRunSummary } from './runSummary';
import { Tools } from './tools';

export async function executeAgentRun(runId: string, userPlan: string = 'enterprise') {
  console.log(`Executing agent run ${runId} with plan ${userPlan}`);
  
  // Mock run data for demonstration
  const mockSteps = [
    {
      index: 1,
      tool: 'plan',
      status: 'done',
      request: { goal: 'Research AI automation trends' },
      response: { steps: [
        { tool: 'web_search', input: { query: 'AI automation trends 2025' } },
        { tool: 'llm', input: { prompt: 'Summarize findings from search results' } }
      ]},
      credits: 50,
      tokensIn: 100,
      tokensOut: 200
    },
    {
      index: 2,
      tool: 'web_search',
      status: 'done',
      request: { query: 'AI automation trends 2025' },
      response: { results: [
        { title: 'AI Automation Growth', snippet: 'AI automation is rapidly expanding...', url: 'https://example.com/ai-trends' }
      ]},
      credits: 25,
      tokensIn: 50,
      tokensOut: 100
    },
    {
      index: 3,
      tool: 'llm',
      status: 'done',
      request: { prompt: 'Summarize findings from search results' },
      response: { text: 'Key findings show AI automation is growing at 40% annually with major adoption in healthcare, finance, and manufacturing sectors.' },
      credits: 75,
      tokensIn: 150,
      tokensOut: 300
    }
  ];

  const runData = {
    id: runId,
    status: 'succeeded',
    goal: 'Research AI automation trends',
    creditsUsed: 150,
    tokensIn: 300,
    tokensOut: 600,
    startedAt: new Date(Date.now() - 60000),
    finishedAt: new Date(),
    output: { summary: 'AI automation research completed successfully' },
    agent: {
      name: 'Research Agent',
      graph: {
        nodes: [
          { id: 'search', data: { label: 'Web Search', tool: 'web_search' } },
          { id: 'analyze', data: { label: 'Analyze', tool: 'llm' } }
        ],
        edges: [
          { source: 'search', target: 'analyze' }
        ]
      }
    },
    steps: mockSteps
  };

  // Generate the summary
  const summary = await generateRunSummary(runData);
  
  console.log('Generated run summary:', summary.length, 'characters');
  
  return {
    ok: true,
    runId,
    summary,
    creditsUsed: runData.creditsUsed,
    status: runData.status
  };
}