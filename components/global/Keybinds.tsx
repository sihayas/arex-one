import { Page, useInterfaceContext } from "@/context/Interface";
import { useNavContext } from "@/context/Nav";
import { useSound } from "@/hooks/usePage";

export const Keybinds = (
  handleInputTextChange: (value: string) => void,
  handleReplySubmit: () => void,
) => {
  const { pages } = useInterfaceContext();
  const { replyTarget, setReplyTarget } = useNavContext();
  const {
    inputValue,
    setInputValue,
    expandInput,
    inputRef,
    storedInputValue,
    setStoredInputValue,
    activeAction,
    selectedFormSound,
    setSelectedFormSound,
  } = useNavContext();
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
      replyTarget
    ) {
      handleReplySubmit();
    }
    // Switch to album page from form
    else if (e.key === "Enter" && selectedFormSound && inputValue === "") {
      e.preventDefault();
      handleSelectSound(selectedFormSound);
      setSelectedFormSound(null);
      inputRef.current?.blur();
      window.history.pushState(null, "");
    }
    // Wipe selectedFormSound and replyTarget
    else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      activeAction !== "none"
    ) {
      e.preventDefault();
      setSelectedFormSound(null);
      setReplyTarget(null);
      setInputValue(storedInputValue);
      setStoredInputValue("");
      inputRef.current?.focus();
    }
    // Prepare form if on sound page
    else if (
      e.key === "Enter" &&
      activePage.sound &&
      activeAction === "none" &&
      !inputValue
    ) {
      e.preventDefault();
      const sound = activePage.sound.data;
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
      //@ts-ignore
      setReplyTarget({ artifact: activePage.artifact.data, reply: null });
    }
  };

  return handleKeyDown;
};
