import { defineCommand } from "citty";
import Sequence from "@/Sequence.ts";

/**
 * Main class that defines and configures the CLI application
 */
class Main {
  /**
   * Creates and returns the CLI command definition
   * @returns {CommandDef} The CLI command configuration
   */
  cli() {
    return defineCommand({
      meta: {
        name: "openapi-ofetch-gen",
        version: "0.1.0",
        description: "Generate TypeScript repositories from OpenAPI/Swagger specifications",
      },
      args: {
        url: {
          type: "positional",
          description: "The complete URL for the JSON Swagger file to parse",
          required: true,
        },
      },
      run({ args }) {
        const sequence = new Sequence(args.url);

        sequence.start();
      },
    });
  }
}

export default Main;
