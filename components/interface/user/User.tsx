import React, { useEffect, useRef, useState } from "react";
import { PageSound, useInterfaceContext } from "@/context/Interface";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useUserProfileQuery } from "@/lib/helper/interface/user";
import Essentials from "@/components/interface/user/render/Essentials";
import Avatar from "@/components/global/Avatar";
import Compressor from "compressorjs";
import Entries from "@/components/interface/user/render/Entries";
import { ListenedIcon, CardsIcon } from "@/components/icons";
import { Author } from "@/types/global";

const generalConfig = { damping: 20, stiffness: 100 };

const User = ({ pageUser }: { pageUser: Author }) => {
  const [userData, setUserData] = useState<Author | null>(null);
  const [followingAtoB, setFollowingAtoB] = useState(false);
  const [followingBtoA, setFollowingBtoA] = useState(false);
  const fileInputRef = useRef(null);

  const { user, scrollContainerRef } = useInterfaceContext();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });
  const translateY = useSpring(
    useTransform(scrollY, [0, 1], [-80, 0]),
    generalConfig,
  );
  const opacity = useSpring(useTransform(scrollY, [0, 1], [1, 0]), {
    stiffness: 100,
    damping: 20,
  });

  const { data } = useUserProfileQuery(user?.id, pageUser.id);

  useEffect(() => {
    if (data) {
      setUserData(data);
      setFollowingAtoB(data.isFollowingAtoB);
      setFollowingBtoA(data.isFollowingBtoA);
    }
  }, [data]);

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

  const handleAvatarClick = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };

  if (!userData) return;

  return (
    <>
      <motion.div style={{ opacity }} className={`flex p-8 pb-0 space-x-6`}>
        <Essentials essentials={userData.essentials} />
      </motion.div>

      {/* Avatar & Interlink */}
      <motion.div
        style={{ opacity }}
        className={`relative flex items-center justify-between w-full`}
        onClick={handleAvatarClick}
      >
        {/* Username */}
        <p
          className={`text-gray2 text-base font-semibold w-full text-end -translate-x-4`}
        >
          {userData.username}
        </p>

        <Avatar
          className="rounded-max shadow-shadowKitLow aspect-square flex-shrink-0"
          imageSrc={userData.image}
          altText={`avatar`}
          width={64}
          height={64}
          user={data}
        />

        {/* Stats */}
        <div className={`flex items-center justify-center gap-8 w-full `}>
          <div className={`flex items-center gap-2`}>
            <ListenedIcon />
            <p className={`text-gray2 text-base font-semibold`}>
              {userData.followers_count || 0}
            </p>
          </div>
          <div className={`flex items-center gap-2`}>
            <CardsIcon />
            <p className={`text-gray2 text-base font-semibold`}>
              {userData.artifacts_count || 0}
            </p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the input
          accept="image/*"
        />
      </motion.div>

      <motion.div style={{ translateY }} className={`w-full`}>
        <Entries pageUserId={pageUser.id} />
      </motion.div>
    </>
  );
};

export default User;
