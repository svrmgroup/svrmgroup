# Fix number plates on the rentals video

## Goal
The cars in the rentals page video must show the same plates as your original photo ("SVRM GROUP"), not the AI-garbled "SVRN GROUP".

## Approach
1. Look closely at your original photo and copy the exact plate design (wording, colours, font, layout).
2. Check every plate in the current video frame by frame to see where each one sits and how it moves.
3. Put an exact copy of your real plate on top of each car's plate in every frame, matched to the angle, size, lighting and movement, so the wording is always correct instead of being redrawn by AI.
4. Show you a preview clip and a few still frames first. Nothing on the site changes until you approve.
5. After you approve, replace the rentals video (including the lighter mobile versions) and check the page plays it.

## Fallback
If a plate moves in a way that can't be covered cleanly, I'll offer a short loop of the cleanest section, or a new clip with a steadier camera, before going ahead.

## Technical details
- Crop the plate from the uploaded photo, fix its perspective, then lay it over the video with ffmpeg using per-frame corner tracking (motion tracking with OpenCV in Python).
- Re-export 1080p, 720p and 480p versions and swap the asset pointer used by `src/pages/Rentals.tsx`.
