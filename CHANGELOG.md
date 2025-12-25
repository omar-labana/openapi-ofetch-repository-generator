# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README.md with usage examples and documentation
- JSDoc comments to all classes and key methods
- Custom error types (ValidationError, FetchError, FileSystemError)
- Input validation for OpenAPI documents
- CONTRIBUTING.md with development guidelines
- CHANGELOG.md to track changes
- .editorconfig for consistent code formatting

### Changed
- CLI name from "easy" to "openapi-ofetch-gen" for consistency
- Improved error messages with more context

### Fixed
- Type safety issues in Normalization.ts (proper type guards for schema.items)
- Better error handling throughout the codebase

### Removed
- Empty Structure.ts file
- Commented-out debug code
- Debug console.log statements

## [0.1.0] - 2025-12-25

### Added
- Initial release
- OpenAPI 3.0 document fetching and parsing
- TypeScript repository generation with ofetch
- Tag-based operation organization
- Smart function naming
- Path parameter templating
- Query and body parameter handling
