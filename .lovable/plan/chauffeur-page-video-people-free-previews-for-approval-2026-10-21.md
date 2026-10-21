# Chauffeur page video — people-free previews for approval

Your 8.5s sunset clip (inside the S-Class, ocean view) has people outside the windscreen for the first ~6 seconds. Nothing on the website changes until you pick a preview.

## Step 1 — Make two previews (saved to your Files only)
1. **Real footage, clear part only:** the last ~2 seconds with nobody in it, slowed gently and looped smoothly to ~8 seconds. No sound, sized for fast loading on phones.
2. **AI recreation:** take a clean still from the end of your clip, then have AI animate a new ~8 second sunset clip from it (slow, calm movement, no people). It will look like your car and view, but it is generated, not your exact footage.

I'll check both previews frame by frame for any people before showing them to you.

## Step 2 — You choose
You watch both and tell me which one to use (or neither).

## Step 3 — Only after you approve a preview
- Replace the background video at the top of the chauffeur page with your chosen clip, in a high-quality version plus lighter versions for phones and slow connections.
- Keep the page wording, buttons and everything else the same.
- Check the page loads and plays smoothly on desktop and phone.

## Technical details
- Source: 3840x2160 HEVC 50fps; transcode to H.264 MP4 (1080p / 720p / 480p), muted, faststart.
- Option 1: ffmpeg trim ~6.4s–8.5s, slow-motion and crossfade loop.
- Option 2: videogen image-to-video from the cleanest frame, saved in Files.
- On approval: upload through Lovable Assets and swap the travel hero video pointer used by the chauffeur page; existing adaptive video loading stays as is.
