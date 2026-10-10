export const parseJson = (text) => {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error('Invalid JSON');
  }

  const sections = [];
  if (Array.isArray(parsed)) {
    parsed.forEach((item, index) => {
      const title = item.title || item.name || `Section ${index + 1}`;
      const content = item.details || item.content || JSON.stringify(item);
      sections.push({ name: title, content });
    });
  } else if (typeof parsed === 'object' && parsed !== null) {
    for (const [key, value] of Object.entries(parsed)) {
      sections.push({ name: key, content: typeof value === 'string' ? value : JSON.stringify(value) });
    }
  }

  if (sections.length === 0) {
    throw new Error('Empty extraction');
  }

  return sections;
};
