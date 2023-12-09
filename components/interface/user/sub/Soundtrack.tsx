import React, { useEffect, useRef } from "react";
import { useSoundtrackQuery } from "@/lib/apiHelper/user";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import Image from "next/image";
import artworkURL from "@/components/global/ArtworkURL";
import Stars from "@/components/global/Stars";

const Soundtrack = ({ userId }: { userId: string | undefined }) => {
  const { scrollContainerRef } = useInterfaceContext();
  const swiperRef = useRef<SwiperCore>();
  const heightContainerRef = useRef<HTMLDivElement>(null);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSoundtrackQuery(userId);

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const swiper = swiperRef.current;
    if (swiper) {
      swiper.setProgress(latest);
      // swiper.slideToClosest();
    }
    if (latest > 0.8 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch((error) => {
        console.error("Error fetching next page:", error);
      });
    }
  });

  useEffect(() => {
    if (heightContainerRef.current && data) {
      const baseHeight = 576;
      heightContainerRef.current.style.minHeight = `${
        allActivities.length * 48 + baseHeight
      }px`;
    }
  }, [data, scrollContainerRef]);

  if (!data) return;
  return (
    <div className={`z-50`} ref={heightContainerRef}>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="!fixed !-z-10"
      >
        {allActivities.map((activity, index) => {
          if (!activity.artifact) return null;
          const color = activity.artifact.appleData.attributes.artwork.bgColor;
          const rating = activity.artifact.content?.rating;
          const name = activity.artifact.appleData.attributes.name;
          const artist = activity.artifact.appleData.attributes.artistName;
          const url = artworkURL(
            activity.artifact.appleData.attributes.artwork.url,
            "1120",
          );

          return (
            <SwiperSlide key={index}>
              {/* Stars */}
              <div
                className={`absolute top-6 left-6 flex items-center p-2 pr-2.5 bg-white rounded-full w-max max-w-[272px] z-10 gap-2 shadow-shadowKitMedium`}
              >
                <Stars rating={rating} />
                <div
                  className={`text-xs text-[#000] leading-[9px] font-medium`}
                >
                  {name}
                </div>
                <div className={`-ml-1`}>&middot;</div>
                <div
                  className={`-ml-1 text-xs text-[#000] leading-[9px] font-medium`}
                >
                  {artist}
                </div>
              </div>
              <Image
                className={`cursor-pointer rounded-2xl rounded-b-none`}
                src={url}
                alt={`artwork`}
                loading="lazy"
                quality={100}
                style={{ objectFit: "cover" }}
                fill={true}
              />
              <div
                style={{
                  background: `linear-gradient(to top, #${color}, rgba(0,0,0,0)`,
                }}
                className="absolute bottom-0 w-full h-2/5 rounded-b-[32px] pointer-events-none"
              />
              <div
                className={`absolute px-6 text-sm text-white font-medium line-clamp-5 bottom-[18px] pointer-events-none`}
              >
                {activity.artifact.content?.text}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Soundtrack;
