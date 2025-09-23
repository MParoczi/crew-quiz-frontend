import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { client } from "./api/client.gen";
import { API_BASE_URL } from "./constants/environmentVariables";
import { home, login, previousGames, profile, questions, quizzes, registration, gameSession } from "./constants/pages";
import MainLayout from "./layouts/main_layout/MainLayout";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import QuestionsPage from "./pages/questions/QuestionsPage";
import QuizzesPage from "./pages/quizzes/QuizzesPage";
import RegistrationPage from "./pages/registration/RegistrationPage";
import mainTheme from "./themes/mainTheme";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import PreviousGamesPage from "./pages/previous_games/PreviousGamesPage.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";
import GameSessionPage from "./pages/game_session/GameSessionPage.tsx";
import AuthenticationProtection from "./components/authentication_protection/AuthenticationProtection.tsx";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  client.setConfig({
    baseUrl: API_BASE_URL,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={mainTheme} defaultColorScheme="dark">
        <Notifications position="bottom-center" zIndex={1000} />
        <BrowserRouter>
          <Routes>
            <Route path={login} element={<LoginPage />} />
            <Route path={registration} element={<RegistrationPage />} />
            <Route
              element={
                <AuthenticationProtection>
                  <MainLayout />
                </AuthenticationProtection>
              }
            >
              <Route path={home} element={<HomePage />} index />
              <Route path={quizzes} element={<QuizzesPage />} />
              <Route path={questions} element={<QuestionsPage />} />
              <Route path={previousGames} element={<PreviousGamesPage />} />
              <Route path={profile} element={<ProfilePage />} />
            </Route>
            <Route
              path={`${gameSession}/:sessionId`}
              element={
                <AuthenticationProtection>
                  <GameSessionPage />
                </AuthenticationProtection>
              }
            />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
