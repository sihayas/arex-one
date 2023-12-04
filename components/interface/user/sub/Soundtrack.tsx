import React, { useEffect, useRef } from "react";
import { useSoundtrackQuery } from "@/lib/apiHelper/user";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { Artwork } from "@/components/global/Artwork";
import {
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { JellyComponent } from "@/components/global/Loading";

const Soundtrack = ({ userId }: { userId: string | undefined }) => {
  const { scrollContainerRef } = useInterfaceContext();
  const swiperRef = useRef<SwiperCore>();
  const heightContainerRef = useRef<HTMLDivElement>(null);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSoundtrackQuery(userId);

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  // Track scrolling for infinite scroll
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const swiper = swiperRef.current;
    if (swiper) {
      swiper.setProgress(latest);
      // swiper.slideToClosest();
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
    <div className="flex flex-col w-full h-full">
      {/* Outer Container */}
      <div ref={heightContainerRef}>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards]}
          cardsEffect={{ slideShadows: false }}
          className="!fixed"
        >
          {allActivities.map((activity, index) => (
            <SwiperSlide key={index}>
              <div className={`relative`}>
                <Artwork
                  className="rounded-2xl rounded-b-none"
                  // @ts-ignore
                  sound={activity.artifact?.appleData}
                  width={320}
                  height={320}
                  bgColor={
                    activity.artifact?.appleData?.attributes?.artwork?.bgColor
                  }
                />
                <div
                  className={`absolute bottom-0 w-full h-full bg-gradient-to-t from-[#F4F4F4] z-50`}
                />
              </div>

              <div className={`p-4 pt-[11px]`}>
                <div className={`text-sm text-gray5 line-clamp-5`}>
                  {activity.artifact?.content?.text}
                </div>
              </div>
            </SwiperSlide>
          ))}
          {/* Pagination */}
          {hasNextPage ? (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <JellyComponent className={``} isVisible={isFetchingNextPage} />
              ) : (
                "more"
              )}
            </button>
          ) : (
            <div className="text-xs text-action">end of line</div>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default Soundtrack;
