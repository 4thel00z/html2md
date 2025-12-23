import { Download, Eye, Maximize2, Minimize2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface HtmlPreviewProps {
  html: string;
  isLoading: boolean;
  refreshToken?: number;
  onDownload?: () => void;
  canDownload?: boolean;
}

export const HtmlPreview: React.FC<HtmlPreviewProps> = ({
  html,
  isLoading,
  refreshToken,
  onDownload,
  canDownload,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    onFullscreenChange();
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    void refreshToken;
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        // Auto-size iframe to content to avoid the inner scrollbar.
        requestAnimationFrame(() => {
          const h =
            doc.documentElement?.scrollHeight ??
            doc.body?.scrollHeight ??
            iframeRef.current?.contentWindow?.document.body?.scrollHeight ??
            0;
          setIframeHeight(h);
        });
      }
    }
  }, [html, refreshToken]);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      await containerRef.current?.requestFullscreen();
    } catch (e) {
      console.error("Failed to toggle fullscreen:", e);
    }
  };

  return (
    <div
      ref={containerRef}
      className={[
        "flex flex-col border border-base-300 overflow-hidden bg-base-100 shadow-sm h-full",
        isFullscreen ? "rounded-none" : "rounded-xl",
      ].join(" ")}
    >
      <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-100/70">
        <div className="flex items-center gap-2 font-semibold">
          <Eye size={18} />
          <span>Live Preview</span>
        </div>
        <div className="flex items-center gap-3">
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              disabled={!canDownload}
              className="btn btn-ghost btn-sm btn-square"
              title="Download HTML"
            >
              <Download size={18} />
            </button>
          )}
          {isLoading && (
            <div className="flex items-center gap-2 opacity-60 text-sm">
              <div className="w-4 h-4 border-2 border-base-300 border-t-base-content rounded-full animate-spin" />
            </div>
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn btn-ghost btn-sm btn-square"
            aria-pressed={isFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen preview" : "Enter fullscreen preview"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
      <div className="flex-grow bg-base-200 relative min-h-[500px] overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {!html && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center opacity-60 italic">
            Convert your markdown to see the preview
          </div>
        )}
        <iframe
          ref={iframeRef}
          className="w-full border-none bg-base-100 block"
          scrolling="no"
          style={{ height: iframeHeight ? `${iframeHeight}px` : "100%" }}
          title="Conversion Preview"
        />
      </div>
    </div>
  );
};
