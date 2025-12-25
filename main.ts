import { runMain } from 'citty';
import Main from '@/Main.ts';

/**
 * OpenAPI ofetch Repository Generator
 * Entry point for the CLI application
 */
if (import.meta.main) {
  const main = new Main();

  runMain(main.cli());
}
