import { pascalCase } from 'scule';
import { NormalizedOperation, Operation } from './interfaces.ts';

const useRepository = 'useRepository';

class Normalize {
  seto = new Set<string>();
  nameRepository(url: string) {
    const normalized = url.replace(/\s+/g, '-').trim();
    return useRepository + pascalCase(normalized);
  }

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

  // const queries = operation.parameters?.filter((param) => param.in === 'query');
  argumentId(operation: Operation['parameters']) {
    const params = operation?.filter((param) => param.in === 'path');
    return params?.map((param) => `${param.name}: string | number`).join(', ');
  }

  argumentQuery(operation: NormalizedOperation) {
    if (!operation.operationId || !operation.parameters || operation.parameters.length === 0) {
      return 'query: Record<string, unknown>';
    }
    // return `query: { ${
    //   params.map((param) =>
    //     `${param.name}${param.schema.nullable ? '?' : ''}: ${this.normalizeType(param)}`
    //   ).join('; ')
    // } }`;

    return `query: ${operation.operationId}Params`;
  }

  argumentBody(operation: NormalizedOperation) {
    return `body: ${
      operation.requestBody?.content?.['application/json']?.schema?.$ref?.replace(
        '#/components/schemas/',
        '',
      ) || 'undefined'
    }`;
  }

  functionArguments(operation: NormalizedOperation) {
    let argumentId = this.argumentId(operation.parameters);
    let argumentQuery = this.argumentQuery(operation);
    let argumentBody = this.argumentBody(operation);
    // ${operation.method === 'get' ? 'query' : 'body'}: ${operation.payload}
    return argumentId + (argumentId && (argumentQuery || argumentBody) ? ', ' : '') +
      (operation.method === 'get' ? argumentQuery : argumentBody);
  }

  normalizeType(something: {
    name: string;
    in: 'query' | 'path';
    schema: {
      type?: 'integer' | 'string' | 'boolean' | 'array';
      nullable?: boolean;
    };
  }) {
    let finale;

    if (something.schema.type === 'integer') {
      finale = 'number';
    } else if (something.schema.type === 'string') {
      finale = 'string';
    } else if (something.schema.type === 'boolean') {
      finale = 'boolean';
    } else if (something.schema.type === 'array') {
      if (something.schema.items.type === 'integer') {
        finale = 'number[]';
      } else if (something.schema.items.$ref) {
        finale =
          something.schema.items.$ref.replace('#/components/schemas/', '').replace(/_/g, '') + '[]';
      } else {
        this.seto.add(something.schema.items);
      }
    } else if ('oneOf' in something.schema && Array.isArray((something.schema as any).oneOf)) {
      // Handle oneOf with $ref
      const oneOf = (something.schema as any).oneOf;
      const ref = oneOf[0]?.$ref;
      if (ref) {
        finale = ref.replace('#/components/schemas/', '').replace(/_/g, '');
      }
    } else if ('$ref' in something.schema && typeof (something.schema as any).$ref === 'string') {
      // Handle schema with $ref directly
      finale = (something.schema as any).$ref.replace('#/components/schemas/', '').replace(
        /_/g,
        '',
      );
    }

    if (!finale) {
      console.log(something);
    }

    return finale;
  }
}

export default Normalize;
