# API Authentication Setup

This document explains how Bearer token authentication is configured for the openapi-ts generated API client.

## Overview

The authentication system automatically sets the Bearer token for all API requests that require authentication. The token is managed through localStorage and automatically applied to the global API client configuration.

## Components

### 1. API Client Utility (`src/utils/apiClient.ts`)

Provides functions to manage the API client authentication:

- `setApiToken(token: string | null)` - Sets the Bearer token for API requests
- `clearApiToken()` - Removes authentication from API requests
- `getApiClient()` - Returns the global API client instance

### 2. Main Layout Integration (`src/layouts/main_layout/MainLayout.tsx`)

The MainLayout component automatically:

- Sets the API token when a user is logged in
- Clears the API token when the user logs out
- Handles token updates when user data changes

### 3. Generated API Client

The openapi-ts configuration generates:

- Type-safe API functions with security schemas
- Automatic Bearer token support through the global client
- TanStack Query hooks that inherit authentication

## How It Works

1. **User Login**: When a user logs in, their authentication data (including token) is stored in localStorage via `useUserLocalStorage`

2. **Token Application**: The MainLayout component watches for user changes and automatically calls `setApiToken()` to configure the global API client

3. **API Requests**: All generated API functions use the configured client, automatically including the Bearer token in the Authorization header

4. **User Logout**: When logging out, `clearApiToken()` removes authentication from subsequent requests

## Usage

The authentication is handled automatically - no manual token management is required in components using the generated API hooks.

```typescript
// API calls automatically include authentication when user is logged in
const { data } = useQuery(getApiUserGetCurrentUserQueryOptions());
```

## Configuration

The openapi-ts configuration in `openapi-ts.config.ts` generates the necessary client and SDK files with proper security handling for Bearer token authentication.

All API endpoints marked with Bearer token security in the OpenAPI specification will automatically include the Authorization header when the token is set.
