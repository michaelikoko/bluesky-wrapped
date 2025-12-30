'use client'

interface LoadingProps {
    title?: string
    subtitle?: string
}

export default function Loading({ title, subtitle }: LoadingProps) {
    return (
            <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-linear-to-b from-base-100 to-base-200">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 blur-3xl opacity-30 bg-secondary rounded-full scale-150"></div>
                        <span className="loading loading-bars loading-lg text-secondary relative"></span>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                        <span className="text-base md:text-lg font-medium text-base-content text-center">
                            {title || 'Loading...'}
                        </span>
                        <span className="text-xs md:text-sm text-base-content/60 text-center">
                            {subtitle || 'This will only take a moment'}
                        </span>
                    </div>
                </div>
            </main>
    )
}