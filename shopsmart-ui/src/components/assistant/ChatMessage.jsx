import React from 'react';
import { Badge } from '../ui/index.js';
import RecommendationCard from './RecommendationCard.jsx';

export default function ChatMessage({ message, onQuickReply }) {
  const { role, type, error, content, currentMode } = message;

  if (role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[85%] shadow-sm">
          {content}
        </div>
      </div>
    );
  }

  if (role === 'error') {
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[85%] shadow-sm border border-red-100">
          <p className="font-semibold text-sm mb-1">Error ({currentMode})</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (role === 'assistant') {
    return (
      <div className="flex justify-start mb-6 w-full">
        <div className="bg-white text-[var(--color-slate-900)] px-4 py-3 rounded-2xl rounded-bl-sm w-full max-w-[95%] shadow-sm border border-[var(--color-slate-200)]">
          {type === 'SHOP' ? (
            <ShopReply message={message} onQuickReply={onQuickReply} />
          ) : (
            <PolicyReply message={message} />
          )}
        </div>
      </div>
    );
  }

  return null;
}

function ShopReply({ message, onQuickReply }) {
  const { interpretedRequirement, budget, recommendations, clarifyingQuestion } = message;

  return (
    <div className="flex flex-col gap-3">
      {/* Intent chips */}
      {(interpretedRequirement || budget) && (
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-500 my-auto">Understood:</span>
          {interpretedRequirement && (
            <Badge variant="neutral">{interpretedRequirement}</Badge>
          )}
          {budget && (
            <Badge variant="neutral">Budget: ${budget}</Badge>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          <p className="font-medium text-sm">Here are some options:</p>
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.productId} recommendation={rec} />
          ))}
        </div>
      )}

      {/* Clarifying Question */}
      {clarifyingQuestion && (
        <div className="mt-2 bg-[var(--color-ai)]/10 p-3 rounded-lg border border-[var(--color-ai)]/20">
          <p className="font-bold text-[var(--color-ai)]">{clarifyingQuestion}</p>
          {/* Mock quick replies for budget/category if it's missing */}
          {!budget && (
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => onQuickReply('Under $500')} className="px-3 py-1 text-sm bg-white border border-[var(--color-ai)] text-[var(--color-ai)] rounded-full hover:bg-[var(--color-ai)] hover:text-white transition-colors">Under $500</button>
              <button onClick={() => onQuickReply('Under $1000')} className="px-3 py-1 text-sm bg-white border border-[var(--color-ai)] text-[var(--color-ai)] rounded-full hover:bg-[var(--color-ai)] hover:text-white transition-colors">Under $1000</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PolicyReply({ message }) {
  const { answer, confidence, sources, followUpRequired } = message;

  const confColor = confidence === 'HIGH' ? 'success' : confidence === 'MEDIUM' ? 'warning' : 'danger';

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm leading-relaxed whitespace-pre-wrap">{answer}</div>
      
      <div className="flex flex-col gap-2 mt-2 border-t pt-2 border-[var(--color-slate-100)]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Confidence:</span>
          <Badge variant={confColor}>{confidence}</Badge>
        </div>
        
        {sources && sources.length > 0 && (
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium mt-0.5">Sources:</span>
            {sources.map((src, idx) => (
              <Badge key={idx} variant="neutral" className="bg-slate-100 text-xs text-slate-600 font-normal">
                {src.document} / {src.section} / {src.version}
              </Badge>
            ))}
          </div>
        )}

        {followUpRequired && (
          <div className="mt-1 flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded text-xs font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Needs follow-up: Information might be incomplete or outside approved documents.
          </div>
        )}
      </div>
    </div>
  );
}
