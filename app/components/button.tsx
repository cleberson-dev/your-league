type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: Props) {
	return (
		<button 
			{...props}
			className="bg-purple-500 text-white py-2 px-4 text-sm rounded hover:bg-purple-600 transition-colors disabled:bg-slate-300 disabled:text-black disabled:opacity-25"
		>
			{props.children}
		</button>
	);
}
