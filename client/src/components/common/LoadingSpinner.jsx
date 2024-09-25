const LoadingSpinner = ({ size = "md", color = "primary" }) => {
	const sizeClass = `loading-${size}`;
	const colorClass = color === "primary" ? "text-primary" : "";

	return <span className={`loading loading-bars ${sizeClass} ${colorClass}`} />;
};

export default LoadingSpinner;