import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatPostDate } from "../../utils/date";
import LoadingSpin from "./LoadingSpin";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);

	const isMyPost = authUser._id === post.user._id;

	const formattedDate = formatPostDate(post.createdAt);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/like/${post._id}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (updatedLikes) => {
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/comment/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		deletePost()
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		likePost();
	};

	return (
		<>
			<div className='flex md:gap-2 gap-1 items-start md:p-4 p-2 border-b border-accent text-xs md:text-base'>
				<div className='flex items-center h-10'>
					<Link to={`/profile/${postOwner.username}`} className='w-10 rounded-full verflow-hidden'>
						<img src={postOwner.profileImg || "/display/avatar-placeholder.png"} className="md:w-10 md:h-10 w-8 h-8 rounded-full object-cover" />
					</Link>
				</div>
				<div className='flex flex-col flex-1 gap-3'>
					<div className='flex gap-2 items-center'>
						<div className="flex flex-col justify-center h-10">
							<Link to={`/profile/${postOwner.username}`} className='font-bold hover:text-secondary'>
								{postOwner.fullName}
							</Link>
							<span className='text-accent flex gap-1 text-sm'>
								<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
								<span>·</span>
								<span>{formattedDate}</span>
							</span>
						</div>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && (<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />)}
								{isDeleting && (<LoadingSpin size='sm' />)}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain w-[100%] h-auto rounded-lg'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{isLiking && <LoadingSpin size="sm" />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-accent group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm text-accent group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-accent"
									}`}
								>
									{post.likes.length}
								</span>
							</div>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-accent group-hover:text-sky-400' />
								<span className='text-sm text-accent group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-accent'>
												No one has commented yet. Be the first one
											</p>
										)}
										{post.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/display/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
														<span className='text-accent text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-accent pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-accent group-hover:text-green-500' />
								<span className='text-sm text-accent group-hover:text-green-500'>0</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-accent cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;