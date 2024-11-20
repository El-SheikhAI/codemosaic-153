# Basic Usage

## Introduction
This document provides foundational knowledge for utilizing CodeMosaic to assemble optimized code fragments through Abstract Syntax Tree (AST) pattern-matching. The workflow consists of three primary phases: module definition, pattern matching, and template generation.

## Installation
```bash
npm install codemosaic-core --save-dev
```

## Quickstart Example

### 1. Module Declaration
Create a `.cm` module file:

```javascript
// react-component.cm
module('FunctionalComponent', () => {
  mat('PropsDeclaration', match => {
    return match.interface('ComponentProps');
  });

  tile('Template', () => `
    import React from 'react';
    
    interface ${mat.PropsDeclaration.name} {
      ${mat.PropsDeclaration.fields}
    }

    const ${mosaic.componentName} = (props: ${mat.PropsDeclaration.name}) => (
      ${mosaic.children}
    );
  `);
});
```

### 2. Pattern Matching Engine
CodeMosaic's AST processor identifies structural patterns:

```javascript
const { CodeMosaic } = require('codemosaic-core');
const generator = new CodeMosaic();

generator.matcher.registerPattern('PropsDeclaration', {
  criteria: node => node.type === 'TSInterfaceDeclaration'
});
```

### 3. Template Generation
Execute the compilation workflow:

```javascript
const output = generator.compile({
  module: 'FunctionalComponent',
  params: {
    componentName: 'Button',
    children: '<button {...props} />'
  }
});

console.log(output.code);
```

## Core Conceptual Architecture

### Modules
Organizational units containing matching rules and template blueprints:

```javascript
module('TypeFactory', () => {
  // Matchers and tiles defined here
});
```

### Mats (Pattern Matchers)
AST-based pattern recognition components:

```javascript
mat('ClassDeclaration', match => {
  return match.class('ViewModel', {
    methods: ['serialize', 'deserialize']
  });
});
```

### Tiles (Template Constructs)
Template fragments with injected metadata:

```markdown
# ${mat.ClassDeclaration.name}

**Methods:**
${mat.ClassDeclaration.methods.map(m => `- \`${m}\``).join('\n')}

```;

### Mosaics (Compiled Output)
The final generated artifact combining matched patterns with template logic:

```javascript
{
  meta: {
    astMatches: [...],
    compilationMetrics: {...}
  },
  code: '...generated source...'
}
```

## Error Handling
CodeMosaic throws compile-time errors for:

1. Pattern match failures
2. Template variable resolution errors
3. AST traversal exceptions

```javascript
try {
  generator.compile(...);
} catch (error) {
  console.error('[CodeMosaic] Compilation Error:', error.diagnostics);
}
```

## Build System Integration

### Webpack Loader
```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.cm$/,
      use: ['codemosaic-loader']
    }
  ]
}
```

### Babel Plugin
```json
{
  "plugins": ["codemosaic-babel-plugin"]
}
```

## Advanced Topics
For sophisticated use cases, refer to:
1. AST traversal customization
2. Multi-module composition
3. Performance optimization techniques
4. Custom matcher registration

---

**Next:** Explore [Pattern Matching Strategies](../advanced/pattern-matching.md) for complex AST recognition scenarios.