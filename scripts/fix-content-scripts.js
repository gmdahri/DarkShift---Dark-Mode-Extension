import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');

function fixScript(scriptPath, scriptName) {
  if (!existsSync(scriptPath)) {
    console.warn(`${scriptName} not found at ${scriptPath}`);
    return;
  }

  let content = readFileSync(scriptPath, 'utf-8');
  
  // Check if it has ES module imports (handle both formatted and minified)
  const hasImports = /import\s*[^'"]*\s*(?:from\s*)?['"]([^'"]+)['"]/.test(content);
  
  if (hasImports || content.includes('import')) {
    console.log(`Fixing ${scriptName}...`);
    
    // Extract all import statements (handle minified code too)
    const importRegex = /import\s*[^'"]*\s*(?:from\s*)?['"]([^'"]+)['"];?/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (!imports.includes(importPath)) {
        imports.push(importPath);
      }
    }
    
    // Read and inline dependencies
    let bundledCode = '';
    
    for (const importPath of imports) {
      // Resolve the import path
      let depPath = importPath;
      if (importPath.startsWith('./')) {
        depPath = join(distDir, 'assets', importPath.replace('./', ''));
      } else if (importPath.startsWith('../')) {
        depPath = join(distDir, importPath);
      } else {
        depPath = join(distDir, 'assets', importPath);
      }
      
      if (existsSync(depPath)) {
        let depContent = readFileSync(depPath, 'utf-8');
        // Remove export statements
        depContent = depContent.replace(/export\s+/g, '');
        bundledCode += `// ${importPath}\n${depContent}\n\n`;
      } else {
        console.warn(`Dependency not found: ${depPath} (from ${importPath})`);
      }
    }
    
    // Remove ALL import statements (handle minified too)
    content = content.replace(/import\s*[^'"]*\s*(?:from\s*)?['"][^'"]+['"];?\n?/g, '');
    content = content.replace(/import\s*['"][^'"]+['"];?\n?/g, '');
    
    // Remove the IIFE wrapper if it was already added
    content = content.replace(/^\(function\(\)\s*\{[\s\S]*'use strict';?\s*\n\n/, '');
    content = content.replace(/\}\)\s*\(\);?\s*$/, '');
    
    // Wrap everything in IIFE
    const iife = `(function() {\n'use strict';\n\n${bundledCode}\n${content}\n})();`;
    
    writeFileSync(scriptPath, iife, 'utf-8');
    console.log(`✓ Fixed ${scriptName}`);
  } else {
    // Already a regular script, just wrap in IIFE if needed
    if (!content.trim().startsWith('(function')) {
      const iife = `(function() {\n'use strict';\n\n${content}\n})();`;
      writeFileSync(scriptPath, iife, 'utf-8');
      console.log(`✓ Wrapped ${scriptName} in IIFE`);
    } else {
      console.log(`✓ ${scriptName} is already in IIFE format`);
    }
  }
}

// Fix content.js
fixScript(join(distDir, 'content.js'), 'content.js');

// Fix background.js
fixScript(join(distDir, 'background.js'), 'background.js');

console.log('Content scripts fixed!');
