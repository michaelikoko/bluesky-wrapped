import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { ExtractedData } from "./types";

export function generateWrappedImagesUrl(data: ExtractedData, profileDetails: ProfileViewDetailed): {
    url: string,
    downloadName: string
}[] {
    const yearNumbersImageUrl = `/api/pics/year-numbers?handle=${encodeURIComponent(profileDetails.handle)}&posts=${encodeURIComponent(data.totalPostsMadeByUser)}&replies=${encodeURIComponent(data.totalRepliesMadeByUser)}&reposts=${encodeURIComponent(data.totalRepostsMadeByUser)}&quotes=${encodeURIComponent(data.totalQuotesMadeByUser)}&engagement=${encodeURIComponent(data.totalLikesReceivedByUser + data.totalRepliesReceivedByUser + data.totalRepostsReceivedByUser + data.totalQuotesReceivedByUser)}&words=${encodeURIComponent(data.totalWordsUsedByUser)}`

    const bestMomentsImageUrl = `/api/pics/best-moments?handle=${encodeURIComponent(profileDetails.handle)}&topPostText=${encodeURIComponent(data.mostEngagedPost?.textContent || '')}&topPostEngagement=${encodeURIComponent(data.mostEngagedPost?.totalEngagement || 0)}&mostActiveMonth=${encodeURIComponent(data.mostActiveMonth || '')}&mostActiveMonthCount=${encodeURIComponent(data.monthlyActivityByUser.find(month => month.month === data.mostActiveMonth)?.totalActivities || 0)}&mostEngagedMonth=${encodeURIComponent(data.mostEngagedMonth || '')}&mostEngagedMonthCount=${encodeURIComponent(data.monthlyEngagementsReceivedByUser.find(month => month.month === data.mostEngagedMonth)?.totalEngagements || 0)}`

    const interestsImageUrl = `/api/pics/interests?handle=${encodeURIComponent(profileDetails.handle)}&topHashtags=${encodeURIComponent(JSON.stringify(data.mostUsedTop5Hashtags))}&topWords=${encodeURIComponent(JSON.stringify(data.mostUsedWords))}`

    const communityImageUrl = `/api/pics/community?handle=${encodeURIComponent(profileDetails.handle)}&topAccounts=${encodeURIComponent(JSON.stringify(data.topInteractedAccounts))}`

    const personalityImageUrl = `/api/pics/personality?personalityType=${encodeURIComponent(data.blueskyPersonality?.personalityType || '')}&description=${encodeURIComponent(data.blueskyPersonality?.description || '')}&handle=${encodeURIComponent(profileDetails.handle)}`


    return [
        { url: yearNumbersImageUrl, downloadName: 'bluesky-wrapped-2025-year-numbers.webp' },
        { url: bestMomentsImageUrl, downloadName: 'bluesky-wrapped-2025-best-moments.webp' },
        { url: interestsImageUrl, downloadName: 'bluesky-wrapped-2025-interests.webp' },
        { url: communityImageUrl, downloadName: 'bluesky-wrapped-2025-community.webp' },
        { url: personalityImageUrl, downloadName: 'bluesky-wrapped-2025-personality.webp' }
    ]
}