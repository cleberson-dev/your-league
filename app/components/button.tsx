type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: Props) {
	return (
		<button 
			{...props}
			className="bg-violet text-white py-2 px-4 text-sm rounded hover:opacity-50 transition-opacity disabled:bg-slate-300 disabled:text-black disabled:opacity-25"
		>
			{props.children}
		</button>
	);
}
