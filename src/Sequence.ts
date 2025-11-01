import type { Document } from '@/interfaces.ts';
import { consola } from 'consola';
import Fetcher from '@/Fetcher.ts';
import FileSystemInteraction from '@/FileSystemInteraction.ts';
import Generator from '@/Generator.ts';

class Sequence {
  document?: Document;
  fetcher: Fetcher;
  fileSystemInteraction: FileSystemInteraction;
  generator: Generator;

  constructor(url: string) {
    this.fetcher = new Fetcher(url);
    this.fileSystemInteraction = new FileSystemInteraction();
    this.generator = new Generator();
  }

  async start() {
    try {
      consola.start(`Parsing Swagger file from ${this.fetcher.url}`);

      this.fetcher.validateURL();

      consola.success('Successfully validated URL');

      consola.info('Fetching Swagger document');

      this.document = await this.fetcher.fetchSwaggerDocument();

      if (!this.document) return;

      consola.success('Successfully fetched Swagger document');

      await this.generator.prepare(this.document);

      consola.success('Successfully prepared generator for typegen');

      await this.fileSystemInteraction.prepare();

      consola.success('Successfully prepared file system for typegen');

      await this.generator.generate();

      consola.success('Successfully generated repositories');
    } catch (error) {
      if (error instanceof Error) {
        consola.error(error.message);
      } else {
        consola.error(String(error));
      }

      Deno.exit(1);
    }
  }
}

export default Sequence;
