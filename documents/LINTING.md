# ESLint and Prettier Configuration

This project is configured with strict ESLint and Prettier settings to ensure code quality and consistency.

## Configuration Files

### ESLint (`eslint.config.js`)

- **Strict TypeScript rules** with type-checking enabled
- **React-specific rules** for modern React development
- **Import/export organization** with automatic sorting
- **Accessibility rules** for better UX
- **Custom configurations** as requested:
  - Allows `@ts-ignore` comments
  - No required function return types
  - Maximum line length: 180 characters

### Prettier (`.prettierrc`)

- **Line width**: 180 characters (as requested)
- **Quotes**: Double quotes for all strings (as requested)
- **Semicolons**: Always required
- **Trailing commas**: Always for better diffs
- **Tab width**: 2 spaces
- **End of line**: LF (Unix style)

### VSCode Settings (`.vscode/settings.json`)

- **Format on save** enabled
- **ESLint auto-fix** on save
- **Import organization** on save
- **Prettier as default formatter**

## Available Scripts

```json
{
  "lint": "eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint . --ext .ts,.tsx --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "type-check": "tsc --noEmit"
}
```

## Key Features

### Strict Rules Enabled

- No unused variables (with `_` prefix exception)
- No explicit `any` types
- Consistent type imports
- Prefer nullish coalescing (`??`)
- Prefer optional chaining (`?.`)
- No array index as keys in React
- No `dangerouslySetInnerHTML`
- Strict accessibility rules

### Import Organization

Imports are automatically organized in this order:

1. Built-in Node.js modules
2. External dependencies
3. Internal modules
4. Parent directory imports
5. Sibling directory imports
6. Index file imports
7. Object imports
8. Type-only imports

### React Best Practices

- Self-closing components when possible
- No React import needed (modern JSX transform)
- Pascal case for components
- No useless fragments
- Boolean props without explicit values
- Consistent curly brace usage

### Accessibility

- Anchor elements must be valid
- Interactive elements need keyboard handlers
- No static element interactions without proper roles

## Recommended VSCode Extensions

The `.vscode/extensions.json` file includes recommendations for:

- ESLint
- Prettier
- TypeScript support
- Path IntelliSense
- Auto Rename Tag

## Custom Overrides

Based on your requirements:

- ✅ **Line length**: 180 characters
- ✅ **Double quotes**: Enforced for all strings
- ✅ **No return types**: Function return types are not required
- ✅ **@ts-ignore allowed**: Can use `@ts-ignore` when needed

## Usage

### Manual Commands

```bash
# Check for linting errors
yarn lint

# Fix auto-fixable linting errors
yarn lint:fix

# Format all files
yarn format

# Check if files are formatted
yarn format:check

# Type check without emitting
yarn type-check
```

### Automatic (Recommended)

With the VSCode settings, files will be:

- Formatted on save
- ESLint errors auto-fixed on save
- Imports organized on save

## Troubleshooting

If you encounter issues:

1. **TypeScript errors**: Run `yarn type-check` to see TypeScript issues
2. **ESLint resolver errors**: Ensure `tsconfig.app.json` includes all source files
3. **Prettier conflicts**: Run `yarn format` to fix formatting
4. **Import issues**: Check that `eslint-import-resolver-typescript` is installed

## Bypassing Rules

When necessary, you can disable rules:

```typescript
// Disable for next line
// eslint-disable-next-line rule-name

// Disable for entire file
/* eslint-disable rule-name */

// Disable TypeScript check
// @ts-ignore
```

Use these sparingly and only when absolutely necessary.
