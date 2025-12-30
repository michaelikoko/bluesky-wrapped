'use client'
import { storyAnimations } from "@/utils/animations";
import { SlideComponentProps } from "@/utils/types"
import { LucideIcon, MessageSquare, MessageSquareQuote, Repeat, StickyNote } from "lucide-react";
import { motion } from 'motion/react'


export default function ActivityOverview({ data, isActive }: SlideComponentProps) {
    const cards: { activity: string; count: number; icon: LucideIcon, extraText: string, color: string }[] = [
        {
            activity: 'Posts',
            count: data.totalPostsMadeByUser,
            icon: StickyNote,
            extraText: 'original thoughts shared',
            color: 'text-purple-400'
        },
        {
            activity: 'Replies',
            count: data.totalRepliesMadeByUser,
            icon: MessageSquare,
            extraText: 'conversations joined',
            color: 'text-blue-400'
        },
        {
            activity: 'Reposts',
            count: data.totalRepostsMadeByUser,
            icon: Repeat,
            extraText: 'voices amplified',
            color: 'text-green-400'
        },
        {
            activity: 'Quotes',
            count: data.totalQuotesMadeByUser,
            icon: MessageSquareQuote,
            extraText: 'posts with commentary',
            color: 'text-pink-400'
        }
    ]

    const totalActivities = data.totalPostsMadeByUser + data.totalRepliesMadeByUser + data.totalRepostsMadeByUser + data.totalQuotesMadeByUser;

    if (!isActive) {
        return <div className='w-full min-h-svh'></div>;
    }

    return (
        <div className="w-full min-h-svh flex items-center justify-center p-4 md:p-8">
            <div className="flex flex-col items-center max-w-4xl w-full">
                <motion.h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 text-center"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    You were <span className="text-primary">active</span> in 2025!
                </motion.h2>
                <motion.p className="text-base md:text-lg text-white/60 mb-6 text-center"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    That&apos;s {totalActivities.toLocaleString()} total interactions
                </motion.p>

                <motion.div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6 w-full max-w-3xl"
                    variants={storyAnimations.staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 hover:bg-white/10 transition-all"
                            variants={{
                                initial: { opacity: 0, y: 30, scale: 0.9 },
                                animate: { opacity: 1, y: 0, scale: 1 }
                            }}
                            transition={{
                                delay: 0.3 + (index * 0.1),
                                duration: 0.5,
                                ease: "backOut"
                            }}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                className="flex items-start justify-between mb-3 md:mb-4"
                                variants={{
                                    initial: { opacity: 0, y: 30, scale: 0.9 },
                                    animate: { opacity: 1, y: 0, scale: 1 }
                                }}
                                transition={{
                                    delay: 0.3 + (index * 0.1),
                                    duration: 0.5,
                                    ease: "backOut"
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <card.icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white/60" />
                            </motion.div>
                            <motion.div className={`text-4xl md:text-5xl font-bold mb-1 md:mb-2 ${card.color}`}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    delay: 0.6 + (index * 0.1),
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 15
                                }}
                            >
                                {card.count.toLocaleString()}
                            </motion.div>
                            <div className="text-lg md:text-xl font-semibold text-white mb-1">
                                {card.activity}
                            </div>
                            <div className="text-xs md:text-sm  text-white/50">
                                {card.extraText}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}