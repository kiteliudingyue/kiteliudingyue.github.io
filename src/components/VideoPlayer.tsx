import { useRef, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export default function VideoPlayer({
  videoUrl,
  poster,
  autoPlay = false,
  muted = true,
  loop = true,
  controls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && !isPlaying) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Error playing video:', error);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error playing video:', error);
        });
      }
    }
  };

  return (
    <div
      className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause overlay button (visible on mobile or when not hovering) */}
      {!controls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={handlePlayPause}
            className={`pointer-events-auto w-16 h-16 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white transition-opacity duration-300 ${
              isHovering && isPlaying ? 'opacity-0' : 'opacity-100 hover:bg-black/70'
            }`}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Hover hint */}
      {!isHovering && !isPlaying && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
          Hover to play
        </div>
      )}
    </div>
  );
}
