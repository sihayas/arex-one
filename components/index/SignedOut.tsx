import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { cardBackMask, cardMask } from "@/components/index/items/Entry";
import Image from "next/image";
import { getStarComponent } from "@/components/global/Star";
import Link from "next/link";
import { AppleIcon } from "@/components/icons";
import React from "react";
import { useInterfaceContext } from "@/context/Interface";

const SignedOut = () => {
  const url =
    "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/800x800.jpg";

  // const [tiltAngles, setTiltAngles] = useState({
  //   tiltAngleX: 0,
  //   tiltAngleY: 0,
  // });
  //
  // const x = useSpring(0, { damping: 320, stiffness: 80 });
  // const y = useSpring(0, { damping: 320, stiffness: 80 });

  // useMotionValueEvent breaks the tilt effect on re-renders so use onChange instead.
  //
  // useEffect(() => {
  //   const xControls = animate(x, [8, 8, -8, -8, 8], {
  //     repeat: Infinity,
  //     duration: 16,
  //     ease: "easeOut",
  //   });
  //
  //   const yControls = animate(y, [8, -8, -8, 8, 8], {
  //     repeat: Infinity,
  //     duration: 16,
  //     ease: "easeOut",
  //   });
  //
  //   const unsubscribeX = x.on("change", (latest) => {
  //     setTiltAngles((prev) => ({ ...prev, tiltAngleX: latest }));
  //   });
  //
  //   const unsubscribeY = y.on("change", (latest) => {
  //     setTiltAngles((prev) => ({ ...prev, tiltAngleY: latest }));
  //   });
  //
  //   return () => {
  //     xControls.stop();
  //     yControls.stop();
  //     unsubscribeX();
  //     unsubscribeY();
  //   };
  // }, [x, y]);

  return (
    <motion.div
      className={`flex h-screen w-screen flex-col items-center py-16 justify-between`}
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
      />
      {/* Card */}
      <motion.div className={`relative`}>
        {/* Card */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 2,
            filter: "brightness(200%)",
            rotate: -8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "brightness(100%)",
            rotate: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.2,
            filter: "brightness(200%)",
            rotate: 8,
          }}
          transition={{
            type: "spring",
            duration: 4.5,
            bounce: 0.4,
            filter: { type: "spring", duration: 8 },
          }}
          className={`cloud-shadow`}
        >
          <Tilt
            perspective={1000}
            // tiltAngleXManual={tiltAngles.tiltAngleX}
            // tiltAngleYManual={tiltAngles.tiltAngleY}
            reset={false}
            tiltReverse={true}
            glareEnable={true}
            glareMaxOpacity={0.45}
            glareBorderRadius={"32px"}
            glareReverse={true}
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
                This album was the first album to actually get me into music.
                Just the fact that music can be this good, for this long truly
                had me awe, and made me want to delve deeper into music. It
                might just be due to the strings and choir, but I absolutely
                love how this all sounds like a live studio performance put in
                an album. Especially with Thoms vocals and how vague and sad the
                lyrics are, you cant tell me that this album doesnt sound like
                something you would hear channel surfing and landing on a public
                access channel. Truly one of the best albums of 2016 and one of
                the best melancholy albums of all time.
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

                {getStarComponent(4)}
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
                {getStarComponent(4)}

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
                Ella Mai has a pleasant but monotone voice, she lacks range, the
              </p>
            </div>
          </Tilt>
        </motion.div>

        {/* Ambiance */}
        <motion.div
          style={{
            background: `#fecde3`,
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
        <motion.p
          initial={{ fontWeight: 0, opacity: 0, scale: 0.8 }}
          animate={{ fontWeight: 400, opacity: 1, scale: 1 }}
          exit={{ fontWeight: 0, opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            duration: 4,
            bounce: 0.4,
            delay: 3,
          }}
          className={`text-xl leading-[15px] pb-[22px] -mr-[24px] text-white`}
        >
          R*
        </motion.p>

        <p
          className={`font-garamond08 text-xl italic leading-[10px] pb-20 text-white`}
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
            className={`center-y center-x absolute p-24`}
          >
            <AppleIcon />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignedOut;
