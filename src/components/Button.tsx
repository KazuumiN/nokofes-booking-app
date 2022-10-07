interface Props {
  text: string;
  onClick: () => void;
}

const Button = ({text, onClick}: Props) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-pre-wrap"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button