# CodeMosaic Setup Guide

## Prerequisites
- Python 3.9 or later
- pip 22.0 or later
- Virtual environment manager (recommended)

## Installation Procedure
1. Create and activate virtual environment:
   ```bash
   python -m venv codemosaic-env
   source codemosaic-env/bin/activate  # Unix/MacOS
   codemosaic-env\Scripts\activate  # Windows
   ```

2. Install via pip:
   ```bash
   pip install codemosaic-core
   ```

3. Verify installation:
   ```bash
   codemosaic --version
   ```

## Configuration
Create configuration file at `~/.codemosaic/config.yaml`:

```yaml
runtime:
  ast_pattern_library: /path/to/patterns
  optimization_profiles:
    - performance
    - readability
  cache_size: 1024

logging:
  level: INFO
  rotate: true
```

Key Configuration Parameters:
- `ast_pattern_library`: Directory containing AST pattern definitions
- `optimization_profiles`: Ordered list of optimization strategies
- `cache_size`: LRU cache size for compiled patterns (MB)

## Initialization
Initialize pattern library:
```bash
codemosaic init --patterns ./standard-patterns
```

This creates the following directory structure:
```
standard-patterns/
├── python/
│   ├── class_definition.json
│   └── decorator_pattern.json
├── javascript/
└── shared/
    └── license_boilerplate.json
```

## Verification Test
Execute validation sequence:
```bash
codemosaic verify --template flask_app
```

Expected successful output:
```
[STATUS] Pattern library initialized: 47 patterns loaded
[OUTPUT] Generated Flask scaffold:
  - app.py (324 bytes)
  - templates/index.html (127 bytes)
  - requirements.txt (18 bytes)
Verification complete: 3 files generated (0.82s)
```

## Troubleshooting
Common issues and resolutions:

1. **Python Version Mismatch**  
   Error: `SyntaxError: invalid syntax in pattern definition`  
   Fix: Ensure Python ≥3.9 using `python --version`

2. **YAML Configuration Errors**  
   Error: `InvalidConfigError: Malformed YAML structure`  
   Fix: Validate config with online YAML linter

3. **Pattern Initialization Failure**  
   Error: `EmptyPatternLibraryWarning: No valid patterns detected`  
   Fix: Check directory permissions and pattern file extensions (.json)

## Next Steps
Proceed to the [Pattern Development Guide](../pattern-development/creating-patterns.md) to:
1. Design custom AST matching rules
2. Configure optimization profiles
3. Extend boilerplate templates