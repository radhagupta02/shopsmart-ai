import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docPath = path.join(__dirname, '../docs/sample-documents/laptop-return-policy.pdf');
const doc = new PDFDocument();

doc.pipe(fs.createWriteStream(docPath));

doc.fontSize(20).text('Laptop Return Policy', { align: 'center' });
doc.moveDown();
doc.fontSize(12).text('Version: 2026.1');
doc.text('Effective Date: 2026-01-01');
doc.text('Category: Electronics');
doc.text('Region: GLOBAL');
doc.moveDown();

doc.fontSize(16).text('Unopened Products');
doc.fontSize(12).text('You can return unopened products within 30 days for a full refund.');
doc.moveDown();

doc.fontSize(16).text('Opened Products');
doc.fontSize(12).text('Opened products are returnable within 7 days of delivery if there is no physical damage. The product must be returned with all original accessories, its original packaging, and after a factory reset.');
doc.moveDown();

doc.fontSize(16).text('Damaged or Defective Products');
doc.fontSize(12).text('If the product is defective on arrival, you are eligible for a replacement or a full refund within 15 days. Please note that customer-caused physical damage is not returnable, though warranty conditions may apply.');

doc.end();
console.log('Generated laptop-return-policy.pdf');
