import { useThreadcrumb } from "@/context/Threadcrumbs";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";
import { useSoundContext } from "@/context/SoundContext";
import { useSound } from "@/hooks/usePage";

export const Keybinds = (
  handleInputTextChange: (value: string) => void,
  handleReplySubmit: () => void,
) => {
  const { replyParent, setReplyParent } = useThreadcrumb();
  const { pages } = useInterfaceContext();
  const {
    inputValue,
    setInputValue,
    expandInput,
    inputRef,
    storedInputValue,
    setStoredInputValue,
    activeAction,
  } = useNavContext();
  const { selectedFormSound, setSelectedFormSound } = useSoundContext();
  const { handleSelectSound } = useSound();

  const activePage: Page = pages[pages.length - 1];

  const handleKeyDown = (e: any) => {
    // New line if Form is expanded or ReplyParent is selected
    if (
      e.key === "Enter" &&
      expandInput &&
      selectedFormSound &&
      inputRef.current?.value !== ""
    ) {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const value = e.target.value;
      const newValue =
        value.substring(0, cursorPosition) +
        "\n" +
        value.substring(cursorPosition);
      handleInputTextChange(newValue);
    }
    //Submit reply with cmd/ctrl + enter
    else if (
      e.key === "Enter" &&
      (e.metaKey || e.ctrlKey) &&
      inputRef.current === document.activeElement &&
      replyParent
    ) {
      handleReplySubmit();
    }
    // Switch to album page from form
    else if (e.key === "Enter" && selectedFormSound && inputValue === "") {
      e.preventDefault();
      handleSelectSound(selectedFormSound);
      inputRef?.current?.blur();
      window.history.pushState(null, "");
    }

    // Wipe selectedFormSound and replyParent
    else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      activeAction !== "none"
    ) {
      e.preventDefault();
      setSelectedFormSound(null);
      setReplyParent(null);
      setInputValue(storedInputValue);
      setStoredInputValue("");
      inputRef?.current?.focus();
    }
    // Prepare form if on sound page
    else if (
      e.key === "Enter" &&
      activePage.sound &&
      activeAction === "none" &&
      !inputValue
    ) {
      e.preventDefault();
      const sound = activePage.sound.sound;
      setSelectedFormSound(sound);
    }
    // Prepare reply parent
    else if (
      e.key === "Enter" &&
      activePage.artifact &&
      activeAction === "none" &&
      !inputValue
    ) {
      e.preventDefault();
      setReplyParent(activePage.artifact);
    }
  };

  return handleKeyDown;
};
