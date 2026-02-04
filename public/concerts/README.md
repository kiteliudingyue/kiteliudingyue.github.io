# Concert Media Assets

This directory contains poster images and video clips for concert cards displayed on the Fun page.

## Directory Structure

```
/public/concerts/
  /posters/     # Static poster images (JPEG/WebP)
  /videos/      # Short video clips (MP4 + WebM)
```

## Adding New Concert Media

### 1. Video Preparation

Videos should be **10-15 seconds long** maximum and optimized for web:

#### Create MP4 version (H.264):
```bash
ffmpeg -i input.mp4 -ss 00:00:10 -t 15 \
  -c:v libx264 -preset slow -crf 28 \
  -vf scale=1280:720 -an \
  output.mp4
```

#### Create WebM version (VP9 fallback):
```bash
ffmpeg -i input.mp4 -ss 00:00:10 -t 15 \
  -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -vf scale=1280:720 -an \
  output.webm
```

**Key settings:**
- `-ss 00:00:10`: Start at 10 seconds into the video
- `-t 15`: Duration of 15 seconds
- `-vf scale=1280:720`: 720p resolution
- `-an`: Remove audio (autoplay requires muted videos)
- `crf 28` (MP4) / `crf 30` (WebM): Compression quality
- Target size: 2-5MB per video

### 2. Extract Poster Frame

```bash
ffmpeg -i output.mp4 -ss 00:00:03 -vframes 1 poster.jpg
```

### 3. File Naming Convention

Use consistent naming: `artist-venue-year.[ext]`

Examples:
- `taylor-swift-sofi-2024.jpg`
- `taylor-swift-sofi-2024.mp4`
- `taylor-swift-sofi-2024.webm`

### 4. Create Content Markdown File

Create a new file in `/src/content/concerts/` with the concert details:

```markdown
---
artist: "Artist Name"
venue: "Venue Name"
date: YYYY-MM-DD
location: "City, State"
posterUrl: "/concerts/posters/artist-venue-year.jpg"
videoUrl: "/concerts/videos/artist-venue-year"
tags: ["Genre", "Year", "Venue Type"]
featured: false
---

Brief description of the concert experience.
```

**Note:** The `videoUrl` should omit the file extension. The component automatically loads both `.mp4` and `.webm` versions.

## Copyright Notice

All concert clips should:
- Be recorded by you personally
- Be 10-15 seconds maximum (fair use)
- Be from performances you attended
- Include proper attribution in the markdown description

The Fun page includes a copyright disclaimer footer automatically.

## Sample Placeholder Content

The repository includes sample concert entries with placeholder paths. Replace these with your actual media:

1. `/concerts/posters/taylor-swift-sofi-2024.jpg`
2. `/concerts/posters/coldplay-rose-bowl-2024.jpg`
3. `/concerts/posters/billie-eilish-forum-2023.jpg`

And corresponding video files (both .mp4 and .webm).

## Testing Checklist

Before adding new concerts:
- ✓ Videos are 10-15 seconds long
- ✓ Videos are under 5MB each
- ✓ Both MP4 and WebM formats exist
- ✓ Poster image extracted and optimized
- ✓ File names match convention
- ✓ Markdown frontmatter is complete
- ✓ Tags are relevant and consistent

## Performance Tips

- Use `preload="metadata"` (already set in component)
- Keep videos under 5MB for fast loading
- 720p resolution is optimal for most screens
- Remove audio track to reduce file size
- Consider lazy loading with `client:visible` (already implemented)
