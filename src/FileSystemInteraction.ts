import { FileSystemError } from '@/interfaces.ts';

const directory = 'repositories';

/**
 * FileSystemInteraction class handles all file system operations for the generator
 */
class FileSystemInteraction {
  /**
   * Prepares the repositories directory by creating it if it doesn't exist
   * or cleaning it if it already exists
   * @throws {FileSystemError} If directory operations fail
   */
  async prepare() {
    try {
      await Deno.stat(directory);
      for await (const entry of Deno.readDir(directory)) {
        const entryPath = `${directory}/${entry.name}`;
        if (entry.isDirectory) {
          await Deno.remove(entryPath, { recursive: true });
        } else {
          await Deno.remove(entryPath);
        }
      }
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        await Deno.mkdir(directory);
      } else {
        throw new FileSystemError(`Error preparing directory: ${directory}`, error);
      }
    }
  }

  /**
   * Writes a generated repository file to the repositories directory
   * @param {string} repositoryName - Name of the repository (without .ts extension)
   * @param {string} content - The TypeScript code content to write
   * @throws {FileSystemError} If file write operation fails
   */
  async writeRepository(repositoryName: string, content: string) {
    try {
      const filePath = `${directory}/${repositoryName}.ts`;
      await Deno.writeTextFile(filePath, content);
    } catch (error) {
      throw new FileSystemError(`Error writing repository file: ${repositoryName}`, error);
    }
  }
}

export default FileSystemInteraction;
