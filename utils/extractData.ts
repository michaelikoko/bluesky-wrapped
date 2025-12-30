import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { AnalyzeBlueskyPersonalityFunctionParameter, BlueskyPersonality, ExtractedData, InteractedAccountProfile, MonthlyActivityByUser, MonthlyEngagementsReceivedByUser, monthsOfTheYear, MostEngagedPostData, PostCategory } from "./types";
import { removeStopwords } from 'stopword'
import { analyzeBlueskyPersonality } from "./analyseBlueskyPersonality";


export function categorizePost(feedObj: FeedViewPost, userDid: ProfileViewDetailed['did']): PostCategory | null {
    const isUserAuthor = feedObj.post.author.did === userDid;

    if (feedObj.reason && feedObj.reason.$type === 'app.bsky.feed.defs#reasonRepost') return 'REPOST';

    if (isUserAuthor && feedObj.reply) return 'REPLY';

    if (isUserAuthor && feedObj.post.embed && feedObj.post.embed.$type === 'app.bsky.embed.record#view') return 'QUOTE';

    if (isUserAuthor && feedObj.post.record.$type === 'app.bsky.feed.post') return 'POST';

    return null;
}

export async function extractDataFromFeed(userFeed: FeedViewPost[], userDid: ProfileViewDetailed['did']): Promise<ExtractedData> {
    let totalPostsMadeByUser = 0;
    let totalRepliesMadeByUser = 0;
    let totalRepostsMadeByUser = 0;
    let totalQuotesMadeByUser = 0;

    let totalLikesReceivedByUser = 0;
    let totalRepostsReceivedByUser = 0;
    let totalRepliesReceivedByUser = 0;
    let totalQuotesReceivedByUser = 0;
    let totalBookmarksReceivedByUser = 0;

    const allUserPosts: MostEngagedPostData[] = []; // Array to collect all posts for ranking

    const months = monthsOfTheYear
    const monthlyActivityByUser: MonthlyActivityByUser[] = months.map(month => ({
        month: month,
        postsMadeByUser: 0,
        repliesMadeByUser: 0,
        repostsMadeByUser: 0,
        quotesMadeByUser: 0,
        totalActivities: 0,
    }));

    const monthlyEngagementsReceivedByUser: MonthlyEngagementsReceivedByUser[] = months.map(month => ({
        month: month,
        likesReceivedByUser: 0,
        repostsReceivedByUser: 0,
        repliesReceivedByUser: 0,
        quotesReceivedByUser: 0,
        bookmarksReceivedByUser: 0,
        totalEngagements: 0,
    }));

    const hashTagUsageMap: Map<string, number> = new Map();

    const accountInteractionsMap: Map<string, InteractedAccountProfile> = new Map();

    let totalWordCount = 0;
    const wordCountMap: Map<string, number> = new Map();

    function addEngagementsFromPost(feedObj: FeedViewPost) {
        totalLikesReceivedByUser += feedObj.post.likeCount || 0;
        totalRepostsReceivedByUser += feedObj.post.repostCount || 0;
        totalRepliesReceivedByUser += feedObj.post.replyCount || 0;
        totalQuotesReceivedByUser += feedObj.post.quoteCount || 0;
        totalBookmarksReceivedByUser += feedObj.post.bookmarkCount || 0;

        /*
        console.log(`post engagements added for post:, ${feedObj.post.uri} likes: ${feedObj.post.likeCount}, reposts: ${feedObj.post.repostCount}, replies: ${feedObj.post.replyCount}, quotes: ${feedObj.post.quoteCount}, bookmarks: ${feedObj.post.bookmarkCount}`);
        */
    }

    function addToAllUserPosts(feedObj: FeedViewPost) {
        const post = feedObj.post;
        const likeCount = post.likeCount || 0;
        const replyCount = post.replyCount || 0;
        const repostCount = post.repostCount || 0;
        const quoteCount = post.quoteCount || 0;
        const bookmarkCount = post.bookmarkCount || 0;

        /*// @ts-expect-error: Ignore TS error for embed type checking, images is not include in the embed object type definition
        const embeddedImagesUrls = post.embed && post.embed.$type === 'app.bsky.embed.images#view' ? post.embed.images.map(img => img.thumb) : undefined;
        */

        // Show images for image embed, else show the thumbnails for other embed types if available
        let embeddedImagesUrls: string | undefined = undefined;
        if (post.embed) {
            // @ts-expect-error: Ignore TS error for embed type checking, images is not include in the embed object type definition
            if (post.embed.$type === 'app.bsky.embed.images#view' && post.embed.images.length > 0) {
                // @ts-expect-error: Ignore TS error for embed type checking, images is not include in the embed object type definition
                embeddedImagesUrls = post.embed.images[0].thumb;


            }
            // @ts-expect-error: Ignore TS error for embed type checking, thumbnail is not include in the embed object type definition 
            else if (post.embed.$type === 'app.bsky.embed.video#view' && post.embed.thumbnail) {
                // @ts-expect-error: Ignore TS error for embed type checking, thumbnail is not include in the embed object type definition
                embeddedImagesUrls = post.embed.thumbnail;
            } 
            // @ts-expect-error: Ignore TS error for embed type checking, thumbnail is not include in the embed object type definition
            else if (post.embed.$type === 'app.bsky.embed.external#view' && post.embed.external && post.embed.external.thumb) {
                // @ts-expect-error: Ignore TS error for embed type checking, thumbnail is not include in the embed object type definition
                embeddedImagesUrls = post.embed.external.thumb;
            }

        }

        //console.log(post.embed)
        //console.log(embeddedImagesUrls)
        
        allUserPosts.push({
            userAvatarUrl: post.author.avatar,
            userHandle: post.author.handle,
            userDisplayName: post.author.displayName,
            uri: post.uri,
            createdAt: post.indexedAt,
            textContent: post.record.text as string || '',
            embeddedImagesUrls,
            likeCount,
            replyCount,
            repostCount,
            quoteCount,
            bookmarkCount,
            totalEngagement: likeCount + replyCount + repostCount + quoteCount + bookmarkCount
        });
    }

    function inputFeedDataToMonthlyActivityByUser(feedObj: FeedViewPost, category: PostCategory) {
        const createdAt = new Date(feedObj.post.indexedAt)
        const monthIndex = createdAt.getMonth(); // 0 = January, 1 = February, ..., 11 = December

        monthlyActivityByUser[monthIndex].totalActivities++;
        switch (category) {
            case 'POST':
                monthlyActivityByUser[monthIndex].postsMadeByUser++;
                break;
            case 'REPLY':
                monthlyActivityByUser[monthIndex].repliesMadeByUser++;
                break;
            case 'REPOST':
                monthlyActivityByUser[monthIndex].repostsMadeByUser++;
                break;
            case 'QUOTE':
                monthlyActivityByUser[monthIndex].quotesMadeByUser++;
                break;
        }
    }

    function inputFeedDataToMonthlyEngagementsReceivedByUser(feedObj: FeedViewPost) {
        const createdAt = new Date(feedObj.post.indexedAt)
        const monthIndex = createdAt.getMonth(); // 0 = January, 1 = February, ..., 11 = December

        monthlyEngagementsReceivedByUser[monthIndex].likesReceivedByUser += feedObj.post.likeCount || 0;
        monthlyEngagementsReceivedByUser[monthIndex].repostsReceivedByUser += feedObj.post.repostCount || 0;
        monthlyEngagementsReceivedByUser[monthIndex].repliesReceivedByUser += feedObj.post.replyCount || 0;
        monthlyEngagementsReceivedByUser[monthIndex].quotesReceivedByUser += feedObj.post.quoteCount || 0;
        monthlyEngagementsReceivedByUser[monthIndex].bookmarksReceivedByUser += feedObj.post.bookmarkCount || 0;

        monthlyEngagementsReceivedByUser[monthIndex].totalEngagements +=
            (feedObj.post.likeCount || 0) +
            (feedObj.post.repostCount || 0) +
            (feedObj.post.replyCount || 0) +
            (feedObj.post.quoteCount || 0) +
            (feedObj.post.bookmarkCount || 0);
    }

    function extractHashtagsFromFeed(feedObj: FeedViewPost) {
        const facets = feedObj.post.record.facets;
        if (!facets) return

        // @ts-expect-error: Ignore TS error for facet type checking, tag is not include in the facet object type definition by atproto
        facets.forEach(facet => {
            if (facet.features[0]?.$type === 'app.bsky.richtext.facet#tag') {
                const tag = facet.features[0].tag.toLowerCase();
                const currentCount = hashTagUsageMap.get(tag) || 0;
                hashTagUsageMap.set(tag, currentCount + 1);
            }
        })
    }

    function addAccountInteraction(author: FeedViewPost['post']['author']) {
        if (!author) return;
        if (author.did === userDid) return; // Skip self


        const existingInteraction = accountInteractionsMap.get(author.did);

        if (existingInteraction) existingInteraction.interactionCount++;
        else {
            accountInteractionsMap.set(author.did, {
                did: author.did,
                handle: author.handle,
                displayName: author.displayName,
                avatarUrl: author.avatar,
                interactionCount: 1,
            });
        }
    }

    function extractWordsFromPost(feedObj: FeedViewPost) {
        const text = feedObj.post.record.text as string;
        if (!text) return;

        const wordsArray = text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 0);
        const filteredWordsArray = removeStopwords(wordsArray).filter(word => word.length > 1); // Remove stopwords and short words

        totalWordCount += filteredWordsArray.length

        filteredWordsArray.forEach(word => {
            const currentCount = wordCountMap.get(word) || 0;
            wordCountMap.set(word, currentCount + 1);
        });
    }


    userFeed.forEach(feedObj => {
        const category = categorizePost(feedObj, userDid);

        switch (category) {
            case 'POST':
                totalPostsMadeByUser++;
                addEngagementsFromPost(feedObj);
                addToAllUserPosts(feedObj);
                inputFeedDataToMonthlyActivityByUser(feedObj, category);
                inputFeedDataToMonthlyEngagementsReceivedByUser(feedObj);
                extractHashtagsFromFeed(feedObj);
                extractWordsFromPost(feedObj);
                break;
            case 'REPLY':
                totalRepliesMadeByUser++;
                addEngagementsFromPost(feedObj);
                addToAllUserPosts(feedObj);
                inputFeedDataToMonthlyActivityByUser(feedObj, category);
                inputFeedDataToMonthlyEngagementsReceivedByUser(feedObj);
                extractHashtagsFromFeed(feedObj);
                // @ts-expect-error: .reply.root.author is not included in the embed type definition by atproto
                addAccountInteraction(feedObj.reply?.root.author)
                extractWordsFromPost(feedObj);
                break;
            case 'REPOST':
                totalRepostsMadeByUser++;
                inputFeedDataToMonthlyActivityByUser(feedObj, category);
                addAccountInteraction(feedObj.post.author);
                break;
            case 'QUOTE':
                totalQuotesMadeByUser++;
                addEngagementsFromPost(feedObj);
                addToAllUserPosts(feedObj);
                inputFeedDataToMonthlyActivityByUser(feedObj, category);
                inputFeedDataToMonthlyEngagementsReceivedByUser(feedObj);
                extractHashtagsFromFeed(feedObj);
                // @ts-expect-error: .record.author is not included in the embed type definition by atproto
                addAccountInteraction(feedObj.post.embed?.record.author)
                extractWordsFromPost(feedObj);
                break;
        }
    })


    function getFallbackPersonality(data: AnalyzeBlueskyPersonalityFunctionParameter): BlueskyPersonality {
        const replyRatio = data.totalRepliesMadeByUser / (data.totalPostsMadeByUser + data.totalRepliesMadeByUser);
        const repostRatio = data.totalRepostsMadeByUser / (data.totalPostsMadeByUser + data.totalRepostsMadeByUser + data.totalRepliesMadeByUser);

        if (replyRatio > 0.4) {
            return {
                personalityType: "The Conversationalist",
                description: "You thrive on dialogue! Nearly half your activity is engaging in thoughtful discussions with others."
            };
        } else if (repostRatio > 0.3) {
            return {
                personalityType: "The Curator",
                description: "You're the ultimate content curator, consistently sharing gems from across Bluesky for your followers to discover."
            };
        } else {
            return {
                personalityType: "The Balanced Poster",
                description: "You mix it all—original posts, engaging conversations, and sharing great content. A true Bluesky all-rounder!",
            };
        }
    }


    allUserPosts.sort((a, b) => b.totalEngagement - a.totalEngagement);

    const mostEngagedPost = allUserPosts.length > 0 ? allUserPosts[0] : null;
    const mostEngagedTop5Posts = allUserPosts.slice(0, 5);

    const sortedMonthlyActivityByUser = [...monthlyActivityByUser].sort((a, b) => b.totalActivities - a.totalActivities);
    const mostActiveMonth = sortedMonthlyActivityByUser.length > 0 && sortedMonthlyActivityByUser[0].totalActivities > 0 ? sortedMonthlyActivityByUser[0].month : null;

    const sortedMonthlyEngagementsReceivedByUser = [...monthlyEngagementsReceivedByUser].sort((a, b) => b.totalEngagements - a.totalEngagements);
    const mostEngagedMonth = sortedMonthlyEngagementsReceivedByUser.length > 0 && sortedMonthlyEngagementsReceivedByUser[0].totalEngagements > 0 ? sortedMonthlyEngagementsReceivedByUser[0].month : null;


    const sortedHashtagUsage = Array.from(hashTagUsageMap.entries()).sort((a, b) => b[1] - a[1]).map(([tag, usageCount]) => ({ tag, usageCount }));
    const mostUsedHashtag = sortedHashtagUsage.length > 0 ? sortedHashtagUsage[0] : null;
    const mostUsedTop5Hashtags = sortedHashtagUsage.slice(0, 5);

    const sortedInteractedAccounts = Array.from(accountInteractionsMap.values()).sort((a, b) => b.interactionCount - a.interactionCount).slice(0, 7).map((account) => account);
    const mostInteractedAccount = sortedInteractedAccounts.length > 0 ? sortedInteractedAccounts[0] : null;

    const totalPostQuotesReplies = totalPostsMadeByUser + totalQuotesMadeByUser + totalRepliesMadeByUser;
    const wordsPerPostAverage = totalPostQuotesReplies > 0 ? Math.round(totalWordCount / totalPostQuotesReplies) : 0;
    const mostUsedWords = Array.from(wordCountMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([word, count]) => ({ word, count }));


    let blueskyPersonality: BlueskyPersonality | null = null;
    try {
        blueskyPersonality = await analyzeBlueskyPersonality({
            totalPostsMadeByUser,
            totalRepliesMadeByUser,
            totalRepostsMadeByUser,
            totalQuotesMadeByUser,
            topHashtags: mostUsedTop5Hashtags,
            topWords: mostUsedWords,
        }, mostEngagedTop5Posts);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        //console.error("Error analyzing Bluesky personality:", error);
        blueskyPersonality = getFallbackPersonality({
            totalPostsMadeByUser,
            totalRepliesMadeByUser,
            totalRepostsMadeByUser,
            totalQuotesMadeByUser,
            topHashtags: mostUsedTop5Hashtags,
            topWords: mostUsedWords,
        });
    }

    return {
        totalPostsMadeByUser,
        totalRepliesMadeByUser,
        totalRepostsMadeByUser,
        totalQuotesMadeByUser,
        totalLikesReceivedByUser,
        totalRepostsReceivedByUser,
        totalRepliesReceivedByUser,
        totalQuotesReceivedByUser,
        totalBookmarksReceivedByUser,
        mostEngagedPost,
        mostEngagedTop5Posts,
        mostActiveMonth,
        monthlyActivityByUser,
        mostEngagedMonth,
        monthlyEngagementsReceivedByUser,
        mostUsedHashtag,
        mostUsedTop5Hashtags,
        allHashtags: sortedHashtagUsage,
        mostInteractedAccount,
        topInteractedAccounts: sortedInteractedAccounts,
        totalWordsUsedByUser: totalWordCount,
        wordsPerPostAverage,
        mostUsedWords,
        blueskyPersonality,
    }
}