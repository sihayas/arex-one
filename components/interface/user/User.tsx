import React, { useEffect, useRef, useState } from "react";
import { useInterfaceContext } from "@/context/Interface";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useUserDataQuery } from "@/lib/helper/interface/user";
import Essentials from "@/components/interface/user/render/Essentials";
import Entries from "@/components/interface/user/render/Entries";
import Avatar from "@/components/global/Avatar";
import Link from "@/components/interface/user/items/Link";
// import Image from "next/image";
import Compressor from "compressorjs";

const User = () => {
  const { user, activePage, pages, scrollContainerRef } = useInterfaceContext();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });
  useMotionValueEvent(scrollY, "change", (latest) => {
    pages[pages.length - 1].isOpen = latest >= 1;
  });
  const opacity = useSpring(useTransform(scrollY, [0, 1], [1, 0]), {
    stiffness: 100,
    damping: 20,
  });

  const [followingAtoB, setFollowingAtoB] = useState(false);
  const [followingBtoA, setFollowingBtoA] = useState(false);

  const fileInputRef = useRef(null);
  const handleAvatarClick = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas context");
        return;
      }
      const targetSize = 640;
      canvas.width = targetSize;
      canvas.height = targetSize;

      // Determine the scale needed to fit the image to the target size
      const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height,
      );
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Calculate the offset to center the image
      const offsetX = (canvas.width - scaledWidth) / 2;
      const offsetY = (canvas.height - scaledHeight) / 2;

      // Draw the image centered on the canvas, cropped to fit
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Failed to convert canvas to blob");
          return;
        }
        new Compressor(blob, {
          quality: 0.8,
          success(result) {
            fetch("/api/user/post/avi", {
              method: "PUT",
              headers: {
                "Content-Type": result.type,
              },
              body: result,
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(
                    `Failed to upload image: ${response.statusText}`,
                  );
                }
                console.log("Upload successful");
              })
              .catch((error) => {
                console.error("Error uploading file:", error);
              });
          },
          error(err) {
            console.error("Compression error:", err.message);
          },
        });
      }, file.type);
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
  };

  const pageUser = activePage.user;
  const circleVariants = {
    notFollowing: { pathLength: 0, stroke: "#E6E6E6" },
    following: {
      pathLength: 1,
      stroke: followingAtoB && followingBtoA ? "#24FF00" : "#FFFFFF",
    },
  };

  const { data } = useUserDataQuery(user?.id, pageUser?.id);

  useEffect(() => {
    !activePage.isOpen && scrollContainerRef.current?.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (data) {
      setFollowingAtoB(data.isFollowingAtoB);
      setFollowingBtoA(data.isFollowingBtoA);
    }
  }, [data]);

  if (!data || !user || !pageUser) return;
  const isSelf = user.id === pageUser.id;

  return (
    <>
      <motion.div style={{ opacity }} className="flex w-full gap-4 p-8">
        <div className={`flex flex-col`}>
          {/* Avatar & Interlink */}
          <div className={`flex items-center`}>
            <div
              className={`relative flex-shrink-0 `}
              onClick={handleAvatarClick}
            >
              <Avatar
                className="rounded-max shadow-shadowKitLow aspect-square"
                imageSrc={data.image}
                altText={`avatar`}
                width={96}
                height={96}
                user={data}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }} // Hide the input
                accept="image/*"
              />
              {!isSelf && (
                <>
                  <motion.svg
                    className="absolute center-x center-y z-10"
                    width={128}
                    height={128}
                    viewBox="0 0 128 128"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.circle
                      cx={64}
                      cy={64}
                      r={62.5}
                      strokeWidth={3}
                      strokeLinecap="round"
                      variants={circleVariants}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 40,
                      }}
                      initial="notFollowing"
                      animate={followingBtoA ? "following" : "notFollowing"}
                    />
                  </motion.svg>
                  <motion.svg
                    className="absolute center-x center-y"
                    width={128}
                    height={128}
                    viewBox="0 0 128 128"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.circle
                      cx={64}
                      cy={64}
                      r={62.5}
                      stroke="#E6E6E6"
                      strokeWidth={3}
                    />
                  </motion.svg>
                </>
              )}
            </div>

            <div className={`flex flex-col gap-6 pl-8`}>
              <p className={`text-gray2 text-3xl font-bold leading-[22px]`}>
                {data.username}
              </p>
              {/* Stats */}
              <div className={`grid grid-cols-[repeat(2,_104px)]`}>
                <div className={`flex flex-col gap-2.5`}>
                  <p
                    className={`font-semibold text-gray3 text-sm leading-[9px]`}
                  >
                    SOUND
                  </p>
                  <p className={`text-gray2 text-xl leading-[15px]`}>
                    {data._count.uniqueSounds || 0}
                  </p>
                </div>
                <div className={`flex flex-col gap-2.5`}>
                  <p
                    className={`font-semibold text-gray3 text-sm leading-[9px]`}
                  >
                    ENTRY
                  </p>
                  <p className={`text-gray2 text-xl  leading-[15px]`}>
                    {data._count.artifact || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* SignedIn User */}
          {!isSelf && (
            <div
              className={`pl-[84px] pb-[22px] min-h-[54px] flex items-center gap-8 relative w-full`}
            >
              <div className={`relative flex-shrink-0`}>
                <Avatar
                  className="rounded-max border border-silver"
                  imageSrc={user.image}
                  altText={`avatar`}
                  width={24}
                  height={24}
                  user={data}
                />
                <motion.svg
                  className="absolute center-x center-y z-10 overflow-visible rotate-45"
                  width={52}
                  height={52}
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.circle
                    cx={26}
                    cy={26}
                    r={24.5}
                    stroke="white"
                    strokeWidth={3}
                    strokeLinecap="round"
                    variants={circleVariants}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 40,
                    }}
                    initial="notFollowing"
                    animate={followingAtoB ? "following" : "notFollowing"}
                  />
                </motion.svg>
                <motion.svg
                  className="absolute center-x center-y"
                  width={52}
                  height={52}
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.circle
                    cx={26}
                    cy={26}
                    r={24.5}
                    stroke="#E6E6E6"
                    strokeWidth={3}
                  />
                </motion.svg>
              </div>
              <Link
                followingAtoB={followingAtoB}
                followingBtoA={followingBtoA}
                setFollowingAtoB={setFollowingAtoB}
                pageUserId={pageUser.id}
              />
            </div>
          )}
        </div>

        <div className={`ml-auto flex flex-col items-end -space-y-6`}>
          <Essentials essentials={data.essentials} />
        </div>
      </motion.div>

      <div className={`-mt-[242px] flex flex-col -space-y-5 w-[420px]`}>
        <Entries userId={pageUser.id} />
      </div>
    </>
  );
};

export default User;
