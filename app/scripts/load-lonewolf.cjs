// Charge le véritable moteur et le contenu TS dans les tests Node, sans copie.
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'), {
  compilerOptions: {module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true},fileName:filename
}).outputText, filename);
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request,parent,...rest) {
  try { return resolve.call(this,request,parent,...rest); }
  catch(e) {
    if (request.startsWith('.')) for (const ext of ['.ts','.tsx']) {
      try {return resolve.call(this,request+ext,parent,...rest);} catch {}
    }
    throw e;
  }
};
