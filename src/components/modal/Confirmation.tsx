import Popup from "reactjs-popup";
import { CrossIcon } from "../Icons";
import { useSpring, animated, config } from "@react-spring/web";

type Props = {
  trigger: React.ReactNode;
  modal: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const animation = {
  from: {
    scale: 0,
    opacity: 0.5,
  },
  to: {
    scale: 1,
    opacity: 1,
  },
  config: config.stiff,
};

export default function ConfirmationModel({
  trigger,
  modal,
  isOpen,
  setIsOpen,
}: Props) {
  const [springs, api] = useSpring(() => animation);

  return (
    <Popup
      trigger={
        <button className="cursor-pointer">
          <div
            onClick={() => {
              api.start(animation);
              setIsOpen(true);
            }}
          >
            {trigger}
          </div>
        </button>
      }
      modal
      open={isOpen}
      position={"center center"}
      overlayStyle={{ background: "rgba(0,0,0,.2)" }}
      closeOnDocumentClick={false}
    >
      <animated.div
        style={springs}
        className="bg-second rounded-[15px] relative w-[200px] h-[200px]"
      >
        {modal}
        <div
          className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <CrossIcon color="var(--red_color)" />
        </div>
      </animated.div>
    </Popup>
  );
}
