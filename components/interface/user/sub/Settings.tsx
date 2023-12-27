import { useNavContext } from "@/context/NavContext";
import {
  useUserSettingsQuery,
  toggleSetting,
  changeBio,
} from "@/lib/apiHelper/user";
import { Essential, Settings } from "@/types/dbTypes";
import React, { useEffect, useState } from "react";
import { useSoundContext } from "@/context/SoundContext";
import { SwapIcon, EditIcon } from "@/components/icons";
import TextareaAutosize from "react-textarea-autosize";

interface SettingsProps {
  userId: string;
  essentials: Essential[];
  bio: string;
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

const Settings = ({ userId, essentials, bio }: SettingsProps) => {
  const { data, isLoading, isError }: QueryResult =
    useUserSettingsQuery(userId);
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);
  const {
    setExpandInput,
    inputRef,
    isChangingEssential,
    setIsChangingEssential,
  } = useNavContext();
  const { setPrevEssentialId, setRank } = useSoundContext();
  const [bioValue, setBioValue] = useState(bio);

  // Function to handle edit click
  const handleEditClick = (prevEssentialId: string, rank: number) => {
    setExpandInput(true);
    setIsChangingEssential(true);
    setPrevEssentialId(prevEssentialId);
    setRank(rank);
    inputRef.current?.focus();
  };

  // Function to handle changing/toggling setting
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

  const handleChangeBio = async () => {
    if (bio === bioValue) return;
    try {
      await changeBio(userId, bioValue);
    } catch (error) {
      console.error("Error changing bio:", error);
      setBioValue(bio);
    }
  };

  const handleInputTextChange = (value: string) => {
    setBioValue(value);
  };

  // Effect to handle blur
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

  // Effect to set local settings
  useEffect(() => {
    if (data) {
      setLocalSettings(data);
    }
  }, [data]);

  // Return null if no data
  if (!data) return null;

  return (
    <div className="w-full h-full py-8 flex flex-col items-end max-w-[192px] overflow-scroll scrollbar-none text-xs leading-[9px]">
      <div className="text-gray2 uppercase mb-[23px]">settings</div>
      {/* Essentials */}
      <div className="text-gray3 pb-[23px] uppercase">essentials</div>
      <div className="flex flex-col gap-4 mb-[64px]">
        {essentials.map((essential, i) => (
          <div className={`flex gap-4 relative`} key={essential.id}>
            {/*<Artwork*/}
            {/*  className="rounded-xl border border-silver"*/}
            {/*  sound={essential.appleData}*/}
            {/*  width={96}*/}
            {/*  height={96}*/}
            {/*/>*/}
            <SwapIcon
              className="absolute -bottom-1 -left-1 cursor-pointer"
              onClick={() => handleEditClick(essential.id, i)}
            />
          </div>
        ))}
      </div>

      {/* Bio */}
      <div className="text-gray3 pb-[23px] uppercase">bio</div>
      <div className="mb-[64px] min-w-[160px] min-h-[105px] border-b-[1.5px] border-l-[1.5px] border-silver rounded-bl-2xl relative pl-2 pb-2">
        <TextareaAutosize
          className={`w-full min-h-full bg-transparent outline-none resize-none text-gray2 text-end text-xs`}
          value={bioValue}
          onChange={(e) => handleInputTextChange(e.target.value)}
          maxRows={6}
          minRows={6}
          maxLength={84}
        />
        <button
          disabled={bio === bioValue}
          className={`absolute -bottom-9 left-0 p-2 outline outline-silver outline-1 rounded-full shadow-sm`}
          onClick={handleChangeBio}
        >
          <EditIcon color={bio !== bioValue ? "#000" : "#CCC"} />
        </button>
      </div>

      {/* Notifications */}
      <div className="text-gray3 mb-[23px] uppercase">signals</div>
      <div className="flex flex-col items-end gap-4 mb-[64px]">
        {[
          { key: "heartNotifications", label: "Hearts" },
          { key: "replyNotifications", label: "Replies" },
          { key: "followerNotifications", label: "Links" },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`flex items-center gap-2  cursor-pointer text-white  w-fit uppercase`}
            onClick={() => handleToggleSetting(key as SettingKey)}
            style={{
              color:
                localSettings && localSettings[key as SettingKey]
                  ? "#A6FF47"
                  : "#CCC",
            }}
          >
            {label}
            <div
              style={{
                backgroundColor:
                  localSettings && localSettings[key as SettingKey]
                    ? "#A6FF47"
                    : "#CCC",
              }}
              className={`w-[10px] h-[10px] rounded-full`}
            ></div>
          </button>
        ))}
      </div>

      {/* Manage Account */}
      <div className=" text-gray3  mb-[23px] uppercase">manage account</div>
      <div className="flex flex-col items-end gap-3 mb-[23px]  ">
        <div className={`text-action font-medium uppercase `}>archive</div>
        <div className={`text-gray2 text-end`}>Mark your data as deleted.</div>
        <div className={`text-black text-end`}>Reversible for 30 days.</div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <div className={` text-red font-medium uppercase `}>delete</div>
        <div className={` text-gray2 text-end leading-[10px]`}>
          Wipe all data related to you
        </div>
        <div className={` text-black text-end leading-[10px]`}>Permanent.</div>
      </div>
    </div>
  );
};

// Exporting Settings component
export default Settings;
