# CodeMosaic API Endpoint Reference

## Overview
The CodeMosaic API provides programmatic access to dynamic code fragment assembly operations through AST pattern-matching. This document provides technical specifications for all API endpoints, including request formats, response structures, and status code definitions.

---

## Base URL
`https://api.codemosaic.io/v1`

---

## Response Headers
All responses include:
```http
X-Request-ID: UUID4
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 3600
```

---

## Core Endpoints

### 1. Template Generation
**POST** `/templates/generate`

Generates optimized code templates using AST pattern-matching.

#### Request Body
```json
{
  "source_language": "Python",
  "target_language": "JavaScript",
  "ast_pattern": {
    "type": "FunctionDeclaration",
    "params": [{"type": "Identifier"}],
    "body": {"type": "BlockStatement"}
  },
  "constraints": {
    "performance": "high",
    "verbosity": "low"
  }
}
```

#### Response: 201 Created
```json
{
  "template_id": "tmpl_5k7g9f3v2d",
  "checksum": "7c5d3a9e1b86f2e4",
  "generated_code": "(params) => {\n  // Optimized implementation\n}",
  "warnings": [
    "Anonymous functions may reduce traceability"
  ],
  "ast_compatibility": {
    "python": ">=3.8",
    "javascript": "ES2020+"
  }
}
```

#### Error States
- `400`: Invalid AST pattern syntax
- `422`: Unsupported language pair
- `429`: Template generation quota exceeded

---

### 2. Fragment Composition
**POST** `/fragments/compose`

Assembles code fragments into executable patterns.

#### Request Parameters
| Parameter | Type     | Required | Description              |
|-----------|----------|----------|--------------------------|
| `mode`    | `string` | Yes      | `strict` or `adaptive`   |
| `validate`| `boolean`| No       | Enable AST validation    |

#### Request Body
```json
{
  "base_fragment": "func_base_8876",
  "components": [
    {"fragment_id": "cond_3452", "position": 2},
    {"fragment_id": "loop_7615", "position": 4}
  ],
  "context": {
    "variables": ["input", "output"],
    "dependencies": ["numpy", "pandas"]
  }
}
```

#### Response: 200 OK
```json
{
  "composition_id": "comp_234k6g89d3",
  "assembled_code": "import numpy as np\n\ndef process(input, output):\n    if input:\n        for item in output:\n            np.transform(item)",
  "validation_report": {
    "ast_integrity": 98.7,
    "security_score": "A"
  }
}
```

---

### 3. Template Analysis
**GET** `/templates/{template_id}/analysis`

Performs static analysis on generated templates.

#### Path Parameters
| Parameter       | Type     | Description                      |
|-----------------|----------|----------------------------------|
| `template_id`   | `string` | UUID of target template          |

#### Query Parameters
| Parameter       | Type     | Default   | Description                  |
|-----------------|----------|-----------|------------------------------|
| `depth`         | `integer`| 1         | Analysis depth (1-3)         |
| `metrics`       | `array`  | all       | Specify metrics to return    |

#### Response: 200 OK
```json
{
  "template_id": "tmpl_5k7g9f3v2d",
  "complexity_metrics": {
    "cyclomatic": 8.2,
    "halstead_volume": 342.6,
    "maintainability_index": 72.4
  },
  "performance_characteristics": {
    "big_o": "O(n log n)",
    "memory_footprint": "12kB"
  },
  "cross_platform": {
    "linux": "compatible",
    "windows": "partial"
  }
}
```

---

## Support Endpoints

### 1. Health Check
**GET** `/system/health`

Returns service status and subsystem diagnostics.

#### Response: 200 OK
```json
{
  "status": "operational",
  "components": {
    "ast_matcher": {
      "status": "online",
      "latency": "12ms",
      "version": "2.4.1"
    },
    "fragment_cache": {
      "status": "online",
      "hit_rate": 94.3,
      "size_gb": 2.4
    }
  }
}
```

### 2. Rate Limit Status
**HEAD** `/system/rate_limit`

Returns current rate limit status in headers.

---

## Error Handling

### Standard Error Format
```json
{
  "error": {
    "code": "TM02",
    "message": "AST pattern contains circular references",
    "documentation": "https://api.codemosaic.io/docs/errors/TM02",
    "context": {
      "offending_node": "BlockStatement:23"
    }
  }
}
```

### Status Code Mapping
| HTTP Status | Error Category           |
|-------------|--------------------------|
| 400         | Validation errors        |
| 401         | Authentication failure   |
| 403         | Authorization failure    |
| 404         | Resource not found       |
| 422         | Semantic validation      |
| 429         | Rate limiting            |
| 500         | Internal server error    |
| 503         | Service unavailable      |