# CodeMosaic SDK Reference

## Overview
CodeMosaic provides a programmatic interface for dynamically assembling code fragments by leveraging Abstract Syntax Tree (AST) pattern-matching. This SDK enables developers to generate optimized boilerplate code through declarative template definitions and AST transformations.

---

## Installation
```bash
# Node.js
npm install codemosaic-sdk --save

# Python
pip install codemosaic
```

---

## Initialization
```typescript
import { FragmentAssembler } from 'codemosaic-sdk';

const assembler = new FragmentAssembler({
  astPatternsDir: './patterns',
  outputEngine: 'typescript', // Options: typescript, python, java
  optimizationLevel: 2, // Range: 0-3
});
```

---

## Core APIs

### 1. FragmentAssembler
Primary class for code generation operations.

#### assembleFragment(templateKey: string, contextData: object)
```typescript
const result = await assembler.assembleFragment(
  'express-router', 
  {
    routes: [
      { method: 'GET', path: '/users', handler: 'getUsers' },
      { method: 'POST', path: '/users', handler: 'createUser' }
    ]
  }
);
```

**Input Structure:**
```json
{
  "templateKey": "express-router",
  "contextData": {
    "controllerName": "UserController",
    "routes": [
      {
        "method": "GET",
        "path": "/users",
        "handler": "getUsers",
        "middleware": []
      }
    ]
  }
}
```

**Output:**
```typescript
import { Router } from 'express';
import UserController from '../controllers/user';

const router = Router();

router.get('/users', UserController.getUsers);
router.post('/users', UserController.createUser);

export default router;
```

---

### 2. AST Utilities

#### NodeMatcher<T extends ASTNode>(pattern: ASTPattern)
```typescript
import { NodeMatcher } from 'codemosaic-sdk/ast';

const functionMatcher = new NodeMatcher<FunctionDeclaration>({
  type: 'FunctionDeclaration',
  identifier: /^handle.*/,
  params: { min: 2, max: 5 }
});

const matches = functionMatcher.findIn(ast);
```

#### TemplateBuilder
```typescript
import { TemplateBuilder } from 'codemosaic-sdk';

new TemplateBuilder()
  .withPattern('async-function')
  .withPlaceholders({
    funcName: 'fetchData',
    parameters: ['url: string', 'options?: RequestInit'],
    returnType: 'Promise<Response>'
  })
  .applyOptimizations(['arrow-conversion', 'promise-simplification'])
  .generate();
```

---

## Lifecycle Hooks

### 1. onBeforeGenerate
```typescript
assembler.registerHook('onBeforeGenerate', (context) => {
  if (!context.validateSchema(schema)) {
    throw new FragmentValidationError('Invalid context structure');
  }
  return context.normalize();
});
```

### 2. onAfterOptimize
```typescript
assembler.registerHook('onAfterOptimize', (ast, metadata) => {
  if (metadata.language === 'typescript') {
    return applyTypeAnnotations(ast);
  }
  return ast;
});
```

---

## Error Handling

### Custom Error Classes
```typescript
try {
  await assembler.assembleFragment(...);
} catch (error) {
  if (error instanceof FragmentAssemblyError) {
    console.error(`AST Validation Failed: ${error.diagnostics}`);
  }
}
```

**Error Structure:**
```json
{
  "code": "E103",
  "message": "Unresolved AST placeholders detected",
  "diagnostics": [
    {
      "nodeType": "VariableDeclaration",
      "position": { "line": 42, "column": 12 },
      "expected": "Identifier",
      "found": "Placeholder"
    }
  ]
}
```

---

## Advanced Patterns

### Custom Transformers
```typescript
import { ASTTransformer } from 'codemosaic-sdk/ast';

class AsyncAwaitTransformer extends ASTTransformer {
  visitCallExpression(node: CallExpression) {
    if (node.callee.name === 'then') {
      return this.transformPromiseChain(node);
    }
    return super.visitCallExpression(node);
  }
  
  private transformPromiseChain(node: CallExpression) {
    // Implementation logic
  }
}

assembler.registerTransformer('promise-optimization', new AsyncAwaitTransformer());
```

---

## Modular Extension

### Plugin System
```javascript
// custom-template-pack.js
export default {
  name: 'graphql-resolvers',
  patterns: {
    'resolver-basic': require('./templates/basic-resolver.ast'),
    'resolver-paginated': require('./templates/paginated-resolver.ast')
  },
  transformers: [new GraphQLOptimizer()]
};
```

**Registration:**
```typescript
assembler.registerPlugin(require('./custom-template-pack'));
```

---

## Common Issues

### Troubleshooting Table
| Error Code | Cause | Resolution |
|------------|-------|------------|
| E101       | Missing AST pattern directory | Verify `astPatternsDir` configuration |
| E204       | Context-data schema mismatch | Use `validateContextSchema()` helper |
| E309       | Circular template dependencies | Run `analyzeTemplateDependencies()` |

---

## References
1. Abstract Syntax Tree Theory (Springer, 2021)
2. Generative Software Patterns (MIT Press, 2023)
3. API Design Patterns (Addison-Wesley, 2022)