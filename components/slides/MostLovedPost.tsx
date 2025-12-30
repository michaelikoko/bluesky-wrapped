/* eslint-disable @next/next/no-img-element */
'use client'
import { MostEngagedPostData, SlideComponentProps } from "@/utils/types"
import { Heart, Repeat2, MessageCircle, Quote, Bookmark, ExternalLink, User } from "lucide-react"
import { motion } from "motion/react"
import { storyAnimations } from "@/utils/animations"

export default function MostLovedPost({ data, isActive }: SlideComponentProps) {
    const post: MostEngagedPostData | null = data.mostEngagedPost

    if (!post) {
        return (
            <div className="w-full min-h-svh flex items-center justify-center">
                <motion.div
                    className="text-center text-white/60"
                    {...storyAnimations.fadeIn}
                >
                    <p className="text-lg md:text-xl">No posts found</p>
                </motion.div>
            </div>
        )
    }

    const getBlueskyUrl = (uri: string) => {
        const parts = uri.replace('at://', '').split('/')
        const did = parts[0]
        const postId = parts[parts.length - 1]
        return `https://bsky.app/profile/${did}/post/${postId}`
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        const dateFormatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        return `${time} · ${dateFormatted}`
    }

    if (!isActive) {
        return <div className='w-full min-h-svh'></div>;
    }

    return (
        <div className="w-full min-h-svh flex items-center justify-center p-3 md:p-6">
            <motion.div
                className="w-full max-w-2xl"
                {...storyAnimations.fadeInUp}
                transition={{ delay: 0.2, duration: 0.5 }}
            >

                <motion.div
                    className="text-center mb-3 md:mb-4"
                    {...storyAnimations.fadeIn}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 text-center">
                        Your <span className="text-secondary">most loved</span> post
                    </h2>
                </motion.div>

                <motion.div
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                >
                    <div className="p-3 md:p-5">
                        <motion.div
                            className="flex items-start justify-between mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                {post.userAvatarUrl ? (
                                    <motion.img
                                        src={post.userAvatarUrl}
                                        alt='User avatar'
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.45, duration: 0.4 }}
                                    />
                                ) : (
                                    <motion.div
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center shrink-0"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.45, duration: 0.4 }}
                                    >
                                        <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </motion.div>
                                )}
                                <div className="flex flex-col min-w-0 flex-1">
                                    {post.userDisplayName && (
                                        <span className="font-medium text-white text-sm md:text-base truncate">
                                            {post.userDisplayName}
                                        </span>
                                    )}
                                    <span className="text-xs md:text-sm text-white/60 truncate">
                                        @{post.userHandle}
                                    </span>
                                </div>
                            </div>

                            <motion.a
                                href={getBlueskyUrl(post.uri)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
                                aria-label="Open post on Bluesky"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-white/60 hover:text-white" />
                            </motion.a>
                        </motion.div>

                        <motion.p
                            className="text-white text-sm md:text-base leading-relaxed mb-3 whitespace-pre-wrap line-clamp-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            {post.textContent}
                        </motion.p>

                        {post.embeddedImagesUrls && post.embeddedImagesUrls.length > 0 && (
                            <motion.div
                                className="mb-3 rounded-lg md:rounded-xl overflow-hidden"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6, duration: 0.4 }}
                            >
                                <img
                                    src={post.embeddedImagesUrls}
                                    alt="Post image"
                                    className="w-full h-auto object-cover max-h-64 md:max-h-80"
                                />
                            </motion.div>
                        )}

                        <motion.p
                            className="text-white/50 text-xs md:text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.65, duration: 0.3 }}
                        >
                            {formatDateTime(post.createdAt)}
                        </motion.p>
                    </div>

                    <motion.div
                        className="border-t border-white/10 px-3 md:px-5 py-2 md:py-3 bg-white/5"
                        variants={storyAnimations.staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        <div className="grid grid-cols-5 gap-2 md:gap-3">
                            {[post.likeCount, post.repostCount, post.replyCount, post.quoteCount, post.bookmarkCount].map((count, index) => (
                                <motion.div
                                    key={index}
                                    className="flex flex-col items-center gap-0.5"
                                    variants={{
                                        initial: { opacity: 0, y: 20, scale: 0.9 },
                                        animate: { opacity: 1, y: 0, scale: 1 }
                                    }}
                                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                                >
                                    {index === 0 && <Heart className="w-4 h-4 md:w-5 md:h-5 text-pink-400" fill="currentColor" />}
                                    {index === 1 && <Repeat2 className="w-4 h-4 md:w-5 md:h-5 text-green-400" />}
                                    {index === 2 && <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />}
                                    {index === 3 && <Quote className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />}
                                    {index === 4 && <Bookmark className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />}
                                    <span className="text-white font-semibold text-xs md:text-sm">
                                        {count.toLocaleString()}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="border-t border-white/10 px-3 md:px-5 py-2 bg-white/5 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.4 }}
                    >
                        <p className="text-white/80 text-xs md:text-sm">
                            <span className="font-bold text-base md:text-lg text-white">{post.totalEngagement.toLocaleString()}</span>
                            {' '}total interactions
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}
