# CodeMosaic Testing Guidelines

## 1. Introduction
Comprehensive testing is foundational to CodeMosaic's architecture due to:  
- The generative nature of code fragment assembly  
- Critical correctness requirements for AST transformations  
- Performance implications of pattern-matching operations  

All contributions must demonstrate corresponding test coverage with rationale for testing strategy.  

## 2. Testing Philosophy
Our approach rests on three pillars:

1. **Determinism**  
   All transformations must produce predictable outputs for identical inputs across environments

2. **AST Integrity**  
   Generated syntax trees must maintain:  
   - Syntactic validity (language grammar compliance)  
   - Semantic consistency (type-safe relationships)  
   - Structural equivalence (pattern preservation)

3. **Performance Thresholds**  
   Pattern-matching operations must complete within O(n log n) time complexity for average cases

## 3. Test Classifications
### 3.1. Unit Tests
**Scope**: Isolated validation of AST node handlers and matching primitives  
**Requirements**:  
```markdown
- Cover all boundary conditions for pattern matchers  
- Validate node transformation purity (no side effects)  
- Include minimization tests for parallel execution contexts  
```

### 3.2. Integration Tests
**Focus**: Interaction between:  
- Fragment assembler components  
- Cross-language AST adapters  
- Optimization pipelines  

**Validation Criteria**:  
1. Intermediate representation consistency  
2. Transformation pipeline idempotency  
3. Memory boundary compliance  

### 3.3. Golden Master Tests
**Implementation**:  
```bash
# Generate new golden masters
npm run test:golden -- --update

# Validate against existing masters
npm run test:golden
```  

**Characteristics**:  
- Capture complete template outputs for benchmark use cases  
- Protected by cryptographic hashing (SHA-256)  
- Required for all publicly exported templates  

## 4. AST-Specific Validation
### 4.1. Structural Assertions
Leverage custom matchers:  
```javascript
expect(ast).toMatchSyntaxTree({
  type: 'FunctionDeclaration',
  params: [{type: 'Identifier'}],
  body: {
    type: 'BlockStatement',
    minLength: 1
  }
});
```

### 4.2. Transformation Idempotency
```markdown
1. Apply transformation twice  
2. Assert deep equality between first and second output AST  
3. Validate no diagnostic differences
```

## 5. Performance Benchmarks
**CI Requirements**:  
```yaml
- Cold start compilation: < 1.5s (p99)  
- Pattern match throughput: > 5k ops/sec  
- Memory ceiling: < 500MB per worker
```

**Measurement Protocol**:  
```bash
npm run perf:baseline -- --scenario=large_ast
npm run perf:compare -- --baseline=20230601-1234
```

## 6. Coverage Standards
**Minimum Requirements**:  
```markdown
- 95% statement coverage (enforced by CI)  
- 100% public API boundary coverage  
- Mutation score ≥ 80% (Stryker.js)  
```

**Verification**:  
```bash
# Generate coverage report
npm run test:coverage

# Mutation testing
npm run test:mutation
```

## 7. Continuous Integration
Pipeline stages must:  

1. **Isolation**: Execute tests in dockerized environments  
2. **Determinism**: Disallow timing-dependent assertions  
3. **Precision**: Use exact AST comparisons, not textual diffs  
4. **Periodicity**: Run performance benchmarks nightly  

## 8. Contribution Requirements
**Test Guidelines**:  
- New features require benchmark profiling  
- Bug fixes must include regression test  
- Golden master updates require dual maintainer approval  

**Prohibited Patterns**:  
```markdown
> 1. Environment-specific test logic  
> 2. Floating-point equality assertions  
> 3. Unbounded non-deterministic operations  
```

## 9. References
1. [AST Specification](wiki/architecture/ast-specification.md)  
2. [Performance Budget](wiki/contributing/performance-budget.md)  
3. [Diagnostic System](wiki/architecture/diagnostics.md)  