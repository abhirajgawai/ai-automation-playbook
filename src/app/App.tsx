import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { StateProvider } from "./StateContext";
import { Layout } from "./Layout";
import { NotFound } from "../components/UI";

const HomePage = lazy(() =>
  import("../features/home/HomePage").then((m) => ({ default: m.HomePage })),
);
const GuidePage = lazy(() =>
  import("../features/guides/GuidePage").then((m) => ({
    default: m.GuidePage,
  })),
);
const ExplorePage = lazy(() =>
  import("../features/explore/ExplorePage").then((m) => ({
    default: m.ExplorePage,
  })),
);
const StartProblemPage = lazy(() =>
  import("../features/discovery/StartProblemPage").then((m) => ({
    default: m.StartProblemPage,
  })),
);
const ReviewPage = lazy(() =>
  import("../features/reviews/ReviewPage").then((m) => ({
    default: m.ReviewPage,
  })),
);
const ProjectsPage = lazy(() =>
  import("../features/projects/ProjectsPage").then((m) => ({
    default: m.ProjectsPage,
  })),
);
const ProjectPage = lazy(() =>
  import("../features/projects/ProjectPage").then((m) => ({
    default: m.ProjectPage,
  })),
);
const TroubleshootPage = lazy(() =>
  import("../features/troubleshooting/TroubleshootPage").then((m) => ({
    default: m.TroubleshootPage,
  })),
);
const ComparePage = lazy(() =>
  import("../features/compare/ComparePage").then((m) => ({
    default: m.ComparePage,
  })),
);
const BookmarksPage = lazy(() =>
  import("../features/library/BookmarksPage").then((m) => ({
    default: m.BookmarksPage,
  })),
);
const GlossaryPage = lazy(() =>
  import("../features/library/GlossaryPage").then((m) => ({
    default: m.GlossaryPage,
  })),
);
const SourcesPage = lazy(() =>
  import("../features/library/SourcesPage").then((m) => ({
    default: m.SourcesPage,
  })),
);
const SettingsPage = lazy(() =>
  import("../features/settings/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  })),
);

export function App() {
  return (
    <StateProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="start" element={<StartProblemPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="guides/:id" element={<GuidePage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="troubleshoot" element={<TroubleshootPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="glossary" element={<GlossaryPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </StateProvider>
  );
}
