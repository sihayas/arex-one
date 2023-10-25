import { Artwork } from "@/components/global/Artwork";
import { useInputContext } from "@/context/InputContext";
import { useUserSettingsQuery } from "@/lib/apiHandlers/userAPI";
import { motion } from "framer-motion";
import { Essential } from "@/types/dbTypes";
import { useEffect } from "react";
import { useSound } from "@/context/SoundContext";
// Interface for SettingsProps
interface SettingsProps {
  userId: string;
  essentials: Essential[];
}

const Settings = ({ userId, essentials }: SettingsProps) => {
  // Fetch user settings
  const { data, isLoading, isError } = useUserSettingsQuery(userId);
  // Use input context
  const {
    setExpandInput,
    inputRef,
    isChangingEssential,
    setIsChangingEssential,
  } = useInputContext();
  // Use sound context
  const { setPrevEssentialId, setRank } = useSound();

  // Function to handle edit click
  const handleEditClick = (prevEssentialId: string, rank: number) => {
    setExpandInput(true);
    setIsChangingEssential(true);
    setPrevEssentialId(prevEssentialId);
    setRank(rank);
    // Focus on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  console.log(essentials);

  // Disable edit mode when clicking outside of the input
  useEffect(() => {
    const currentInputRef = inputRef.current;
    // Function to handle blur event
    const handleBlur = () => {
      if (isChangingEssential) {
        setIsChangingEssential(false);
        setPrevEssentialId("");
        setRank(0);
      }
    };

    // Add blur event listener
    if (currentInputRef) {
      currentInputRef.addEventListener("blur", handleBlur);
    }

    // Remove blur event listener on unmount
    return () => {
      if (currentInputRef) {
        currentInputRef.removeEventListener("blur", handleBlur);
      }
    };
  }, [
    inputRef,
    isChangingEssential,
    setIsChangingEssential,
    setPrevEssentialId,
    setRank,
  ]);

  // Render settings component
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full pt-8 flex flex-col"
    >
      <svg width="100%" height="2">
        <line
          x1="0"
          y1="0"
          x2="100%"
          y2="0"
          style={{ stroke: "#CCC", strokeWidth: 2, strokeDasharray: "1, 4" }}
        />
      </svg>

      <div className="text-xs text-gray3 font-medium tracking-widest leading-[75%] pt-8 mb-4">
        ESSENTIALS
      </div>
      <div className="flex flex-col gap-4">
        {essentials.map((essential, i) => (
          <div className={`flex gap-4`} key={essential.id}>
            <Artwork
              className="rounded-lg shadow-shadowKitLow outline outline-silver outline-1"
              sound={essential.appleAlbumData}
              width={86}
              height={86}
            />
            <div className="flex flex-col justify-center gap-[14px]">
              <div className="text-xs text-gray2 leading-[75%]">
                {essential.appleAlbumData.attributes.artistName}
              </div>
              <div className="text-sm leading-[75%]">
                {essential.appleAlbumData.attributes.name}
              </div>
            </div>
            {/* Edit Button */}
            <button
              className="text-xs text-gray2 font-medium ml-auto"
              onClick={() => handleEditClick(essential.id, i)}
            >
              edit
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Export Settings component
export default Settings;
