'use client'
import { ExtractedData } from "./types";

export default function getBlueskyComposeUrl(data: ExtractedData): string {
    const wrappedUrl = typeof window !== 'undefined' ? window.location.href : '';

    const postText = [
        "Just checked out my #BlueskyWrapped for 2025! 🦋✨",
        "",
        `My year on Bluesky in numbers, moments, and connections.`,
        "",
        `${data.totalPostsMadeByUser} posts 📝, ${data.totalLikesReceivedByUser.toLocaleString()} likes ❤️, and I'm "${data.blueskyPersonality?.personalityType}" 👀`,
        "",
        `Check yours out here: ${wrappedUrl}`,
        "",
        "#Bluesky #Wrapped2025 #ATProto",
    ].join("\n");

    const blueskyComposeUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(postText)}`;
    return blueskyComposeUrl;
}