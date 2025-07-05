import { generateAgentResponse } from '../components/services/geminiService';
import { AgentType } from '../lib/types';

/**
 * A simple CLI to interact with the Gemini service.
 *
 * Usage:
 * ts-node scripts/gemini-cli.ts <agentType> "<message>"
 *
 * Example:
 * ts-node scripts/gemini-cli.ts BLAZE "Give me a marketing slogan for a new haircut style"
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: ts-node scripts/gemini-cli.ts <agentType> "<message>"');
    console.error('Available agents:', Object.values(AgentType).join(', '));
    process.exit(1);
  }

  const agentType = args[0] as AgentType;
  const message = args[1];

  if (!Object.values(AgentType).includes(agentType)) {
    console.error(`Invalid agent type: ${agentType}`);
    console.error('Available agents:', Object.values(AgentType).join(', '));
    process.exit(1);
  }

  console.log(`\nConnecting to Gemini with agent '${agentType}'...`);
  console.log(`> ${message}\n`);

  try {
    const response = await generateAgentResponse(agentType, message, []);
    console.log(`--- ${agentType}'s Response ---`);
    console.log(response);
    console.log('-----------------------\n');
  } catch (error) {
    console.error('Failed to get response from Gemini:', error);
    process.exit(1);
  }
}

main();