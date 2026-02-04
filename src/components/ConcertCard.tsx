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
  const [isMuted, setIsMuted] = useState(true);

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

  // Toggle mute/unmute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
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
        className="relative aspect-[9/16] bg-gray-100 dark:bg-gray-900 overflow-hidden cursor-pointer"
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
          muted={isMuted}
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

        {/* Mute/Unmute Button */}
        {isPlaying && (
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            )}
          </button>
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
