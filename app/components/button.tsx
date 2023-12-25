type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: Props) {
  return (
    <button 
      {...props}
      className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600 transition-colors"
    >
      {props.children}
    </button>
  );
}
