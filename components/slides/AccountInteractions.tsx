'use client'
import { SlideComponentProps } from "@/utils/types";
import { Users, User } from "lucide-react";
import { motion } from 'motion/react';
import { storyAnimations, getDelay } from "@/utils/animations";

export default function AccountInteractions({ data, isActive }: SlideComponentProps) {
    const topAccounts = data.topInteractedAccounts.slice(0, 6);

    if (!isActive) {
        return <div className='w-full min-h-svh'></div>;
    }
    return (
        <div className="w-full min-h-svh flex items-center justify-center p-3 md:p-6">
            <div className="flex flex-col items-center max-w-4xl w-full">
                <motion.div className="text-center mb-4 md:mb-6"
                    initial="initial"
                    animate="animate"
                    variants={storyAnimations.staggerContainer}
                >
                    <motion.h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-2 flex items-center justify-center gap-2"
                        {...storyAnimations.fadeInUp}
                        transition={{ delay: 0.2, duration: 0.5 }}

                    >
                        <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                        Your <span className="text-secondary">Bluesky</span> Circle
                    </motion.h2>
                    <motion.p className="text-sm md:text-base text-white/60"
                        {...storyAnimations.fadeInUp}
                        transition={{ delay: 0.3, duration: 0.5 }}                    >
                        People you connected with most
                    </motion.p>
                </motion.div>

                {topAccounts.length > 0 ? (
                    <motion.div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 w-full"
                        initial="initial"
                        animate="animate"
                        variants={storyAnimations.staggerContainer}
                    >
                        {topAccounts.map((account, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 md:p-4 hover:bg-white/10 transition-all flex flex-col items-center text-center"
                                variants={storyAnimations.fadeInUp}
                                transition={getDelay(index, 0.15)}
                            >
                                {account.avatarUrl ? (
                                    <motion.img
                                        src={account.avatarUrl}
                                        alt={account.handle}
                                        className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover mb-2 md:mb-3 ring-2 ring-white/20"
                                        {...storyAnimations.scalePop}
                                        transition={{ delay: 0.2, duration: 0.5 }}

                                    />
                                ) : (
                                    <motion.div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-2 md:mb-3 ring-2 ring-white/20"
                                        {...storyAnimations.scalePop}
                                        transition={{ delay: 0.2, duration: 0.5 }}

                                    >
                                        <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    </motion.div>
                                )}

                                <motion.h3 className="text-sm md:text-base font-semibold text-white mb-0.5 truncate w-full"
                                    {...storyAnimations.fadeInUp}
                                    transition={getDelay(index, 0.2)}
                                >
                                    {account.displayName || ''}
                                </motion.h3>

                                <motion.p className="text-xs md:text-sm text-white/60 mb-2 truncate w-full"
                                    {...storyAnimations.fadeInUp}
                                    transition={getDelay(index, 0.25)}
                                >
                                    @{account.handle}
                                </motion.p>

                                <motion.div className="text-xl md:text-2xl font-bold text-purple-400"
                                    {...storyAnimations.scalePop}
                                    transition={getDelay(index, 0.3)}
                                >
                                    {account.interactionCount}
                                </motion.div>
                                <motion.p className="text-xs text-white/50"
                                    {...storyAnimations.fadeIn}
                                    transition={getDelay(index, 0.35)}
                                >
                                    interactions
                                </motion.p>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div className="text-center text-white/60 py-8"
                        {...storyAnimations.fadeIn}
                    >
                        <p className="text-base md:text-lg">No interaction data available</p>
                    </motion.div>
                )}
            </div>
        </div>
    )


}