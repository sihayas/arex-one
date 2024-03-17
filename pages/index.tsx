import Layout from "../components/layout";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Dash from "@/components/index/items/Dash";
import { animate, motion, useSpring } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import Feed from "@/components/index/render/Feed";
import Link from "next/link";
import Avatar from "@/components/global/Avatar";
import { AppleIcon, StarIcon } from "@/components/icons";
import { cardMask, cardBackMask } from "@/components/index/items/Entry";
import Tilt from "react-parallax-tilt";
import Image from "next/image";

type Feed = "personal" | "bloom" | "recent" | null;

export default function Home() {
  const { user } = useInterfaceContext();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const [activeFeed, setActiveFeed] = React.useState<Feed>("personal");

  const url =
    "https://is3-ssl.mzstatic.com/image/thumb/Music112/v4/03/45/19/034519dc-9ff9-7f63-3d02-23a101a0cc3a/22UMGIM01299.rgb.jpg/805x805bb.jpg";

  const [tiltAngles, setTiltAngles] = useState({
    tiltAngleX: 0,
    tiltAngleY: 0,
  });

  const x = useSpring(0, { damping: 320, stiffness: 80 });
  const y = useSpring(0, { damping: 320, stiffness: 80 });

  // useMotionValueEvent breaks the tilt effect on re-renders so use onChange instead.

  useEffect(() => {
    const xControls = animate(x, [8, 8, -8, -8, 8], {
      repeat: Infinity,
      duration: 16,
      ease: "easeOut",
    });

    const yControls = animate(y, [8, -8, -8, 8, 8], {
      repeat: Infinity,
      duration: 16,
      ease: "easeOut",
    });

    const unsubscribeX = x.on("change", (latest) => {
      setTiltAngles((prev) => ({ ...prev, tiltAngleX: latest }));
    });

    const unsubscribeY = y.on("change", (latest) => {
      setTiltAngles((prev) => ({ ...prev, tiltAngleY: latest }));
    });

    return () => {
      xControls.stop();
      yControls.stop();
      unsubscribeX();
      unsubscribeY();
    };
  }, [x, y]);

  if (!user) {
    return (
      <Layout>
        <Head>
          <title>Voir</title>
        </Head>
        <motion.div
          className={`flex h-screen w-full flex-col items-center py-16 justify-between`}
        >
          <motion.div
            className="center-x pointer-events-none absolute top-0 z-0 h-full w-full backdrop-blur-[72px]"
            style={{
              background:
                "radial-gradient(at center top, rgba(255,255,255,0.0), #000000)",
            }}
            initial={{ backgroundPosition: "50% 100%" }}
            animate={{ backgroundPosition: "50% 80%" }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 10,
              ease: "linear",
            }}
          />
          {/* Intro */}
          <div
            className={`flex flex-col items-center gap-[17px] font-garamond12 text-lg italic leading-[10px] z-10`}
          >
            {/*<p>In this haven of harmonies</p>*/}
            {/*<p>interaction is a delicate dance</p>*/}
            {/*<p>of digits across screens</p>*/}
            {/*<p>a silent symphony shared</p>*/}
            {/*<p>Users as intertwined melodies</p>*/}
            {/*<p>resonate in a silent pact</p>*/}
            {/*<p>bound by the unseen thread of rhythm</p>*/}
            {/*<p>a song sent is a souls whisper</p>*/}
            {/*<p>a shared pulse within the vast digital expanse</p>*/}
          </div>
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              damping: 40,
              stiffness: 200,
            }}
            className={`relative`}
          >
            <div className={`cloud-shadow z-10`}>
              <Tilt
                perspective={1000}
                tiltAngleXManual={tiltAngles.tiltAngleX}
                tiltAngleYManual={tiltAngles.tiltAngleY}
                tiltReverse={true}
                glareEnable={true}
                glareMaxOpacity={0.45}
                glareBorderRadius={"32px"}
                scale={1.02}
                transitionEasing={"cubic-bezier(0.1, 0.8, 0.2, 1)"}
                className={`transform-style-3d relative h-[432px] w-[304px]`}
              >
                {/* Front */}
                <div
                  style={{
                    ...cardMask,
                  }}
                  className="backface-hidden absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col bg-white"
                >
                  <Image
                    className={`-mt-6`}
                    src={url}
                    alt={`artwork`}
                    quality={100}
                    width={304}
                    height={304}
                    draggable={false}
                  />
                  <div className="`text-base line-clamp-3 px-6 pt-[18px] text-black">
                    Ella Mai has a pleasant but monotone voice, she lacks range,
                    the production doesnt help, it distracts, it modulates the
                    timbre too much, and it is more about that, than it is about
                    her. The result is, ironically for an R&B album, soulless.
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-0 left-0 flex h-[72px] w-full items-center gap-3 p-6 justify-between">
                    <div className={`flex items-center gap-3`}>
                      <Image
                        className={`rounded-max outline outline-silver outline-1`}
                        src={
                          "https://i.pinimg.com/originals/14/fb/62/14fb621d6f98da5fbf9949f4c58b2bb3.gif"
                        }
                        alt={`artwork`}
                        quality={100}
                        width={32}
                        height={32}
                        draggable={false}
                      />
                      <div className={`flex flex-col`}>
                        <p
                          className={`text-gray2 line-clamp-1 text-sm font-medium`}
                        >
                          Heart on My Sleeve
                        </p>
                        <p
                          className={`line-clamp-1 text-base font-semibold text-black`}
                        >
                          Juno
                        </p>
                      </div>
                    </div>

                    <StarIcon />
                  </div>
                </div>

                {/* Back */}
                <div
                  style={{
                    ...cardBackMask,
                    transform: "rotateX(180deg)",
                  }}
                  className="backface-hidden absolute left-0 top-0 flex h-full  w-full cursor-pointer flex-col bg-white p-6 pb-0 "
                >
                  <div className={`flex flex-shrink-0 justify-between`}>
                    <StarIcon />

                    <Image
                      className={`shadow-shadowKitHigh rounded-xl`}
                      src={url}
                      alt={`artwork`}
                      quality={100}
                      width={88}
                      height={88}
                      draggable={false}
                    />
                  </div>

                  <div className={`flex flex-col pt-2`}>
                    <p
                      className={`text-gray2 mt-auto line-clamp-1 text-sm font-medium`}
                    >
                      Ella Mai
                    </p>
                    <p
                      className={`line-clamp-1 text-base font-semibold text-black`}
                    >
                      Heart on My Sleeve
                    </p>
                  </div>

                  <p className={`line-clamp-[11] pt-[9px] text-base`}>
                    Ella Mai has a pleasant but monotone voice, she lacks range,
                    the
                  </p>
                </div>
              </Tilt>
            </div>

            <motion.div
              style={{
                background: `#0b1b18`,
                backgroundRepeat: "repeat, no-repeat",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className={`absolute top-0 left-0 -z-10 h-[432px] w-[304px]`}
            />
          </motion.div>
          {/* Footer */}
          <div className={`flex flex-col items-center z-10`}>
            <p
              className={`font-bold tracking-[24px] text-xl leading-[15px] pb-[22px] -mr-[24px]`}
            >
              RX
            </p>

            <p
              className={`font-garamond08 text-xl italic leading-[10px] pb-20`}
            >
              a network for the love of sound
            </p>

            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              className={`bg-black w-[232px] h-[32px] rounded-xl shadow-shadowKitHigh  cursor-pointer relative`}
            >
              <Link
                href={`/api/oauth/apple/login`}
                className={`center-y center-x absolute`}
              >
                <AppleIcon />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Rx</title>
      </Head>

      {activeFeed && (
        <motion.div
          ref={scrollContainerRef}
          className={`scrollbar-none flex max-h-screen w-full flex-col items-center gap-32 overflow-scroll px-8 pb-32 pt-16`}
        >
          {/*  Blur Backdrop */}
          <div
            className={`center-x pointer-events-none absolute top-0 z-0 h-full w-full bg-white/50 backdrop-blur-[72px]`}
          />

          {activeFeed === "bloom" ? (
            <Feed
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"bloom"}
            />
          ) : activeFeed === "personal" ? (
            <Feed
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"personal"}
            />
          ) : activeFeed === "recent" ? (
            <Feed
              userId={user.id}
              scrollContainerRef={scrollContainerRef}
              type={"recent"}
            />
          ) : null}

          <div
            className={`absolute z-20 -translate-x-[188px] flex items-center flex-row-reverse`}
          >
            <Avatar
              className="shadow-shadowKitMedium rounded-full"
              imageSrc={user.image}
              altText={`avatar`}
              width={48}
              height={48}
              user={user}
            />
            <p
              className={`absolute right-14 text-base text-black font-medium mix-blend-darken`}
            >
              @{user.username}
            </p>
          </div>

          <Dash className="absolute z-0 -translate-x-[188px]" />
        </motion.div>
      )}

      {/*<Player />*/}
    </Layout>
  );
}
