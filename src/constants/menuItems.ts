import { IconChartCohort, IconHome2, IconQuestionMark, IconTournament, IconUser } from "@tabler/icons-react";

import { home, previousGames, profile, questions, quizzes } from "./pages";

export default [
  { icon: IconHome2, label: "Home", route: home },
  { icon: IconChartCohort, label: "Quizzes", route: quizzes },
  { icon: IconQuestionMark, label: "Questions", route: questions },
  { icon: IconTournament, label: "Previous Games", route: previousGames },
  { icon: IconUser, label: "Profile", route: profile },
];
