import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const Sidebar = () => {

	const queryClient = useQueryClient();

	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		}
	});

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-accent w-15 md:w-full'>
				<Link to='/' className='mt-2 flex justify-center md:justify-start'>
                    <img src="/logo/Dark_Navbar_Logo.png" alt="" className="hidden md:block px-2 w-auto h-12" />
                    <img src="/logo/Favicon.png" alt="" className="block md:hidden px-2 w-auto h-12" />
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center items-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-secondary transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer hover:text-white group'
						>
							<MdHomeFilled className='w-5 h-5 text-primary group-hover:text-white' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center items-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-secondary transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer hover:text-white group'
						>
							<IoNotifications className='w-5 h-5 text-primary group-hover:text-white' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center items-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-3 items-center hover:bg-secondary transition-all rounded-full duration-300 py-2 pl-2 pr-2 max-w-fit cursor-pointer hover:text-white group'
						>
							<FaUser className='w-5 h-5 text-primary group-hover:text-white' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='mt-auto mb-1 ml-1 mr-1 flex gap-2 items-center transition-all duration-300 hover:bg-secondary py-2 px-2 rounded-full group'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-10 rounded-full'>
								<img src={authUser?.profileImg || "/display/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-center md:justify-between items-center flex-1'>
							<div className='hidden md:block'>
								<p className='text-text font-bold text-sm w-20 truncate group-hover:text-white'> {authUser?.fullName}</p>
								<p className='text-accent text-sm group-hover:text-[#f9f9f9]'>@{authUser?.username}</p>
							</div>
							<BiLogOut className='w-8 h-8 cursor-pointer text-primary group-hover:text-white' 
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;