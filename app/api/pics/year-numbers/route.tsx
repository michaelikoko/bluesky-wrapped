import { ImageResponse } from "@takumi-rs/image-response";

interface YearNumbersData {
    totalPosts: number;
    totalReplies: number;
    totalReposts: number;
    totalQuotes: number;
    totalEngagement: number;
    totalWords: number;
    handle: string;
}

function YearNumbersImage({ data }: { data: YearNumbersData }) {
    return (
        <div tw="flex flex-col w-full h-full p-12" style={{
           backgroundColor: 'oklch(14% 0.005 285.823)',
           backgroundImage: 'linear-gradient(oklch(16% 0.006 285.823) 1px, transparent 1px),  linear-gradient(90deg, oklch(16% 0.006 285.823) 1px, transparent 1px)',
           backgroundSize: '20px 20px',
    }}>

      <div tw="flex flex-col mb-8">
        <h1 tw="text-6xl font-bold text-white mb-2">My 2025 Year in Numbers</h1>
        <p tw="text-2xl text-white/60">@{data.handle}</p>
      </div>


      <div tw="flex flex-1 flex-col justify-center">
        <div tw="grid grid-cols-2 gap-6">

          <div tw="flex flex-col bg-white/10 rounded-3xl p-8 border border-white/20">
            <p tw="text-white/70 text-2xl mb-4">Activity</p>
            <div tw="flex flex-col gap-3">
              <div tw="flex justify-between items-center">
                <span tw="text-white text-2xl">Posts</span>
                <span tw="text-purple-400 text-4xl font-bold">{data.totalPosts}</span>
              </div>
              <div tw="flex justify-between items-center">
                <span tw="text-white text-2xl">Replies</span>
                <span tw="text-blue-400 text-4xl font-bold">{data.totalReplies}</span>
              </div>
              <div tw="flex justify-between items-center">
                <span tw="text-white text-2xl">Reposts</span>
                <span tw="text-green-400 text-4xl font-bold">{data.totalReposts}</span>
              </div>
              <div tw="flex justify-between items-center">
                <span tw="text-white text-2xl">Quotes</span>
                <span tw="text-pink-400 text-4xl font-bold">{data.totalQuotes}</span>
              </div>
            </div>
          </div>

          <div tw="flex flex-col gap-6">
            <div tw="flex flex-col bg-white/10 rounded-3xl p-8 border border-white/20">
              <p tw="text-white/70 text-2xl mb-2">Total Engagement</p>
              <p tw="text-yellow-400 text-6xl font-bold">{data.totalEngagement.toLocaleString()}</p>
              <p tw="text-white/50 text-xl">interactions received</p>
            </div>

            <div tw="flex flex-col bg-white/10 rounded-3xl p-8 border border-white/20">
              <p tw="text-white/70 text-2xl mb-2">Words Written</p>
              <p tw="text-cyan-400 text-6xl font-bold">{data.totalWords.toLocaleString()}</p>
              <p tw="text-white/50 text-xl">across all posts</p>
            </div>
          </div>
        </div>
      </div>
      <div tw="flex justify-center mt-8">
        <p tw="text-white/40 text-xl">Bluesky Wrapped 2025</p>
      </div>
    </div >
  );
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const data: YearNumbersData = {
        totalPosts: parseInt(searchParams.get('posts') || '0'),
        totalReplies: parseInt(searchParams.get('replies') || '0'),
        totalReposts: parseInt(searchParams.get('reposts') || '0'),
        totalQuotes: parseInt(searchParams.get('quotes') || '0'),
        totalEngagement: parseInt(searchParams.get('engagement') || '0'),
        totalWords: parseInt(searchParams.get('words') || '0'),
        handle: searchParams.get('handle') || 'user.bsky.social',
    };

    return new ImageResponse(<YearNumbersImage data={data} />, {
        width: 1200,
        height: 1200,
    });
}