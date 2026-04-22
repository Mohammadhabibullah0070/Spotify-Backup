# Spotify Backup

Backup your Spotify library (playlists + liked songs) and restore to any account. Simple, secure, no setup needed.

**Live app:** https://spotify-backup-1iz5.vercel.app

---

## Features

- 🔐 **Secure OAuth2 Auth** — No passwords stored
- 💾 **Complete Backup** — Export all playlists, tracks, and liked songs as JSON
- 🔄 **Smart Restore** — Recreate your library in any Spotify account
- 📊 **Results Dashboard** — See what restored and what failed
- 📱 **Responsive** — Works on desktop, tablet, and mobile
- 🚀 **100% Client-Side** — No server, no tracking

---

## For Users

To use this app, you need a Spotify Developer app. The process is simple:

### How It Works

1. **Create a Spotify Developer Account** (free) at https://developer.spotify.com/dashboard
2. **Create an app** and get your Client ID
3. **Whitelist your Spotify accounts** (the ones you want to backup/restore from)
4. **Setup the app** with your Client ID (see Developer section below)
5. **Run locally** or deploy your own version
6. **Login and backup/restore** using your whitelisted accounts

### Why the Dev Portal?

Spotify requires all apps to be whitelisted in development mode. This is a security measure. You whitelist the actual Spotify accounts you'll be using, and then they can authenticate with your app.

---

## For Developers

### Getting Started

**Required:** Node.js 18+, Spotify Developer Account

Follow these steps to set up your own instance:

```bash
# Clone and install
git clone https://github.com/Mohammadhabibullah0070/spotify-backup.git
cd spotify-backup
npm install

# Get Spotify Client ID from https://developer.spotify.com/dashboard

# Configure
cp .env.example .env.local
# Edit .env.local with your Client ID

# Add this to Spotify Dashboard → Redirect URIs:
# http://127.0.0.1:3000/callback

# Run
npm run dev
# Open http://127.0.0.1:3000
```

### Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Project Structure

```
src/
├── components/  # UI Components
├── context/     # React Context (Auth, Backup)
├── hooks/       # Custom React hooks
├── lib/         # Utilities (API, auth, storage)
├── pages/       # Page components
└── styles/      # Global CSS
```

See [.CONTRIBUTING.md](./.CONTRIBUTING.md) for detailed architecture and contributing guidelines.

---

## Troubleshooting

| Issue                        | Solution                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| **"redirect_uri mismatch"**  | Use `127.0.0.1` (not localhost). Match `.env.local` exactly with Spotify Dashboard settings.      |
| **"PKCE" or "nonce" errors** | Clear browser storage (DevTools → Application → Clear all). Refresh and try again.                |
| **Permission/scope errors**  | Disconnect account, log back in, and click **Allow** when permissions screen appears.             |
| **Token expired**            | Click the account card and log back in.                                                           |
| **Missing playlists**        | Spotify-generated playlists (Release Radar, Discover Weekly) can't be backed up (API limitation). |
| **Some tracks not restored** | Tracks unavailable in your region or local files (not transferable) are skipped. Check results.   |

---

## Tech Stack

React 18 • TypeScript 5 • Vite 5 • CSS3 • Spotify Web API • OAuth2 with PKCE

---

## Security

- ✅ No server — all data stays in your browser
- ✅ No passwords stored — only Spotify sees credentials
- ✅ No tracking, ads, or data collection
- ✅ Open source — audit the code yourself

---

## FAQ

**Q: Is my data safe?**  
A: Yes. Everything runs in your browser. Your password is only used by Spotify.

**Q: Can I restore to the same account?**  
A: Yes, but you'll get duplicates. Use different accounts for testing.

**Q: What about podcasts?**  
A: Backed up but not restored (Spotify API limitation).

**Q: How do I contribute?**  
A: See [.CONTRIBUTING.md](./.CONTRIBUTING.md).

---

## Support & Contributing

- 🐛 **Found a bug?** Create an issue: https://github.com/Mohammadhabibullah0070/spotify-backup/issues
- 💬 **Want to contribute?** See [.CONTRIBUTING.md](./.CONTRIBUTING.md)
- 📚 **Architecture docs?** See [.CONTRIBUTING.md](./.CONTRIBUTING.md)

---

## License

MIT — Free to use, modify, and distribute.

Built with ❤️ using React, TypeScript, and Spotify's Web API.

---

## Development Workflow

### Available Scripts

```bash
npm run dev       # Start Vite dev server (http://127.0.0.1:3000)
npm run build     # Compile TypeScript + build for production
npm run preview   # Preview production build locally
```

### Project Structure

```
src/
├── components/              # UI Components
│   ├── AccountCard/         # Show logged-in user + buttons
│   ├── BackupButton/        # Trigger backup export
│   ├── ImportPanel/         # Upload backup JSON
│   ├── PlaylistList/        # Show playlists
│   ├── RestorePanel/        # Restore flow (playlists → tracks → liked)
│   ├── ResultsPanel/        # Show detailed stats
│   ├── StatusPanel/         # Loading indicators + errors
│   └── layout/              # App chrome/layout
├── context/                 # React Context providers
│   ├── AuthContext.tsx      # Manage source + destination accounts
│   └── BackupContext.tsx    # Imported backup + restore state
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts           # Access auth state
│   ├── useBackup.ts         # Orchestrate backup flow
│   ├── usePlaylistCreator.ts # Step 1 of restore (create playlists)
│   ├── useTrackRestorer.ts  # Step 2 of restore (add tracks)
│   ├── useLikedSongsRestorer.ts # Step 3 of restore (save liked)
│   ├── useRestoreResults.ts # Aggregate final results
│   └── usePlaylistTracks.ts / usePlaylists.ts / useLikedSongs.ts
├── lib/                     # Utilities
│   ├── spotifyApi.ts        # Read API (get user, playlists, tracks)
│   ├── spotifyAuth.ts       # Auth flow (PKCE, token exchange)
│   ├── restoreApi.ts        # Write API (create playlist, add tracks)
│   ├── backupFormat.ts      # Backup JSON schema + building
│   ├── validateBackup.ts    # Validate imported JSON
│   ├── resultsExport.ts     # Format results for download
│   ├── errorCodes.ts        # Centralized error messages
│   ├── pkce.ts              # PKCE helpers
│   ├── storage.ts           # LocalStorage wrappers
│   └── spotifyAuth.ts       # Auth (token exchange, refresh)
├── pages/                   # Page-level components
│   ├── HomePage.tsx         # Main UI
│   └── CallbackPage.tsx     # OAuth callback redirect handler
└── styles/                  # Global CSS
```

### Key Concepts

**Authentication Context (`AuthContext.tsx`)**

- Stores logged-in user data for both source and destination accounts
- Auto-refreshes expired tokens (keeps you logged in across page refreshes)
- Provides `loginAs()` and `logoutAs()` helpers

**Backup Context (`BackupContext.tsx`)**

- Stores the imported backup JSON
- Tracks playlist mapping (source ID → destination ID created during restore)
- Provides `setImportedBackup()` helper

**PKCE Flow** (`spotifyAuth.ts` + `pkce.ts`)

- Generates a random code verifier + challenge
- Redirects to Spotify login
- Spotify redirects back with an auth code
- Exchange code + verifier for access token (without sending a client secret!)

**Rate Limiting** (`restoreApi.ts`)

- Spotify limits API writes to ~3 requests/second
- App batches 100 tracks per request + waits 300ms between batches
- Automatically retries on 429 (rate limit) errors

---

## Deployment

### Deploy to Vercel (Easiest)

1. Push your code to GitHub
2. Go to https://vercel.com and click **"Import Project"**
3. Connect your GitHub repo
4. Add environment variables:
   ```
   VITE_SPOTIFY_CLIENT_ID = your_client_id
   VITE_SPOTIFY_REDIRECT_URI = https://your-vercel-url.vercel.app/callback
   ```
5. Click **Deploy** (automatic on every push to `main`)

### Deploy to Other Hosts (Netlify, GitHub Pages, etc.)

Similar steps:

1. Push to GitHub
2. Connect your host's dashboard to the repo
3. Add environment variables
4. Deploy

**Important:** Don't forget to add your production URL to Spotify Dashboard Redirect URIs!

---

## Troubleshooting

### Overview of Common Issues

| Issue                                   | Section                                             |
| --------------------------------------- | --------------------------------------------------- |
| "Redirect URI mismatch" when logging in | [Redirect URI Mismatch](#redirect-uri-mismatch)     |
| "PKCE" or "nonce" errors                | [PKCE Issues](#pkce-issues)                         |
| "Permission denied" or missing scopes   | [Missing Scopes](#missing-scopes)                   |
| Can't log back in, session expired      | [Token Expiry](#token-expiry)                       |
| Some playlists aren't showing up        | [Missing Playlists](#missing-playlists)             |
| "Local track" warnings during restore   | [Local Track Limitations](#local-track-limitations) |
| Some songs aren't restored              | [Unavailable Tracks](#unavailable-tracks)           |
| Spotify rate limit errors               | [Rate Limiting](#rate-limiting)                     |

---

### Redirect URI Mismatch

**Error Message:**

```
redirect_uri mismatch
```

or

```
Redirect URI configuration mismatch with Spotify
```

**Why It Happens:**
The app tried to log you in but the redirect URL doesn't match your Spotify app settings. This is a security feature.

**Fix It:**

#### For Local Development

1. Make sure your `.env.local` has:

   ```env
   VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
   ```

   ⚠️ Important: Use `127.0.0.1` not `localhost` (Spotify changed this)

2. Go to https://developer.spotify.com/dashboard → Your App → **Edit Settings**

3. Under **Redirect URIs**, make sure you have EXACTLY:

   ```
   http://127.0.0.1:3000/callback
   ```

   (must match your `.env.local` exactly)

4. Click **Save** and wait 10 seconds

5. Try logging in again

#### For Production (Vercel/Netlify/etc.)

1. Your production URL is something like: `https://your-app.vercel.app`

2. Add this to Spotify Dashboard Redirect URIs:

   ```
   https://your-app.vercel.app/callback
   ```

3. Set environment variable:

   ```
   VITE_SPOTIFY_REDIRECT_URI=https://your-app.vercel.app/callback
   ```

4. Re-deploy and try again

**Pro Tip:**

- You can have BOTH URLs in your Spotify app:
  - `http://127.0.0.1:3000/callback` (for local testing)
  - `https://your-app.vercel.app/callback` (for production)
- Just use different `.env` files for each!

---

### PKCE Issues

**Error Messages:**

```
auth_pkce_failed
Code verifier not found
nonce mismatch
Could not parse OAuth state
```

**Why It Happens:**
PKCE is a security protocol for OAuth2. It generates a secret code during login that gets verified when exchanging the auth code for tokens. Errors happen when:

- Browser storage was cleared before redirect completed
- Session storage was accidentally cleared
- Browser tab was closed mid-login
- Multiple login attempts in different tabs

**Fix It:**

1. **Clear Browser Storage (if stuck in error loop)**
   - Open Browser DevTools (F12)
   - Go to **Application** → **Storage**
   - Clear **Cookies**, **LocalStorage**, and **SessionStorage**
   - Refresh the page

2. **Use a Fresh Browser Tab**
   - Don't try logging in multiple times simultaneously
   - One login at a time, please!

3. **Check Browser Extensions**
   - Some privacy extensions block storage
   - Try temporarily disabling them

4. **Check Console Errors**
   - Open DevTools (F12) → **Console** tab
   - Look for red errors with `PKCE` or `nonce` in the name
   - Screenshot them for debugging

**Still broken?**

```bash
# If this persists after clearing storage, try:
# 1. Restart your browser completely
# 2. For development: Restart npm run dev
# 3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
```

---

### Missing Scopes

**Error Message:**

```
Your account does not have the appropriate scopes
```

or

```
Requires scopes: user-library-modify
```

**Why It Happens:**
The app asks Spotify for 10 permissions (called "scopes"):

- Read your profile (name, email)
- Read your playlists
- Read your liked songs
- Modify your playlists
- Modify your library
- (etc.)

If you refused to grant one of these, certain features won't work.

**Fix It:**

1. **Disconnect the account:**
   - Click the account card → **Disconnect**

2. **Log back in:**
   - Click **Login with Spotify**
   - You'll see a **permissions** screen
   - Click **Allow** to grant ALL permissions
   - If you click **Deny**, you can't use that account for this app

3. **Try your operation again**

**What each scope does:**

| Scope                         | Used For                                     |
| ----------------------------- | -------------------------------------------- |
| `user-read-private`           | Show your name, country, premium/free status |
| `user-read-email`             | Show your email address                      |
| `user-library-read`           | Backup: read your liked songs                |
| `user-library-modify`         | Restore: save liked songs                    |
| `playlist-read-private`       | Backup: read your playlists                  |
| `playlist-read-collaborative` | Backup: read shared playlists                |
| `playlist-modify-public`      | Restore: create/edit public playlists        |
| `playlist-modify-private`     | Restore: create/edit private playlists       |
| `user-follow-read`            | Backup: read who you follow                  |
| `user-follow-modify`          | Restore: re-follow artists                   |

---

### Token Expiry

**Error Message:**

```
Destination session expired. Please reconnect.
```

or

```
Session expired. Please reconnect your source account.
```

**Why It Happens:**
Spotify access tokens expire after 1 hour. The app automatically tries to refresh them, but if:

- You're offline for too long
- The refresh token was revoked
- The browser storage was cleared

Then you need to log back in.

**Fix It:**

1. Click the account card (Source or Destination)
2. Click **Disconnect**
3. Click **Login with Spotify** again
4. Approve permissions
5. Resume your backup/restore

**Note:** Tokens auto-refresh every 5 minutes while you're using the app, so you shouldn't see this unless you're AFK for a while.

---

### Missing Playlists

**Issue:**
Some of your Spotify playlists don't show up in the backup.

**Why It Happens:**

| Playlist Type                    | What Happens      | Why                                                |
| -------------------------------- | ----------------- | -------------------------------------------------- |
| Your own playlists               | ✅ Backed up      | You own them, full access                          |
| Playlists you follow             | ❌ Skipped        | Spotify blocks API access to read them             |
| Spotify-generated playlists      | ❌ Skipped        | Example: Release Radar, Discover Weekly, Top Songs |
| Playlists others shared with you | ⚠️ May be blocked | Depends on the owner's privacy settings            |
| Playlists you collaborated on    | ✅ Backed up      | You have write access                              |

**Spotify's Limitation:**
Spotify returns a **403 error** (permission denied) for playlists generated by Spotify's algorithms or owned by other users. This is a Spotify API limitation, not a bug in this app.

**What You Can Do:**

1. **For Release Radar / Discover Weekly / etc.:**
   - Spotify regenerates these weekly, so don't try to restore them
   - They'll be different on your new account anyway

2. **For shared playlists you want to preserve:**
   - Contact the playlist owner and ask them to make it public
   - Or recreate them manually in your destination account

3. **See what was skipped:**
   - Check the **Backup Results** panel
   - Look for ⚠️ icons and error messages
   - Download the JSON backup and search for `"skipped"` entries

---

### Local Track Limitations

**Error/Warning:**

```
⚠️ Local track (not available on Spotify)
```

**What Are Local Tracks?**
Local tracks are MP3 files you added to Spotify yourself (uploaded from your computer). They're stored in YOUR library but not in Spotify's database, so:

- Only you can see them
- Can't be shared
- Can't be restored to another account
- Can't even access them via API

**What Happens During Backup:**

- ✅ Local tracks are INCLUDED in your backup JSON
- They show a warning: `"kind": "local"`

**What Happens During Restore:**

- ❌ Local tracks are SKIPPED
- The app can't add them to the destination (Spotify API limitation)
- You'll see a count like: "Skipped 2 local tracks"

**What You Can Do:**

1. **Identify your local tracks:**
   - Open your backup JSON file
   - Search for `"kind": "local"`
   - Note the track names/artists

2. **Find them on Spotify:**
   - Search for each song on Spotify
   - Find the official version
   - You'll need to manually add these to your destination account

3. **Bulk-add via Spotify:**
   - Create a playlist with the official tracks
   - Share the link with yourself or friends
   - More user-friendly than using this app for local files

---

### Unavailable Tracks

**Issue:**
A song shows as restored but isn't actually in your playlist.

**Error/Warning:**

```
⚠️ Unavailable track
```

**Why It Happens:**

Spotify removes tracks for various reasons:

| Reason                      | Example                              |
| --------------------------- | ------------------------------------ |
| **Regional unavailability** | Song is blocked in your country      |
| **Licensing expired**       | Music label removed rights           |
| **Track deleted**           | Artist or label removed the song     |
| **Podcast episode**         | Episodes can't go in music playlists |
| **Account restrictions**    | Your account type doesn't allow it   |

**What Happens During Restore:**

1. The app tries to add the track
2. Spotify returns a 404 (not found) or 403 (not available in your region)
3. The app logs it as "unavailable" and moves on
4. ✅ The restore continues (it doesn't stop)

**Check the Results:**

1. After restore completes, click **"View Results"**
2. Look for the "Unavailable Tracks" section
3. Download the JSON results to see exact tracks

**What You Can Do:**

1. **Check if it's regional:**
   - Try a VPN set to the song's original country
   - Or wait for licensing agreements to change

2. **Find alternatives:**
   - Search for a cover version or remix
   - Manually add it to the playlist

3. **Report to Spotify:**
   - If a popular song is incorrectly unavailable, report it via the Spotify app

---

### Rate Limiting

**Error Message:**

```
restore_429: Rate limit hit too many times
```

or

```
Retry after Xs — too many requests
```

**Why It Happens:**
Spotify limits API calls to prevent abuse:

- ~3 write requests per second
- If you exceed this, you get a 429 error

The app is designed to respect this:

- Batches 100 tracks per request
- Waits 300ms between batches
- Auto-retries on rate limit

But if you:

- Have 10,000+ tracks
- Are running multiple restores simultaneously
- Have a very slow connection

You might hit the limit.

**Fix It:**

1. **Wait a few minutes** (5-10 minutes usually)
   - Spotify's rate limit resets after a bit

2. **Try again:**
   - Click your restore panel
   - Click the **Restore** button again
   - It'll pick up where it left off (doesn't re-process completed items)

3. **Slower connection?**
   - The app might be batching too fast for Spotify
   - This is rare, but you can:
     - Try on a faster internet connection
     - Wait longer and try again

---

### Other Errors

#### "Could not read the file"

- The file might be corrupted or in an unsupported format
- Download a fresh backup and try again

#### "File is too large"

- Backups are limited to 20 MB
- You probably have 50,000+ tracks!
- The app will still work but may be slow

#### "Invalid JSON"

- The file was edited or corrupted
- Use the original downloaded file

#### Browser showing "Network error"

- Your internet is down
- Spotify is temporarily unavailable
- Check your connection and try again

---

## Tips & Best Practices

### Before You Backup

- Make sure both accounts are logged in
- Check your internet connection
- Backup can take a few minutes for large libraries (10,000+ tracks)

### During Restore

- Don't close the browser tab until it's done
- Don't try to restore to the same account twice (you'll get duplicates)
- If it fails, just click **Restore** again—it's safe to retry

### After Restore

- Check the **Results** panel for what was restored vs. skipped
- Download the JSON results for your records
- Manually add any unavailable tracks you care about

### For Large Libraries (10,000+ Tracks)

- Restore might take 30+ minutes
- Leave the browser window open
- Don't turn off your computer
- Rest assured the app is working (you'll see progress updates)

---

## Contributing

Found a bug? Have an idea? We'd love your help!

1. **Check existing issues:** https://github.com/Mohammadhabibullah0070/spotify-backup/issues
2. **Create a new issue** with:
   - What you were trying to do
   - What error you got
   - Your browser and OS
   - Steps to reproduce

3. **Want to code?**
   - Fork the repo
   - Create a feature branch: `git checkout -b feature/my-feature`
   - Make changes and test locally
   - Push and create a Pull Request

---

## FAQ

**Q: Is my data safe?**
A: Yes! Everything happens in your browser. No data is sent to any server. We can't see your music library or tokens.

**Q: Can I restore to Spotify's official playlists (Release Radar, etc.)?**
A: No, Spotify doesn't allow that. These are read-only playlists.

**Q: Can I backup multiple accounts at once?**
A: You can keep multiple accounts logged in (source + destination), but backup one at a time.

**Q: What happens if I restore to the same account twice?**
A: The playlists will have duplicates of the tracks. Recommend using different accounts for testing.

**Q: Does this work with podcasts?**
A: Podcasts are backed up but not restored (they require a different API endpoint).

**Q: Will my backup work forever?**
A: Yes, as long as Spotify's API stays compatible. If they make major changes, we might need to update the app.

**Q: Can I delete my data?**
A: Yes, just clear your browser's LocalStorage. Or logout (which clears your tokens).

**Q: How do I report a bug?**
A: Create an issue on GitHub with steps to reproduce + your browser console output.

---

## Support

- 📚 **Check the troubleshooting guide** above first
- 🐛 **Found a bug?** Create an issue: https://github.com/Mohammadhabibullah0070/spotify-backup/issues
- 💬 **General questions?** Check existing issues or discussions
- 🎵 **Feature requests?** Open an issue with the label `enhancement`

---

## License

MIT License — you're free to use, modify, and distribute this project. See [LICENSE](./LICENSE) file for details.

---

## Credits

Built with ❤️ using React, TypeScript, Vite, and Spotify's Web API.

Inspired by the original [SpotMyBackup](https://www.spotmybackup.com) project.
