import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { useInterface } from "@/context/Interface";
import { useSound } from "@/context/Sound";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";
import { useScrollPosition } from "@/hooks/handleInteractions/useScrollPosition";

import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { animated, SpringValue } from "@react-spring/web";

import { EntryFull } from "./sub/EntryFull";
import { ReviewData } from "../../../../lib/global/interfaces";

interface EntryProps {
  translateY: SpringValue<number>;
}

export const Entry = ({ translateY }: EntryProps) => {
  const { data: session } = useSession();
  // Context
  const { activePage } = useInterface();
  const { setReplyParent, threadcrumbs, setThreadcrumbs } = useThreadcrumb();
  const { selectedSound } = useSound();
  const { scrollContainerRef } = useScrollPosition();
  const targetElement = document.querySelector(".cmdk");

  const boxShadow = useMemo(() => {
    if (selectedSound?.colors[0]) {
      return `0px 0px 0px 0px ${selectedSound.colors[0]}, 0.15),
        2px 2px 7px 0px ${selectedSound.colors[0]}, 0.15),
        9px 9px 13px 0px ${selectedSound.colors[0]}, 0.13),
        20px 20px 17px 0px ${selectedSound.colors[0]}, 0.08),
        35px 36px 20px 0px ${selectedSound.colors[0]}, 0.02),
        55px 57px 22px 0px ${selectedSound.colors[0]}, 0.00)`;
    }
    return undefined;
  }, [selectedSound?.colors]);

  const firstThreadcrumb = activePage.threadcrumbs?.[0];

  const reviewId = threadcrumbs ? threadcrumbs[0] : null;

  // Get review data
  const {
    data: review,
    error,
    isLoading,
  } = useQuery(
    ["review", reviewId, session?.user?.id],
    async () => {
      const response: AxiosResponse<ReviewData> = await axios.get(
        `/api/review/get/byId?id=${reviewId}&userId=${session?.user?.id || ""}`
      );
      return response.data;
    },
    {
      enabled: !!reviewId,
    }
  );

  // Set default reply parent
  useEffect(() => {
    if (review) {
      setReplyParent(review);
    }
  }, [review, setReplyParent]);

  // If reviewId changes [first item in threadcrumbs], re-render Entry
  useEffect(() => {
    if (activePage.threadcrumbs && firstThreadcrumb) {
      setThreadcrumbs(activePage.threadcrumbs);
    }
  }, [activePage.threadcrumbs, firstThreadcrumb, setThreadcrumbs]);

  // If review album is different from selected album, fetch artwork
  const { artworkUrl, isLoading: isArtworkLoading } = useFetchArtworkUrl(
    review?.albumId,
    "465",
    "albumId"
  );

  if (!review || !artworkUrl) return null;

  return (
    <>
      {targetElement &&
        createPortal(
          <Image
            className="fixed -top-[93px] -left-[93px] rounded-[20px] -z-10"
            style={{
              boxShadow: boxShadow,
            }}
            src={artworkUrl || "/public/images/default.png"}
            alt={`${selectedSound?.sound.attributes.name} artwork`}
            width={186}
            height={186}
            onDragStart={(e) => e.preventDefault()}
            draggable="false"
          />,
          targetElement
        )}

      <EntryFull review={review} />
    </>
  );
};

export default Entry;
