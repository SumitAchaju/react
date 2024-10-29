import {
  FormEvent,
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
  useContext,
} from "react";
import {
  EmojiIcon,
  GalleryIcon,
  MicroPhoneIcon,
  PlusIcon,
  SendIcon,
} from "./Icons";
import { useParams } from "react-router-dom";
import ThemeContext from "../context/Theme";

const EmojiPicker = lazy(() => import("emoji-picker-react"));
enum Theme {
  DARK = "dark",
  LIGHT = "light",
}
type Props = {
  isActive: boolean;
  handleMsgSend: (e: FormEvent<HTMLFormElement>) => void;
};

function MessageBox({ isActive, handleMsgSend }: Props) {
  const { roomId } = useParams();
  const iconsDiv = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const themeContext = useContext(ThemeContext);

  function handleChangeBox() {
    if (inputRef.current?.value == "") {
      inputRef.current?.classList.remove("ps-[40px]");
      iconsDiv.current?.classList.remove("hidden");
      return;
    }
    inputRef.current?.classList.add("ps-[40px]");
    iconsDiv.current?.classList.add("hidden");
  }
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = "";
      handleChangeBox();
    }
  }, [roomId]);

  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const handleMsgSumbit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isActive) {
      handleMsgSend(e);
      handleChangeBox();
      setIsEmojiOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        inputRef.current?.focus();
      }
      if (e.ctrlKey && e.key === "m") {
        setIsEmojiOpen((prev) => !prev);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsEmojiOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <form
      className="relative py-5"
      ref={formRef}
      onKeyDownCapture={(e) => {
        if (e.key === "Enter" && e.ctrlKey) {
          handleMsgSumbit(e);
        }
      }}
      onSubmit={(e) => {
        handleMsgSumbit(e);
      }}
    >
      <Suspense
        fallback={
          <div className="!absolute top-0 right-0 -translate-y-full">
            <p className="text-secondary-text">Loading...</p>
          </div>
        }
      >
        <EmojiPicker
          className="!absolute top-0 right-0 -translate-y-full !bg-second"
          open={isEmojiOpen}
          lazyLoadEmojis
          theme={themeContext?.theme === "dark" ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={(emoji) => {
            if (inputRef.current) {
              inputRef.current.value += emoji.emoji;
            }
            handleChangeBox();
          }}
        />
      </Suspense>
      <input
        name="messageBox"
        autoComplete="off"
        id="msgBox"
        ref={inputRef}
        className="w-full rounded-full py-5 font-medium ps-[150px] pe-[110px] text-[18px] block resize-none bg-second text-primary-text transition-all hidden-scroll"
        placeholder="Type Something..."
        onChange={handleChangeBox}
      />

      <div
        ref={iconsDiv}
        className="flex gap-3 items-center absolute top-1/2 -translate-y-1/2 left-8 transition-all"
      >
        <div>
          <PlusIcon />
        </div>
        <div>
          <MicroPhoneIcon />
        </div>
        <div>
          <GalleryIcon />
        </div>
      </div>
      <div className="flex gap-4 items-center absolute top-1/2 -translate-y-1/2 right-8">
        <div
          onClick={() => setIsEmojiOpen((prev) => !prev)}
          className="cursor-pointer"
        >
          <EmojiIcon />
        </div>
        <div>
          <button type="submit">
            <SendIcon />
          </button>
        </div>
      </div>
    </form>
  );
}

export default MessageBox;
