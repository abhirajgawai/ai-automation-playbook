import { guides } from "../../content";
import type { Guide } from "../../content/types";
import { Empty, Page } from "../../components/UI";
import { usePersonalState } from "../../app/StateContext";
import { GuideIndexItem } from "../explore/GuideIndexItem";
import "../explore/explore.css";

/**
 * Bookmarks (Task 12). Replaces the legacy `Bookmarks()` page in the
 * now-deleted `src/features/pages.tsx` with the identical bookmark list
 * (`state.bookmarks` cross-referenced against `guides`, unknown/removed
 * IDs silently dropped) but rendered with the same `GuideIndexItem`
 * substantive preview card the Learn/Explore page (Task 7) already
 * established, so a saved guide reads exactly like it would from Explore --
 * summary, "Use it when" rule and stage badges included -- rather than a
 * bare title link. This is a deliberate reuse, not a duplicate: the
 * pre-flight scan reserves a shared empty-state primitive between the
 * project/bookmark routes, and reusing the explore card here keeps
 * "continue reading" affordances consistent across every guide listing.
 */
export function BookmarksPage() {
  const { state } = usePersonalState();
  const found = state.bookmarks
    .map((id) => guides.find((g) => g.id === id))
    .filter((g): g is Guide => !!g);
  return (
    <Page
      title="Bookmarks"
      intro="Saved reading for this browser. Open any card to pick up exactly where you left off."
    >
      {found.length ? (
        <div className="guide-index">
          {found.map((g) => (
            <GuideIndexItem key={g.id} guide={g} />
          ))}
        </div>
      ) : (
        <Empty
          title="No bookmarks yet"
          body="Bookmark a guide to keep it close at hand."
          link="Explore guides"
          to="/explore"
        />
      )}
    </Page>
  );
}
