import React, { useRef } from "react";

interface IframeVideoPlayerProps {
  src: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  allowFullScreen?: boolean;
  className?: string;
}

const IframeVideoPlayer: React.FC<IframeVideoPlayerProps> = ({
  src,
  title = "Video Player",
  width = "100%",
  height = 480,
  allowFullScreen = true,
  className = "",
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden h-full ${className}`}
      style={{ width }}>
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        width={width}
        height={height}
        allow={allowFullScreen ? "fullscreen" : ""}
        allowFullScreen={allowFullScreen}
        frameBorder="0"
        className="w-full h-full"
      />
    </div>
  );
};

export default IframeVideoPlayer;
