import clsx from "clsx";
import { Download, Eye, Maximize2, Minimize2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export type HtmlPreviewSlot =
  | "root"
  | "rootFullscreen"
  | "rootWindowed"
  | "header"
  | "headerTitle"
  | "headerActions"
  | "downloadButton"
  | "fullscreenButton"
  | "loadingContainer"
  | "spinner"
  | "body"
  | "emptyState"
  | "iframe";

export type HtmlPreviewClassNames = Partial<Record<HtmlPreviewSlot, string>>;

export interface HtmlPreviewProps {
  html: string;
  isLoading: boolean;
  refreshToken?: number;
  onDownload?: () => void;
  canDownload?: boolean;
  classNames?: HtmlPreviewClassNames;
  unstyled?: boolean;
}

export const HtmlPreview: React.FC<HtmlPreviewProps> = ({
  html,
  isLoading,
  refreshToken,
  onDownload,
  canDownload,
  classNames,
  unstyled = false,
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
      className={clsx(
        !unstyled &&
          "flex flex-col border border-base-300 overflow-hidden bg-base-100 shadow-sm h-full",
        classNames?.root,
        isFullscreen
          ? clsx(!unstyled && "rounded-none", classNames?.rootFullscreen)
          : clsx(!unstyled && "rounded-xl", classNames?.rootWindowed)
      )}
    >
      <div
        className={clsx(
          !unstyled &&
            "flex items-center justify-between p-4 border-b border-base-300 bg-base-100/70",
          classNames?.header
        )}
      >
        <div
          className={clsx(
            !unstyled && "flex items-center gap-2 font-semibold",
            classNames?.headerTitle
          )}
        >
          <Eye size={18} />
          <span>Live Preview</span>
        </div>
        <div className={clsx(!unstyled && "flex items-center gap-3", classNames?.headerActions)}>
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              disabled={!canDownload}
              className={clsx(
                !unstyled && "btn btn-ghost btn-sm btn-square",
                classNames?.downloadButton
              )}
              title="Download HTML"
            >
              <Download size={18} />
            </button>
          )}
          {isLoading && (
            <div
              className={clsx(
                !unstyled && "flex items-center gap-2 opacity-60 text-sm",
                classNames?.loadingContainer
              )}
            >
              <div
                className={clsx(
                  !unstyled &&
                    "w-4 h-4 border-2 border-base-300 border-t-base-content rounded-full animate-spin",
                  classNames?.spinner
                )}
              />
            </div>
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={clsx(
              !unstyled && "btn btn-ghost btn-sm btn-square",
              classNames?.fullscreenButton
            )}
            aria-pressed={isFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen preview" : "Enter fullscreen preview"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
      <div
        className={clsx(
          !unstyled &&
            "flex-grow bg-base-200 relative min-h-[500px] overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          classNames?.body
        )}
      >
        {!html && !isLoading && (
          <div
            className={clsx(
              !unstyled && "absolute inset-0 flex items-center justify-center opacity-60 italic",
              classNames?.emptyState
            )}
          >
            Convert your markdown to see the preview
          </div>
        )}
        <iframe
          ref={iframeRef}
          className={clsx(!unstyled && "w-full border-none bg-base-100 block", classNames?.iframe)}
          scrolling="no"
          style={{ height: iframeHeight ? `${iframeHeight}px` : "100%" }}
          title="Conversion Preview"
        />
      </div>
    </div>
  );
};
