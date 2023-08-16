import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";

import { useQuery } from "@tanstack/react-query";
import { animated, SpringValue } from "@react-spring/web";
import axios, { AxiosResponse } from "axios";

import { EntryFull } from "./sub/EntryFull";
import { ReviewData } from "../../../../lib/global/interfaces";

interface EntryProps {
  translateY: SpringValue<number>;
}

export const Entry = ({ translateY }: EntryProps) => {
  const { data: session } = useSession();
  // Context
  const { activePage } = useCMDK();
  const { setReplyParent, threadcrumbs, setThreadcrumbs } = useThreadcrumb();
  const { selectedAlbum } = useCMDKAlbum();

  const boxShadow = useMemo(() => {
    if (selectedAlbum?.colors[0]) {
      return `0px 0px 0px 0px ${selectedAlbum.colors[0]}, 0.11),
        9px 11px 32px 0px ${selectedAlbum.colors[0]}, 0.11),
        37px 45px 58px 0px ${selectedAlbum.colors[0]}, 0.09),
        83px 100px 78px 0px ${selectedAlbum.colors[0]}, 0.05),
        148px 178px 93px 0px ${selectedAlbum.colors[0]}, 0.02),
        231px 279px 101px 0px ${selectedAlbum.colors[0]}, 0.00)`;
    }
    return undefined;
  }, [selectedAlbum?.colors]);

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
    "1032"
  );

  if (!review || !artworkUrl) return null;

  return (
    <>
      <Image
        className="absolute rounded-[20px] rounded-b-none"
        style={{
          boxShadow: boxShadow,
        }}
        src={artworkUrl || "/public/images/default.png"}
        alt={`${selectedAlbum?.attributes.name} artwork`}
        width={516}
        height={516}
        onDragStart={(e) => e.preventDefault()}
        draggable="false"
      />

      {/* Translate up 8rem  */}
      <animated.div
        style={{
          transform: translateY.to((value) => `translateY(${value}rem)`),
        }}
      >
        <EntryFull review={review} />
      </animated.div>
    </>
  );
};

export default Entry;
