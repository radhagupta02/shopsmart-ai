export const parseMarkdown = (text) => {
  // Strip leading header block (Key: Value lines)
  const lines = text.split('\n');
  let bodyStartIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '' || lines[i].startsWith('#')) {
      bodyStartIndex = i;
      break;
    }
  }
  
  const body = lines.slice(bodyStartIndex).join('\n');
  if (!body.trim()) {
    throw new Error('Empty extraction');
  }

  const sections = [];
  const regex = /^##\s+(.*)$/gm;
  let match;
  let lastIndex = 0;
  let currentSection = 'General';

  while ((match = regex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      const content = body.slice(lastIndex, match.index).trim();
      if (content) {
        sections.push({ name: currentSection, content });
      }
    }
    currentSection = match[1].trim();
    lastIndex = regex.lastIndex;
  }

  const lastContent = body.slice(lastIndex).trim();
  if (lastContent) {
    sections.push({ name: currentSection, content: lastContent });
  }

  if (sections.length === 0) {
    throw new Error('Empty extraction');
  }

  return sections;
};
