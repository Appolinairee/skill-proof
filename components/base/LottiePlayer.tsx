import { useEffect } from "react";

const LottiePlayer = ({
  className = "",
  src,
  loop = true,
  speed = 1,
  autoplay = true,
}: LottiePlayerProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
    script.type = "module";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: `<dotlottie-player 
                  src="${src}" 
                  background="transparent" 
                  speed="${speed}" 
                  loop="${loop}" 
                  autoplay="${autoplay}">
                </dotlottie-player>`,
      }}
    />
  );
};

export default LottiePlayer;
