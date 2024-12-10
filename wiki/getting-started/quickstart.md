# Quickstart Guide for CodeMosaic

## Overview
CodeMosaic is an advanced code generation system that dynamically assembles optimized boilerplate templates through Abstract Syntax Tree (AST) pattern-matching. This guide provides essential steps to install and execute fundamental operations.

## Prerequisites
- Python 3.8 or higher
- pip package manager
- Git (recommended for template repository cloning)

## Installation
1. Install the core package:
```bash
pip install codemosaic
```

2. Verify installation:
```bash
codemosaic --version
```

## Basic Workflow
### 1. Template Initialization
Create a template definition file (`pattern-rules.yaml`):
```yaml
patterns:
  - language: python
    target: function
    signature: "def $name($args) -> $return_type:"
    body: |
        \"\"\"Generated docstring\"\"\"
        # Auto-generated implementation
    constraints:
      min_parameters: 1
      max_parameters: 3
```

### 2. Template Execution
Run the assembler:
```bash
codemosaic assemble \
  --patterns ./pattern-rules.yaml \
  --target-dir ./templates \
  --output ./generated_api.py
```

### 3. Output Validation
Examine the generated file:
```python
# generated_api.py
def calculate_sum(a: int, b: int) -> int:
    """Generated docstring"""
    # Auto-generated implementation

def process_data(input: str, config: dict) -> bool:
    """Generated docstring"""
    # Auto-generated implementation
```

## Example: REST Endpoint Generation
### Input Template (`rest-rules.yaml`)
```yaml
patterns:
  - language: python
    target: class
    inheritance: ["FastAPI"]
    methods:
      - decorator: "@app.get('/$endpoint')"
        signature: "def $handler(self) -> dict:"
        body: |
            return {"status": "processed"}
```

### Generation Command
```bash
codemosaic assemble \
  --patterns ./rest-rules.yaml \
  --target-dir ./web_templates \
  --output ./api_endpoints.py
```

### Generated Output
```python
from fastapi import FastAPI

class UserAPI(FastAPI):
    @app.get('/users')
    def get_users(self) -> dict:
        return {"status": "processed"}

    @app.get('/metrics')
    def get_metrics(self) -> dict:
        return {"status": "processed"}
```

## Next Steps
1. Explore advanced pattern constraints in [Pattern Matching Reference](../advanced/pattern-specification.md)
2. Learn template composition techniques in [Template Inheritance Guide](../features/template-inheritance.md)
3. Review performance optimization in [Best Practices](../best-practices/performance.md)