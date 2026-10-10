import fs from 'fs';
import path from 'path';

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    let p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.js')) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('\\`')) {
        content = content.replace(/\\`/g, '`');
        fs.writeFileSync(p, content, 'utf8');
        console.log('Fixed', p);
      }
    }
  });
}
walk('shopsmart-api/src');
