import React, { useRef } from "react";
import { useSoundtrackQuery } from "@/lib/apiHelper/user";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { Artwork } from "@/components/global/Artwork";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Soundtrack = ({ userId }: { userId: string | undefined }) => {
  const { scrollContainerRef } = useInterfaceContext();
  const swiperRef = useRef<SwiperCore>();

  const { data, isLoading, isError } = useSoundtrackQuery(userId);

  // Track scrolling for infinite scroll
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("x changed to", latest);

    const swiper = swiperRef.current;
    if (swiper) {
      swiper.setProgress(latest);
    }
  });

  if (!data) return;
  return (
    <div className="flex flex-col w-full h-full">
      <div className={`min-h-[100vh]`}>
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
          {data.map((activity, index) => (
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
                  className={`absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#F4F4F4] z-50`}
                />
              </div>

              <div className={`p-4 pt-[11px]`}>
                <div className={`text-sm text-gray5 line-clamp-5`}>
                  {activity.artifact?.content?.text}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Soundtrack;
