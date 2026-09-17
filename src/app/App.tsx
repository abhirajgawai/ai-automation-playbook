import { Route, Routes } from "react-router-dom";
import { StateProvider } from "./StateContext";
import { Layout } from "./Layout";
import { HomePage } from "../features/home/HomePage";
import { GuidePage } from "../features/guides/GuidePage";
import { ExplorePage } from "../features/explore/ExplorePage";
import { StartProblemPage } from "../features/discovery/StartProblemPage";
import { ReviewPage } from "../features/reviews/ReviewPage";
import { ProjectsPage } from "../features/projects/ProjectsPage";
import { ProjectPage } from "../features/projects/ProjectPage";
import { TroubleshootPage } from "../features/troubleshooting/TroubleshootPage";
import { ComparePage } from "../features/compare/ComparePage";
import { BookmarksPage } from "../features/library/BookmarksPage";
import { GlossaryPage } from "../features/library/GlossaryPage";
import { SourcesPage } from "../features/library/SourcesPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { NotFound } from "../components/UI";
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
