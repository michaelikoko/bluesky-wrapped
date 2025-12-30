'use client'

import { SlideComponentProps } from "@/utils/types"
import { FileText, WholeWord, MessageSquareText } from "lucide-react"
import { motion } from "motion/react"
import { storyAnimations } from "@/utils/animations"

const COLORS = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-green-400 to-emerald-400',
    'from-yellow-400 to-orange-400',
    'from-pink-400 to-rose-400',
    'from-indigo-400 to-purple-400',
    'from-cyan-400 to-blue-400',
    'from-emerald-400 to-green-400',
];

export default function WordsUsed({ data, isActive }: SlideComponentProps) {
    const topWords = data.mostUsedWords ?? []; // Limit to top 8 for better display

    if (!isActive) {
        return <div className='w-full min-h-svh'></div>;
    }
    return (
        <div className="w-full min-h-svh flex items-center justify-center p-3 md:p-6">
            <motion.div className="flex flex-col items-center max-w-4xl w-full"
                initial="initial"
                animate="animate"
                variants={storyAnimations.staggerContainer}
            >
                <motion.h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-2 text-center"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.2 }}
                >
                    You had <span className="text-secondary">a lot</span> to say!
                </motion.h2>
                <motion.p className="text-sm md:text-base text-white/60 mb-4 md:mb-6 text-center"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Your voice in numbers
                </motion.p>

                <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl mb-4 md:mb-6"
                    variants={storyAnimations.staggerContainer}
                >
                    <motion.div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-5 hover:bg-white/10 transition-all"
                        {...storyAnimations.fadeInUp}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">
                            {data.totalWordsUsedByUser.toLocaleString()}
                        </div>
                        <div className="text-base md:text-lg font-semibold text-white">Total Words</div>
                        <div className="text-xs md:text-sm text-white/50">across all your posts</div>
                    </motion.div>

                    <motion.div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-5 hover:bg-white/10 transition-all"
                        {...storyAnimations.fadeInUp}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <WholeWord className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">
                            {data.wordsPerPostAverage.toLocaleString()}
                        </div>
                        <div className="text-base md:text-lg font-semibold text-white">Words per Post</div>
                        <div className="text-xs md:text-sm text-white/50">average length</div>
                    </motion.div>
                </motion.div>

                <motion.div className="w-full max-w-3xl"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                        <MessageSquareText className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                        <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                            Your Top Words
                        </h3>
                    </div>

                    {topWords.length > 0 ? (
                        <motion.div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3"
                            variants={storyAnimations.staggerContainer}
                        >
                            {topWords.map((wordObj, index) => {
                                return (
                                    <motion.div
                                        key={index}
                                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-4 hover:bg-white/10 transition-all text-center"
                                        variants={storyAnimations.fadeInUp}
                                        transition={{ delay: 0.7 + index * 0.05 }}
                                    >
                                        <div className={`text-2xl md:text-3xl font-bold bg-linear-to-r ${COLORS[index % COLORS.length]} bg-clip-text text-transparent mb-1`}>
                                            {wordObj.count}
                                        </div>
                                        <div className="text-sm md:text-base font-medium text-white truncate">
                                            {wordObj.word}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div className="text-center text-white/60 py-8"
                            {...storyAnimations.fadeIn}
                            transition={{ delay: 0.7 }}
                        >
                            <p className="text-sm md:text-base">No word data available</p>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    )
}
