import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
	const queryClient = useQueryClient();
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<>
			<div className='flex-[4_4_0] border-r border-accent min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-accent'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown'>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content absolute right-0 mt-2 z-[1] menu p-2 shadow bg-neutral rounded-box w-52'
						>
							<li className="hover:bg-neutral hover:text-red-500">
								<a onClick={deleteNotifications}>Discard all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center text-accent p-4 font-bold'>Your notification list is empty.</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-accent' key={notification._id}>
						<div className='flex flex-col gap-1 p-4'>
                            <div className="flex gap-2 items-center">
                                <Link to={`/profile/${notification.from.username}`} className="flex gap-2 items-center">
                                    <div className='avatar h-8'>
                                        <div className='flex items-center w-8 rounded-full'>
                                            <img src={notification.from.profileImg || "/display/avatar-placeholder.png"} />
                                        </div>
                                    </div>
                                    <div className='flex h-8 gap-1 items-center'>
                                        <span className='font-bold hover:text-secondary'>@{notification.from.username}</span>{" "}
                                    </div>
                                </Link>
                            </div>   
							<div className="pl-10 flex justify-between items center">     
								{notification.type === "follow" ? "Followed your profile" : "Reacted to your post"}
								{notification.type === "follow" && <FaUser className='w-5 h-5 text-primary' />}
								{notification.type === "like" && <FaHeart className='w-5 h-5 text-red-500' />}
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;