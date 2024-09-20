interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  varient: "primary" | "secondary";
  text: string;
  hover?: boolean;
}

const defaultClass =
  "px-[25px] py-[10px] font-medium text-[18px] rounded-[15px] border-2 duration-300";

const primaryClass = "bg-red-color border-transparent text-white";

const primaryHover =
  "hover:bg-transparent hover:border-2 hover:border-red-color hover:text-red-color";

const secondaryClass =
  "bg-transparent border-2 border-red-color text-red-color ";

const secondaryHover =
  "hover:bg-red-color hover:border-2 hover:border-transparent hover:text-white";

export default function Button({
  varient,
  text,
  hover = true,
  ...buttonProps
}: Props) {
  const primary = hover ? primaryClass + " " + primaryHover : primaryClass;
  const secondary = hover
    ? secondaryClass + " " + secondaryHover
    : secondaryClass;
  return (
    <button
      disabled={buttonProps.disabled}
      className={
        defaultClass +
        " " +
        (varient == "primary" ? primary : secondary) +
        " " +
        buttonProps.className
      }
      onClick={buttonProps.onClick}
    >
      {text}
    </button>
  );
}
