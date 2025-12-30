export type PostCategory = 'POST' | 'REPLY' | 'REPOST' | 'QUOTE';

export interface MostEngagedPostData {
    uri: string;
    createdAt: string;
    textContent: string;
    embeddedImagesUrls?: string
    likeCount: number;
    replyCount: number;
    repostCount: number;
    quoteCount: number;
    bookmarkCount: number;
    totalEngagement: number;
    userAvatarUrl?: string;
    userHandle: string;
    userDisplayName?: string;
}

export const monthsOfTheYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;

export interface MonthlyActivityByUser {
    month: typeof monthsOfTheYear[number];
    postsMadeByUser: number;
    repliesMadeByUser: number;
    repostsMadeByUser: number;
    quotesMadeByUser: number;
    totalActivities: number;
}

export interface MonthlyEngagementsReceivedByUser {
    month: typeof monthsOfTheYear[number];
    likesReceivedByUser: number;
    repostsReceivedByUser: number;
    repliesReceivedByUser: number;
    quotesReceivedByUser: number;
    bookmarksReceivedByUser: number;
    totalEngagements: number;
}

export interface HashTagData {
    tag: string;
    usageCount: number;
}

export interface InteractedAccountProfile {
    did: string;
    handle: string;
    displayName?: string;
    avatarUrl?: string;
    interactionCount: number;
}

export interface WordCountData {
    word: string;
    count: number;
}

export interface BlueskyPersonality {
    personalityType: string;
    description: string;
}

export interface AnalyzeBlueskyPersonalityFunctionParameter {
    totalPostsMadeByUser: number;
    totalRepliesMadeByUser: number;
    totalRepostsMadeByUser: number;
    totalQuotesMadeByUser: number;
    topHashtags: HashTagData[];
    topWords: WordCountData[];
}

export interface ExtractedData {
    // Activity Overview
    totalPostsMadeByUser: number;
    totalRepliesMadeByUser: number;
    totalRepostsMadeByUser: number;
    totalQuotesMadeByUser: number;

    //Engagment Recieived - For only the posts, replies, and quotes made by the user
    totalLikesReceivedByUser: number;
    totalRepostsReceivedByUser: number;
    totalRepliesReceivedByUser: number;
    totalQuotesReceivedByUser: number;
    totalBookmarksReceivedByUser: number;

    // Most Engaged Posts - The post with the highest total engagement (likes + replies + reposts + quotes + bookmarks) made by the user
    mostEngagedPost: MostEngagedPostData | null;
    mostEngagedTop5Posts: MostEngagedPostData[];

    // Monthly Posting Pattern
    mostActiveMonth: MonthlyActivityByUser['month'] | null;
    monthlyActivityByUser: MonthlyActivityByUser[];

    // Monthly Engagements Received
    mostEngagedMonth: MonthlyEngagementsReceivedByUser['month'] | null;
    monthlyEngagementsReceivedByUser: MonthlyEngagementsReceivedByUser[];

    // Hashtag Usage
    mostUsedHashtag: HashTagData | null;
    mostUsedTop5Hashtags: HashTagData[];
    allHashtags: HashTagData[];

    // Your Circle
    mostInteractedAccount: InteractedAccountProfile | null;
    topInteractedAccounts: InteractedAccountProfile[]; // Should be sorted by interaction count descending

    // Words
    totalWordsUsedByUser: number;
    wordsPerPostAverage: number;
    mostUsedWords: WordCountData[];

    // Personality
    blueskyPersonality: BlueskyPersonality | null;
}

export interface SlideComponentProps {
    data: ExtractedData;
    isActive: boolean;
}