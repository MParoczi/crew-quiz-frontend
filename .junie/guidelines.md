# Junie Development Guidelines

## Project Context

- **Application Type**: Jeopardy-style crew quiz game application
- **Target Platforms**: Mobile-first with desktop support
- **Primary Focus**: Responsive design and game-like animations
- **Development Environment**: Windows 11, PowerShell, Yarn package manager

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: Mantine (MANDATORY for all components)
- **State Management**: Jotai (MANDATORY)
- **Styling**: CSS Modules + Mantine theme system
- **API**: TanStack Query for data fetching
- **Icons**: Tabler Icons React

## Code Generation Rules

### React Component Structure (TSX Files Only)

ALWAYS use this exact pattern for React components:

```typescript
function ComponentName() {
    function renderSubSection() {
        return (
            <MantineComponent>
                {/* content */}
            </MantineComponent>
        );
    }

    function render() {
        return (
            <Container>
                {renderSubSection()}
            </Container>
        );
    }

    return render();
}
```

### Function Props Requirements

ALL functions passed as props to React components MUST be wrapped with `useCallback`:

```typescript
import { useCallback } from 'react';

function ParentComponent() {
    const handleClick = useCallback(() => {
        // handle click logic
    }, []);

    const handleSubmit = useCallback((data: FormData) => {
        // handle submit logic
    }, []);

    function render() {
        return (
            <ChildComponent
                onClick={handleClick}
                onSubmit={handleSubmit}
            />
        );
    }

    return render();
}
```

#### useCallback Dependency Rules

- Include ALL variables from component scope that are used inside the callback
- For API refetch functions, include the refetch function in dependencies
- For state setters, dependencies are usually not needed (React guarantees stable references)
- When unsure, include the variable in dependencies to avoid stale closures

### File Naming Requirements

- React Components: `PascalCase.tsx` (e.g., `QuestionModal.tsx`)
- CSS Modules: `componentName.module.css` (e.g., `questionModal.module.css`)
- Other files: `camelCase.ts` (e.g., `useQueryData.ts`)
- Markdown files: `UPPERCASE.md` (e.g., `README.md`)

### Folder Structure Rules

- Global components: `src/components/component_name/ComponentName.tsx`
- Page components: `src/pages/page_name/PageName.tsx`
- Page-specific elements: `src/pages/page_name/elements/element_name/ElementName.tsx`

## Available Components (src/components/)

### Reusable Components

- **AuthenticationProtection**: Component for protecting routes requiring authentication
- **ConfirmationModal**: Modal for user confirmations with confirm/cancel actions
- **CustomAutocomplete**: Autocomplete input with custom styling
- **CustomCopyButton**: Button component for copying text to clipboard
- **HoverPaper**: Paper component with hover effects
- **LoadingContainer**: Container with loading states
- **NavbarLink**: Navigation link component
- **QuestionModal**: Modal for question display and interaction

### Component Usage Rules

- ALL components must use Mantine components exclusively
- Use `variant="filled"` for all components EXCEPT Button (use `variant="light"`)
- Always use `radius="xs"` for all components that support radius
- CSS files should use `var(--mantine-radius-xs)` for radius values

## Theme System (src/themes/mainTheme.ts)

### Available Colors

- **Primary**: `greenAccent` - Main brand color with 10-shade tuple
- **Secondary Colors**: `success`, `error`, `warning`, `info` - Each with 10-shade tuples
- **Typography**: Font family is "Inter"
- **Spacing**: Default radius is "xs"

### Color Usage Rules

- ONLY use colors defined in mainTheme.ts
- Use Mantine component API color props when possible
- DO NOT create new colors - use existing color tuples

### Breakpoints

- xs: 30em, sm: 48em, md: 64em, lg: 74em, xl: 90em

### Mobile-First Theme Features

- Touch-friendly button sizes (44px minimum, 48px on mobile)
- Responsive component overrides for Button, Container, Card, Modal
- Mobile-specific padding and margin adjustments

## Custom Hooks (src/hooks/)

### Available Hooks

- **useMutateData**: Wrapper for TanStack Query mutations with notifications
- **useQueryData**: Wrapper for TanStack Query queries with automatic error handling
- **useReAuthentication**: Hook for handling authentication token refresh
- **useUserLocalStorage**: Local storage management for user data

### Hook Usage Patterns

#### useQueryData Hook

Returns `[data, refetch, isLoading]` tuple:

```typescript
import useQueryData from "../hooks/useQueryData";
import { getApiQuizGetQuizzesForCurrentUserOptions } from "../api/@tanstack/react-query.gen";
import { BackendModelsDtosQuizDto, GetApiQuizGetQuizzesForCurrentUserData } from "../api/types.gen";

// Usage example - specify response type and request data type as generics
const [quizList, getQuizList, isLoading] = useQueryData<BackendModelsDtosQuizDto[], GetApiQuizGetQuizzesForCurrentUserData>(getApiQuizGetQuizzesForCurrentUserOptions);

// For queries with path parameters
const [currentGame, getCurrentGame, isLoading] = useQueryData<BackendModelsDtosCurrentGameDto, GetApiCurrentGameGetCurrentGameBySessionIdBySessionIdData>(
  getApiCurrentGameGetCurrentGameBySessionIdBySessionIdOptions,
  {
    path: { sessionId: "session-123" },
  },
);
```

#### useMutateData Hook

Returns `[data, executeRequest, isPending]` tuple:

```typescript
import useMutateData from "../hooks/useMutateData";
import { postApiQuizCreateQuizMutation } from "../api/@tanstack/react-query.gen";
import { useCallback } from "react";

// Usage example
const handleSubmitSuccess = useCallback(async () => {
  await getQuizList();
}, [getQuizList]);

const [, createNewQuiz, isPending] = useMutateData(postApiQuizCreateQuizMutation, {
  onSuccess: handleSubmitSuccess,
  successMessage: "New quiz was created",
});

// Execute the mutation
await createNewQuiz({
  name: "My Quiz",
  questionGroups: [],
});
```

### Hook Features

- Queries are disabled by default and require manual refetch
- Mutations automatically show success/error notifications
- Both hooks support custom onSuccess/onError callbacks
- Use the hooks' built-in error handling

## API Structure (src/api/)

### Generated Files (DO NOT MODIFY)

- `client.gen.ts` - API client
- `sdk.gen.ts` - SDK functions
- `types.gen.ts` - TypeScript types
- `transformers.gen.ts` - Data transformers
- `@tanstack/react-query.gen.ts` - Query hooks

### API Usage Guidelines

#### Using Generated Types

All API types are available in `types.gen.ts` and follow these patterns:

- **Data Types**: `{Method}Api{Controller}{Action}Data` (e.g., `PostApiAuthenticationLoginData`)
- **Response Types**: `{Method}Api{Controller}{Action}Response` (e.g., `PostApiAuthenticationLoginResponse`)
- **DTO Types**: `BackendModelsDtos{Name}Dto` (e.g., `BackendModelsDtosUserDto`)

#### Main DTO Types

- `BackendModelsDtosAuthenticationDto` - Authentication data
- `BackendModelsDtosUserDto` - User information
- `BackendModelsDtosQuizDto` - Quiz data
- `BackendModelsDtosQuestionDto` - Question data
- `BackendModelsDtosQuestionGroupDto` - Question group data
- `BackendModelsDtosCurrentGameDto` - Current game state
- `BackendModelsDtosGameFlowDto` - Game flow actions

#### Available API Endpoints

##### Authentication

- `postApiAuthenticationLoginMutation` - User login
- `postApiAuthenticationReauthenticateMutation` - Token refresh

##### Current Game

- `getApiCurrentGameGetCurrentGameForCurrentUserOptions` - Get current user's game
- `getApiCurrentGameGetCurrentGameBySessionIdBySessionIdOptions` - Get game by session ID
- `postApiCurrentGameCreateCurrentGameMutation` - Create new game
- `putApiCurrentGameUpdateCurrentGameMutation` - Update game
- `deleteApiCurrentGameDeleteCurrentGameByCurrentGameIdMutation` - Delete game

##### Game Flow

- `postApiGameFlowAddUserToCurrentGameMutation` - Add user to game
- `postApiGameFlowStartGameMutation` - Start game
- `postApiGameFlowSelectQuestionMutation` - Select question
- `postApiGameFlowSubmitAnswerMutation` - Submit answer
- `postApiGameFlowLeaveGameMutation` - Leave game

##### Questions

- `getApiQuestionGetQuestionsForCurrentUserOptions` - Get user's questions
- `getApiQuestionGetQuestionsByQuestionGroupIdByQuestionGroupIdOptions` - Get questions by group
- `getApiQuestionGetQuestionByQuestionIdOptions` - Get specific question
- `postApiQuestionCreateQuestionMutation` - Create question
- `putApiQuestionUpdateQuestionMutation` - Update question
- `deleteApiQuestionDeleteQuestionByQuestionIdMutation` - Delete question

##### Question Groups

- `getApiQuestionGroupGetQuestionGroupsForCurrentUserOptions` - Get user's question groups
- `getApiQuestionGroupGetQuestionGroupsByQuizIdByQuizIdOptions` - Get groups by quiz
- `getApiQuestionGroupGetQuestionGroupByQuestionGroupIdOptions` - Get specific group
- `postApiQuestionGroupCreateQuestionGroupMutation` - Create group
- `putApiQuestionGroupUpdateQuestionGroupMutation` - Update group
- `deleteApiQuestionGroupDeleteQuestionGroupByQuestionGroupIdMutation` - Delete group

##### Quizzes

- `getApiQuizGetQuizzesForCurrentUserOptions` - Get user's quizzes
- `getApiQuizGetQuizByCurrentGameIdByCurrentGameIdOptions` - Get quiz by game ID
- `getApiQuizGetQuizByQuizIdOptions` - Get specific quiz
- `postApiQuizCreateQuizMutation` - Create quiz
- `putApiQuizUpdateQuizMutation` - Update quiz
- `deleteApiQuizDeleteQuizByQuizIdMutation` - Delete quiz

##### Users

- `getApiUserGetCurrentUserOptions` - Get current user
- `postApiUserCreateUserMutation` - Create user
- `putApiUserUpdateUserMutation` - Update user
- `deleteApiUserDeleteUserByUserIdMutation` - Delete user

#### Type Safety Rules

- ALWAYS use the generated types for API calls
- Use the exact type names from `types.gen.ts`
- For `useQueryData`, specify both response and request data types as generics
- For `useMutateData`, the hook will infer types from the mutation function
- Use the generated mutation and query options functions

#### Error Handling

- Mutations automatically show error notifications via `useMutateData`
- Queries automatically show error notifications via `useQueryData`
- All API errors are typed as `DefaultError` from TanStack Query

## Constants (src/constants/)

### Available Constants

- **menuItems**: Navigation menu configuration with Tabler icons and routes
  - Home (IconHome2), Quizzes (IconChartCohort), Questions (IconQuestionMark)
  - Previous Games (IconTournament), Profile (IconUser)
- **pages**: Route constants for navigation
- **environmentVariables**: Environment-specific variables
- **storageKeys**: Local storage key constants

## Page Structure

### Main Pages

- **HomePage**: Landing/dashboard page
- **LoginPage**: User authentication
- **RegistrationPage**: User registration
- **QuestionsPage**: Question management with QuestionGroupItem, QuestionGroupModal, QuestionsHeader
- **QuizzesPage**: Quiz management with QuizHeader, QuizItem, QuizModal
- **PreviousGamesPage**: Game history
- **ProfilePage**: User profile management
- **GameSessionPage**: Main game session page with game flow elements

### Game Session Elements (src/pages/game_session/elements/)

- **Answer**: Answer submission component
- **BackHomeButton**: Navigation button to return home
- **Lobby**: Game lobby for waiting and user management
- **QuestionSelection**: Question selection interface
- **Result**: Game results display

### Page Elements Pattern

Each page can have an `elements/` folder for page-specific components:

- QuestionGroupItem, QuestionGroupModal, QuestionsHeader (questions page)
- QuizHeader, QuizItem, QuizModal (quizzes page)
- Answer, BackHomeButton, Lobby, QuestionSelection, Result (game session page)

## Layout System (src/layouts/)

### Available Layouts

- **MainLayout**: Primary application layout with navigation

## Authentication & Storage (src/storage_configs/)

### Authentication Configuration

- **authenticationConfigs**: Configuration for authentication token management
- Use with `useUserLocalStorage` hook for persistent user data
- Integration with `AuthenticationProtection` component for route protection

## Interface Naming Convention

- ALL interfaces must be prefixed with 'I': `IInterfaceName`
- Use descriptive names: `IConfirmationModalProps`, `IUseMutateDataOptions`

## Development Patterns

### State Management

- Use Jotai for global state management
- Keep state minimal and focused
- Consider mobile performance
- Use local storage for user data persistence

### Styling Approach

1. Use Mantine component API first
2. Use CSS modules for complex styling
3. Avoid inline styles and `styles` props
4. Use CSS variables for Mantine values: `var(--mantine-radius-xs)`

### Mobile-First Design

- Design for mobile first, then scale up
- Use Mantine's responsive props when possible
- Test on various screen sizes
- Optimize touch interactions
- Leverage theme breakpoints and mobile-specific component overrides

### Animation Guidelines

- Use smooth transitions for better UX
- Consider mobile performance impact
- Leverage Mantine's built-in animations
- Implement game-like interactions for engaging gameplay

## Utilities (src/utils/)

### Available Utilities

- **apiClient**: HTTP client configuration
- **notifications**: Success/error notification helpers (showSuccessNotification, showErrorNotification)

## Development Commands (Use PowerShell)

### ⚠️ IMPORTANT: DO NOT RUN DEVELOPMENT SERVER

**NEVER run development server commands** as they stall prompt processing:

- ❌ `yarn dev`
- ❌ `yarn run dev`
- ❌ `npm start`
- ❌ `npm run dev`

These commands start interactive processes that will cause the development environment to hang and become unresponsive.

### Available Commands

- Build: `yarn build`
- Lint: `yarn lint`
- Lint fix: `yarn lint:fix`
- Format: `yarn format`
- Format check: `yarn format:check`
- Type check: `yarn type-check`
- API generation: `yarn api:generate`

## Code Quality Rules

- NO comments in code (self-explanatory code preferred)
- NO example code unless requested
- Use TypeScript strictly
- Follow mobile-first responsive design
- Prioritize performance for mobile gameplay
- Use proper error boundaries and loading states
- Implement proper accessibility features
- Maintain consistent component structure and naming patterns

## Game-Specific Guidelines

- Focus on user experience for quiz gameplay
- Implement proper game state management
- Consider real-time multiplayer interactions
- Optimize for quick question-answer cycles
- Ensure responsive design works well for game elements
- Use appropriate loading states during game transitions
- Implement proper error handling for game flow disruptions
