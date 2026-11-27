# CareerSync daily reel factory — staging

Free, offline motion-graphics reel renderer (Pillow + FFmpeg). No paid APIs, secrets, production deploys, or social publishing.

## Safety and review
- Edit `jobs.json` to mark a real, verified job `"status": "approved"` and set its expiry date. Entries default to `draft`; expired jobs never render.
- The GitHub workflow is restricted to `staging/careersync-daily-reels`.
- Run it manually from Actions > CareerSync daily reels > Run workflow > select staging branch.
- Download the `careersync-reel-review-*` artifact (MP4 + review.txt) and approve before publishing.
- The scheduled trigger is included for eventual rollout, but GitHub scheduled workflows only execute from the repository default branch. It will **not** run daily while this workflow remains staging-only.
- No actual BechNaSeekho logo asset or natural-language narration is bundled yet. This MVP uses text branding and silent animations. Supply an authorized logo and licensed narration/music before final approval.
- Video: 540×960, 30 seconds, H.264 MP4; review text includes title and caption.
- GitHub Actions free-minute and artifact-storage quotas depend on repository plan/visibility. No paid AI services are used.

## Future production rollout (requires separate explicit approval)
After staging tests, create a separate scheduled workflow or merge the reviewed workflow into default branch with a safe schedule guard, approved job feed, branding assets, optional free TTS, and approval-gated publishing. Do not auto-publish.
