import { useEffect, useRef } from "react";

declare global {
  interface Window {
    jwplayer?: (id: string) => JWPlayerInstance;
  }
}

interface JWPlayerInstance {
  setup: (config: JWPlayerConfig) => JWPlayerInstance;
  remove: () => void;
  on: (event: string, callback: (event?: any) => void) => void;
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
    default?: string;
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
}

const VideoPlayer = () => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const jwPlayerRef = useRef<JWPlayerInstance | null>(null);

  useEffect(() => {
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
        // Initialize JW Player with your configuration
        jwPlayerRef.current = window.jwplayer("jwplayer-container");
        jwPlayerRef.current.setup({
          width: "100%",
          height: "100%",
          title: "HLS Live Stream",
          key: "cLGMn8T20tGvW+0eXPhq4NNmLB57TrscPjd1IyJF84o=",
          sources: [
            {
              file: "https://vz-cea98c59-23c.b-cdn.net/c309129c-27b6-4e43-8254-62a15c77c5ee/1280x720/video.m3u8",
              type: "hls",
              default: "true"
            }
          ],
          image: "https://cdn-w1.netlify.com/cagatayldzz.com/2020/pbgRkz.jpg",
          primary: "html5",
          autostart: false,
          mute: false,
          stretching: "uniform",
          controls: true,
          displaytitle: true,
          displaydescription: false,
          abouttext: "Yuki Anime Platform",
          aboutlink: ""
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
          
          .jw-progress {
            background: rgba(55,65,81,0.6) !important;
          }
          
          .jw-buffer {
            background: rgba(55,65,81,0.8) !important;
          }
          
          .jw-progress-bar {
            background: #3b82f6 !important;
          }
          
          .jw-knob {
            background: #3b82f6 !important;
            border: 2px solid #ededed !important;
            box-shadow: 0 0 0 1px #3b82f6 !important;
          }
          
          .jw-text {
            color: #ededed !important;
            font-family: "Inter", sans-serif !important;
            font-size: 12px !important;
          }
          
          .jw-slider-horizontal .jw-slider-container {
            background: rgba(55,65,81,0.6) !important;
          }
          
          .jw-slider-horizontal .jw-progress {
            background: #3b82f6 !important;
          }
          
          .jw-slider-horizontal .jw-knob {
            background: #3b82f6 !important;
            border: 2px solid #ededed !important;
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
        `;
        document.head.appendChild(style);

        // Add event listeners for custom functionality
        jwPlayerRef.current.on('ready', () => {
          console.log('JW Player is ready');
          // Add custom 10s rewind and forward buttons using JW Player's addButton API
          if (window.jwplayer) {
            window.jwplayer('jwplayer-container').addButton(
              '/skip-10-next.svg',
              'Forward 10 seconds',
              function() {
                if (jwPlayerRef.current) {
                  const currentTime = jwPlayerRef.current.getPosition();
                  const duration = jwPlayerRef.current.getDuration();
                  jwPlayerRef.current.seek(Math.min(currentTime + 10, duration));
                }
              },
              'custom-forward-10s',
              'Forward 10s'
            );
            window.jwplayer('jwplayer-container').addButton(
              '/skip-10-prev.svg',
              'Rewind 10 seconds',
              function() {
                if (jwPlayerRef.current) {
                  const currentTime = jwPlayerRef.current.getPosition();
                  jwPlayerRef.current.seek(Math.max(currentTime - 10, 0));
                }
              },
              'custom-rewind-10s',
              'Rewind 10s'
            );
            
          }
        });

        jwPlayerRef.current.on('play', () => {
          console.log('Video started playing');
        });

        jwPlayerRef.current.on('pause', () => {
          console.log('Video paused');
        });

        jwPlayerRef.current.on('error', (e) => {
          console.error('JW Player error:', e);
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
          console.error('Error removing JW Player:', error);
        }
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        id="jwplayer-container"
        ref={playerRef}
        className="w-full aspect-video min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden bg-black"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

export default VideoPlayer;
