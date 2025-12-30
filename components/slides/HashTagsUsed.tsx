'use client'

import { SlideComponentProps } from "@/utils/types"
import { Hash } from "lucide-react"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { motion } from "motion/react"
import { storyAnimations } from "@/utils/animations"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export default function HashTagsUsed({ data: extractedData, isActive }: SlideComponentProps) {
    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    font: {
                        size: 11,
                    },
                },
            },
        },
    }

    const labels = extractedData.mostUsedTop5Hashtags.map(
        tagObj => `#${tagObj.tag}`
    )

    const barChartData = {
        labels,
        datasets: [
            {
                label: 'Usage count',
                data: extractedData.mostUsedTop5Hashtags.map(
                    tagObj => tagObj.usageCount
                ),
                backgroundColor: 'rgba(139, 194, 255, 0.8)',
                borderRadius: 6,
                barThickness: 18,
            },
        ],
    }

    if (!isActive) {
        return <div className='w-full min-h-svh'></div>;
    }

    return (
        <div className="w-full min-h-svh flex items-center justify-center p-3 md:p-6">
            <motion.div className="w-full max-w-3xl flex flex-col"
                {...storyAnimations.fadeInUp}
                transition={{ delay: 0.2, duration: 0.5 }}

            >
                <motion.div className="text-center mb-3 md:mb-4"
                    {...storyAnimations.fadeIn}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        <Hash className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                        Your most used hashtag
                    </h2>
                </motion.div>

                {extractedData.mostUsedHashtag ? (
                    <motion.div className="text-center mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                    >
                        <h3 className="text-5xl sm:text-6xl md:text-7xl font-bold text-secondary mb-1">
                            #{extractedData.mostUsedHashtag.tag}
                        </h3>
                        <p className="text-sm md:text-base text-white/60">
                            Used {extractedData.mostUsedHashtag.usageCount.toLocaleString()} times
                        </p>
                    </motion.div>
                ) : (
                    <motion.div className="text-center text-white/60 mb-4"
                        {...storyAnimations.fadeIn}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <p className="text-base md:text-lg">
                            You did not use any hashtags in your posts this year.
                            </p>
                    </motion.div>
                )}

                {
                    extractedData.mostUsedHashtag && (

                        <motion.div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 h-64 md:h-80"
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                        >
                            <Bar options={options} data={barChartData} />
                        </motion.div>
                    ) 
                }
            </motion.div>
        </div>
    )
}
