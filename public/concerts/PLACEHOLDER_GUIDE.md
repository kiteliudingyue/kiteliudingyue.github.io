# Quick Start: Adding Placeholder Images

To test the Fun page immediately without real concert videos, you can use placeholder images and videos.

## Option 1: Use Placeholder Image Services

Create simple placeholder files using URLs:

```bash
cd public/concerts/posters

# Download placeholder images (600x800 vertical posters)
curl "https://placehold.co/600x800/667eea/ffffff/png?text=Taylor+Swift" -o taylor-swift-sofi-2024.jpg
curl "https://placehold.co/600x800/f56565/ffffff/png?text=Coldplay" -o coldplay-rose-bowl-2024.jpg
curl "https://placehold.co/600x800/48bb78/ffffff/png?text=Billie+Eilish" -o billie-eilish-forum-2023.jpg
```

## Option 2: Create Solid Color Images with ImageMagick

If you have ImageMagick installed:

```bash
cd public/concerts/posters

# Create simple colored placeholder images
convert -size 600x800 xc:#667eea -gravity center -pointsize 48 -fill white -annotate +0+0 "Taylor Swift\nSoFi Stadium" taylor-swift-sofi-2024.jpg
convert -size 600x800 xc:#f56565 -gravity center -pointsize 48 -fill white -annotate +0+0 "Coldplay\nRose Bowl" coldplay-rose-bowl-2024.jpg
convert -size 600x800 xc:#48bb78 -gravity center -pointsize 48 -fill white -annotate +0+0 "Billie Eilish\nThe Forum" billie-eilish-forum-2023.jpg
```

## Option 3: Generate Test Videos with FFmpeg

Create simple test videos (colored screens with text):

```bash
cd public/concerts/videos

# Create 10-second test video with color and text
ffmpeg -f lavfi -i color=c=blue:s=1280x720:d=10 \
  -vf "drawtext=text='Taylor Swift':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  -c:v libx264 -preset fast -crf 28 -an taylor-swift-sofi-2024.mp4

ffmpeg -f lavfi -i color=c=red:s=1280x720:d=10 \
  -vf "drawtext=text='Coldplay':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  -c:v libx264 -preset fast -crf 28 -an coldplay-rose-bowl-2024.mp4

ffmpeg -f lavfi -i color=c=green:s=1280x720:d=10 \
  -vf "drawtext=text='Billie Eilish':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  -c:v libx264 -preset fast -crf 28 -an billie-eilish-forum-2023.mp4

# Create WebM versions
ffmpeg -i taylor-swift-sofi-2024.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 taylor-swift-sofi-2024.webm
ffmpeg -i coldplay-rose-bowl-2024.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 coldplay-rose-bowl-2024.webm
ffmpeg -i billie-eilish-forum-2023.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 billie-eilish-forum-2023.webm
```

## Option 4: Manual Testing Without Media

The page will still work without images/videos. The ConcertCard component will:
- Show broken image icons (browser default)
- Video elements will be hidden (opacity 0) until hovered
- All functionality will still work

This is useful for testing:
- Navigation to /fun page
- Tag filtering
- Responsive layout
- Dark mode
- Card hover states

## Option 5: Copy from Other Projects

If you have concert photos/videos from your phone:

1. Extract a poster frame from any video:
   ```bash
   ffmpeg -i your-video.mp4 -ss 00:00:03 -vframes 1 poster.jpg
   ```

2. Create a short clip:
   ```bash
   ffmpeg -i your-video.mp4 -ss 00:00:30 -t 12 -c:v libx264 -preset slow -crf 28 -vf scale=1280:720 -an clip.mp4
   ```

3. Rename to match the markdown file references

## Quick Test Command

Run the dev server to see the page:

```bash
npm run dev
```

Then visit: http://localhost:4321/fun

## What You'll See

- Header navigation with "Fun" tab
- Hero section with title and description
- Tag filter (collapsible)
- 3 concert cards in a grid
- Each card shows:
  - Artist name overlay
  - Venue name
  - Date and location
  - Description
  - Tags
  - Featured badge (on first card)
- Copyright disclaimer at bottom

## Browser Console

If images/videos are missing, you'll see 404 errors in the browser console. This is expected and won't break functionality.

## Next Steps

Once you have real concert footage:
1. Use the FFmpeg commands in `/public/concerts/README.md`
2. Replace the placeholder files
3. Update the markdown files in `/src/content/concerts/`
4. Rebuild and deploy

## Testing Checklist

Without media files, you can still test:
- ✅ Page loads and renders
- ✅ Navigation works
- ✅ Tag filtering shows/hides cards
- ✅ Layout is responsive
- ✅ Dark mode works
- ✅ Card hover effects work
- ✅ Mobile menu works

With placeholder media:
- ✅ Images display
- ✅ Videos play on hover (desktop)
- ✅ Videos play on tap (mobile)
- ✅ Only one video plays at a time
- ✅ Video transitions are smooth
