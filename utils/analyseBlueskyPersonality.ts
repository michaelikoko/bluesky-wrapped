'use server'
import { GoogleGenAI, Type } from "@google/genai";
import { AnalyzeBlueskyPersonalityFunctionParameter, BlueskyPersonality, MostEngagedPostData } from "./types";

/*
1. The Conversationalist - High reply ratio (>40%), engages deeply in discussions
2. The Curator - Heavy reposter (>30%), shares quality content from others
3. The Technical Educator - Shares tutorials, how-tos, knowledge (look for instructional language)
4. The Observer - Mostly lurks, occasional insightful posts
5. The Community Builder - Connects people, uses hashtags strategically, diverse interactions
6. The Thought Leader - Long-form insights, quoted often, original ideas
7. The Creative - Posts original art, stories, creative content
8. The News Sharer - Shares current events, news, updates
9. The Casual Poster - Mix of everything, no clear pattern, spontaneous
10. The Niche Expert - Deep focus on one specific topic/domain
*/

export async function analyzeBlueskyPersonality(data: AnalyzeBlueskyPersonalityFunctionParameter, samplePosts: MostEngagedPostData[]): Promise<BlueskyPersonality | null> {

    const samplePostsText = samplePosts.map((post, index) => `Post ${index + 1}: ${post.textContent}`).join('\n\n');

    const prompt = `
Analyze this Bluesky user's posting behavior and categorize them into ONE personality type.

USER STATS:
- Total Posts: ${data.totalPostsMadeByUser}
- Total Replies: ${data.totalRepliesMadeByUser}
- Total Reposts: ${data.totalRepostsMadeByUser}
- Total Quotes: ${data.totalQuotesMadeByUser}
- Reply Ratio: ${(data.totalRepliesMadeByUser / (data.totalPostsMadeByUser + data.totalRepliesMadeByUser) * 100).toFixed(0)}%
- Top Hashtags: ${data.topHashtags.map(h => '#' + h.tag).join(', ')}
- Top Words: ${data.topWords.slice(0, 5).map(w => w.word).join(', ')}

SAMPLE POSTS:
${samplePostsText}

PERSONALITY TYPES TO CHOOSE FROM: Be creative with names, but keep them relevant to Bluesky posting styles.

Consider:
- Reply ratio (high = conversationalist)
- Repost ratio (high = curator)
- Content type (tutorials = educator, news links = news sharer)
- Hashtag usage (strategic = community builder)
- Tone (analytical, casual, professional, creative)
- Topics (broad vs narrow focus)

Return ONLY valid JSON, no markdown:
{
  "personalityType": "The [Personality Type]",
  "description": "A 2-3 sentence fun, personalized description of their posting style",
}
`;

    const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseJsonSchema: {
                type: Type.OBJECT,
                properties: {
                    personalityType: {
                        type: Type.STRING
                    },
                    description: {
                        type: Type.STRING
                    }
                },
                required: ['personalityType', 'description']
            }
        }
    })
    if (!response.text) throw new Error('No response from AI model');
    const personality: BlueskyPersonality = JSON.parse(response.text);
    return personality;

}
