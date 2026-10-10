import fs from 'fs';
import path from 'path';

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    let p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.js')) {
      let content = fs.readFileSync(p, 'utf8');
      let changed = false;
      if (content.includes('\\$')) {
        content = content.replace(/\\\$/g, '$');
        changed = true;
      }
      if (content.includes("join('n')")) {
        content = content.replace(/join\('n'\)/g, "join('\\n')");
        changed = true;
      }
      if (content.includes("join('nn')")) {
        content = content.replace(/join\('nn'\)/g, "join('\\n\\n')");
        changed = true;
      }
      if (content.includes("}nText:")) {
        content = content.replace(/\}nText:/g, "}\\nText:");
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(p, content, 'utf8');
        console.log('Fixed', p);
      }
    }
  });
}
walk('shopsmart-api/src');
