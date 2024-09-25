const LoadingSpin = ({ size = "md", color = "primary" }) => {
	const sizeClass = `loading-${size}`;
	const colorClass = color === "primary" ? "text-primary" : "";

	return <span className={`loading loading-spinner ${sizeClass} ${colorClass}`} />;
};

export default LoadingSpin;