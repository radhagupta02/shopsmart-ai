import { answerQuestion } from '../services/ai/ragService.js';
import { handleShopRequest } from '../services/ai/shopAssistant.js';
import { route } from '../services/ai/intentRouter.js';
import { handleOrderStatus } from '../services/ai/orderStatusTool.js';
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
    
    logger.info(`AI POLICY | provider=gemini | model=gemini-1.5-flash | latencyMs=${ragResult.latencyMs}`);

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

export const shop = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    
    const shopResult = await handleShopRequest(req.user.id, message, history, req.user.tier);
    
    await aiLogService.record({
      userId: req.user.id,
      type: 'SHOP',
      question: message,
      response: shopResult,
      confidence: null,
      sources: null,
      latencyMs: shopResult.latencyMs
    });
    
    logger.info(`AI SHOP | provider=gemini | model=gemini-1.5-flash | latencyMs=${shopResult.latencyMs}`);

    res.json({
      interpretedRequirement: shopResult.interpretedRequirement,
      budget: shopResult.budget,
      recommendations: shopResult.recommendations,
      clarifyingQuestion: shopResult.clarifyingQuestion
    });
  } catch (err) {
    next(err);
  }
};

export const chat = async (req, res, next) => {
  try {
    const { message, history, region } = req.body;
    
    const intent = await route(message);
    
    if (intent === 'POLICY') {
      const ragResult = await answerQuestion({ question: message, region, user: req.user });
      
      await aiLogService.record({
        userId: req.user.id, type: 'POLICY', question: message,
        response: ragResult.answer, confidence: ragResult.confidence,
        sources: ragResult.sources, latencyMs: ragResult.latencyMs
      });
      
      return res.json({ type: 'POLICY', policy: ragResult });
    }
    
    if (intent === 'SHOP') {
      const shopResult = await handleShopRequest(req.user.id, message, history, req.user.tier);
      
      await aiLogService.record({
        userId: req.user.id, type: 'SHOP', question: message,
        response: shopResult, confidence: null, sources: null, latencyMs: shopResult.latencyMs
      });
      
      return res.json({ type: 'SHOP', shop: shopResult });
    }
    
    if (intent === 'ORDER') {
      const orderResult = await handleOrderStatus(req.user.id, message);
      return res.json({ type: 'ORDER', order: orderResult });
    }
    
    return res.json({ 
      type: 'UNKNOWN', 
      message: "I'm sorry, I can only help with shopping recommendations, store policies, and tracking your orders." 
    });
    
  } catch (err) {
    next(err);
  }
};
