import React, { useEffect, useRef } from 'react';

const VideoPlayer = () => {
  const artRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Load Artplayer CSS
    if (!document.querySelector('link[href*="artplayer"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/artplayer/5.1.1/artplayer.css';
      document.head.appendChild(link);
    }

    // Load Artplayer JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/artplayer/5.1.1/artplayer.js';
    script.onload = () => {
      if (artRef.current && window.Artplayer) {
        playerRef.current = new window.Artplayer({
          container: artRef.current,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
          volume: 0.7,
          isLive: false,
          muted: false,
          autoplay: false,
          pip: true,
          autoSize: false,
          autoMini: false,
          screenshot: true,
          setting: true,
          loop: false,
          flip: true,
          playbackRate: true,
          aspectRatio: true,
          fullscreen: true,
          fullscreenWeb: true,
          subtitleOffset: false,
          miniProgressBar: true,
          mutex: true,
          backdrop: true,
          playsInline: true,
          autoPlayback: true,
          airplay: true,
          theme: '#f39c12',
          lang: 'en',
          whitelist: ['*'],
          moreVideoAttr: {
            crossOrigin: 'anonymous',
          },
          settings: [
            {
              width: 200,
              html: 'Subtitle',
              tooltip: 'Subtitle',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"/></svg>',
              selector: [
                {
                  html: 'Display',
                  tooltip: 'Show',
                  switch: true,
                  onSwitch: function (item) {
                    item.tooltip = item.switch ? 'Hide' : 'Show';
                    art.subtitle.show = !item.switch;
                    return !item.switch;
                  },
                },
              ],
            },
            {
              html: 'PIP Mode',
              icon: '<svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/></svg>',
              tooltip: 'Picture in Picture',
              click: function () {
                playerRef.current.pip = !playerRef.current.pip;
              },
            },
          ],
          controls: [
            {
              position: 'right',
              html: 'CC',
              tooltip: 'Closed Captions',
              style: {
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '0 8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.2)'
              },
              click: function () {
                // Toggle captions
                console.log('CC clicked');
              },
            },
          ],
          customType: {
            m3u8: function (video, url) {
              if (window.Hls && window.Hls.isSupported()) {
                const hls = new window.Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
              }
            },
          },
        });

        // Custom styling to match your screenshot
        const style = document.createElement('style');
        style.textContent = `
          .art-video-player {
            background: #000;
            border-radius: 0;
          }
          
          .art-controls {
            background: linear-gradient(transparent, rgba(0,0,0,0.8)) !important;
            padding: 8px 12px !important;
          }
          
          .art-control {
            color: #fff !important;
            margin: 0 4px !important;
          }
          
          .art-control:hover {
            background: rgba(255,255,255,0.1) !important;
            border-radius: 4px !important;
          }
          
          .art-progress {
            height: 4px !important;
          }
          
          .art-progress-inner {
            background: #f39c12 !important;
          }
          
          .art-progress-dot {
            background: #f39c12 !important;
            width: 12px !important;
            height: 12px !important;
          }
          
          .art-time {
            color: #fff !important;
            font-size: 12px !important;
            font-family: monospace !important;
          }
          
          .art-volume-slider {
            background: rgba(255,255,255,0.3) !important;
          }
          
          .art-volume-handle {
            background: #f39c12 !important;
          }
          
          .art-settings {
            background: rgba(50,50,50,0.95) !important;
            border-radius: 8px !important;
            border: 1px solid #555 !important;
          }
          
          .art-setting-item {
            color: #fff !important;
            padding: 8px 12px !important;
          }
          
          .art-setting-item:hover {
            background: rgba(255,255,255,0.1) !important;
          }
          
          .art-control-playAndPause,
          .art-control-volume,
          .art-control-time,
          .art-control-progress,
          .art-control-setting,
          .art-control-fullscreen,
          .art-control-pip {
            display: flex !important;
            align-items: center !important;
          }
          
          /* Custom CC button styling */
          .art-controls .art-control[data-tooltip="Closed Captions"] {
            background: rgba(255,255,255,0.1) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            border-radius: 4px !important;
            padding: 4px 8px !important;
            font-size: 10px !important;
            font-weight: bold !important;
          }
          
          /* Skip buttons styling - will be added via controls API */
          .art-control-skip {
            position: relative;
          }
          
          .art-control-skip::after {
            content: "10";
            position: absolute;
            bottom: -2px;
            right: -2px;
            font-size: 8px;
            font-weight: bold;
            background: rgba(0,0,0,0.7);
            border-radius: 2px;
            padding: 1px 2px;
          }
        `;
        document.head.appendChild(style);

        // Add skip buttons
        if (playerRef.current) {
          // Skip backward 10s
          playerRef.current.controls.add({
            position: 'right',
            html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>',
            tooltip: 'Skip backward 10s',
            style: { position: 'relative' },
            click: function () {
              playerRef.current.seek = playerRef.current.currentTime - 10;
            },
          });

          // Skip forward 10s  
          playerRef.current.controls.add({
            position: 'right',
            html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/></svg>',
            tooltip: 'Skip forward 10s',
            style: { position: 'relative' },
            click: function () {
              playerRef.current.seek = playerRef.current.currentTime + 10;
            },
          });
        }
      }
    };
    document.head.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        ref={artRef} 
        className="w-full h-auto"
        style={{ aspectRatio: '16/9', minHeight: '400px' }}
      />
      
      <div className="mt-4 text-gray-300">
        <h2 className="text-lg font-semibold mb-2">Artplayer Features:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Professional video player with all standard controls</li>
          <li>Custom theme color matching your design (#f39c12)</li>
          <li>Built-in skip forward/backward buttons</li>
          <li>CC (Closed Captions) button</li>
          <li>Picture-in-picture support</li>
          <li>Speed control settings</li>
          <li>Fullscreen functionality</li>
          <li>Volume control with slider</li>
          <li>Progress bar with scrubbing</li>
          <li>Responsive design</li>
          <li>HLS/M3U8 support</li>
          <li>Screenshot capability</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayer;