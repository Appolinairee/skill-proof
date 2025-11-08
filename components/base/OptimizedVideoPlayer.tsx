"use client";

import { useState, useRef, useEffect } from "react";
import { formatMediaUrl } from "@/utils/media";
import Button from "./button/Button";
import { useAddToCart } from "@/components/cart/useAddToCart";
import { RefreshIcon, ShoppingCartIcon } from "@/public/assets/icons/icons";
import { cn } from "@/utils/utils";
import { getOrderActions } from "@/store/orderStore";
import useUserStore from "@/store/userStore";
import { ROLES } from "@/utils/constants/users";

interface Media {
  url: string;
  mediaType: string;
}

interface OptimizedVideoPlayerProps {
  media: Media;
  className?: string;
}

const PayProductButton: React.FC<{ product: any }> = ({ product }) => {
  const { addToCart, isVariantInCart, isAddingToCart, currentVariant } =
    useAddToCart(product);
  const { removeItem } = getOrderActions();

  const handlePayProduct = () => {
    if (!isVariantInCart) {
      addToCart(1);
    } else if (currentVariant) {
      removeItem(currentVariant.id);
    }
  };

  return (
    <Button
      className={cn(
        "!px-2 !py-[12px] !rounded-[15px] flex items-center gap-2 !w-auto transition-colors",
        isVariantInCart ? "bg-secondary text-white" : "bg-white text-black"
      )}
      icon={<ShoppingCartIcon />}
      onClick={handlePayProduct}
      isLoading={isAddingToCart}
      disabled={isAddingToCart}
    >
      {isVariantInCart
        ? "Ajouté ✔"
        : isAddingToCart
          ? "Ajout..."
          : "Payer le produit"}
    </Button>
  );
};

const OptimizedVideoPlayer: React.FC<
  OptimizedVideoPlayerProps & { product?: any }
> = ({ media, className, product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [pauseReason, setPauseReason] = useState<
    "manual" | "visibility" | null
  >(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedManuallyRef = useRef(false);
  const user = useUserStore((state) => state.user);

  const mediaUrl = formatMediaUrl(media.url);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    const currentContainer = containerRef.current;
    if (currentContainer) observer.observe(currentContainer);
    return () => {
      if (currentContainer) observer.unobserve(currentContainer);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isVisible && !video.paused) {
      video.pause();
      setPauseReason("visibility");
    } else if (isVisible && pauseReason === "visibility" && video.paused) {
      video.play().catch((error) => {
        console.error("Video play failed:", error);
      });
      setPauseReason(null);
    }
  }, [isVisible, pauseReason]);

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    pausedManuallyRef.current = false;
    video.currentTime = 0;
    setVideoEnded(false);
    video.play().catch((error) => {
      console.error("Video replay failed:", error);
    });
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    pausedManuallyRef.current = false;
  };

  const handleVideoPlaying = () => {
    setVideoEnded(false);
    pausedManuallyRef.current = false;
  };

  const handleVideoPause = () => {
    const video = videoRef.current;
    if (video && !video.ended && isVisible) {
      setPauseReason("manual");
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-[250px] xs:h-[300px] rounded-[15px] overflow-hidden bg-black cursor-pointer",
        className
      )}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover block"
        src={mediaUrl}
        playsInline
        controls
        preload="metadata"
        onEnded={handleVideoEnd}
        onPlaying={handleVideoPlaying}
        onPause={handleVideoPause}
        disablePictureInPicture
        controlsList="nodownload"
        muted
        autoPlay={isVisible}
      />

      {videoEnded && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="text-white text-center px-4">
            <div className="flex flex-col gap-y-6">
              {user?.roleType === ROLES.USER && product && <PayProductButton product={product} />}

              <Button
                className="border-btn !bg-transparent"
                icon={<RefreshIcon />}
                onClick={handleReplay}
              >
                Rejouer la vidéo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedVideoPlayer;
