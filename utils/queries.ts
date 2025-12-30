import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs"
import blueskyAgent from "./blueskyAgent"

export async function searchAccountsByUsername({ queryKey }: { queryKey: [string, string] }) {
    const [, username] = queryKey
    const result = (await blueskyAgent.searchActors({ q: username, limit: 10 })).data
    return result
}

export async function getProfileByUsername({ queryKey }: { queryKey: [string, string] }) {
    const [, username] = queryKey
    const profile = (await blueskyAgent.getProfile({ actor: username })).data
    return profile
}

export async function getUserFeed({ queryKey, onProgress }: { queryKey: [string, string], onProgress?: (fetchedPosts: number) => void }) {
    const [, userDid] = queryKey
    if (!userDid) {
        throw new Error('User DID is required to fetch user feed')
    }

    let userFeed: FeedViewPost[] = []
    let cursor: string | undefined = undefined
    const yearTarget = 2025

    while (true) {
        try {
            const result = await blueskyAgent.getAuthorFeed({ actor: userDid, includePins: false, cursor: cursor, limit: 100 })

            const { feed, cursor: nextCursor } = result.data

            const feed2025 = feed.filter(feedObject => {
                const postDate = new Date(feedObject.post.indexedAt)
                return postDate.getFullYear() === yearTarget
            })

            userFeed = [...userFeed, ...feed2025]

            if (onProgress) onProgress(userFeed.length) // Call the progress callback, which updates the state in the component on the number of posts fetched

            //console.log('Next Cursor:', nextCursor)
            //console.log('Current cursor:', cursor)
            //console.log(`Fetched ${userFeed.length} posts from 2025 so far...`)

            if (!nextCursor || new Date(nextCursor).getFullYear() < yearTarget) break
            cursor = nextCursor

            await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
            //console.error('Error fetching user feed:', error)
            if (userFeed.length === 0) throw error
            break
        }
    }

    return userFeed
}