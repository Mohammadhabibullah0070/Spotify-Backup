/**
 * ResultsPanel — displays the final restore results/report.
 *
 * Milestone 13 — Final Results Report
 *
 * Shows:
 *  • Summary stats (playlists, tracks, liked songs)
 *  • Detailed log entries
 *  • Export button for JSON report
 */

import { useState } from "react";
import type { RestoreResultSummary } from "../../lib/resultsExport";
import {
  downloadResultsJSON,
  formatNumber,
  calculateSuccessRate,
} from "../../lib/resultsExport";
import "./ResultsPanel.css";

interface ResultsPanelProps {
  results: RestoreResultSummary;
  onClose?: () => void;
}

export default function ResultsPanel({ results, onClose }: ResultsPanelProps) {
  const [expandedLogs, setExpandedLogs] = useState(false);

  const playlistSuccessRate = calculateSuccessRate(
    results.playlists.created,
    results.playlists.total,
  );

  const tracksSuccessRate = calculateSuccessRate(
    results.tracks.restored,
    results.tracks.total,
  );

  const likedSuccessRate = calculateSuccessRate(
    results.likedSongs.restored,
    results.likedSongs.total,
  );

  return (
    <div className="results-panel">
      {/* ── Header ───────────────────────────────────────────── */}
      <header className="results-panel__header">
        <span className="results-panel__icon" aria-hidden="true">
          ✅
        </span>
        <div>
          <h2 className="results-panel__title">Restore Complete!</h2>
          <p className="results-panel__timestamp">
            Completed at {new Date(results.exportedAt).toLocaleString()}
          </p>
        </div>
      </header>

      {/* ── Account pair ────────────────────────────────────── */}
      <section className="results-panel__accounts">
        <div className="result-account">
          <span className="result-account__label">From</span>
          <span className="result-account__name">
            {results.source.displayName || results.source.id}
          </span>
        </div>
        <span className="result-account__arrow" aria-hidden="true">
          →
        </span>
        <div className="result-account">
          <span className="result-account__label">To</span>
          <span className="result-account__name">
            {results.destination.displayName || results.destination.id}
          </span>
        </div>
      </section>

      {/* ── Summary stats ────────────────────────────────────── */}
      <section className="results-panel__summary">
        {/* Playlists */}
        <StatCard
          icon="📁"
          title="Playlists"
          stats={[
            {
              label: "Created",
              value: results.playlists.created,
              color: "success",
            },
            {
              label: "Failed",
              value: results.playlists.failed,
              color: results.playlists.failed > 0 ? "error" : "muted",
            },
          ]}
          successRate={playlistSuccessRate}
        />

        {/* Tracks */}
        <StatCard
          icon="🎵"
          title="Playlist Tracks"
          stats={[
            {
              label: "Restored",
              value: results.tracks.restored,
              color: "success",
            },
            {
              label: "Local files",
              value: results.tracks.skippedLocal,
              color: "muted",
            },
            {
              label: "Episodes",
              value: results.tracks.skippedEpisode,
              color: "muted",
            },
            {
              label: "Unavailable",
              value: results.tracks.skippedUnavailable,
              color: "warn",
            },
            {
              label: "Deleted",
              value: results.tracks.skippedNull,
              color: "muted",
            },
            {
              label: "Failed",
              value: results.tracks.failed,
              color: results.tracks.failed > 0 ? "error" : "muted",
            },
          ]}
          successRate={tracksSuccessRate}
        />

        {/* Liked Songs */}
        <StatCard
          icon="❤️"
          title="Liked Songs"
          stats={[
            {
              label: "Restored",
              value: results.likedSongs.restored,
              color: "success",
            },
            {
              label: "Local files",
              value: results.likedSongs.skippedLocal,
              color: "muted",
            },
            {
              label: "Episodes",
              value: results.likedSongs.skippedEpisode,
              color: "muted",
            },
            {
              label: "Deleted",
              value: results.likedSongs.skippedNull,
              color: "muted",
            },
            {
              label: "Failed",
              value: results.likedSongs.failed,
              color: results.likedSongs.failed > 0 ? "error" : "muted",
            },
          ]}
          successRate={likedSuccessRate}
        />
      </section>

      {/* ── Detailed logs ──────────────────────────────────────── */}
      {results.logs.length > 0 && (
        <section className="results-panel__logs-section">
          <button
            className="results-panel__logs-toggle"
            onClick={() => setExpandedLogs(!expandedLogs)}
            aria-expanded={expandedLogs}
          >
            {expandedLogs ? "▼" : "▶"} Detailed Logs ({results.logs.length}{" "}
            entries)
          </button>

          {expandedLogs && (
            <div className="results-panel__logs">
              {results.logs.map((entry, idx) => (
                <div
                  key={idx}
                  className={`result-log-entry result-log-entry--${entry.level}`}
                  title={entry.timestamp}
                >
                  <span className="result-log-entry__level" aria-hidden="true">
                    {entry.level === "error" && "❌"}
                    {entry.level === "warn" && "⚠️"}
                    {entry.level === "info" && "ℹ️"}
                  </span>
                  <span className="result-log-entry__step">[{entry.step}]</span>
                  <span className="result-log-entry__message">
                    {entry.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Action buttons ──────────────────────────────────────── */}
      <section className="results-panel__actions">
        <button
          className="results-panel__btn results-panel__btn--primary"
          onClick={() => downloadResultsJSON(results)}
        >
          📥 Download JSON Report
        </button>
        {onClose && (
          <button
            className="results-panel__btn results-panel__btn--secondary"
            onClick={onClose}
          >
            Done
          </button>
        )}
      </section>

      {/* ── Notes ──────────────────────────────────────────────── */}
      <section className="results-panel__notes">
        <p>
          ℹ️ <strong>Note:</strong> Local files and episodes cannot be restored
          via the Spotify API. Unavailable tracks are geo-restricted in your
          region but their linked versions were attempted. For detailed
          debugging, download the JSON report.
        </p>
      </section>
    </div>
  );
}

// ── Stat Card Component ──────────────────────────────────────

interface StatItem {
  label: string;
  value: number;
  color: "success" | "warn" | "error" | "muted";
}

interface StatCardProps {
  icon: string;
  title: string;
  stats: StatItem[];
  successRate: number;
}

function StatCard({ icon, title, stats, successRate }: StatCardProps) {
  const total = stats.reduce((sum, s) => sum + s.value, 0);

  return (
    <article className="stat-card">
      <header className="stat-card__header">
        <span className="stat-card__icon" aria-hidden="true">
          {icon}
        </span>
        <h3 className="stat-card__title">{title}</h3>
      </header>

      <div className="stat-card__stats">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`stat-item stat-item--${stat.color}`}
          >
            <span className="stat-item__label">{stat.label}</span>
            <span className="stat-item__value">{formatNumber(stat.value)}</span>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="stat-card__footer">
          <div
            className="stat-card__bar"
            role="progressbar"
            aria-valuenow={successRate}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="stat-card__bar-fill"
              style={{ width: `${successRate}%` }}
            />
          </div>
          <span className="stat-card__rate">{successRate}% success</span>
        </div>
      )}
    </article>
  );
}
