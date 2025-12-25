import { parseURL } from 'ufo';
import { $fetch } from 'ofetch';
import type { Document } from '@/interfaces.ts';
import { ValidationError, FetchError } from '@/interfaces.ts';

/**
 * Fetcher class responsible for validating URLs and fetching OpenAPI documents
 */
class Fetcher {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Validates that the URL is properly formatted and points to a JSON file
   * @throws {ValidationError} If the URL is invalid or doesn't point to a .json file
   */
  validateURL() {
    const parsed = parseURL(this.url);

    if (!parsed.host || !parsed.pathname.endsWith('.json')) {
      throw new ValidationError('Invalid URL. Please provide a valid URL to a JSON Swagger file.');
    }
  }

  /**
   * Validates the structure of the fetched OpenAPI document
   * @param {unknown} data - The data to validate
   * @throws {ValidationError} If the document structure is invalid
   */
  validateDocument(data: unknown): asserts data is Document {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid OpenAPI document: document must be an object');
    }

    const doc = data as Partial<Document>;

    if (!doc.openapi) {
      throw new ValidationError('Invalid OpenAPI document: missing "openapi" field');
    }

    if (!doc.openapi.startsWith('3.0')) {
      throw new ValidationError(
        `Unsupported OpenAPI version: ${doc.openapi}. Only OpenAPI 3.0.x is supported`,
      );
    }

    if (!doc.info || typeof doc.info !== 'object') {
      throw new ValidationError('Invalid OpenAPI document: missing or invalid "info" field');
    }

    if (!doc.paths || typeof doc.paths !== 'object') {
      throw new ValidationError('Invalid OpenAPI document: missing or invalid "paths" field');
    }

    if (Object.keys(doc.paths).length === 0) {
      throw new ValidationError('Invalid OpenAPI document: no paths defined');
    }
  }

  /**
   * Fetches the OpenAPI/Swagger document from the configured URL
   * @returns {Promise<Document>} The parsed OpenAPI document
   * @throws {FetchError} If the fetch operation fails
   */
  async fetchSwaggerDocument() {
    try {
      const data = await $fetch<unknown>(this.url);
      this.validateDocument(data);
      return data;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new FetchError(`Failed to fetch Swagger document from ${this.url}`, error);
    }
  }
}

export default Fetcher;
