# Contributing to OpenAPI ofetch Repository Generator

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites

- [Deno](https://deno.land/) 1.x or higher

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/openapi-ofetch-repository-generator.git
   cd openapi-ofetch-repository-generator
   ```

3. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Generator

Test your changes by running the generator with a sample OpenAPI spec:

```bash
deno run --allow-net --allow-read --allow-write main.ts https://petstore3.swagger.io/api/v3/openapi.json
```

### Watch Mode

For active development with auto-reload:

```bash
deno task dev
```

### Code Formatting

The project uses Deno's built-in formatter:

```bash
# Check formatting
deno fmt --check

# Auto-fix formatting
deno fmt
```

Configuration is in `deno.jsonc`:
- Single quotes
- 100 character line width

### Type Checking

Ensure your code has no TypeScript errors:

```bash
deno check main.ts
```

## Code Style

- Use TypeScript for all code
- Add JSDoc comments to public APIs
- Follow existing naming conventions:
  - Classes: PascalCase
  - Functions/methods: camelCase
  - Constants: camelCase or UPPER_SNAKE_CASE for true constants
  - Files: PascalCase for classes, camelCase for utilities

## Project Structure

```
.
├── main.ts                 # Entry point
├── src/
│   ├── Main.ts            # CLI definition
│   ├── Sequence.ts        # Orchestration
│   ├── Fetcher.ts         # Document fetching and validation
│   ├── Generator.ts       # Code generation
│   ├── Normalization.ts   # Name and type normalization
│   ├── FileSystemInteraction.ts  # File operations
│   └── interfaces.ts      # TypeScript interfaces and types
└── repositories/          # Generated output (gitignored)
```

## Making Changes

### Adding Features

1. Update relevant class(es) in `src/`
2. Add JSDoc comments
3. Update README.md if the feature is user-facing
4. Test with various OpenAPI specifications

### Bug Fixes

1. Identify the root cause
2. Fix the issue with minimal changes
3. Add validation or error handling if applicable
4. Test to ensure the fix works

### Documentation

- Keep README.md up to date
- Add JSDoc comments to new functions/classes
- Update CONTRIBUTING.md if development workflow changes

## Error Handling

Use the custom error types defined in `interfaces.ts`:

- `ValidationError` - For input validation errors
- `FetchError` - For network/fetch errors
- `FileSystemError` - For file system operation errors

Example:
```typescript
if (!isValid) {
  throw new ValidationError('Detailed error message');
}
```

## Submitting Changes

### Commit Messages

Write clear commit messages:

```
Add feature: brief description

- Detailed point 1
- Detailed point 2
```

### Pull Requests

1. Push your branch to your fork
2. Open a PR against the `main` branch
3. Describe your changes clearly
4. Reference any related issues

### PR Checklist

- [ ] Code follows project style
- [ ] Formatted with `deno fmt`
- [ ] Passes type checking with `deno check`
- [ ] JSDoc comments added for public APIs
- [ ] README.md updated if needed
- [ ] Tested with sample OpenAPI specs

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about contributing
- General discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
