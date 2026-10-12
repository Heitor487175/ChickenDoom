## Brand-asset pass:

This app is a custom-card, game-like build. Generate the share card and X banner before finishing the task, and keep the task moving while the art is in flight. The card is not optional for this app, and the stale marker is `/workspace/./og-pending`; it expires after 10 minutes.

Do not wait on the brand task. No `wait_tasks`, never `get_task_output` on it — consuming a task's output suppresses its completion notification, so the result would never reach the caller. Keep building while the pass runs. If you are the pass itself, self-check the current files with:

node scripts/brand-check.mjs --game --placeholder-ok --root .

Use the brand checker before declaring the app ready, and treat the output as a gate rather than a guess.
