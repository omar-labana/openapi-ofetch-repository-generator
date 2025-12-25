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
   * Fetches the OpenAPI/Swagger document from the configured URL
   * @returns {Promise<Document>} The parsed OpenAPI document
   * @throws {FetchError} If the fetch operation fails
   */
  async fetchSwaggerDocument() {
    try {
      return await $fetch<Document>(this.url);
    } catch (error) {
      throw new FetchError(`Failed to fetch Swagger document from ${this.url}`, error);
    }
  }
}

export default Fetcher;
