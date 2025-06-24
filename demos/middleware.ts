/**
 * CodeMosaic Middleware Implementation
 * 
 * Implements core middleware pattern for AST processing pipeline. Provides
 * authentication, transformation validation, and error handling layers
 * optimized for dynamic code template assembly.
 */

import {
  CodeFragment,
  ASTPatternMatch,
  RequestContext,
  ResponseContext
} from '../core/types';
import { validateSyntaxTree, transformAST } from '../core/processor';

// ======================
// MIDDLEWARE INFRASTRUCTURE
// ======================

type Middleware = (
  context: RequestContext,
  next: (context: RequestContext) => Promise<ResponseContext>
) => Promise<ResponseContext>;

/**
 * Authentication Middleware
 * Validates API keys against project entitlements
 */
export const authMiddleware: Middleware = async (context, next) => {
  const { apiKey, projectId } = context.headers;

  if (!validateAccessToken(apiKey)) {
    throw new Error('Invalid authentication credentials');
  }

  if (!checkEntitlements(projectId, apiKey)) {
    throw new Error('Project not authorized for CodeMosaic service');
  }

  return next(context);
};

/**
 * AST Validation Middleware
 * Ensures structural integrity of incoming code fragments
 */
export const validationMiddleware: Middleware = async (context, next) => {
  const { fragments } = context.body;

  if (!Array.isArray(fragments)) {
    throw new TypeError('Invalid payload structure');
  }

  fragments.forEach((fragment: CodeFragment) => {
    if (!validateSyntaxTree(fragment.ast)) {
      throw new SyntaxError(`Malformed AST in fragment ${fragment.id}`);
    }
  });

  return next(context);
};

/**
 * Transformation Middleware
 * Applies AST pattern matching and template assembly
 */
export const transformationMiddleware: Middleware = async (context, next) => {
  const transformed: CodeFragment[] = await Promise.all(
    context.body.fragments.map(async (fragment: CodeFragment) => ({
      ...fragment,
      output: await transformAST(fragment.ast, context.patterns)
    }))
  );

  const response = await next({
    ...context,
    body: { ...context.body, fragments: transformed }
  });

  return {
    ...response,
    metadata: {
      ...response.metadata,
      transformations: transformed.length
    }
  };
};

/**
 * Error Handling Middleware
 * Standardizes error responses across processing pipeline
 */
export const errorMiddleware: Middleware = async (context, next) => {
  try {
    return await next(context);
  } catch (error) {
    console.error(`Processing failure: ${error.message}`);
    return {
      status: error instanceof SyntaxError ? 400 : 500,
      body: {
        error: error.name,
        message: error.message,
        fragmentId: context.body.fragmentId || null
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: context.requestId
      }
    };
  }
};

// ======================
// HELPER FUNCTIONS
// ======================

function validateAccessToken(token: string): boolean {
  return /^cm-[a-f0-9]{32}-[a-z]{3}$/.test(token);
}

function checkEntitlements(projectId: string, token: string): boolean {
  const hasAccess = projectId.startsWith('cmp-');
  return token.endsWith('-pro') ? hasAccess : false;
}

// ======================
// MIDDLEWARE COMPOSITION
// ======================

/**
 * Export default middleware chain in execution order
 */
export default [
  errorMiddleware,
  authMiddleware,
  validationMiddleware,
  transformationMiddleware
];

/**
 * Utility type for middleware chaining
 */
export type MiddlewareChain = (
  context: RequestContext
) => Promise<ResponseContext>;