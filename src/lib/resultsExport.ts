/**
 * resultsExport.ts — utilities for exporting restore results as JSON.
 *
 * Milestone 13 — Final Results Report
 *
 * Collects data from all three restore operations (playlists, tracks, liked songs)
 * and creates a downloadable JSON report for debugging and archival.
 */

export interface RestoreLogEntry {
  timestamp: string; // ISO 8601 UTC
  level: "info" | "warn" | "error";
  step: "playlists" | "tracks" | "liked-songs" | "summary";
  message: string;
}

export interface RestoreResultSummary {
  exportedAt: string; // ISO 8601 UTC
  source: { id: string; displayName: string | null };
  destination: { id: string; displayName: string | null };

  playlists: {
    created: number;
    failed: number;
    total: number;
  };

  tracks: {
    restored: number;
    skippedLocal: number;
    skippedEpisode: number;
    skippedUnavailable: number;
    skippedNull: number;
    failed: number;
    total: number;
  };

  likedSongs: {
    restored: number;
    skippedLocal: number;
    skippedEpisode: number;
    skippedNull: number;
    failed: number;
    total: number;
  };

  logs: RestoreLogEntry[];
}

/**
 * Downloads a JSON file with restore results.
 */
export function downloadResultsJSON(results: RestoreResultSummary): void {
  const json = JSON.stringify(results, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `spotify-restore-results-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Formats a large number with commas for readability.
 */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/**
 * Calculates a simple success rate percentage.
 */
export function calculateSuccessRate(succeeded: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((succeeded / total) * 100);
}
