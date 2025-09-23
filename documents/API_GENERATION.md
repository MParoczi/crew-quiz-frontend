# API Generation Setup

This project uses a custom configuration to generate TanStack Query hooks with specific patterns for different HTTP methods.

## Configuration

The API generation is configured in `openapi-ts.config.ts` and uses a post-processing script to clean up the generated files.

### Generated Functions by HTTP Method

- **GET methods**: Only generate `queryOptions` and `queryKey` functions
- **POST/PUT/DELETE/PATCH methods**: Only generate `mutationOptions` and `queryKey` functions

### Usage

To regenerate the API client with proper cleanup:

```bash
yarn run api:generate
```

This command will:

1. Run `openapi-ts` to generate the initial API client
2. Execute the cleanup script to remove unwanted functions
3. Format the code with Prettier

### Files

- `openapi-ts.config.ts` - Main configuration for the OpenAPI TypeScript generator
- `scripts/cleanupTanstackQuery.js` - Post-processing script that removes unwanted functions
- `src/api/@tanstack/react-query.gen.ts` - Generated TanStack Query hooks (cleaned)

### Example Usage in Components

```typescript
// For GET endpoints - use queryOptions
import { getApiCurrentGameGetCurrentGameForCurrentUserOptions } from '@/api/@tanstack/react-query.gen';

function MyComponent() {
  const { data } = useQuery(getApiCurrentGameGetCurrentGameForCurrentUserOptions());
  return <div>{data?.name}</div>;
}

// For POST/PUT/DELETE endpoints - use mutations
import { postApiAuthenticationLoginMutation } from '@/api/@tanstack/react-query.gen';

function LoginComponent() {
  const loginMutation = useMutation(postApiAuthenticationLoginMutation());

  const handleLogin = () => {
    loginMutation.mutate({ body: { email, password } });
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Benefits

1. **Type Safety**: Full TypeScript support for all API endpoints
2. **Consistency**: Standardized patterns for queries vs mutations
3. **Automatic Updates**: Regenerate when API schema changes
4. **Clean API**: Only necessary functions are generated for each HTTP method
