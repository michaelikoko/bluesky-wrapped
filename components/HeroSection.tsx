/* eslint-disable @next/next/no-img-element */
'use client'

import { searchAccountsByUsername } from '@/utils/queries'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HeroSection() {
    const [username, setUsername] = useState('')
    const [isNavigating, setIsNavigating] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim()) return

        setIsNavigating(true)
        router.push(`/${username.trim()}`)
        setIsNavigating(false)
    }

    const { data: suggestedProfiles, isLoading: isSuggestionsLoading, isError: isSuggestionsError } = useQuery({
        queryKey: ['searchAccountsByUsername', username],
        queryFn: searchAccountsByUsername,
        enabled: username.length > 0,
    })
    return (
        <div className="flex flex-col items-center justify-center w-full md:w-10/12 h-svh gap-6">
            <div className="text-5xl md:text-6xl text-center font-bold">
                Your Year on <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bluesky inline size-12 md:size-15 me-1 text-secondary" viewBox="0 0 16 16">
  <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948"/>
</svg>
                    Bluesky</span>, <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-accent">Unwrapped</span>
            </div>

            <div className="text-center text-sm md:text-base text-base-content/60 px-8 md:px-14">
                Generate your personalized year-in-review story in seconds. Share your stats, top followers, and best moments.
            </div>

            <div className="w-full max-w-2xl px-4 relative">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-row gap-3 items-center">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setShowSuggestions(true);
                                setUsername(e.target.value)
                            }}
                            placeholder="username.bsky.social"
                            disabled={isNavigating}
                            className="input input-bordered rounded-md input-lg flex-1 focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!username.trim() || isNavigating}
                            className="btn btn-secondary btn-lg whitespace-nowrap rounded-md disabled:bg-secondary/25"
                        >
                            {isNavigating ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                </>
                            ) : (
                                <ArrowRight />
                            )}
                        </button>
                    </div>
                </form>

                {showSuggestions && username.length > 0 && !isSuggestionsError && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-base-100 rounded-box shadow-lg z-50  overflow-y-auto">
                        {isSuggestionsLoading ? (
                            <div className="flex items-center justify-center h-55">
                                <span className="loading loading-bars loading-lg text-secondary"></span>
                            </div>
                        ) : suggestedProfiles && suggestedProfiles.actors.length > 0 ? (
                            <ul className="py-2 h-55">
                                {suggestedProfiles.actors.map((actor) => (
                                    <li
                                        key={actor.did}
                                        onClick={() => {
                                            setShowSuggestions(false);
                                            setUsername(actor.handle);
                                        }}
                                        className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-base-200 transition-colors"
                                    >
                                        <img
                                            src={actor.avatar}
                                            alt={actor.displayName || actor.handle}
                                            className="w-10 h-10 rounded-full object-cover shrink-0 avatar"
                                        />
                                        <div className="flex flex-col min-w-0 flex-1">
                                            {actor.displayName && (
                                                <span className="font-medium truncate">
                                                    {actor.displayName}
                                                </span>
                                            )}
                                            <span className="text-sm text-base-content/60 truncate">
                                                @{actor.handle}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                )}
            </div>

            <div className="text-xs text-base-content/40 text-center">
                No login required • Public data only
            </div>
        </div>
    )
}