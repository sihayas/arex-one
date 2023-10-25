import { Artwork } from "@/components/global/Artwork";
import { useInputContext } from "@/context/InputContext";
import { useUserSettingsQuery, toggleSetting } from "@/lib/apiHandlers/userAPI";
import { motion } from "framer-motion";
import { Essential, Settings } from "@/types/dbTypes";
import { useEffect, useState } from "react";
import { useSound } from "@/context/SoundContext";

// Interface for SettingsProps
interface SettingsProps {
  userId: string;
  essentials: Essential[];
}
interface QueryResult {
  data: Settings | null;
  isLoading: boolean;
  isError: boolean;
}

export type SettingKey =
  | "followerNotifications"
  | "heartNotifications"
  | "replyNotifications";

const Settings = ({ userId, essentials }: SettingsProps) => {
  const { data, isLoading, isError }: QueryResult =
    useUserSettingsQuery(userId);
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);
  const {
    setExpandInput,
    inputRef,
    isChangingEssential,
    setIsChangingEssential,
  } = useInputContext();
  const { setPrevEssentialId, setRank } = useSound();

  const handleEditClick = (prevEssentialId: string, rank: number) => {
    setExpandInput(true);
    setIsChangingEssential(true);
    setPrevEssentialId(prevEssentialId);
    setRank(rank);
    inputRef.current?.focus();
  };

  const handleToggleSetting = async (settingKey: SettingKey) => {
    if (!localSettings) return;
    const updatedSettings = {
      ...localSettings,
      [settingKey]: !localSettings[settingKey],
    };
    setLocalSettings(updatedSettings);
    try {
      await toggleSetting(userId, settingKey);
    } catch (error) {
      console.error("Error toggling setting:", error);
      setLocalSettings(localSettings);
    }
  };

  useEffect(() => {
    const handleBlur = () => {
      if (isChangingEssential) {
        setIsChangingEssential(false);
        setPrevEssentialId("");
        setRank(0);
      }
    };
    const currentInputRef = inputRef.current;
    currentInputRef?.addEventListener("blur", handleBlur);
    return () => currentInputRef?.removeEventListener("blur", handleBlur);
  }, [
    inputRef,
    isChangingEssential,
    setIsChangingEssential,
    setPrevEssentialId,
    setRank,
  ]);

  useEffect(() => {
    if (data) {
      setLocalSettings(data);
    }
  }, [data]);

  if (!data) return null;
  console.log(data);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full pt-4 flex flex-col"
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

      {/* Essentials */}
      <div className="text-xs text-gray3 font-medium tracking-widest leading-[75%] pt-4 mb-4">
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

      {/* Signals */}
      <div className="text-xs text-gray3 font-medium tracking-widest leading-[75%] pt-8 mb-4">
        SIGNALS
      </div>
      {/* Toggle Settings */}
      <div className="flex items-center gap-4">
        {[
          { key: "heartNotifications", label: "Hearts" },
          { key: "replyNotifications", label: "Replies" },
          { key: "followerNotifications", label: "Links" },
        ].map(({ key, label }) => (
          <button
            key={key}
            className="py-[6px] px-2 bg-[#F4F4F4] outline outline-silver outline-[.5px] rounded-full flex items-center gap-2 leading-[75%] cursor-pointer text-gray4 text-xs"
            onClick={() => handleToggleSetting(key as SettingKey)}
          >
            <div
              className={
                localSettings && localSettings[key as SettingKey]
                  ? "bg-[#21FF00] rounded-full w-2 h-2"
                  : "bg-[#CCC] rounded-full w-2 h-2"
              }
            />
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// Export Settings component
export default Settings;
