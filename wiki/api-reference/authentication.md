# Authentication

## Overview
This document outlines the authentication protocol for CodeMosaic's public API. All programmatic interactions with the CodeMosaic engine require valid credentials to ensure secure access to AST-based code generation services.

## Authentication Methods

### API Tokens (Recommended)
The primary authentication mechanism utilizes JWT (JSON Web Tokens) passed via the `Authorization` header:

```http
Authorization: Bearer <your_api_token>
```

Tokens grant scoped access to:
- AST pattern matching operations
- Template generation endpoints
- Code optimization workflows

## Obtaining API Tokens

1. Navigate to **Project Settings > API Access** in the CodeMosaic dashboard
2. Generate a new token with appropriate permissions:
   - `read: ast_analysis`
   - `write: template_generation`
   - `execute: code_optimization`
3. Store the token securely using encrypted storage solutions

## Usage Example 

```bash
curl -X POST https://api.codemosaic.dev/v1/generate \
  -H "Authorization: Bearer cm-token-12345" \
  -H "Content-Type: application/json" \
  -d '{"ast_pattern": "class_declaration", "language": "python"}'
```

## Authentication Failure Responses

| HTTP Status | Error Code             | Resolution Steps                     |
|-------------|------------------------|--------------------------------------|
| 401         | INVALID_CREDENTIALS    | Verify token validity and scope      |
| 403         | INSUFFICIENT_SCOPE     | Regenerate token with required permissions |
| 429         | RATE_LIMIT_EXCEEDED    | Implement exponential backoff strategy |

## Security Best Practices
1. **Never** commit tokens to version control systems
2. Rotate tokens every 90 days via the dashboard
3. Restrict network access to known IP ranges when possible
4. Always use HTTPS endpoints (TLS 1.2+ required)

## Token Expiration and Revocation
- Default validity period: 90 days from issuance
- Immediate revocation available through:
  - CodeMosaic developer dashboard
  - Programmatic revocation API endpoint
- Revoked tokens become invalid within 15 seconds globally

## Cross-Project Authentication
For multi-project workflows, use OAuth2 client credentials flow:

```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=your_client_id
&client_secret=your_client_secret
&scope=ast:read template:write
```

---

This documentation was last updated on 2023-10-15. Always refer to the `X-API-Version` header in responses for compatibility guidance.