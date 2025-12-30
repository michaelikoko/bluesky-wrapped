import { ImageResponse } from "@takumi-rs/image-response";
import { Hash, MessageSquareMore } from "lucide-react";

interface InterestsData {
    topHashtags: Array<{ tag: string; count: number }>;
    topWords: Array<{ word: string; count: number }>;
    handle: string;
}

function InterestsImage({ data }: { data: InterestsData }) {
    return (
        <div tw="flex flex-col w-full h-full bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 p-12" style={{
           backgroundColor: 'oklch(14% 0.005 285.823)',
           backgroundImage: 'linear-gradient(oklch(16% 0.006 285.823) 1px, transparent 1px),  linear-gradient(90deg, oklch(16% 0.006 285.823) 1px, transparent 1px)',
           backgroundSize: '20px 20px',
    }}>
            <div tw="flex flex-col mb-8">
                <h1 tw="text-6xl font-bold text-white mb-2">My Interests</h1>
                <p tw="text-2xl text-white/60">@{data.handle}</p>
            </div>

            <div tw="flex flex-1 gap-8">
                <div tw="flex flex-1 flex-col bg-white/10 rounded-3xl p-8 border border-white/20">
                    <div tw="flex items-center gap-3 mb-6">
                        <span tw="text-4xl">
                            <Hash style={{
                                color: '#0369a1'
                            }} />
                        </span>
                        <p tw="text-white text-3xl font-bold">Top Hashtags</p>
                    </div>
                    <div tw="flex flex-col gap-4">
                        {data.topHashtags.slice(0, 5).map((hashtag, index) => (
                            <div key={index} tw="flex items-center justify-between">
                                <div tw="flex items-center gap-3">
                                    <span tw="text-white/50 text-2xl font-bold">{index + 1}</span>
                                    <span tw="text-purple-400 text-2xl font-semibold">#{hashtag.tag}</span>
                                </div>
                                <span tw="text-white text-2xl font-bold">{hashtag.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div tw="flex flex-1 flex-col bg-white/10 rounded-3xl p-8 border border-white/20">
                    <div tw="flex items-center gap-3 mb-6">
                        <span tw="text-4xl">
                            <MessageSquareMore
                                style={{
                                    color: '#f87171'
                                }}
                            />
                        </span>
                        <p tw="text-white text-3xl font-bold">Top Words</p>
                    </div>
                    <div tw="flex flex-wrap gap-4">
                        {data.topWords.slice(0, 5).map((word, index) => {
                            const sizes = ['text-5xl', 'text-4xl', 'text-3xl', 'text-3xl', 'text-2xl'];
                            const colors = ['text-pink-400', 'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-purple-400'];
                            return (
                                <div key={index} tw={`flex flex-col items-center`}>
                                    <span tw={`${colors[index]} ${sizes[index]} font-bold`}>{word.word}</span>
                                    <span tw="text-white/50 text-lg">{word.count}×</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div tw="flex justify-center mt-8">
                <p tw="text-white/40 text-xl">Bluesky Wrapped 2025</p>
            </div>
        </div>
    );
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const hashtagsParam = searchParams.get('topHashtags');
    const wordsParam = searchParams.get('topWords');

    const data: InterestsData = {
        topHashtags: hashtagsParam ? JSON.parse(hashtagsParam) : [],
        topWords: wordsParam ? JSON.parse(wordsParam) : [],
        handle: searchParams.get('handle') || 'user.bsky.social',
    };

    return new ImageResponse(<InterestsImage data={data} />, {
        width: 1200,
        height: 1200,
    });
}