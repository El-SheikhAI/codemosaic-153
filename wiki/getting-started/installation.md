# CodeMosaic Installation Guide

## Prerequisites
Before installing CodeMosaic, ensure your development environment meets the following requirements:
- Unix-like operating system (Linux/macOS/WSL2) or Windows 10/11
- Node.js v16.14.0 or later
- npm v8.0.0 or later
- Python 3.8+ (for AST pattern-matching extensions)
- Git 2.30+

## Installation Methods

### Official npm Package (Recommended)
1. Execute the following command in your terminal:
```bash
npm install -g codemosaic-cli
```

2. Verify path configuration:
```bash
echo $PATH | grep -q "/usr/local/bin" || echo 'export PATH="$PATH:/usr/local/bin"' >> ~/.bashrc
```

### Python Package Installation
For Python-centric workflows:
```bash
pip install codemosaic --user
```

### Source Compilation
1. Clone the repository:
```bash
git clone https://github.com/codemosaic/core.git
cd core
```

2. Install dependencies and build:
```bash
npm run bootstrap && npm run build:prod
```

3. Create symbolic link:
```bash
sudo ln -s $(pwd)/bin/codemosaic /usr/local/bin/codemosaic
```

## Verification Protocol
Confirm successful installation with these diagnostics:

1. Version check:
```bash
codemosaic --version
```
Expected output pattern: `vX.Y.Z-stable.[platform]`

2. Integrity test:
```bash
codemosaic validate-install
```
Successful output: `Installation integrity verified (8/8 checks passed)`

3. AST pattern recognition test:
```bash
codemosaic test ast-parser --quick
```
Successful output: `AST processor: Operational (All test cases passed)`

## Post-Installation Configuration
1. Initialize workspace:
```bash
mkdir -p $HOME/.codemosaic/profiles
codemosaic init --profile default
```

2. Set default preferences:
```bash
codemosaic configure --set ast.concurrent_workers=4 --set codegen.template_store=/usr/local/share/codemosaic/templates
```

3. Verify system readiness:
```bash
codemosaic system-status
```

## Troubleshooting

### Common Issues Resolution
| Symptom | Resolution |
|---------|------------|
| `EACCES` permissions error | Prefix install command with `sudo` or configure [npm permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors) |
| `MODULE_NOT_FOUND` | Execute `npm rebuild --update-binary` |
| Python bindings error | Install required dependencies: `sudo apt-get install python3-distutils` (Linux) or `brew install python@3.9` (macOS) |
| AST cache corruption | Execute `codemosaic purge-cache --ast` |

### Diagnostic Commands
- Generate system report:
```bash
codemosaic generate-report --diagnostic > codemosaic-report.txt
```

- Validate environment preconditions:
```bash
curl -s https://install.codemosaic.io/preflight.sh | bash
```

## Uninstallation
1. Remove global installation:
```bash
npm uninstall -g codemosaic-cli
```

2. Purge configuration files:
```bash
rm -rf $HOME/.codemosaic
```

3. Remove Python artifacts:
```bash
pip uninstall codemosaic
```

## Next Steps
Proceed to [Basic Usage Guide](../usage/basic-operations.md) for initial template generation techniques and AST manipulation workflows.