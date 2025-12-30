'use client'

import { monthsOfTheYear, SlideComponentProps } from "@/utils/types"
import { Calendar } from "lucide-react"
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

export default function PeakEngagementMonth({ data: extractedData, isActive }: SlideComponentProps) {
    const options = {
        plugins: {
            title: {
                display: false,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                stacked: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                },
            },
        },
    }

    const labels = monthsOfTheYear.map(month => month.slice(0, 3))

    const barChartData = {
        labels,
        datasets: [
            {
                label: 'Likes',
                data: monthsOfTheYear.map(month =>
                    extractedData.monthlyEngagementsReceivedByUser.find(m => m.month === month)
                        ?.likesReceivedByUser || 0
                ),
                backgroundColor: 'rgba(229, 24, 117, 0.8)',
            },
            {
                label: 'Replies',
                data: monthsOfTheYear.map(month =>
                    extractedData.monthlyEngagementsReceivedByUser.find(m => m.month === month)
                        ?.repliesReceivedByUser || 0
                ),
                backgroundColor: 'rgba(139, 194, 255, 0.8)',
            },
            {
                label: 'Reposts',
                data: monthsOfTheYear.map(month =>
                    extractedData.monthlyEngagementsReceivedByUser.find(m => m.month === month)
                        ?.repostsReceivedByUser || 0
                ),
                backgroundColor: 'rgba(44, 163, 59, 0.8)',
            },
            {
                label: 'Quotes',
                data: monthsOfTheYear.map(month =>
                    extractedData.monthlyEngagementsReceivedByUser.find(m => m.month === month)
                        ?.quotesReceivedByUser || 0
                ),
                backgroundColor: 'rgba(255, 181, 103, 0.8)',
            },
            {
                label: 'Bookmarks',
                data: monthsOfTheYear.map(month =>
                    extractedData.monthlyEngagementsReceivedByUser.find(m => m.month === month)
                        ?.bookmarksReceivedByUser || 0
                ),
                backgroundColor: 'rgba(19, 90, 249, 0.8)',
            },
        ],
    }

    const mostEngagedMonthData = extractedData.monthlyEngagementsReceivedByUser.find(
        m => m.month === extractedData.mostEngagedMonth
    )

    if (!isActive) {
        return <div className='w-full min-h-svh'></div>;
    }

    return (
        <div className="w-full min-h-svh flex items-center justify-center p-3 md:p-6">
            <motion.div
                className="w-full max-w-3xl flex flex-col"
                {...storyAnimations.fadeInUp}
                transition={{ delay: 0.2, duration: 0.5 }}
            >

                <motion.div
                    className="text-center mb-3 md:mb-4"
                    {...storyAnimations.fadeIn}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        <Calendar className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                        Your peak engagement month
                    </h2>
                </motion.div>


                {extractedData.mostEngagedMonth ? (
                    <motion.div
                        className="text-center mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                    >
                        <h3 className="text-5xl sm:text-6xl md:text-7xl font-bold text-secondary mb-1">
                            {extractedData.mostEngagedMonth}
                        </h3>
                        <p className="text-sm md:text-base text-white/60">
                            {mostEngagedMonthData?.totalEngagements.toLocaleString()} engagements received
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center text-white/60 mb-4"
                        {...storyAnimations.fadeIn}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <p className="text-base md:text-lg">No engagement data available.</p>
                    </motion.div>
                )}

                <motion.div
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 h-64 md:h-80"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                >
                    <Bar options={options} data={barChartData} />
                </motion.div>
            </motion.div>
        </div>
    )
}
