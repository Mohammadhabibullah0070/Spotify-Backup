/**
 * errorCodes.ts — Centralized error message mapping.
 *
 * Maps error codes to:
 *   - User-friendly messages
 *   - Recovery suggestions
 *   - Links to troubleshooting docs
 *
 * Pattern: throw new Error('error_key: details')
 * Then use parseErrorMessage(err) to get user-friendly text + hints.
 */

export interface ParsedError {
  code: string;
  message: string;
  recovery?: string;
  troubleshootingLink?: string;
}

/**
 * Parse an error thrown by the app.
 * Returns a structure with user-friendly message + recovery hints.
 */
export function parseErrorMessage(err: unknown): ParsedError {
  if (!(err instanceof Error)) {
    return {
      code: "unknown",
      message: String(err) || "An unexpected error occurred.",
    };
  }

  const msg = err.message;

  // ─── AUTHENTICATION ERRORS ─────────────────────────────────

  if (msg.includes("access_denied")) {
    return {
      code: "auth_access_denied",
      message: "You declined the Spotify permissions.",
      recovery:
        "To proceed, you need to allow the app to read your playlists and create new ones.",
    };
  }

  if (msg.includes("redirect_uri") || msg.includes("REDIRECT_URI")) {
    return {
      code: "auth_redirect_uri_mismatch",
      message: "Redirect URI configuration mismatch with Spotify.",
      recovery:
        "The app tried to redirect you back but the URL didn't match. Check that your Spotify app's Redirect URI matches the website URL. See troubleshooting for details.",
      troubleshootingLink: "#redirect-uri-mismatch",
    };
  }

  if (msg.includes("nonce")) {
    return {
      code: "auth_nonce_mismatch",
      message: "Security check failed during login.",
      recovery:
        "Your session may have timed out or been interrupted. Try logging in again.",
    };
  }

  if (msg.includes("code_verifier") || msg.includes("PKCE")) {
    return {
      code: "auth_pkce_failed",
      message: "PKCE security handshake failed.",
      recovery:
        "This is a security protocol issue. Clear your browser cache and try logging in again. If it persists, check the troubleshooting guide.",
      troubleshootingLink: "#pkce-issues",
    };
  }

  if (msg.includes("Token exchange failed") || msg.includes("code")) {
    return {
      code: "auth_token_exchange_failed",
      message: "Failed to exchange authorization code for access token.",
      recovery:
        "The Spotify login may have timed out. Try logging in again or refresh the page.",
    };
  }

  if (msg.includes("Token refresh failed") || msg.includes("refresh_token")) {
    return {
      code: "auth_token_refresh_failed",
      message: "Could not refresh your Spotify session.",
      recovery: "Your session has expired. Please log in again to continue.",
    };
  }

  if (msg.includes("403") && msg.includes("scope")) {
    return {
      code: "auth_insufficient_scopes",
      message: "Missing required Spotify permissions.",
      recovery:
        "The app is asking for permissions it doesn't have. Disconnect and log in again to grant all required permissions.",
      troubleshootingLink: "#missing-scopes",
    };
  }

  if (msg.includes("401") || msg.includes("unauthorized")) {
    return {
      code: "auth_unauthorized",
      message: "Your Spotify session is no longer valid.",
      recovery:
        "Your access token has expired or been revoked. Please log in again.",
    };
  }

  // ─── API ERRORS (restore operations) ─────────────────────────

  if (msg.includes("restore_429")) {
    return {
      code: "api_rate_limited",
      message: "Spotify rate limit hit — too many requests too quickly.",
      recovery:
        "The app is trying to add too many tracks at once. Wait a few minutes and try again.",
    };
  }

  if (msg.includes("create_playlist_")) {
    return {
      code: "api_create_playlist_failed",
      message: "Failed to create a playlist on Spotify.",
      recovery:
        "This might be a temporary Spotify issue or your account may have limits. Try again in a moment.",
    };
  }

  if (msg.includes("add_tracks_")) {
    return {
      code: "api_add_tracks_failed",
      message: "Failed to add tracks to a playlist.",
      recovery:
        "Some tracks may be unavailable in your region or the playlist may be full. See detailed restore results.",
    };
  }

  if (msg.includes("save_liked_")) {
    return {
      code: "api_save_liked_failed",
      message: "Failed to save tracks to your Liked Songs.",
      recovery:
        "Some tracks may not be available. Check the restore results for details on which tracks were skipped.",
    };
  }

  // ─── FILE / VALIDATION ERRORS ──────────────────────────────

  if (msg.includes("File must be a .json file")) {
    return {
      code: "file_invalid_type",
      message: "Please upload a .json backup file.",
      recovery:
        "Make sure you're uploading the backup file created by this app.",
    };
  }

  if (msg.includes("File is too large")) {
    return {
      code: "file_too_large",
      message: "Backup file is too large (> 20 MB).",
      recovery:
        "Your backup is very large. Try splitting it into smaller playlists.",
    };
  }

  if (msg.includes("not valid JSON")) {
    return {
      code: "file_invalid_json",
      message: "Backup file is not valid JSON or is corrupted.",
      recovery:
        "The file may have been damaged or edited incorrectly. Use the original downloaded backup.",
    };
  }

  if (msg.includes("backup version") || msg.includes("version")) {
    return {
      code: "file_unsupported_version",
      message: "Backup format version is not supported.",
      recovery:
        "This backup was created with a different version of the app. Download a new backup from the source account.",
    };
  }

  // ─── NETWORK ERRORS ────────────────────────────────────────

  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return {
      code: "network_error",
      message: "Network connection error.",
      recovery:
        "Check your internet connection and try again. If Spotify is down, wait a moment and retry.",
    };
  }

  // ─── FALLBACK ──────────────────────────────────────────────

  return {
    code: "unknown_error",
    message: msg || "An unexpected error occurred.",
    recovery: "Try refreshing the page or logging in again.",
  };
}

/**
 * Format an error for display in the UI.
 * Includes the user-friendly message and any recovery suggestions.
 */
export function formatErrorForDisplay(err: unknown): string {
  const parsed = parseErrorMessage(err);
  let result = parsed.message;
  if (parsed.recovery) {
    result += `\n\n💡 ${parsed.recovery}`;
  }
  return result;
}
