// fix-imports.js
// UIコンポーネントのインポートパスを修正するスクリプト
import fs from 'fs';
import path from 'path';

const UI_COMPONENTS_DIR = './components/ui';

// UIコンポーネントディレクトリ内のすべてのファイルを取得
const files = fs.readdirSync(UI_COMPONENTS_DIR)
  .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));

let modifiedCount = 0;

// 各ファイルのインポートパスを修正
files.forEach(file => {
  const filePath = path.join(UI_COMPONENTS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // @/lib/utils を相対パスに置換
  const originalContent = content;
  content = content.replace(/import\s+\{\s*cn\s*\}\s+from\s+['"]@\/lib\/utils['"]/g, 
                          "import { cn } from '../../lib/utils'");
  
  // 他のパスエイリアスも必要に応じて置換
  // content = content.replace(/from\s+['"]@\/components\/(.*)['"]/g, "from '../../components/$1'");
  
  // 変更があった場合のみファイルを書き込み
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log(`Modified: ${filePath}`);
  }
});

console.log(`Total files modified: ${modifiedCount}`);
