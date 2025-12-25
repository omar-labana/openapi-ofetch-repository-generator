import { pascalCase } from 'scule';
import { NormalizedOperation, Operation } from './interfaces.ts';

const useRepository = 'useRepository';

/**
 * Normalize class handles naming conventions and type normalization for generated code
 */
class Normalize {
  /** Set used to track unhandled schema types for debugging */
  seto = new Set<string>();

  /**
   * Normalizes a tag name into a repository function name
   * @param {string} url - The tag name to normalize
   * @returns {string} Repository name in format "useRepository{PascalCaseTag}"
   */
  nameRepository(url: string) {
    const normalized = url.replace(/\s+/g, '-').trim();
    return useRepository + pascalCase(normalized);
  }

  /**
   * Generates a function name from HTTP method and path
   * @param {string} method - HTTP method (get, post, etc.)
   * @param {string} path - API path (e.g., "/users/{id}")
   * @returns {string} Function name in format "{method}{Path}ById" etc.
   */
  nameRequest(method: string, path: string) {
    const normalizedMethod = method.toLowerCase().replace(/\s+/g, '-').trim();
    const normalizedPath = path.replace(/\s+/g, '-').trim();

    // Find all {param} in the path and create ByParam pattern
    const byPatternMatches = [...normalizedPath.matchAll(/\{([^}]+)\}/g)];
    let byPattern = '';
    if (byPatternMatches.length > 0) {
      const params = byPatternMatches.map((match) => match[1]);
      byPattern = 'By' + params.map((p) => pascalCase(p)).join('And');
    }

    // Remove {param} from normalizedPath for base name
    const basePath = normalizedPath.replace(/\{[^}]+\}/g, '');

    return `${normalizedMethod}${pascalCase(basePath)}${byPattern}`;
  }

  /**
   * Converts a path to a template string or regular string for use in generated code
   * @param {string} url - The API path (e.g., "/users/{id}")
   * @returns {string} Template string like `\`/users/\${id}\`` or regular string '/users'
   */
  endpoint(url: string) {
    // '/classifications/{id}'
    // If the url contains any {, convert to template string and add $ before each {
    if (url.includes('{')) {
      // Replace {param} with ${param}
      const template = url.replace(/\{([^}]+)\}/g, '${$1}');
      return `\`${template}\``;
    }
    return `'${url}'`;
  }

  /**
   * Generates TypeScript type signature for path parameters
   * @param {Operation['parameters']} operation - Operation parameters
   * @returns {string | undefined} Type signature like "id: string | number"
   */
  argumentId(operation: Operation['parameters']) {
    const params = operation?.filter((param) => param.in === 'path');
    return params?.map((param) => `${param.name}: string | number`).join(', ');
  }

  /**
   * Adjusts PascalCase normalization to preserve specific patterns like G2G
   * @param {string} name - Name to normalize
   * @returns {string} Adjusted PascalCase name
   */
  adjustPascalNormalized(name: string) {
    const pascal = pascalCase(name, { normalize: true });
    // if in name there was 'G2G', make sure it stays 'G2G' in pascal case, there can be multiple occurrences
    if (name.includes('G2G')) {
      return pascal.replace(/G2g/g, 'G2G');
    }

    return pascal;
  }

  /**
   * Generates TypeScript type signature for query parameters
   * @param {NormalizedOperation} operation - Normalized operation
   * @returns {string} Type signature for query parameters
   */
  argumentQuery(operation: NormalizedOperation) {
    if (!operation.operationId || !operation.parameters || operation.parameters.length === 0) {
      return 'query: Record<string, unknown>';
    }
    // return `query: { ${
    //   params.map((param) =>
    //     `${param.name}${param.schema.nullable ? '?' : ''}: ${this.normalizeType(param)}`
    //   ).join('; ')
    // } }`;

    return `query: ${this.adjustPascalNormalized(operation.operationId)}Params`;
  }

  /**
   * Generates TypeScript type signature for request body
   * @param {NormalizedOperation} operation - Normalized operation
   * @returns {string} Type signature for body parameter
   */
  argumentBody(operation: NormalizedOperation) {
    return `body: ${
      operation.requestBody?.content?.['application/json']?.schema?.$ref?.replace(
        '#/components/schemas/',
        '',
      ) || 'undefined'
    }`;
  }

  /**
   * Combines all function arguments into a single type signature
   * @param {NormalizedOperation} operation - Normalized operation
   * @returns {string} Complete function arguments signature
   */
  functionArguments(operation: NormalizedOperation) {
    let argumentId = this.argumentId(operation.parameters);
    let argumentQuery = this.argumentQuery(operation);
    let argumentBody = this.argumentBody(operation);
    // ${operation.method === 'get' ? 'query' : 'body'}: ${operation.payload}
    return argumentId + (argumentId && (argumentQuery || argumentBody) ? ', ' : '') +
      (operation.method === 'get' ? argumentQuery : argumentBody);
  }

  /**
   * Normalizes OpenAPI schema types to TypeScript types
   * @param {object} something - Parameter with schema information
   * @returns {string | undefined} TypeScript type string or undefined if type cannot be determined
   */
  normalizeType(something: {
    name: string;
    in: 'query' | 'path';
    schema: {
      type?: 'integer' | 'string' | 'boolean' | 'array';
      nullable?: boolean;
      items?: {
        type?: 'integer' | 'string' | 'boolean';
        $ref?: string;
      };
      oneOf?: Array<{ $ref?: string }>;
      $ref?: string;
    };
  }): string | undefined {
    let finale: string | undefined;

    if (something.schema.type === 'integer') {
      finale = 'number';
    } else if (something.schema.type === 'string') {
      finale = 'string';
    } else if (something.schema.type === 'boolean') {
      finale = 'boolean';
    } else if (something.schema.type === 'array' && something.schema.items) {
      if (something.schema.items.type === 'integer') {
        finale = 'number[]';
      } else if (something.schema.items.$ref) {
        finale =
          something.schema.items.$ref.replace('#/components/schemas/', '').replace(/_/g, '') + '[]';
      } else {
        this.seto.add(JSON.stringify(something.schema.items));
      }
    } else if (something.schema.oneOf && Array.isArray(something.schema.oneOf)) {
      // Handle oneOf with $ref
      const oneOf = something.schema.oneOf;
      const ref = oneOf[0]?.$ref;
      if (ref) {
        finale = ref.replace('#/components/schemas/', '').replace(/_/g, '');
      }
    } else if (something.schema.$ref && typeof something.schema.$ref === 'string') {
      // Handle schema with $ref directly
      finale = something.schema.$ref.replace('#/components/schemas/', '').replace(
        /_/g,
        '',
      );
    }

    return finale;
  }
}

export default Normalize;
