'use client'
import { SlideComponentProps } from "@/utils/types"
import { Bookmark, Heart, LucideIcon, MessageSquare, MessageSquareQuote, Repeat } from "lucide-react";
import { motion } from "motion/react";
import { storyAnimations } from "@/utils/animations";


export default function EngagementRecieved({ data, isActive }: SlideComponentProps) {

    const cards: { activity: string; count: number; icon: LucideIcon, color: string }[] = [
        {
            activity: 'Likes',
            count: data.totalLikesReceivedByUser,
            icon: Heart,
            color: 'text-pink-400'
        },
        {
            activity: 'Reposts',
            count: data.totalRepostsReceivedByUser,
            icon: Repeat,
            color: 'text-green-400'
        },
        {
            activity: 'Replies',
            count: data.totalRepliesReceivedByUser,
            icon: MessageSquare,
            color: 'text-blue-400'
        },
        {
            activity: 'Quotes',
            count: data.totalQuotesReceivedByUser,
            icon: MessageSquareQuote,
            color: 'text-purple-400'
        },
        {
            activity: 'Bookmarks',
            count: data.totalBookmarksReceivedByUser,
            icon: Bookmark,
            color: 'text-yellow-400'
        }
    ]

    const totalEngagement = cards.reduce((sum, card) => sum + card.count, 0);

    if (!isActive) {
        return <div className='w-full min-h-svh'></div>;
    }

    return (
        <div className="w-full min-h-svh flex items-center justify-center p-4 md:p-8">
            <div className="flex flex-col items-center max-w-2xl w-full">
                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 text-center"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Your posts <span className="text-primary">resonated</span>
                </motion.h2>
                <motion.p
                    className="text-base md:text-lg text-white/60 mb-6 text-center"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {totalEngagement.toLocaleString()} total engagements received
                </motion.p>

                <motion.div
                    className="w-full space-y-3 md:space-y-4"
                    variants={storyAnimations.staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 hover:bg-white/10 transition-all flex items-center justify-between"
                            variants={{
                                initial: { opacity: 0, y: 30, scale: 0.95 },
                                animate: { opacity: 1, y: 0, scale: 1 }
                            }}
                            transition={{
                                delay: 0.3 + (index * 0.1),
                                duration: 0.5,
                                ease: "backOut"
                            }}
                            whileHover={{
                                scale: 1.03,
                                transition: { duration: 0.2 }

                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3 md:gap-4 flex-1">
                                <card.icon className={`w-6 h-6 md:w-7 md:h-7 ${card.color}`} />
                                <span className="text-lg md:text-xl font-semibold text-white">
                                    {card.activity}
                                </span>
                            </div>
                            <motion.div
                                className={`text-3xl md:text-4x font-bold ${card.color}`}
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    delay: 0.5 + (index * 0.1),
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 18
                                }}
                            >
                                {card.count.toLocaleString()}
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
