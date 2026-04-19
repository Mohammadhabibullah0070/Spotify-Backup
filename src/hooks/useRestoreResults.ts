/**
 * useRestoreResults — aggregates results from all three restore operations.
 *
 * Milestone 13
 *
 * Collects final tallies from:
 *   • Playlist creation (usePlaylistCreator)
 *   • Track restoration (useTrackRestorer)
 *   • Liked songs restoration (useLikedSongsRestorer)
 *
 * Returns a summary object suitable for display and JSON export.
 */

import { useAuth } from "./useAuth";
import type {
  RestoreResultSummary,
  RestoreLogEntry,
} from "../lib/resultsExport";

export interface UseRestoreResultsInput {
  playlistsCreated?: number;
  playlistsFailed?: number;
  tracksRestored?: number;
  tracksSkippedLocal?: number;
  tracksSkippedEpisode?: number;
  tracksSkippedNull?: number;
  tracksSkippedUnavailable?: number;
  tracksFailed?: number;
  likedRestored?: number;
  likedSkippedLocal?: number;
  likedSkippedEpisode?: number;
  likedSkippedNull?: number;
  likedFailed?: number;
  logs?: RestoreLogEntry[];
}

/**
 * Aggregates restore results into a summary object.
 * Input can be partial — missing fields default to 0.
 */
export function buildRestoreSummary(
  sourceId: string,
  sourceName: string | null,
  destId: string,
  destName: string | null,
  input: UseRestoreResultsInput = {},
): RestoreResultSummary {
  const summary: RestoreResultSummary = {
    exportedAt: new Date().toISOString(),

    source: {
      id: sourceId,
      displayName: sourceName,
    },

    destination: {
      id: destId,
      displayName: destName,
    },

    playlists: {
      created: input.playlistsCreated ?? 0,
      failed: input.playlistsFailed ?? 0,
      total: (input.playlistsCreated ?? 0) + (input.playlistsFailed ?? 0),
    },

    tracks: {
      restored: input.tracksRestored ?? 0,
      skippedLocal: input.tracksSkippedLocal ?? 0,
      skippedEpisode: input.tracksSkippedEpisode ?? 0,
      skippedUnavailable: input.tracksSkippedUnavailable ?? 0,
      skippedNull: input.tracksSkippedNull ?? 0,
      failed: input.tracksFailed ?? 0,
      total:
        (input.tracksRestored ?? 0) +
        (input.tracksSkippedLocal ?? 0) +
        (input.tracksSkippedEpisode ?? 0) +
        (input.tracksSkippedUnavailable ?? 0) +
        (input.tracksSkippedNull ?? 0) +
        (input.tracksFailed ?? 0),
    },

    likedSongs: {
      restored: input.likedRestored ?? 0,
      skippedLocal: input.likedSkippedLocal ?? 0,
      skippedEpisode: input.likedSkippedEpisode ?? 0,
      skippedNull: input.likedSkippedNull ?? 0,
      failed: input.likedFailed ?? 0,
      total:
        (input.likedRestored ?? 0) +
        (input.likedSkippedLocal ?? 0) +
        (input.likedSkippedEpisode ?? 0) +
        (input.likedSkippedNull ?? 0) +
        (input.likedFailed ?? 0),
    },

    logs: input.logs ?? [],
  };

  return summary;
}

/**
 * Hook to manage and provide restore results summary.
 * Call this from your results display component.
 */
export function useRestoreResults() {
  const { source, destination } = useAuth();

  /**
   * Build a summary from individual result objects.
   * Used by RestorePanel when all steps are done.
   */
  const buildSummary = (
    input: UseRestoreResultsInput,
  ): RestoreResultSummary | null => {
    if (!source?.user || !destination?.user) {
      return null;
    }

    return buildRestoreSummary(
      source.user.id,
      source.user.display_name,
      destination.user.id,
      destination.user.display_name,
      input,
    );
  };

  return { buildSummary };
}
