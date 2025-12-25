# OpenAPI ofetch Repository Generator

A Deno-based code generator that converts OpenAPI/Swagger specifications into TypeScript repository files with type-safe [ofetch](https://github.com/unjs/ofetch) HTTP clients.

## Features

- 🚀 Generates TypeScript repository files from OpenAPI 3.0 specifications
- 🔒 Type-safe API clients with full TypeScript support
- 📦 Organizes operations by OpenAPI tags
- 🎯 Smart function naming based on HTTP methods and paths
- 🔄 Automatic query parameter and request body handling
- ✨ Built with Deno for modern JavaScript tooling

## Installation

```bash
deno install --allow-net --allow-read --allow-write -n openapi-ofetch-gen https://deno.land/x/openapi_ofetch_repository_generator/main.ts
```

Or use directly with `deno run`:

```bash
deno run --allow-net --allow-read --allow-write https://deno.land/x/openapi_ofetch_repository_generator/main.ts <swagger-url>
```

## Usage

### Basic Usage

```bash
deno run --allow-net --allow-read --allow-write main.ts https://api.example.com/swagger.json
```

This will:
1. Fetch the OpenAPI/Swagger specification from the provided URL
2. Parse and organize operations by tags
3. Generate TypeScript repository files in the `./repositories` directory

### Example Output

Given an OpenAPI specification with a "users" tag, the generator creates:

```typescript
// repositories/useRepositoryUsers.ts

const useRepositoryUsers = () => {
  const factoryFetch = useFactoryFetch();

  const getUsers = (query: GetUsersParams) => 
    factoryFetch<UserListResponse>('/users', { query, method: 'get' })

  const postUsers = (body: CreateUserRequest) => 
    factoryFetch<UserResponse>('/users', { body, method: 'post' })

  const getUsersById = (id: string | number) => 
    factoryFetch<UserResponse>(`/users/${id}`, { query: {}, method: 'get' })

  return {
    getUsers,
    postUsers,
    getUsersById,
  }
};

export default useRepositoryUsers;
```

## Requirements

- Deno 1.x or higher
- Valid OpenAPI 3.0 JSON specification URL

## Configuration

The generator uses configuration from `deno.jsonc`:

```jsonc
{
  "fmt": {
    "singleQuote": true,
    "lineWidth": 100
  }
}
```

## Development

### Running Locally

```bash
# Clone the repository
git clone https://github.com/omar-labana/openapi-ofetch-repository-generator.git
cd openapi-ofetch-repository-generator

# Run with watch mode
deno task dev
```

### Project Structure

```
.
├── main.ts                 # Entry point
├── src/
│   ├── Main.ts            # CLI definition
│   ├── Sequence.ts        # Orchestration logic
│   ├── Fetcher.ts         # OpenAPI document fetching
│   ├── Generator.ts       # Code generation logic
│   ├── Normalization.ts   # Name and type normalization
│   ├── FileSystemInteraction.ts  # File operations
│   └── interfaces.ts      # TypeScript interfaces
└── repositories/          # Generated output directory
```

## How It Works

1. **Fetch**: Downloads the OpenAPI specification from the provided URL
2. **Parse**: Validates and parses the OpenAPI document structure
3. **Organize**: Groups operations by tags (or "miscellaneous" if untagged)
4. **Generate**: Creates TypeScript repository files with:
   - Normalized function names based on HTTP method and path
   - Type-safe parameters and return types
   - Path parameter templating
   - Query/body parameter handling

## Limitations

- Only supports OpenAPI 3.0 specifications
- Only JSON format is supported (not YAML)
- Requires the specification to be accessible via HTTP/HTTPS
- Generated code assumes a `useFactoryFetch()` function is available

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Omar Labana
