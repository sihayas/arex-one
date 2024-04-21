import React, { useEffect, useRef, useState } from "react";
import { useInterfaceContext } from "@/context/Interface";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useUserProfileQuery } from "@/lib/helper/interface/user";
import Essentials from "@/components/interface/user/render/Essentials";
// import Entries from "@/components/interface/user/render/Entries";
import Avatar from "@/components/global/Avatar";
import Link from "@/components/interface/user/items/Link";
import Compressor from "compressorjs";
import Entries from "@/components/interface/user/render/Entries";
import { ListenedIcon, CardsIcon } from "@/components/icons";

const User = () => {
  const { user, activePage, scrollContainerRef } = useInterfaceContext();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });
  const opacity = useSpring(useTransform(scrollY, [0, 1], [1, 0]), {
    stiffness: 100,
    damping: 20,
  });

  const pageUser = activePage.data;
  const isSelf = user?.id === pageUser.id;

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
            const userId = user?.id;
            fetch(`/api/user/post/avi?userId=${userId}`, {
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

  const circleVariants = {
    notFollowing: { pathLength: 0, stroke: "#E6E6E6" },
    following: {
      pathLength: 1,
      stroke: followingAtoB && followingBtoA ? "#24FF00" : "#FFFFFF",
    },
  };

  const { data } = useUserProfileQuery(user?.id, pageUser?.id);

  useEffect(() => {
    if (data) {
      setFollowingAtoB(data.isFollowingAtoB);
      setFollowingBtoA(data.isFollowingBtoA);
    }
  }, [data]);

  console.log(data, "d");

  if (!data || !user || !pageUser) return;

  return (
    <>
      <div className={`flex p-8 pb-0 space-x-6`}>
        <Essentials essentials={data.essentials} />
      </div>

      {/* Avatar & Interlink */}
      <div
        className={`relative flex items-center justify-between w-full`}
        onClick={handleAvatarClick}
      >
        {/* Stats */}
        <div className={`flex items-center justify-center gap-8 w-full `}>
          <div className={`flex items-center gap-2`}>
            <ListenedIcon />
            <p className={`text-gray2 text-base font-semibold`}>
              {data._count.followers || 0}
            </p>
          </div>
          <div className={`flex items-center gap-2`}>
            <CardsIcon />
            <p className={`text-gray2 text-base font-semibold`}>
              {data._count.entries || 0}
            </p>
          </div>
        </div>
        <Avatar
          className="rounded-max shadow-shadowKitLow aspect-square flex-shrink-0"
          imageSrc={data.image}
          altText={`avatar`}
          width={64}
          height={64}
          user={data}
        />
        {/* Username */}
        <p
          className={`text-gray2 text-base font-semibold w-full translate-x-2`}
        >
          {data.username}
        </p>
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

      <div className={`w-full -mt-[80px]`}>
        <Entries pageUserId={pageUser.id} />
      </div>
    </>
  );
};

export default User;

// {
//   !isSelf && (
//     <div
//       className={`pl-[84px] pb-[22px] min-h-[54px] flex items-center gap-8
// relative w-full`}
//     >
//       <div className={`relative flex-shrink-0`}>
//         <Avatar
//           className="rounded-max border border-silver"
//           imageSrc={user.image}
//           altText={`avatar`}
//           width={24}
//           height={24}
//           user={data}
//         />
//         <motion.svg
//           className="absolute center-x center-y z-10 overflow-visible rotate-45"
//           width={52}
//           height={52}
//           viewBox="0 0 52 52"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <motion.circle
//             cx={26}
//             cy={26}
//             r={24.5}
//             stroke="white"
//             strokeWidth={3}
//             strokeLinecap="round"
//             variants={circleVariants}
//             transition={{
//               type: "spring",
//               stiffness: 100,
//               damping: 40,
//             }}
//             initial="notFollowing"
//             animate={followingAtoB ? "following" : "notFollowing"}
//           />
//         </motion.svg>
//         <motion.svg
//           className="absolute center-x center-y"
//           width={52}
//           height={52}
//           viewBox="0 0 52 52"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <motion.circle
//             cx={26}
//             cy={26}
//             r={24.5}
//             stroke="#E6E6E6"
//             strokeWidth={3}
//           />
//         </motion.svg>
//       </div>
//       <Link
//         followingAtoB={followingAtoB}
//         followingBtoA={followingBtoA}
//         setFollowingAtoB={setFollowingAtoB}
//         pageUserId={pageUser.id}
//       />
//     </div>
//   );
// }
