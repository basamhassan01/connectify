import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-accent min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-accent'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-primary hover:text-white transition duration-300 cursor-pointer relative text-xs md:text-base"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-[100%] h-1 bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-primary hover:text-white transition duration-300 cursor-pointer relative text-xs md:text-base'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-[100%] h-1 bg-primary'></div>
						)}
					</div>
				</div>
				<CreatePost />
				<Posts feedType={feedType} />
			</div>
		</>
	);
};
export default HomePage;