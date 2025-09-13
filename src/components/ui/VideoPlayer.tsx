import { useEffect, useRef } from "react";

declare global {
  interface Window {
    jwplayer?: (id: string) => JWPlayerInstance;
  }
}

interface JWPlayerInstance {
  setup: (config: JWPlayerConfig) => JWPlayerInstance;
  remove: () => void;
  on: (event: string, callback: (event?: unknown) => void) => void;
  seek: (time: number) => void;
  getPosition: () => number;
  getDuration: () => number;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  setMute: (muted: boolean) => void;
  getMute: () => boolean;
  addButton: (
    icon: string,
    tooltip: string,
    callback: () => void,
    btnClass?: string,
    id?: string
  ) => void;
}

interface JWPlayerConfig {
  width: string | number;
  height: string | number;
  title?: string;
  key: string;
  sources: Array<{
    file: string;
    type: string;
    label: string;
    default?: boolean;
  }>;
  image?: string;
  primary?: string;
  autostart?: boolean;
  mute?: boolean;
  stretching?: string;
  controls?: boolean;
  displaytitle?: boolean;
  displaydescription?: boolean;
  abouttext?: string;
  aboutlink?: string;
  playbackRateControls?: number[];
  cast?: object;
  tracks?: Array<{
    file: string;
    label?: string;
    kind: string;
    default?: boolean;
  }>;
}

interface VideoPlayerProps {
  videoSources?: Array<{
    file: string;
    type: string;
    label: string;
    default?: boolean;
  }>;
  posterImage?: string;
  videoTitle?: string;
  subtitles?: Array<{
    file: string;
    label: string;
    kind: string;
    default?: boolean;
  }>;
  thumbnailsVttUrl?: string; // URL to your server-generated VTT file
}

const VideoPlayer = ({ 
  videoSources, 
  posterImage, 
  videoTitle, 
  subtitles, 
  thumbnailsVttUrl 
}: VideoPlayerProps = {}) => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const jwPlayerRef = useRef<JWPlayerInstance | null>(null);

  useEffect(() => {
    const createFallbackVTT = () => {
      const vttContent = `WEBVTT

00:00:00.000 --> 00:00:10.000
https://picsum.photos/160/90?random=1&blur=1

00:00:10.000 --> 00:00:20.000
https://picsum.photos/160/90?random=2&grayscale

00:00:20.000 --> 00:00:30.000
https://picsum.photos/160/90?random=3

00:00:30.000 --> 00:00:40.000
https://picsum.photos/160/90?random=4&blur=1

00:00:40.000 --> 00:00:50.000
https://picsum.photos/160/90?random=5

00:00:50.000 --> 00:01:00.000
https://picsum.photos/160/90?random=6&grayscale

00:01:00.000 --> 00:01:10.000
https://picsum.photos/160/90?random=7

00:01:10.000 --> 00:01:20.000
https://picsum.photos/160/90?random=8&blur=1

00:01:20.000 --> 00:01:30.000
https://picsum.photos/160/90?random=9

00:01:30.000 --> 00:01:40.000
https://picsum.photos/160/90?random=10

00:01:40.000 --> 00:01:50.000
https://picsum.photos/160/90?random=11&grayscale

00:01:50.000 --> 00:02:00.000
https://picsum.photos/160/90?random=12`;
      
      const blob = new Blob([vttContent], { type: 'text/vtt' });
      return URL.createObjectURL(blob);
    };

    // Load JW Player CSS first
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://ssl.p.jwpcdn.com/player/v/8.22.0/jwplayer.css";
    document.head.appendChild(cssLink);

    // Load JW Player script
    const script = document.createElement("script");
    script.src = "https://ssl.p.jwpcdn.com/player/v/8.22.0/jwplayer.js";
    script.onload = () => {
      if (window.jwplayer) {
        const thumbnailVTTUrl = thumbnailsVttUrl || createFallbackVTT();
        
        // Initialize JW Player
        jwPlayerRef.current = window.jwplayer("jwplayer-container");
        jwPlayerRef.current.setup({
          width: "100%",
          height: "100%",
          key: "cLGMn8T20tGvW+0eXPhq4NNmLB57TrscPjd1IyJF84o=",
          sources: videoSources || [
            {
              file: "https://vz-cea98c59-23c.b-cdn.net/c309129c-27b6-4e43-8254-62a15c77c5ee/1280x720/video.m3u8",
              type: "hls",
              label: "720p",
              default: true,
            },
          ],
          image: posterImage || "https://cdn-w1.netlify.com/cagatayldzz.com/2020/pbgRkz.jpg",
          title: videoTitle || "Yuki Anime Platform",
          primary: "html5",
          stretching: "uniform",
          playbackRateControls: [0.5, 1, 1.5, 2],
          tracks: [
            ...(subtitles || []),
            {
              file: thumbnailVTTUrl,
              kind: "thumbnails",
            },
          ],
        });

        // Add custom styling to match your theme
        const style = document.createElement("style");
        style.textContent = `
          #jwplayer-container {
            width: 100% !important;
            height: 100% !important;
            min-height: 300px !important;
            aspect-ratio: 16/9;
            background: #0a0a0a;
          }
          
          .jw-wrapper {
            border-radius: 8px;
            overflow: hidden;
            width: 100% !important;
            height: 100% !important;
            background: #0a0a0a;
          }
          
          .jw-media {
            border-radius: 8px;
          }
          
          .jw-controls {
            background: linear-gradient(transparent, rgba(10,10,10,0.9)) !important;
          }
          
          .jw-button-color {
            color: #ededed !important;
          }
          
          .jw-button-color:hover {
            color: #ffffff !important;
          }
          
          .jw-icon-playback:hover,
          .jw-icon-volume:hover,
          .jw-icon-fullscreen:hover {
            color: #ffffff !important;
          }
          
          .jw-progress, .jw-slider-horizontal .jw-slider-container {
            background: rgba(55,65,81,0.6) !important;
          }
          
          .jw-buffer {
            background: rgba(55,65,81,0.8) !important;
          }
          
          .jw-progress-bar, .jw-slider-horizontal .jw-progress {
            background: #3b82f6 !important;
          }
          
          .jw-knob, .jw-slider-horizontal .jw-knob {
            background: #3b82f6 !important;
            border: 2px solid #ededed !important;
            box-shadow: 0 0 0 1px #3b82f6 !important;
          }

          .jw-text {
            color: #fff !important;
            font-family: "Inter", sans-serif !important;
            font-size: 12px !important;
          }
          
          .jw-tooltip {
            background: rgba(31,41,55,0.95) !important;
            color: #ededed !important;
            border-radius: 6px !important;
            border: 1px solid rgba(59,130,246,0.3) !important;
            font-family: "Inter", sans-serif !important;
          }
          
          .jw-menu {
            background: rgba(31,41,55,0.98) !important;
            border-radius: 8px !important;
            border: 1px solid rgba(59,130,246,0.2) !important;
            backdrop-filter: blur(10px);
          }
          
          .jw-option {
            color: #ededed !important;
            padding: 8px 12px !important;
          }
          
          .jw-option:hover {
            background: rgba(255,255,255,0.1) !important;
            color: #ffffff !important;
          }
          
          .jw-option.jw-active-option {
            background: #3b82f6 !important;
            color: #ededed !important;
          }
          
          .jw-settings-menu {
            background: rgba(31,41,55,0.98) !important;
            border: 1px solid rgba(59,130,246,0.2) !important;
          }
          
          .jw-volume-tip {
            background: #3b82f6 !important;
          }
          
          .jw-time-tip {
            background: rgba(31,41,55,0.95) !important;
            border: 1px solid rgba(59,130,246,0.3) !important;
          }

          /* Thumbnail preview styling - override JW Player defaults */
          .jw-tooltip-thumbnail {
            background: transparent !important;
            border: 2px solid rgba(59,130,246,0.6) !important;
            border-radius: 8px !important;
            box-shadow: 0 8px 25px rgba(0,0,0,0.5) !important;
            overflow: hidden !important;
            backdrop-filter: blur(10px) !important;
            padding: 0 !important;
            margin: 0 !important;
            position: absolute !important;
            z-index: 10000 !important;
          }

          .jw-tooltip-thumbnail img {
            border-radius: 6px !important;
            width: 160px !important;
            height: 90px !important;
            object-fit: cover !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide all arrow/bubble elements and tooltip content */
          .jw-tooltip-thumbnail::before,
          .jw-tooltip-thumbnail::after,
          .jw-tooltip::before,
          .jw-tooltip::after,
          .jw-tooltip-thumbnail .jw-arrow,
          .jw-tooltip .jw-arrow,
          .jw-tooltip-thumbnail .jw-tooltip-time {
            display: none !important;
            content: none !important;
            border: none !important;
            background: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }

          /* Tooltip positioning and styling */
          .jw-tooltip {
            z-index: 10000 !important;
            background: transparent !important;
            position: absolute !important;
            pointer-events: none !important;
            border: none !important;
            box-shadow: none !important;
          }

          .jw-slider-time .jw-tooltip,
          .jw-slider-time .jw-tooltip-thumbnail {
            position: absolute !important;
            bottom: 40px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            border: none !important;
            background: none !important;
          }
          
          /* Hover states for all interactive elements */
          .jw-controlbar .jw-icon:hover {
            color: #ffffff !important;
          }
          
          .jw-button-container:hover .jw-icon {
            color: #ffffff !important;
          }
          
          /* Loading and buffering states */
          .jw-icon-buffer {
            border-color: #3b82f6 transparent transparent transparent !important;
          }
          
          /* Custom accent color for special elements */
          .jw-flag-user-inactive.jw-flag-controls-hidden .jw-logo {
            opacity: 0.8;
          }
          .jw-icon-playback{
            display: flex !important;
           }

          /* Replace rewind icon with custom 10s backward icon */
          .jw-svg-icon-rewind path {
            display: none;
          }
          .jw-svg-icon-rewind {
            background-image: url('/skip-10-prev.svg');
            background-size: contain;
            background-repeat: no-repeat;
          }

          /* Hide default rewind button */
          .jw-icon-rewind {
            display: none !important;
          }
          .jw-button-container .jw-svg-icon{
            width: 24px!important;
            height: 24px!important;
          }
          .jw-icon-display > .jw-svg-icon-play{
            width: 100px!important;
            height: 100px!important;
          }

        `;
        document.head.appendChild(style);

        // Add event listeners for custom functionality
        jwPlayerRef.current.on("ready", () => {
          console.log("JW Player is ready");
          console.log("Thumbnail VTT URL:", thumbnailVTTUrl);
          console.log("Thumbnail preview enabled - hover over progress bar to see thumbnails");
          
          // Custom thumbnail positioning
          const progressBar = document.querySelector('.jw-slider-time');
          
          if (progressBar) {
            let isHovering = false;
            
            progressBar.addEventListener('mouseenter', () => {
              isHovering = true;
            });
            
            progressBar.addEventListener('mouseleave', () => {
              isHovering = false;
            });
            
            progressBar.addEventListener('mousemove', (e: Event) => {
              if (isHovering && e instanceof MouseEvent) {
                const rect = progressBar.getBoundingClientRect();
                const x = e.clientX - rect.left;
                
                // Find all tooltip elements and position them
                const tooltips = document.querySelectorAll('.jw-tooltip, .jw-tooltip-thumbnail');
                tooltips.forEach(tooltip => {
                  const tooltipElement = tooltip as HTMLElement;
                  if (tooltipElement) {
                    tooltipElement.style.left = `${x}px`;
                    tooltipElement.style.transform = 'translateX(-50%)';
                    tooltipElement.style.bottom = '40px';
                    tooltipElement.style.position = 'absolute';
                  }
                });
              }
            });
          }
          
          // Debug: Check if tracks are loaded
          setTimeout(() => {
            console.log("Player tracks:", jwPlayerRef.current);
          }, 2000);
          
          // Add custom 10s rewind and forward buttons using JW Player's addButton API
          if (window.jwplayer) {
            window.jwplayer("jwplayer-container").addButton(
              "/skip-10-next.svg",
              "Forward 10 seconds",
              function () {
                if (jwPlayerRef.current) {
                  const currentTime = jwPlayerRef.current.getPosition();
                  const duration = jwPlayerRef.current.getDuration();
                  jwPlayerRef.current.seek(
                    Math.min(currentTime + 10, duration)
                  );
                }
              },
              "custom-forward-10s",
              "Forward 10s"
            );
            window.jwplayer("jwplayer-container").addButton(
              "/skip-10-prev.svg",
              "Rewind 10 seconds",
              function () {
                if (jwPlayerRef.current) {
                  const currentTime = jwPlayerRef.current.getPosition();
                  jwPlayerRef.current.seek(Math.max(currentTime - 10, 0));
                }
              },
              "custom-rewind-10s",
              "Rewind 10s"
            );
          }
        });

        jwPlayerRef.current.on("play", () => {
          console.log("Video started playing");
        });

        jwPlayerRef.current.on("pause", () => {
          console.log("Video paused");
        });

        jwPlayerRef.current.on("error", (e) => {
          console.error("JW Player error:", e);
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (jwPlayerRef.current) {
        try {
          jwPlayerRef.current.remove();
        } catch (error) {
          console.error("Error removing JW Player:", error);
        }
      }
    };
  }, [videoSources, posterImage, videoTitle, subtitles, thumbnailsVttUrl]);

  return (
    <div className="w-full">
      <div
        id="jwplayer-container"
        ref={playerRef}
        className="w-full aspect-video min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden bg-black"
      />
    </div>
  );
};

export default VideoPlayer;
