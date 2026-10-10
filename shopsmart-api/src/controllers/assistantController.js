import { answerQuestion } from '../services/ai/ragService.js';
import * as aiLogService from '../services/aiLogService.js';
import { logger } from '../utils/logger.js';

export const askPolicy = async (req, res, next) => {
  try {
    const { question, region } = req.body;
    
    const ragResult = await answerQuestion({ question, region, user: req.user });
    
    await aiLogService.record({
      userId: req.user.id,
      type: 'POLICY',
      question,
      response: ragResult.answer,
      confidence: ragResult.confidence,
      sources: ragResult.sources,
      latencyMs: ragResult.latencyMs
    });
    
    logger.info(\`AI POLICY | provider=gemini | model=gemini-1.5-flash | latencyMs=\${ragResult.latencyMs}\`);

    res.json({
      answer: ragResult.answer,
      confidence: ragResult.confidence,
      sources: ragResult.sources,
      followUpRequired: ragResult.followUpRequired
    });
  } catch (err) {
    next(err);
  }
};
