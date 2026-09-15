import { Route, Routes } from "react-router-dom";
import { StateProvider } from "./StateContext";
import { Layout } from "./Layout";
import {
  Bookmarks,
  Compare,
  Explore,
  Glossary,
  GuidePage,
  Home,
  NotFound,
  ProjectDetail,
  Projects,
  Review,
  Settings,
  Sources,
  StartProblem,
  Troubleshoot,
} from "../features/pages";
export function App() {
  return (
    <StateProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="start" element={<StartProblem />} />
          <Route path="explore" element={<Explore />} />
          <Route path="guides/:id" element={<GuidePage />} />
          <Route path="review" element={<Review />} />
          <Route path="troubleshoot" element={<Troubleshoot />} />
          <Route path="compare" element={<Compare />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="sources" element={<Sources />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </StateProvider>
  );
}
