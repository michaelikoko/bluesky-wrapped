'use client'
import { SlideComponentProps } from "@/utils/types"
import { Megaphone } from "lucide-react"
import { motion } from 'motion/react'
import { storyAnimations } from "@/utils/animations"
export default function BlueskyPersonality({ data, isActive }: SlideComponentProps) {

    if (!data.blueskyPersonality) {
        return (
            <div className="w-full h-screen flex items-center justify-center p-3 md:p-6">
                <motion.div className="text-center text-white/60" {...storyAnimations.fadeIn}>
                    <p className="text-base md:text-lg">No personality data available</p>
                </motion.div>
            </div>
        )
    }

    if (!isActive) {
        return <div className='w-full min-h-svh'></div>;
    }

    return (
        <div className="w-full min-h-svh flex items-center justify-center p-4 md:p-8">
            <motion.div className="flex flex-col items-center text-center max-w-3xl w-full px-4"
                initial="initial"
                animate="animate"
                variants={storyAnimations.staggerContainer}
            >
                <motion.div {...storyAnimations.scalePop}
                    transition={{ delay: 0.2, duration: 0.5 }}

                >
                    <Megaphone className="w-12 h-12 md:w-16 md:h-16 text-yellow-400 mb-4 md:mb-6" />
                </motion.div>

                <motion.p className="text-base md:text-lg text-white/60 mb-2 md:mb-3 uppercase tracking-wider"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    You are...
                </motion.p>

                <motion.h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 md:mb-6 bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.2, duration: 0.5 }}

                >
                    {data.blueskyPersonality.personalityType}
                </motion.h2>

                <motion.p className="text-base md:text-lg  text-white/80 leading-relaxed max-w-2xl"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.2, duration: 0.5 }}

                >
                    {data.blueskyPersonality.description}
                </motion.p>
            </motion.div>
        </div>
    )

}