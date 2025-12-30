'use client'

import { CircleAlert, LucideIcon } from "lucide-react"

interface ErrorProps {
    errorIcon?: LucideIcon
    errorTitle?: string
    errorMessage?: string
    buttonIcon?: LucideIcon
    buttonText?: string
    onButtonClick?: () => void
}

export default function ErrorComponent({
    errorIcon: ErrorIcon,
    errorTitle,
    errorMessage,
    buttonIcon: ButtonIcon,
    buttonText,
    onButtonClick
}: ErrorProps) {
    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-linear-to-b from-base-100 to-base-200">
            <div className="flex flex-col items-center max-w-md text-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 blur-2xl opacity-20 bg-error rounded-full"></div>
                    {
                        ErrorIcon ? <ErrorIcon className="size-16 md:size-20 text-error relative" /> :
                            <CircleAlert className="size-16 md:size-20 text-error relative" />
                    }
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                        {
                            errorTitle || 'Oops! Something went wrong'
                        }
                    </h1>
                    <p className="text-base md:text-lg text-base-content/70">
                        {
                            errorMessage || 'An unexpected error occurred. Please try again.'
                        }
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary rounded-md gap-2 px-6"
                    onClick={() => {
                        if (onButtonClick) onButtonClick()
                        window.location.reload()
                    }}
                >
                    {
                        ButtonIcon && <ButtonIcon className="size-5" />
                    }
                    {
                        buttonText || 'Refresh'
                    }
                </button>
            </div>
        </main>)
}