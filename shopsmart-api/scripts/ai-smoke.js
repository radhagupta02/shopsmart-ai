import { chat, chatJson, embed } from '../src/services/ai/aiClient.js';
import { z } from 'zod';

async function run() {
  console.log('--- AI Smoke Test ---');

  try {
    console.log('\n1. Testing chat()...');
    const chatResult = await chat({
      system: 'You are a helpful assistant.',
      user: 'Say hello in one word.',
      temperature: 0.1
    });
    console.log(chatResult);

    console.log('\n2. Testing chatJson()...');
    const jsonSchema = z.object({ greeting: z.string() });
    const jsonResult = await chatJson({
      system: 'You return JSON.',
      user: 'Return a greeting object.',
      schema: jsonSchema,
      temperature: 0.1
    });
    console.log(jsonResult);

    console.log('\n3. Testing embed()...');
    const embedResult = await embed(['Test sentence.'], 'document');
    console.log('Provider:', embedResult.provider);
    console.log('Model:', embedResult.model);
    console.log('Dimension N:', embedResult.data[0].length);
    console.log('Latency:', embedResult.latencyMs);

    console.log('\nSmoke test complete.');
    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(1);
  }
}

run();
