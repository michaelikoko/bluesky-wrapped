'use client'

import { Share2, Sparkles } from "lucide-react"
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { SlideComponentProps } from "@/utils/types"
import { motion } from 'motion/react'
import { storyAnimations } from "@/utils/animations"
import getBlueskyComposeUrl from "@/utils/getBlueskyComposeUrl"

export default function ThankYou({ data, isActive }: SlideComponentProps) {
    const { width, height } = useWindowSize()

    if (!isActive) {
        return <div className='w-full min-h-svh'></div>;
    }

    const blueskyComposeUrl = getBlueskyComposeUrl(data)

    return (
        <div className="w-full min-h-svh flex items-center justify-center p-4 md:p-8">
            <Confetti
                width={width}
                height={height}
            />
            <motion.div className="flex flex-col items-center text-center max-w-3xl w-full px-4"
                initial="initial"
                animate="animate"
                variants={storyAnimations.staggerContainer}
            >
                <motion.div {...storyAnimations.scalePop}
                    transition={{ delay: 0.2, duration: 0.5 }}

                >
                    <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-secondary mb-4 md:mb-6" />
                </motion.div>

                <motion.h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-3 md:mb-4 leading-tight"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    That&apos;s your <span className="text-primary">2025!</span>
                </motion.h2>

                <motion.p className="text-base md:text-lg text-white/60 mb-6 md:mb-8 max-w-xl"
                    {...storyAnimations.fadeInUp}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    A year of posts, conversations, and moments wrapped.
                </motion.p>

                <a href={blueskyComposeUrl} target="_blank" rel="noopener noreferrer" className="hover:no-underline">
                    <motion.button
                        type="button"
                        className="btn btn-accent btn-lg md:btn-xl rounded-full px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 gap-2"
                        {...storyAnimations.scalePop}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Share2 className="w-5 h-5" />
                        Share your wrapped
                    </motion.button>
                </a>
            </motion.div>
        </div >
    )


}