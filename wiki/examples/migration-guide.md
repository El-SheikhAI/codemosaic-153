# CodeMosaic Version 2.x to 3.0 Migration Guide

## Introduction
This document provides a comprehensive technical roadmap for migrating projects from CodeMosaic 2.x to CodeMosaic 3.0. The 3.0 release introduces significant architectural improvements to our Abstract Syntax Tree (AST) pattern-matching engine and template optimization pipeline. 

## Breaking Changes

### 1. AST Pattern Syntax Update
**Change:** Pattern matching now requires explicit node type declarations using RFC 3986 URI syntax  
**Rationale:** Prevents ambiguous matches in nested code structures  

**Before:**
```javascript
{ name: "MyComponent", props: { variant: "primary" } }
```

**After:**
```javascript
{ "ast:jsx/component": { name: "MyComponent", props: { variant: "primary" } } }
```

### 2. Template Partial Registration
**Change:** Template partials now require schema validation during registration  

**Before:**
```ruby
CodeMosaic.register_partial(:header, "<header>{content}</header>")
```

**After:**
```ruby
CodeMosaic.register_partial(:header, 
  template: "<header>{content}</header>",
  schema: { 
    content: { type: :node, required: true } 
  }
)
```

### 3. Optimization Pipeline Configuration
**Change:** The optimization pipeline now uses a declarative composition model  

**Before:**
```yaml
optimizations:
  - dead_code_elimination
  - constant_folding
```

**After:**
```yaml
optimization_pipeline:
  phases:
    - analyzer: dead_code
      params: { strict: true }
    - transformer: constant_fold 
      when: file_size < 2kb
```

## Deprecated Features Removed

| Removed Feature          | Replacement                         |
|--------------------------|-------------------------------------|
| `LegacyPatternEngine`    | `AST::PatternMatcherV2`             |
| `Template#inline_partial`| `TemplateFragment.with_slot`        |
| `:optimize_aggressive`   | Pipeline: `aggressive_optimization` |

## Migration Procedure

### Step 1: Update Configuration Baseline
1. Convert all pattern matchers to URI-qualified syntax:
```bash
codemosaic migrate patterns --input src/patterns/ --output src/patterns/v3/
```

2. Transform legacy optimization configs:
```bash
codemosaic config upgrade --file codemosaic.yml
```

### Step 2: Template System Refactoring
Add schema validation to all partial registrations:
```diff
CodeMosaic.register_partial(:dashboard,
+  schema: {
+    title: { type: :string, length: { max: 60 } },
+    widgets: { type: :node_array, count: { min: 1 } }
+  },
  template: <<~TPL
    <div class="dashboard">
      <h1>{title}</h1>
      <section>{widgets}</section>
    </div>
  TPL
)
```

### Step 3: Pipeline Modernization
Convert sequential optimizations to phased pipelines:
```yaml
# Before
optimizations:
  - whitespace_compression
  - import_bundling

# After
optimization_pipeline:
  phases:
    - phase: preprocessing
      steps:
        - name: whitespace_compression
          target: [".js", ".css"]
    - phase: bundling
      steps:
        - name: import_bundling
          params: { mode: "esm" }
```

## Troubleshooting Migration Issues

### Common Issues & Solutions

**Pattern Matching Failures:**
```log
[Error] No match found for { "ast:es6/function": { name: "render" } }
```
Solution: Verify node types using the AST explorer:
```bash
codemosaic ast inspect --file Component.js --target render
```

**Template Validation Errors:**
```log
[Schema Error] Partial 'header': Missing required slot 'content'
```
Solution: Add null checks or default values in template definitions:
```handlebars
<header>{content || ''}</header>
```

**Pipeline Configuration Warnings:**
```log
[Warning] Unknown optimization phase 'preprocessing' (valid: parsing, analysis, transformation)
```
Solution: Consult phase reference documentation:
```bash
codemosaic docs optimization-phases
```

## Getting Help
Submit migration reports to our Engineering Support Portal:
```
https://support.codemosaic.com/migration
```

Include the output of:
```bash
codemosaic diagnose --version --config
```