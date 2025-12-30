/* eslint-disable @next/next/no-img-element */
'use client'

import ErrorComponent from "@/components/ErrorComponent"
import Loading from "@/components/Loading"
import WrappedStories from "@/components/WrappedStories"
//import { testExtractedData } from "@/testExtractedData"
import { extractDataFromFeed } from "@/utils/extractData"
import { generateWrappedImagesUrl } from "@/utils/generateWrappedImagesUrl"
import getBlueskyComposeUrl from "@/utils/getBlueskyComposeUrl"
import { getProfileByUsername, getUserFeed } from "@/utils/queries"
import { ExtractedData } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, CircleAlert, CloudAlert, Download, RotateCcw, Share2, Sparkles } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from "react"

export default function WrappedPage() {
    const { username } = useParams<{ username: string }>()
    const router = useRouter()
    const [totalPostFetched, setTotalPostFetched] = useState<number>(0)

    const [showStories, setShowStories] = useState<boolean>(!false)

    const setProgressCallback = useCallback((fetchedPosts: number) => {
        // Update the state with the number of posts fetched so far
        setTotalPostFetched(fetchedPosts)
    }, [])

    useEffect(() => {
        // Remove vertical scroll when stories are open
        if (showStories) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [showStories])

    const { data: profileDetails, isLoading: isProfileLoading, isError: isProfileError } = useQuery({
        queryKey: ['getProfileByUsername', username],
        queryFn: getProfileByUsername,
        enabled: username.length > 1,
    })

    const { data: userFeed, isLoading: isUserFeedLoading, isError: isUserFeedError, refetch: refetchUserFeed } = useQuery({
        queryKey: ['getUserFeed', profileDetails?.did || ''],
        queryFn: () => getUserFeed({ queryKey: ['getUserFeed', profileDetails?.did || ''], onProgress: setProgressCallback }),
        enabled: !!profileDetails?.did,
    })

    const {
        data: extractedData,
        isLoading: isExtractedDataLoading,
        isError: isExtractedDataError,
    } = useQuery({
        queryKey: ['extractDataFromFeed', userFeed, profileDetails?.did || ''],
        queryFn: () => extractDataFromFeed(userFeed || [], profileDetails?.did || ''),
        //queryFn: () => testExtractedData(), // For dev purpose to avoid hitting rate limits
        enabled: !!userFeed && !!profileDetails?.did,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    })

    const handleDownloadImage = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            //console.error('Error downloading image:', error);
        }
    };

    //console.log('profileDetails:', { profileDetails, isProfileLoading, isProfileError })
    //console.log('userFeed:', { userFeed, isUserFeedLoading, isUserFeedError })
    //console.log('totalPostFetched:', totalPostFetched)

    if (isProfileLoading) return <Loading title="Confirming Bluesky Account" />
    if (isUserFeedLoading) return <Loading title="Loading your feed..." subtitle={`Fetched ${totalPostFetched} posts so far...`} />
    if (isExtractedDataLoading) return <Loading title="Analyzing your activity..." />

    if (isProfileError || !profileDetails || username.length === 1) {
        return <ErrorComponent errorIcon={CircleAlert} errorTitle="Oops! Something went wrong" errorMessage="Invalid Bluesky username. Please go back and try again." buttonIcon={ArrowLeft} buttonText="Go Back" onButtonClick={() => router.push('/')} />
    }

    if (isUserFeedError) {
        return <ErrorComponent errorIcon={CloudAlert} errorTitle="Oops! Error loading feed" errorMessage="Failed to load user feed. Please try again." buttonIcon={RotateCcw} buttonText="Retry" onButtonClick={() => refetchUserFeed()} />
    }

    if (isExtractedDataError || !extractedData) {
        return <ErrorComponent errorIcon={CircleAlert} errorTitle="Oops! Something went wrong" errorMessage="Failed to analyze your feed data. Please try again." buttonIcon={RotateCcw} buttonText="Retry" onButtonClick={() => router.refresh()} />
    }

    //console.log('extractedData:', extractedData)
    const data: ExtractedData = extractedData as ExtractedData

    const wrappedImagesUrls = generateWrappedImagesUrl(data, profileDetails)
    //console.log('wrappedImagesUrls:', wrappedImagesUrls)
    const blueskyComposeUrl = getBlueskyComposeUrl(data)
    return (
        <main className="w-full min-h-screen">
            {showStories && <WrappedStories closeStories={() => setShowStories(false)} extractedData={data} />}

            <section className="h-screen px-4 py-6 md:px-8 md:py-12 lg:px-16 lg:py-16 flex items-center justify-center">
                <div className="relative flex flex-col items-center justify-center w-full h-full max-w-4xl mx-auto">
                    <div className="relative z-10 flex flex-col items-center text-center">

                        <div className="mb-6 md:mb-8">
                            <div className="relative">
                                <img
                                    src={profileDetails.avatar}
                                    alt={`${profileDetails.displayName}'s avatar`}
                                    className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full object-cover ring-4 ring-secondary ring-offset-4 ring-offset-base-100 shadow-xl"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-secondary rounded-full p-2 shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-white" viewBox="0 0 16 16">
                                        <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{profileDetails.displayName}</h1>
                        <p className="text-sm md:text-base text-base-content/60 mb-8">@{profileDetails.handle}</p>


                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 flex items-center justify-center flex-wrap gap-2">
                            <span>Your 2025 on </span>

                            <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary via-accent to-primary">
                                Bluesky
                            </span>
                        </h2>


                        <p className="text-sm md:text-base lg:text-lg text-base-content/60 mb-8 max-w-md px-4">
                            Dive into your year on Bluesky
                        </p>

                        <button
                            type="button"
                            className="btn btn-primary btn-md md:btn-lg rounded-full px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 gap-2"
                            onClick={() => setShowStories(true)}
                        >
                            <Sparkles className="w-5 h-5" />
                            View Your Story
                        </button>
                    </div>
                </div>
            </section>

            <section className="bg-base-200 rounded-t-4xl py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-16 flex items-center justify-center flex-col gap-5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-base-content mb-2">
                            Your Wrapped Summary
                        </h2>
                        <p className="text-sm md:text-base text-base-content/60">
                            Download and share your year in review
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {wrappedImagesUrls.map((image, index) => (
                            <div
                                key={index}
                                className="group relative bg-base-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                            >
                                <img
                                    src={image.url}
                                    alt={`Wrapped summary ${index + 1}`}
                                    className="w-full h-auto aspect-square object-cover"
                                />

                                {/* Overlay with Download Button */}
                                {/*                                
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => handleDownloadImage(url, `bluesky-wrapped-2025-${imageNames[index]}.png`)}
                                        className="btn btn-primary btn-circle btn-lg shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
                                        aria-label="Download image"
                                    >
                                        <Download className="w-6 h-6" />
                                    </button>
                                </div>
                                */}

                                <button
                                    onClick={() => handleDownloadImage(image.url, image.downloadName)}
                                    className="absolute bottom-3 right-3 btn btn-primary btn-sm btn-circle shadow-lg"
                                    aria-label="Download image"
                                    type="button"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <a href={blueskyComposeUrl} target="_blank" rel="noopener noreferrer" className="hover:no-underline">
                    <button
                        type="button"
                        className="btn btn-accent btn-md md:btn-lg rounded-full px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 gap-2"

                    >
                        <Share2 className="w-5 h-5" />
                        Share
                    </button>
                </a>
            </section>
        </main>
    )
}