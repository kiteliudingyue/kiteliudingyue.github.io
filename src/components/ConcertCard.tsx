import { useRef, useState, useEffect } from 'react';
import type { CollectionEntry } from 'astro:content';

interface Props {
  concert: CollectionEntry<'concerts'>;
}

export default function ConcertCard({ concert }: Props) {
  const { artist, venue, date, location, posterUrl, videoUrl, featured } = concert.data;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle hover play on desktop
  useEffect(() => {
    if (!videoRef.current || isMobile) return;

    if (isHovered) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isHovered, isMobile]);

  // Handle mobile tap to play
  const handleMobileClick = () => {
    if (!isMobile || !videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
      setIsPlaying(true);
    }
  };

  // Pause all other videos when this one plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      const allVideos = document.querySelectorAll('video');
      allVideos.forEach((v) => {
        if (v !== video && !v.paused) {
          v.pause();
          v.currentTime = 0;
        }
      });
    };

    video.addEventListener('play', handlePlay);
    return () => video.removeEventListener('play', handlePlay);
  }, []);

  // Extract video basename for dual format support
  const videoBasename = videoUrl.replace(/\.(mp4|webm)$/, '');

  return (
    <article className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {featured && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
          Featured
        </div>
      )}

      <div
        className="relative aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden cursor-pointer"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onClick={handleMobileClick}
      >
        {/* Poster Image Layer */}
        <img
          src={posterUrl}
          alt={`${artist} at ${venue}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isPlaying ? 0 : 1 }}
        />

        {/* Artist Name Overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300"
          style={{ opacity: isPlaying ? 0 : 1 }}
        >
          <h3 className="text-xl font-bold text-white">{artist}</h3>
          <p className="text-sm text-gray-200">{venue}</p>
        </div>

        {/* Video Layer */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isPlaying ? 1 : 0 }}
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src={`${videoBasename}.mp4`} type="video/mp4" />
          <source src={`${videoBasename}.webm`} type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* Mobile Play Button Overlay */}
        {isMobile && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-900 dark:text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <time className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</time>
          <span className="text-sm text-gray-500 dark:text-gray-400">{location}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {concert.body && concert.body.length > 0 ? concert.body : `Concert experience at ${venue}`}
        </p>

        {concert.data.tags && concert.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {concert.data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
            {concert.data.tags.length > 3 && (
              <span className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                +{concert.data.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
