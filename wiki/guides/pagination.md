# Pagination Implementation Guide

## 1. Introduction to Pagination in CodeMosaic
Pagination is a critical technique for managing large datasets in modern applications. CodeMosaic implements pagination through abstract syntax tree (AST) transformations that generate optimal data retrieval patterns based on your schema and query structure. Our framework supports three primary pagination strategies:

- **Offset-based pagination**: Traditional page number system
- **Cursor-based pagination**: Opaque pointer-based navigation
- **Keyset pagination**: Column value-based sequential access

## 2. Basic Implementation

### 2.1 Offset Pagination Template
```yaml
# AST Pattern: OffsetPagination
metadata:
  pattern: "Query{SelectionSet(edges: [Node])}"
parameters:
  - name: "pageSize"
    default: 25
    type: "Int!"
  - name: "pageNumber"
    default: 1
    type: "Int!"
transformations:
  - operation: "AddPaginationArguments"
    arguments:
      - name: "limit"
        value: "$pageSize"
      - name: "offset"
        value: "($pageNumber - 1) * $pageSize"
```

### 2.2 Implementation Notes
- Use for small datasets (<10,000 records)
- Supports random page access
- Performance degrades linearly with offset value

## 3. Advanced Techniques

### 3.1 Cursor-Based Pagination
```yaml
# AST Pattern: CursorPagination
metadata:
  pattern: "Query{Connection(edges: [Edge], pageInfo: {endCursor, hasNextPage})}"
parameters:
  - name: "first"
    default: 25
    type: "Int!"
  - name: "after"
    type: "String!"
transformations:
  - operation: "AddCursorArguments"
    arguments:
      - name: "first"
        value: "$first"
      - name: "after"
        value: "$after"
validation:
  - field: "pageInfo.hasNextPage"
    error: "EndOfPagination"
```

### 3.2 Keyset Pagination (Recommended for Large Datasets)
```sql
-- Generated Template
SELECT * FROM records
WHERE created_at > :last_created_at
ORDER BY created_at DESC
LIMIT :page_size
```
Performance characteristics:
→ Constant time complexity O(1)
→ No duplicate records during inserts
→ Requires indexed column for sorting

## 4. AST Customization Patterns

### 4.1 Custom Connection Types
To extend pagination templates:
```typescript
// Extend base connection type
type CustomConnection implements NodeConnection {
  totalCount: Int!
  pageInfo: PageInfo!
  edges: [CustomEdge!]!

  // Add custom pagination metrics
  currentPage: Int!
  totalPages: Int!
}
```

### 4.2 Pagination Parameter Validation
```yaml
validations:
  - condition: "$pageSize <= 100"
    error: "MaxPageSizeExceeded"
    severity: "ERROR"
  - condition: "$pageNumber > 0"
    error: "InvalidPageNumber"
    severity: "ERROR"
```

## 5. Performance Considerations

1. **Indexing Strategy**
   - Create composite indexes on sorting columns
   - Covering indexes for frequent queries

2. **Connection Pooling**
   ```yaml
   configuration:
     db_pool:
       min_connections: 5
       max_connections: 100
       idle_timeout: 300s
   ```

3. **Rate Limiting**
   - 1000 requests/minute per API endpoint
   - 100 concurrent connections per service

## 6. Common Implementation Pitfalls

### Pitfall: Off-by-One Errors
**Solution**: Use inclusive/exclusive bounds validation
```typescript
function validateCursor(cursor: string, lastItem: object) {
  return cursor === encodeBase64(lastItem.sortKey);
}
```

### Pitfall: Inconsistent Page Sizes
**Solution**: Apply strict validation
```yaml
parameters:
  - name: "pageSize"
    constraints:
      min: 1
      max: 100
      default: 25
```

### Pitfall: Count Inaccuracy
**Alternative Approach**:
```sql
-- Approximate count for large datasets
SELECT est_count FROM pg_estimate_count('table_name');
```

## 7. Troubleshooting

**Symptom**: Missing page data during high concurrency  
→ Solution: Implement read-after-write consistency patterns

**Symptom**: Slow count operations  
→ Solution: Use cached counters or probabilistic data structures

**Symptom**: Inconsistent sort order  
→ Solution: Add secondary sort column (e.g., UUID) to break ties

## 8. Conclusion
Proper pagination implementation requires careful consideration of your data access patterns and scale requirements. CodeMosaic's AST-driven approach generates optimized implementations while allowing customization through our template modification system. For production systems exceeding 1M records, we strongly recommend cursor-based or keyset pagination implementations with proper indexing strategies.