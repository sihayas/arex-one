import { useSession } from "next-auth/react";

import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";

import Replies from "@/components/interface/entry/sub/reply/Replies";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { EntryFull } from "@/components/interface/entry/sub/EntryFull";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import ReplyInput from "@/components/interface/entry/sub/reply/ReplyInput";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useEffect } from "react";

export const Entry = () => {
  const { data: session } = useSession();
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { setReplyParent } = useThreadcrumb();

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const scale = useTransform(scrollY, [0, 12], [0.867, 1]);
  const springScale = useSpring(scale, { damping: 20, stiffness: 200 });

  const activePage: Page = pages[pages.length - 1];

  const review = activePage.review;

  useEffect(() => {
    if (review) {
      setReplyParent(review);
      console.log("set reply parent to review");
    }
  }, [review, setReplyParent]);

  // If review album is different from selected album, fetch artwork
  const { artworkUrl } = useFetchArtworkUrl(review?.albumId, "726", "albumId");

  return (
    <div className="w-full h-full relative">
      {review ? (
        <>
          <motion.div
            style={{
              scale: springScale,
              willChange: "transform",
            }}
          >
            <EntryFull review={review} />
          </motion.div>
          <div className="p-8 flex flex-wrap gap-4">
            <Replies />
          </div>
          <div className="fixed w-full top-0 p-8">
            <ReplyInput />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Entry;
