import { ImageResponse } from "@takumi-rs/image-response";
import { CalendarDays, Heart, Sparkles, Trophy } from "lucide-react";

interface BestMomentsData {
  topPostText: string;
  topPostEngagement: number;
  mostActiveMonth: string;
  mostActiveMonthCount: number;
  mostEngagedMonth: string;
  mostEngagedMonthCount: number;
  handle: string;
}

function BestMomentsImage({ data }: { data: BestMomentsData }) {
  return (
    <div tw="flex flex-col w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-12" style={{
           backgroundColor: 'oklch(14% 0.005 285.823)',
           backgroundImage: 'linear-gradient(oklch(16% 0.006 285.823) 1px, transparent 1px),  linear-gradient(90deg, oklch(16% 0.006 285.823) 1px, transparent 1px)',
           backgroundSize: '20px 20px',
    }}>

      <div tw="flex flex-col mb-8">
        <h1 tw="text-6xl font-bold text-white mb-2">My Best Moments</h1>
        <p tw="text-2xl text-white/60">@{data.handle}</p>
      </div>


      <div tw="flex flex-1 flex-col gap-6">
 
        <div tw="flex flex-col bg-white/10 rounded-3xl p-8 border border-white/20">
          <div tw="flex items-center gap-3 mb-4">
            <span tw="text-4xl">
                <Trophy  style={{
                    color: '#f59e0b'
                }}/>
            </span>
            <p tw="text-white/70 text-2xl">Top Post</p>
          </div>
          <p tw="text-white text-2xl mb-4 line-clamp-3">{data.topPostText}</p>
          <div tw="flex items-center gap-8">
            <div tw="flex items-center gap-2">
              <span tw="text-3xl"><Heart 
              style={{
                color: '#dc2626'
              }}
              
              /></span>
              <span tw="text-pink-400 text-3xl font-bold">{data.topPostEngagement.toLocaleString()}</span>
            </div>
            <span tw="text-white/50 text-xl">total interactions</span>
          </div>
        </div>

    
        <div tw="flex gap-6">
          <div tw="flex flex-1 flex-col bg-white/10 rounded-3xl p-8 border border-white/20">
            <div tw="flex items-center gap-3 mb-4">
              <span tw="text-4xl"><CalendarDays 
              style={{
                color: '#4f46e5'
              }}
              /></span>
              <p tw="text-white/70 text-2xl">Most Active</p>
            </div>
            <p tw="text-purple-400 text-5xl font-bold mb-2">{data.mostActiveMonth}</p>
            <p tw="text-white/70 text-xl">{data.mostActiveMonthCount} activities</p>
          </div>

          <div tw="flex flex-1 flex-col bg-white/10 rounded-3xl p-8 border border-white/20">
            <div tw="flex items-center gap-3 mb-4">
              <span tw="text-4xl">
                <Sparkles 
                style={{
                    color: '#facc15'
                }}
                />
              </span>
              <p tw="text-white/70 text-2xl">Peak Engagement</p>
            </div>
            <p tw="text-yellow-400 text-5xl font-bold mb-2">{data.mostEngagedMonth}</p>
            <p tw="text-white/70 text-xl">{data.mostEngagedMonthCount} interactions</p>
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
  
  const data: BestMomentsData = {
    topPostText: searchParams.get('topPostText') || '',
    topPostEngagement: parseInt(searchParams.get('topPostEngagement') || '0'),
    mostActiveMonth: searchParams.get('mostActiveMonth') || 'January',
    mostActiveMonthCount: parseInt(searchParams.get('mostActiveMonthCount') || '0'),
    mostEngagedMonth: searchParams.get('mostEngagedMonth') || 'January',
    mostEngagedMonthCount: parseInt(searchParams.get('mostEngagedMonthCount') || '0'),
    handle: searchParams.get('handle') || 'user.bsky.social',
  };

  return new ImageResponse(<BestMomentsImage data={data} />, {
    width: 1200,
    height: 1200,
  });
}