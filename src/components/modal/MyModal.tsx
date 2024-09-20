import Popup from "reactjs-popup";
import { CrossIcon } from "../Icons";
import { useSpring, animated, config } from "@react-spring/web";

type Props = {
  trigger: React.ReactNode;
  modal: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeOnDocumentClick?: boolean;
  alphaOverlay?: number;
  closeBtn?: boolean;
  className?: string;
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

export default function MyModal({
  alphaOverlay = 0.4,
  closeOnDocumentClick = true,
  closeBtn = true,
  ...props
}: Props) {
  const [springs, api] = useSpring(() => animation);

  return (
    <Popup
      trigger={
        <button className="cursor-pointer">
          <div
            onClick={() => {
              api.start(animation);
              props.setIsOpen(true);
            }}
          >
            {props.trigger}
          </div>
        </button>
      }
      modal
      open={props.isOpen}
      position={"center center"}
      overlayStyle={{ background: `rgba(0,0,0,${alphaOverlay})` }}
      closeOnDocumentClick={closeOnDocumentClick}
    >
      <animated.div
        style={springs}
        className={
          "bg-second rounded-[15px] relative w-[750px] h-[530px] " +
          props.className
        }
      >
        {props.modal}
        {closeBtn ? (
          <div
            className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 cursor-pointer"
            onClick={() => props.setIsOpen((prev) => !prev)}
          >
            <CrossIcon color="var(--red_color)" />
          </div>
        ) : null}
      </animated.div>
    </Popup>
  );
}
