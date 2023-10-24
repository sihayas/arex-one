import { Artwork } from "@/components/global/Artwork";
import { useInputContext } from "@/context/InputContext";
import { useUserSettingsQuery } from "@/lib/apiHandlers/userAPI";
import { AlbumData } from "@/types/appleTypes";
import { motion } from "framer-motion";
interface SettingsProps {
  userId: string;
  essentials: AlbumData[];
}

const Settings = ({ userId, essentials }: SettingsProps) => {
  const { data, isLoading, isError } = useUserSettingsQuery(userId);
  const { expandInput, setExpandInput, isSettingsOpen, setIsSettingsOpen } =
    useInputContext();

  console.log(data);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full pt-8 flex flex-col gap-8"
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

      <div className="flex gap-4">
        {essentials.map((albumData, i) => (
          <div className={`flex flex-col gap-2`} key={albumData.id}>
            <Artwork
              className="rounded-lg shadow-shadowKitLow outline outline-silver outline-1"
              sound={albumData}
              width={86}
              height={86}
            />
            {/* Edit Button */}
            <button
              className="text-xs text-gray2 font-medium"
              onClick={() => console.log("edit")}
            >
              edit
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Settings;
