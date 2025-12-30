import { ImageResponse } from "@takumi-rs/image-response";
import { Sparkles } from "lucide-react";

interface PersonalityData {
    personalityType: string;
    description: string;
    handle: string;
}

function PersonalityImage({ data }: { data: PersonalityData }) {
    return (
        <div tw="flex flex-col w-full h-full bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 p-16 items-center justify-center text-center" style={{
            backgroundColor: 'oklch(14% 0.005 285.823)',
            backgroundImage: 'linear-gradient(oklch(16% 0.006 285.823) 1px, transparent 1px),  linear-gradient(90deg, oklch(16% 0.006 285.823) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
        }}>
            <span tw="text-8xl mb-8">
                <Sparkles
                    style={{
                        color: '#facc15'
                    }}
                />
            </span>

            <p tw="text-white/60 text-3xl mb-4 uppercase tracking-wider">YOU ARE</p>

            <h1 tw="text-blue-400 text-8xl font-extrabold mb-8 leading-tight">
                {data.personalityType}
            </h1>

            <p tw="text-white/80 text-3xl leading-relaxed max-w-4xl mb-12">
                {data.description}
            </p>

            <div tw="flex items-center gap-4 bg-white/10 rounded-full px-8 py-4 border border-white/20">
                <span tw="text-4xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bluesky inline size-15 me-1 text-blue-400" viewBox="0 0 16 16">
                        <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948" />
                    </svg>
                </span>
                <p tw="text-white text-2xl font-semibold">@{data.handle}</p>
            </div>

            <p tw="text-white/40 text-2xl mt-12 fixed bottom-4">Bluesky Wrapped 2025</p>
        </div>
    );
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const data: PersonalityData = {
        personalityType: searchParams.get('personalityType') || 'The Balanced Poster',
        description: searchParams.get('description') || 'You have a well-rounded posting style, engaging with a variety of content and interactions on Bluesky.',
        handle: searchParams.get('handle') || 'user.bsky.social',
    };

    //console.log('Generating personality image for:', data);

    return new ImageResponse(<PersonalityImage data={data} />, {
        width: 1200,
        height: 1200,
    });
}