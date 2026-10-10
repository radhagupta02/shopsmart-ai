import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const parsePdf = async (buffer) => {
  const options = {
    pagerender: (pageData) => {
      return pageData.getTextContent().then((textContent) => {
        let lastY, text = '';
        for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }
        return `--- PAGE_BREAK ---\n${text}`;
      });
    }
  };

  const parsed = await pdfParse(buffer, options);
  if (!parsed.text || !parsed.text.trim()) {
    throw new Error('Empty extraction');
  }

  const pages = parsed.text.split('--- PAGE_BREAK ---');
  const sections = [];
  
  pages.forEach((pageText, i) => {
    if (pageText.trim()) {
      sections.push({ name: `Page ${i}`, content: pageText.trim() });
    }
  });

  if (sections.length === 0) {
    throw new Error('Empty extraction');
  }

  return sections;
};
