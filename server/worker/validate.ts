import { validateQueue, ValidateJobData } from '../queue-service';
import { validateWorkflow } from '@shared/WorkflowSchema';
import { db } from '../db';
import { workflowLogs } from '@shared/schema';

// Validation worker for workflow testing as per checklist requirements

// Simulate workflow execution to check for potential issues
async function simulateWorkflow(workflowJson: any): Promise<{ success: boolean; issues: string[]; annotations: any[] }> {
  const issues: string[] = [];
  const annotations: any[] = [];
  
  try {
    // Validate workflow structure
    const validation = validateWorkflow(workflowJson);
    if (!validation.success) {
      issues.push(`Schema validation failed: ${validation.error}`);
      return { success: false, issues, annotations };
    }

    const workflow = validation.data;
    
    // Check for common issues
    
    // 1. Validate node connections
    const nodeIds = new Set(workflow.nodes.map(n => n.id));
    for (const edge of workflow.edges) {
      if (!nodeIds.has(edge.fromNodeId)) {
        issues.push(`Edge references non-existent node: ${edge.fromNodeId}`);
      }
      if (!nodeIds.has(edge.toNodeId)) {
        issues.push(`Edge references non-existent node: ${edge.toNodeId}`);
      }
    }
    
    // 2. Check for nodes with missing auth requirements
    for (const node of workflow.nodes) {
      if (['email', 'slack', 'http'].includes(node.type) && !node.authRef) {
        issues.push(`Node ${node.id} (${node.type}) requires authRef for authentication`);
        annotations.push({
          nodeId: node.id,
          type: 'warning',
          message: 'Missing authentication reference'
        });
      }
    }
    
    // 3. Validate trigger configuration
    for (const trigger of workflow.triggers) {
      if (trigger.type === 'webhook' && !trigger.config.path) {
        issues.push(`Webhook trigger missing path configuration`);
      }
      if (trigger.type === 'schedule' && !trigger.config.cron) {
        issues.push(`Schedule trigger missing cron configuration`);
      }
    }
    
    // 4. Check for unreachable nodes
    const reachableNodes = new Set<string>();
    const triggerNodes = workflow.nodes.filter(n => n.type === 'webhook' || workflow.triggers.some(t => t.type === 'webhook'));
    
    function markReachable(nodeId: string) {
      if (reachableNodes.has(nodeId)) return;
      reachableNodes.add(nodeId);
      
      const outgoingEdges = workflow.edges.filter(e => e.fromNodeId === nodeId);
      outgoingEdges.forEach(edge => markReachable(edge.toNodeId));
    }
    
    triggerNodes.forEach(node => markReachable(node.id));
    
    const unreachableNodes = workflow.nodes.filter(n => !reachableNodes.has(n.id));
    unreachableNodes.forEach(node => {
      issues.push(`Node ${node.id} is unreachable from triggers`);
      annotations.push({
        nodeId: node.id,
        type: 'error',
        message: 'Unreachable node'
      });
    });
    
    // 5. Simulate execution annotations
    workflow.nodes.forEach(node => {
      let status = 'success';
      let message = 'Node validation passed';
      
      // Simulate potential failures
      if (node.type === 'http' && !node.inputs.url) {
        status = 'error';
        message = 'HTTP node missing URL';
        issues.push(`Node ${node.id}: HTTP action requires URL`);
      } else if (node.type === 'email' && !node.inputs.to) {
        status = 'error';
        message = 'Email node missing recipient';
        issues.push(`Node ${node.id}: Email action requires recipient`);
      }
      
      annotations.push({
        nodeId: node.id,
        type: status === 'success' ? 'success' : 'error',
        message
      });
    });
    
    return {
      success: issues.length === 0,
      issues,
      annotations
    };
    
  } catch (error) {
    issues.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, issues, annotations };
  }
}

// Process validation jobs
if (validateQueue) {
  validateQueue.process('validate-workflow', async (job) => {
    const { workflowId, workflowJson, requestId } = job.data as ValidateJobData;
    
    console.log(`[Validator] Processing validation job for workflow ${workflowId}`);
    
    try {
      // Log validation start
      await db.insert(workflowLogs).values({
        workflowId,
        runId: requestId,
        status: 'running',
        stepName: 'validation_start',
        output: { message: 'Starting workflow validation' }
      });

      // Simulate workflow execution
      const result = await simulateWorkflow(workflowJson);
      
      if (result.success) {
        // Log successful validation
        await db.insert(workflowLogs).values({
          workflowId,
          runId: requestId,
          status: 'success',
          stepName: 'validation_complete',
          output: { 
            message: 'Workflow validation passed',
            annotations: result.annotations
          }
        });

        console.log(`[Validator] Workflow ${workflowId} validation passed`);
        return { success: true, annotations: result.annotations };
        
      } else {
        // Log validation issues
        await db.insert(workflowLogs).values({
          workflowId,
          runId: requestId,
          status: 'error',
          stepName: 'validation_failed',
          error: result.issues.join('; '),
          output: { 
            message: 'Workflow validation failed',
            issues: result.issues,
            annotations: result.annotations
          }
        });

        console.log(`[Validator] Workflow ${workflowId} validation failed:`, result.issues);
        return { success: false, issues: result.issues, annotations: result.annotations };
      }
      
    } catch (error) {
      console.error(`[Validator] Validation job failed for workflow ${workflowId}:`, error);
      
      // Log error
      await db.insert(workflowLogs).values({
        workflowId,
        runId: requestId,
        status: 'error',
        stepName: 'validation_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        output: { message: 'Validation error occurred' }
      });

      throw error;
    }
  });

  console.log('[Validator] Validation queue processor started');
}

export default validateQueue;