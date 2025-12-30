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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from "motion/react"
import { storyAnimations } from "@/utils/animations"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function PeakActivityMonth({ data: extractedData, isActive }: SlideComponentProps) {
    const options = {
        plugins: {
            title: {
                display: false,
            }
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
    };

    const labels = monthsOfTheYear.map(month => month.slice(0, 3)); // Abbreviated months

    const barChartData = {
        labels,
        datasets: [
            {
                label: 'Posts',
                data: monthsOfTheYear.map((month) => {
                    return extractedData.monthlyActivityByUser.find(m => m.month === month)?.postsMadeByUser || 0
                }),
                backgroundColor: 'rgba(229, 24, 117, 0.8)',
            },
            {
                label: 'Replies',
                data: monthsOfTheYear.map((month) => {
                    return extractedData.monthlyActivityByUser.find(m => m.month === month)?.repliesMadeByUser || 0
                }),
                backgroundColor: 'rgba(139, 194, 255, 0.8)',
            },
            {
                label: 'Reposts',
                data: monthsOfTheYear.map((month) => {
                    return extractedData.monthlyActivityByUser.find(m => m.month === month)?.repostsMadeByUser || 0
                }),
                backgroundColor: 'rgba(44, 163, 59, 0.8)',
            },
            {
                label: 'Quotes',
                data: monthsOfTheYear.map((month) => {
                    return extractedData.monthlyActivityByUser.find(m => m.month === month)?.quotesMadeByUser || 0
                }),
                backgroundColor: 'rgba(255, 181, 103, 0.8)',
            }
        ]
    }

    const mostActiveMonthData = extractedData.monthlyActivityByUser.find(
        m => m.month === extractedData.mostActiveMonth
    );

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
                        Your peak month
                    </h2>
                </motion.div>

                {extractedData.mostActiveMonth ? (
                    <motion.div
                        className="text-center mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                    >
                        <h3 className="text-5xl sm:text-6xl md:text-7xl font-bold text-secondary mb-1">
                            {extractedData.mostActiveMonth}
                        </h3>
                        <p className="text-sm md:text-base text-white/60">
                            {mostActiveMonthData?.totalActivities.toLocaleString()} activities
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center text-white/60 mb-4"
                        {...storyAnimations.fadeIn}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <p className="text-base md:text-lg">No posting activity data available.</p>
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
