// CodeMosaic Client SDK Demonstration
// Academic Usage Example for AST-Driven Code Generation

import { CodeMosaicClient } from '@codemosaic/sdk';

/**
 * Demonstrates dynamic template assembly using AST pattern-matching
 * This production-ready example illustrates optimal SDK usage patterns
 */
async function executeCodeGenerationWorkflow() {
  // Initialize client with production configuration
  const client = new CodeMosaicClient({
    endpoint: 'https://api.codemosaic.io/v1',
    astStrategy: 'optimized',
    caching: true
  });

  try {
    // Register code fragments with AST annotations
    await client.defineFragment('logging-wrapper', {
      language: 'javascript',
      pattern: {
        type: 'FunctionDeclaration',
        wrapper: true,
        hooks: {
          pre: 'console.time("execution");',
          post: 'console.timeEnd("execution");'
        }
      }
    });

    await client.defineFragment('data-transformer', {
      language: 'javascript',
      pattern: {
        type: 'ClassDeclaration',
        methods: ['map', 'filter', 'reduce'],
        optimalStructure: true
      }
    });

    // Assemble boilerplate with dynamic optimization
    const generatedCode = await client.assembleTemplate({
      components: [
        { fragment: 'logging-wrapper', target: 'data-transformer' },
        { fragment: 'data-transformer', configurations: { modular: true } }
      ],
      optimizationProfile: 'production'
    });

    // Validate and output results
    if (generatedCode.validateAST()) {
      console.log('Generated Production Code:\n');
      console.log(generatedCode.toString());
      console.log('\nAST Validation: Successful');
      console.log(`Optimization Level: ${generatedCode.metrics.optimizationLevel}`);
    } else {
      throw new Error('AST validation failed for generated code');
    }

    return generatedCode.export('file', 'output/bundle.js');
  } catch (error) {
    console.error('Code Generation Error:', error.details);
    process.exit(1);
  }
}

// Execute demonstration workflow
executeCodeGenerationWorkflow()
  .then(() => console.log('\nCodeMosaic demonstration completed successfully'))
  .catch(console.error);