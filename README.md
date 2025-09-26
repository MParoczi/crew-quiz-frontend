# CrewQuiz Frontend

A modern, mobile-first **Jeopardy-style crew quiz game application** built with React and TypeScript. This interactive multiplayer quiz platform allows teams to create custom quizzes, manage questions, and compete in real-time game sessions with engaging game-like animations and responsive design.

## ✨ Features

### 🎮 Game Experience

- **Real-time Multiplayer**: Live game sessions with SignalR integration
- **Jeopardy-style Gameplay**: Classic quiz show format with question selection
- **Role-based Gaming**: Game Master controls vs regular player participation
- **Turn Management**: Organized player rotation and current user tracking
- **Live Updates**: Real-time notifications for all game events
- **Game Session Archive**: Review previous games and results

### 📝 Content Management

- **Quiz Creation**: Design custom quizzes with multiple question groups
- **Question Management**: Create, edit, and organize questions by categories
- **Question Groups**: Organize questions into themed categories
- **Flexible Content**: Support for various question types and difficulty levels

### 👥 User Management

- **User Authentication**: Secure login and registration system
- **User Profiles**: Personal profile management
- **Game History**: Track previous games and performance
- **Authentication Protection**: Route-based access control

### 📱 Technical Features

- **Mobile-First Design**: Optimized for mobile devices with desktop support
- **Responsive UI**: Seamless experience across all screen sizes
- **Dark Theme**: Modern dark color scheme by default
- **Type-Safe API**: Full TypeScript integration with generated API types
- **Real-time Communication**: WebSocket-based live updates
- **Offline-Ready**: Progressive web app capabilities

## 🚀 Technology Stack

### Frontend Framework

- **React 19.1.0** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server

### UI & Styling

- **Mantine 8.0.1** - Comprehensive React UI library
- **Tabler Icons React** - Beautiful icon set
- **CSS Modules** - Scoped styling approach
- **PostCSS** - Advanced CSS processing

### State Management & Data

- **Jotai 2.14.0** - Atomic state management
- **TanStack Query 5.76.2** - Server state management and caching
- **React Router DOM 7.6.0** - Client-side routing

### Real-time & Communication

- **Microsoft SignalR 9.0.6** - Real-time web functionality
- **OpenAPI Code Generation** - Type-safe API integration
- **Fetch API Client** - Modern HTTP client

### Development Tools

- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Yarn** - Package management

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **Yarn** (version 1.22 or higher)
- **Backend API** - The CrewQuiz backend service running
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd crew-quiz-frontend
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Generate API types** (if backend is running)
   ```bash
   yarn api:generate
   ```

## 🏃‍♂️ Development

### Available Scripts

- **`yarn build`** - Build the production application
- **`yarn lint`** - Run ESLint to check code quality
- **`yarn lint:fix`** - Fix auto-fixable linting issues
- **`yarn format`** - Format code with Prettier
- **`yarn format:check`** - Check code formatting
- **`yarn type-check`** - Run TypeScript type checking
- **`yarn preview`** - Preview the production build
- **`yarn api:generate`** - Generate API types from OpenAPI spec

### Development Workflow

1. **Start the backend service** first
2. **Run API generation** to sync types: `yarn api:generate`
3. **Build the application**: `yarn build`
4. **Run code quality checks**: `yarn lint && yarn type-check`

> ⚠️ **Note**: This project does not include a development server command to prevent interactive processes that could interfere with automated environments.

## 📁 Project Structure

```
src/
├── api/                    # Generated API client and types
│   ├── @tanstack/         # React Query integration
│   ├── client.gen.ts      # HTTP client
│   ├── types.gen.ts       # TypeScript type definitions
│   └── sdk.gen.ts         # API SDK functions
├── components/            # Reusable UI components
│   ├── authentication_protection/
│   ├── confirmation_modal/
│   ├── custom_autocomplete/
│   ├── loading_container/
│   └── question_modal/
├── constants/             # Application constants
│   ├── environmentVariables.ts
│   ├── menuItems.ts
│   └── pages.ts
├── hooks/                 # Custom React hooks
│   ├── useQueryData.ts    # API query wrapper
│   ├── useMutateData.ts   # API mutation wrapper
│   ├── useSignalR.ts      # Real-time communication
│   └── useUserLocalStorage.ts
├── layouts/               # Application layouts
│   └── main_layout/
├── pages/                 # Application pages
│   ├── home/             # Dashboard
│   ├── login/            # Authentication
│   ├── registration/     # User registration
│   ├── quizzes/          # Quiz management
│   ├── questions/        # Question management
│   ├── game_session/     # Live game interface
│   │   └── elements/     # Game components
│   │       ├── lobby/    # Pre-game lobby
│   │       ├── question_selection/
│   │       ├── answer/   # Answer submission
│   │       └── result/   # Game results
│   ├── previous_games/   # Game history
│   └── profile/          # User profile
├── resources/            # Static assets
├── storage_configs/      # Local storage configuration
├── themes/              # Mantine theme customization
└── utils/               # Utility functions
```

## 🔌 API Integration

The application uses automatically generated TypeScript types and API clients from an OpenAPI specification. The API provides endpoints for:

### Authentication

- User login and registration
- Token refresh and validation
- Session management

### Game Management

- Create and join game sessions
- Real-time game state updates
- Player management and roles
- Game flow control (start, question selection, answers)

### Content Management

- Quiz CRUD operations
- Question and question group management
- User-specific content filtering

### User Data

- Profile management
- Game history tracking
- Personal statistics

## 🎯 Game Flow

1. **Authentication**: Users login or register
2. **Quiz Management**: Create quizzes and questions
3. **Game Creation**: Start a new game session
4. **Player Lobby**: Players join using session ID
5. **Game Start**: Game Master initiates the game
6. **Question Selection**: Current player chooses a question
7. **Answer Phase**: All players submit answers
8. **Results**: View correct answers and scoring
9. **Next Round**: Continue until quiz completion
10. **Game Archive**: Results saved for future reference

## 🎨 Design System

The application follows a comprehensive design system:

- **Mobile-First**: Optimized for touch interfaces
- **Responsive Breakpoints**: xs(30em), sm(48em), md(64em), lg(74em), xl(90em)
- **Color Palette**: Custom green accent with semantic color system
- **Typography**: Inter font family throughout
- **Component Standards**: Consistent Mantine component usage
- **Animation**: Smooth transitions for enhanced UX

## 🤝 Contributing

### Code Standards

- Follow TypeScript strict mode
- Use Mantine components exclusively
- Implement mobile-first responsive design
- Maintain consistent file naming (PascalCase for components)
- Use CSS Modules for custom styling
- Follow the established component structure pattern

### Development Guidelines

- All functions passed as props must use `useCallback`
- Use Jotai for global state management
- Implement proper error handling and loading states
- Follow the established project structure
- Write self-documenting code without comments

### Component Pattern

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

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For technical support or questions about the CrewQuiz Frontend:

1. Check the project documentation
2. Review the generated API types for backend integration
3. Ensure the backend service is running and accessible
4. Verify environment variables are properly configured

---

**Built with ❤️ for interactive team quiz experiences**
