import { query } from '../../config/db.js';
import { chatJson } from './aiClient.js';
import { logger } from '../../utils/logger.js';
import { getPreferences } from '../preferenceService.js';

export const handleShopRequest = async (userId, message, history = [], userTier) => {
  const start = Date.now();
  
  try {
    const prefs = await getPreferences(userId);
    const catRes = await query(\`SELECT id, name FROM categories\`);
    const validCategoryIds = new Set(catRes.rows.map(c => c.id));
    const categoriesText = catRes.rows.map(c => \`\${c.id}: \${c.name}\`).join(', ');

    const extractionPrompt = \`
You are ShopSmart's AI shopping assistant. Extract the user's intent.
Available Categories:
\${categoriesText}

User preferences (fallback if not specified): 
Brands: \${prefs.brands.join(', ')}
Budget Range: \${prefs.budgetMin || 0} to \${prefs.budgetMax || 'unlimited'}

History of conversation:
\${history.map(h => \`\${h.role}: \${h.content}\`).join('\\n')}

Latest User Message:
\${message}

You must extract:
- summary: A short summary of what the user is looking for.
- categoryId: The ID of the best matching category from the list above, or null if unknown. MUST be one of the IDs provided.
- budget: A number representing the maximum budget in USD, or null if unknown. If user says "cheaper", adjust from history budget.
- useCase: A short string describing the use case.
- mustHaveSpecs: Array of hard constraints. Example: Java development + AI learning means 16 GB RAM or more, SSD, strong CPU, dedicated GPU is a plus. Format: [{ key: 'ram', op: '>=', value: '16' }]. Ops can be: '>=', '<=', '='. Values as strings.
- brandHints: Array of brand names explicitly mentioned or preferred.

Reply EXACTLY with this JSON format:
{ "summary": "...", "categoryId": number | null, "budget": number | null, "useCase": "...", "mustHaveSpecs": [...], "brandHints": [...] }
    \`;

    const extractionResult = await chatJson([{ role: 'user', content: extractionPrompt }], { 
      temperature: 0, 
      systemInstruction: 'Reply strictly in JSON matching the requested schema.' 
    });

    let { summary, categoryId, budget, useCase, mustHaveSpecs = [], brandHints = [] } = extractionResult;

    if (categoryId && !validCategoryIds.has(categoryId)) {
      categoryId = null;
    }

    if (!budget || !categoryId) {
      const clarifyingQuestion = !categoryId 
        ? "Could you clarify which type of product you're looking for?" 
        : "What is your maximum budget for this item?";
      
      return {
        interpretedRequirement: summary || message,
        budget: budget || null,
        recommendations: [],
        clarifyingQuestion,
        latencyMs: Date.now() - start
      };
    }

    let sql = \`SELECT id, name, description, brand, price, rating, stock_qty as "stockQty", specs, images[1] as "imageUrl",
               CASE WHEN stock_qty = 0 THEN 'OUT_OF_STOCK' WHEN stock_qty <= 5 THEN 'LOW_STOCK' ELSE 'IN_STOCK' END as availability
               FROM products WHERE category_id = $1 AND price <= $2 AND stock_qty > 0\`;
    const params = [categoryId, budget];

    const validOps = new Set(['>=', '<=', '=']);
    
    const keysRes = await query(\`
      SELECT DISTINCT jsonb_object_keys(specs) as key 
      FROM products WHERE category_id = $1
    \`, [categoryId]);
    const validKeys = new Set(keysRes.rows.map(r => r.key.toLowerCase()));

    const validSpecs = (mustHaveSpecs || []).filter(s => s && s.key && validKeys.has(s.key.toLowerCase()) && validOps.has(s.op));

    validSpecs.forEach(spec => {
      const isNum = !isNaN(parseFloat(spec.value));
      const paramIdx = params.length + 1;
      params.push(isNum ? parseFloat(spec.value) : spec.value.toString());
      
      if (isNum) {
        sql += \` AND (specs->>'\${spec.key.toLowerCase()}')::numeric \${spec.op} $\${paramIdx}\`;
      } else {
        if (spec.op === '=') {
          sql += \` AND lower(specs->>'\${spec.key.toLowerCase()}') = lower($\${paramIdx})\`;
        }
      }
    });

    const candRes = await query(sql, params);
    let candidates = candRes.rows;

    if (candidates.length === 0) {
      return {
        interpretedRequirement: summary,
        budget,
        recommendations: [],
        clarifyingQuestion: \`I couldn't find any products in that category under $\${budget} that meet all your requirements. Could we increase the budget or adjust the specifications?\`,
        latencyMs: Date.now() - start
      };
    }

    const useCaseWords = useCase ? useCase.toLowerCase().split(/\\W+/) : [];
    const brandHintsLower = (brandHints || []).map(b => b.toLowerCase());
    const prefBrands = (prefs.brands || []).map(b => b.toLowerCase());
    
    candidates.forEach(c => {
      let score = 0;
      const text = \`\${c.name} \${c.brand} \${c.description || ''}\`.toLowerCase();
      
      useCaseWords.forEach(w => { if (w.length > 2 && text.includes(w)) score += 1; });
      brandHintsLower.forEach(b => { if (text.includes(b)) score += 3; });
      prefBrands.forEach(b => { if (text.includes(b)) score += 2; });
      
      c._score = score;
    });

    candidates.sort((a, b) => b._score - a._score);
    const top3 = candidates.slice(0, 3);

    const explanationPrompt = \`
You are ShopSmart's AI shopping assistant. Explain why these products are recommended.
Use only the provided data. Give one short sentence (no marketing fluff) per product.
If a product id doesn't match the list below, drop it.

Candidates:
\${JSON.stringify(top3.map(c => ({ id: c.id, name: c.name, price: c.price, specs: c.specs })), null, 2)}

User's Request:
\${summary}
UseCase: \${useCase}

Reply exactly with JSON format:
{ "reasons": [{ "productId": "...", "reason": "..." }] }
    \`;

    const explainResult = await chatJson([{ role: 'user', content: explanationPrompt }], { temperature: 0.3 });
    const reasonsMap = new Map();
    if (explainResult.reasons && Array.isArray(explainResult.reasons)) {
      explainResult.reasons.forEach(r => reasonsMap.set(r.productId, r.reason));
    }

    const recommendations = top3.map(c => ({
      productId: c.id,
      productName: c.name,
      reason: reasonsMap.get(c.id) || \`Meets requirements for \${c.name} with key specs matching your need.\`,
      availability: c.availability
    }));

    return {
      interpretedRequirement: summary,
      budget,
      recommendations,
      clarifyingQuestion: null,
      latencyMs: Date.now() - start
    };
  } catch (err) {
    logger.error('shopAssistant error', err);
    throw err;
  }
};
