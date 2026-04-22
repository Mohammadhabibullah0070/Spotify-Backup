/**
 * CallbackPage — rendered when Spotify redirects back to /callback.
 *
 * Steps:
 *  1. Read ?code and ?state from the URL
 *  2. Validate the nonce (CSRF check)
 *  3. Load the code verifier from sessionStorage
 *  4. Exchange the auth code for tokens
 *  5. Fetch the user's profile
 *  6. Save everything via AuthContext
 *  7. Redirect to /
 */

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { exchangeCodeForTokens } from "../lib/spotifyAuth";
import { fetchCurrentUser } from "../lib/spotifyApi";
import {
  loadCodeVerifier,
  loadNonce,
  clearCodeVerifier,
  clearNonce,
  type StoredTokens,
} from "../lib/storage";
import { parseErrorMessage } from "../lib/errorCodes";
import type { OAuthState } from "../lib/spotifyAuth";
import "./CallbackPage.css";

type Status = "loading" | "error";

export default function CallbackPage() {
  const { setAccount } = useAuth();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const stateRaw = params.get("state");
    const error = params.get("error"); // e.g. 'access_denied'

    // ── User denied access ─────────────────────────────────────
    if (error) {
      const parsed = parseErrorMessage(
        error === "access_denied"
          ? new Error("access_denied: user_declined_permissions")
          : new Error(error),
      );
      setErrorCode(parsed.code);
      setErrorMsg(
        error === "access_denied"
          ? 'You declined the Spotify permissions.\n\n💡 To use this app, you need to approve access to your playlists, liked songs, and library. Click "Allow" next time, or try logging in again.'
          : `Spotify returned an error: ${error}\n\n💡 ${parsed.recovery || "Try logging in again."}`,
      );
      setStatus("error");
      return;
    }

    // ── Missing params ─────────────────────────────────────────
    if (!code || !stateRaw) {
      setErrorCode("auth_pkce_failed");
      setErrorMsg(
        "Missing code or state parameter.\n\n💡 This usually means Spotify did not redirect correctly. Try refreshing the page and logging in again.",
      );
      setStatus("error");
      return;
    }

    // ── Parse state ────────────────────────────────────────────
    let oauthState: OAuthState;
    try {
      oauthState = JSON.parse(stateRaw) as OAuthState;
    } catch {
      setErrorCode("auth_pkce_failed");
      setErrorMsg(
        "Could not parse OAuth state.\n\n💡 Try clearing your browser cache and logging in again. If this persists, check the troubleshooting guide.",
      );
      setStatus("error");
      return;
    }

    const { role, nonce } = oauthState;

    // ── CSRF nonce check ───────────────────────────────────────
    const savedNonce = loadNonce(role);
    if (!savedNonce || savedNonce !== nonce) {
      setErrorCode("auth_pkce_failed");
      setErrorMsg(
        "Security check failed (nonce mismatch).\n\n💡 Your session may have expired or been interrupted. Try logging in again.",
      );
      setStatus("error");
      return;
    }

    // ── Load code verifier ─────────────────────────────────────
    const codeVerifier = loadCodeVerifier(role);
    if (!codeVerifier) {
      setErrorCode("auth_pkce_failed");
      setErrorMsg(
        "Code verifier not found.\n\n💡 Try clearing your browser storage (cache/cookies) and logging in again.",
      );
      setStatus("error");
      return;
    }

    // ── Exchange code for tokens ────────────────────────────────
    (async () => {
      try {
        const tokenResponse = await exchangeCodeForTokens(code, codeVerifier);

        const tokens: StoredTokens = {
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          expiresAt: Date.now() + tokenResponse.expires_in * 1000,
        };

        // Fetch the user's Spotify profile
        const user = await fetchCurrentUser(tokenResponse.access_token);

        // Save to context + localStorage
        setAccount(role, tokens, user);

        // Clean up session storage (these are single-use)
        clearCodeVerifier(role);
        clearNonce(role);

        // Redirect to home
        window.location.href = "/";
      } catch (err) {
        const parsed = parseErrorMessage(err);
        setErrorCode(parsed.code);
        setErrorMsg(
          `Login failed: ${parsed.message}${parsed.recovery ? `\n\n💡 ${parsed.recovery}` : ""}`,
        );
        setStatus("error");
      }
    })();
  }, [setAccount]);

  // ── Render ──────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="callback-page">
        <div className="callback-page__card">
          <div className="callback-page__spinner" aria-hidden="true" />
          <h1 className="callback-page__title">Connecting to Spotify…</h1>
          <p className="callback-page__desc">
            Exchanging your authorization code for tokens. This only takes a
            moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="callback-page">
      <div className="callback-page__card callback-page__card--error">
        <span className="callback-page__icon" aria-hidden="true">
          ⚠️
        </span>
        <h1 className="callback-page__title">Login failed</h1>
        <p className="callback-page__desc">{errorMsg}</p>
        {errorCode && (
          <p className="callback-page__error-code">Error code: {errorCode}</p>
        )}
        <a href="/" className="callback-page__btn">
          ← Back to home
        </a>
      </div>
    </div>
  );
}
