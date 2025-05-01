/**
 * Edge Functions ビルドスクリプト
 * 
 * このスクリプトは以下の処理を行います：
 * 1. src/edge ディレクトリから Edge Functions のソースコードを読み込む
 * 2. 必要に応じてトランスパイルやバンドルを行う
 * 3. supabase/functions ディレクトリに出力する
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 設定
const sourceDir = path.resolve(__dirname, '../src/edge');
const targetDir = path.resolve(__dirname, '../../../supabase/functions');

// supabase/functions ディレクトリがなければ作成
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created target directory: ${targetDir}`);
}

/**
 * ディレクトリ内のファイルをコピーする関数
 */
function copyEdgeFunctions(source, target, isRoot = true) {
  // _shared ディレクトリは特別扱い（各関数ディレクトリにコピーする）
  const isSharedDir = path.basename(source) === '_shared';
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(target) && !isSharedDir) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  // ディレクトリ内のファイルを取得
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    
    // _shared ディレクトリの場合は各関数ディレクトリにコピーするため、ここではスキップ
    if (isRoot && entry.name === '_shared') continue;
    
    if (entry.isDirectory()) {
      // サブディレクトリの場合は再帰的に処理
      const targetPath = path.join(target, entry.name);
      copyEdgeFunctions(sourcePath, targetPath, false);
      
      // 各関数ディレクトリに _shared の内容をコピー
      const sharedDir = path.join(sourceDir, '_shared');
      if (fs.existsSync(sharedDir)) {
        const targetSharedDir = path.join(targetPath);
        if (!fs.existsSync(targetSharedDir)) {
          fs.mkdirSync(targetSharedDir, { recursive: true });
        }
        
        // _shared ディレクトリの内容をコピー
        const sharedFiles = fs.readdirSync(sharedDir, { withFileTypes: true });
        for (const sharedFile of sharedFiles) {
          if (sharedFile.isFile()) {
            const sharedSourcePath = path.join(sharedDir, sharedFile.name);
            const sharedTargetPath = path.join(targetSharedDir, sharedFile.name);
            fs.copyFileSync(sharedSourcePath, sharedTargetPath);
            console.log(`Copied shared file: ${sharedTargetPath}`);
          }
        }
      }
    } else if (entry.isFile() && !isSharedDir) {
      // ファイルの場合はそのままコピー
      const targetPath = path.join(target, entry.name);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied file: ${targetPath}`);
    }
  }
}

// Edge Functions のビルドとコピー
try {
  console.log('Building Edge Functions...');
  
  // TypeScriptのトランスパイルは現在行わず、直接コピーする
  // 将来的にはここでトランスパイルやバンドルを行うことも可能
  copyEdgeFunctions(sourceDir, targetDir);
  
  console.log('Edge Functions build completed successfully!');
} catch (error) {
  console.error('Error building Edge Functions:', error);
  process.exit(1);
}
