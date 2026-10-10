export const chunkDocument = (sections, documentTitle) => {
  const chunks = [];
  const MAX_SIZE = 800;
  const OVERLAP = 100;
  let chunkIndex = 0;

  for (const section of sections) {
    const text = section.content;
    let i = 0;
    while (i < text.length) {
      const end = Math.min(i + MAX_SIZE, text.length);
      let chunkText = text.slice(i, end);
      
      chunks.push({
        chunk_index: chunkIndex++,
        section: section.name,
        content: chunkText,
        embeddingInput: `${documentTitle} - ${section.name}\n${chunkText}`
      });

      if (end === text.length) break;
      i = end - OVERLAP;
      // ensure we don't infinitely loop if overlap is weirdly applied
      if (i <= 0) break; 
    }
  }
  return chunks;
};
