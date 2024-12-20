# Custom Middleware Development in CodeMosaic

## Introduction
Middleware in CodeMosaic serves as a processing layer between abstract syntax tree (AST) pattern-matching operations and code template assembly. Custom middleware implementations enable developers to inject domain-specific transformations, validation checks, or optimization routines during the code generation lifecycle.

## Implementation Requirements
A valid middleware implementation must:
1. Inherit from `BaseMiddleware` class
2. Implement the `process` method
3. Accept and return standardized `ASTBundle` objects
4. Maintain immutability of input AST structures

## Example: Execution Logger Middleware
```typescript
import { 
  BaseMiddleware, 
  ASTBundle, 
  MiddlewareContext 
} from '@codemosaic/core';

export class ExecutionLogger extends BaseMiddleware {
  async process(
    astBundle: ASTBundle, 
    context: MiddlewareContext = {}
  ): Promise<ASTBundle> {
    const executionId = crypto.randomUUID();
    const entryTimestamp = Date.now();

    console.debug(`[${executionId}] Starting processing at ${entryTimestamp}`);
    const processed = await super.process(astBundle, context);
    
    const exitTimestamp = Date.now();
    const duration = exitTimestamp - entryTimestamp;
    console.debug(
      `[${executionId}] Completed in ${duration}ms | ` +
      `Nodes processed: ${processed.metadata.nodeCount}`
    );
    
    return processed;
  }
}
```

## Integration Workflow
1. **Registration**: Add middleware to CodeMosaic configuration
```yaml
# codemosaic.config.yml
middlewares:
  - class: utils/ExecutionLogger
    priority: 100
    config:
      logLevel: verbose
```

2. **Execution Order**: Middlewares execute in priority-ascending order (0 → 1000)

3. **Context Propagation**: Shared context persists across middleware chain
```typescript
// Subsequent middleware access
context.correlationId = executionId; 
```

## Operational Semantics
1. Input AST validation occurs before any middleware execution
2. Each middleware receives the output of its predecessor
3. Parallel processing permitted when implementations expose thread-safe guarantees
4. Critical errors trigger rollback via `MiddlewareRollbackException`

## Performance Considerations
1. **Complexity Constraints**  
   Maintain O(n log n) time complexity relative to AST node count

2. **Memory Management**  
   Clone AST subtrees selectively using structural sharing:
   ```typescript
   const modified = astBundle.shallowClone();
   modified.replaceNode(path, updatedNode);
   ```

3. **Idempotency**  
   Ensure repeated processing yields identical output:
   ∀x, m(m(x)) = m(x)

## Verification Protocol
Validate middleware correctness using the reference test suite:
```bash
ctest -R Middleware_ExecutionLogger --verbose
```

Test cases must cover:
- Null input handling
- Cyclic AST structures
- Metadata preservation
- Cross-platform serialization

## Best Practices
1. **Isolate Side Effects**: Confine I/O operations to dedicated middleware
2. **Version Compatibility**: Declare runtime constraints
```json
{
  "engine": {
    "minVersion": "2.3.0",
    "maxVersion": "3.1.4"
  }
}
```
3. **Diagnostic Instrumentation**: Implement `getDiagnostics()` for runtime introspection
4. **Partial Processing**: Support selective AST traversal via `NodeFilter` predicates

## Conclusion
Custom middleware implementations extend CodeMosaic's code generation pipeline while preserving the core engine's reliability guarantees. The Execution Logger example demonstrates how to implement cross-cutting concerns without coupling to specific AST patterns. Adherence to the immutability contract and complexity guidelines ensures system-wide stability during template assembly operations.

For advanced use cases, reference the AST Manipulation API specification (RFC-2047) in the CodeMosaic architecture repository.