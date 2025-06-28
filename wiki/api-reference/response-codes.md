# CodeMosaic API Response Codes

## Overview
This document enumerates standardized HTTP response codes returned by the CodeMosaic API for dynamic code assembly operations. Response bodies for errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": {
      "ast_pattern_hash": "c93bd...",
      "language": "Python",
      "validation_errors": [
        "..."
      ]
    }
  }
}
```

---

## Success Codes

| Code | Description                        | Scenario                                 |
|------|------------------------------------|------------------------------------------|
| 200  | OK                                 | Successful code template generation      |
| 201  | Created                            | New boilerplate template persisted to DB |
| 204  | No Content                         | Template cache cleared successfully     |

---

## Client-Side Errors (4xx)

| Code | Description                        | Scenario                                         | Error Code Examples            |
|------|------------------------------------|--------------------------------------------------|--------------------------------|
| 400  | Bad Request                        | Malformed AST pattern syntax                    | `INVALID_AST_SYNTAX`           |
| 401  | Unauthorized                       | Missing/invalid API token                        | `AUTH_MISSING_CREDENTIALS`     |
| 403  | Forbidden                          | Token lacks required scopes                      | `PERMISSION_DENIED`            |
| 404  | Not Found                          | Nonexistent template ID requested                | `TEMPLATE_NOT_FOUND`           |
| 409  | Conflict                           | Template version mismatch during updates         | `VERSION_CONFLICT`             |
| 422  | Unprocessable Entity               | Semantic validation of AST pattern failed        | `AST_SEMANTIC_INVALID`         |
| 429  | Too Many Requests                  | Rate limit exceeded (30 requests/second)         | `RATE_LIMIT_EXCEEDED`          |

---

## Server-Side Errors (5xx)

| Code | Description                        | Scenario                                         | Error Code Examples            |
|------|------------------------------------|--------------------------------------------------|--------------------------------|
| 500  | Internal Server Error             | AST transformer runtime exception                | `AST_TRANSFORM_FAILURE`        |
| 502  | Bad Gateway                        | Upstream dependency failure                      | `FRAGMENT_CACHE_UNAVAILABLE`   |
| 503  | Service Unavailable               | Planned maintenance window                       | `SERVICE_MAINTENANCE`          |
| 504  | Gateway Timeout                    | AST processing exceeded 15s timeout              | `TRANSFORM_TIMEOUT`            |

---

## Example Error Response
```json
{
  "error": {
    "code": "AST_SEMANTIC_INVALID",
    "message": "AST pattern contains unreachable control flow nodes",
    "details": {
      "ast_pattern_hash": "e8a7d...",
      "language": "JavaScript",
      "validation_errors": [
        "Unterminated loop condition at line 42",
        "Undefined variable 'userInput' at line 17"
      ]
    }
  }
}
```

---

**Note**: Always implement proper exponential backoff strategies when handling 429 and 5xx responses. For complete error handling guidelines, refer to [Error Best Practices](../guides/error-handling.md).