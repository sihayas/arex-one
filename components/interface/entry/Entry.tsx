import RenderReplies from "@/components/interface/entry/sub/reply/RenderReplies";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { EntryFull } from "@/components/interface/entry/sub/EntryFull";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import ReplyInput from "@/components/interface/entry/sub/reply/ReplyInput";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useEffect } from "react";
import { RecordExtended } from "@/types/globalTypes";

export const Entry = () => {
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { setReplyParent } = useThreadcrumb();

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const scale = useTransform(scrollY, [0, 12], [0.93, 1]);
  const springScale = useSpring(scale, { damping: 20, stiffness: 200 });

  const activePage: Page = pages[pages.length - 1];

  const record = activePage.record as RecordExtended;

  useEffect(() => {
    if (record) {
      setReplyParent(record);
      console.log("set reply parent to review");
    }
  }, [record, setReplyParent]);

  console.log(record);

  // If review album is different from selected album, fetch artwork
  // const { artworkUrl } = useFetchArtworkUrl(review?.albumId, "726", "albumId");

  return (
    <div className="w-full h-full relative mb-96">
      {record ? (
        <>
          <motion.div
            style={{
              willChange: "transform",
            }}
          >
            <EntryFull record={record} />
          </motion.div>
          <RenderReplies />
          {/*<div className="fixed w-full top-0 p-8">*/}
          {/*  <ReplyInput />*/}
          {/*</div>*/}
        </>
      ) : null}
    </div>
  );
};

export default Entry;
