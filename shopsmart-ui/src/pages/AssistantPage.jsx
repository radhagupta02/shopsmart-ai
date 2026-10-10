import React from 'react';
import AssistantPanel from '../components/assistant/AssistantPanel.jsx';

export default function AssistantPage() {
  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50">
      <AssistantPanel embedded={true} />
    </div>
  );
}
