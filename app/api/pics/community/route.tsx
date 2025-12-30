//import { InteractedAccountProfile } from "@/utils/types";
import { ImageResponse } from "@takumi-rs/image-response";
import { Users } from "lucide-react";
import { PersistentImage } from "@takumi-rs/core"

interface CommunityData {
    //topAccounts: InteractedAccountProfile[];
    topAccounts: {
        did: string;
        handle: string;
        displayName?: string;
        avatarUrl?: string;
        interactionCount: number;
        hasAvatarLoaded?: boolean;
    }[];
    handle: string;
}

function CommunityImage({ data }: { data: CommunityData }) {

    return (
        <div tw="flex flex-col w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-12" style={{
            backgroundColor: 'oklch(14% 0.005 285.823)',
            backgroundImage: 'linear-gradient(oklch(16% 0.006 285.823) 1px, transparent 1px),  linear-gradient(90deg, oklch(16% 0.006 285.823) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
        }}>
            <div tw="flex flex-col mb-8">
                <h1 tw="text-6xl font-bold text-white mb-2">My Community</h1>
                <p tw="text-2xl text-white/60">@{data.handle}</p>
            </div>


            <div tw="flex flex-col bg-white/10 rounded-3xl p-8 border border-white/20 mb-6">
                <div tw="flex items-center gap-3 mb-6">
                    <span tw="text-4xl">
                        <Users
                            style={{
                                color: '#2563eb'
                            }}
                        />
                    </span>
                    <p tw="text-white text-3xl font-bold">Most Interacted With</p>
                </div>
                <div tw="grid grid-cols-4 gap-6">
                    {data.topAccounts.sort((a, b) => b.interactionCount - a.interactionCount).map((account, index) => (
                        <div key={index} tw="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all flex flex-col items-center text-center">

                            {(account.hasAvatarLoaded !== undefined && account.hasAvatarLoaded === true) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={account.handle}
                                    alt={account.handle}
                                    tw="w-14 h-14 rounded-full object-cover mb-2 md:mb-3 ring-2 ring-white/20"
                                />
                            ) : (
                                <div tw="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-2 bg-blue-400/60">
                                    <span tw="text-white text-2xl font-bold">
                                        {account.displayName?.charAt(0) || account.handle.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}

                            <h3 tw="text-base font-semibold text-white mb-0.5 truncate w-full">
                                {account.displayName || ''}
                            </h3>

                            <p tw="text-sm text-white/60 mb-1 truncate w-full">
                                @{account.handle}
                            </p>

                            <div tw="text-2xl font-bold text-purple-400">
                                {account.interactionCount}
                            </div>
                            <p tw="text-xs text-white/50">interactions</p>
                        </div>
                    ))}
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

    const topAccountsParam = searchParams.get('topAccounts');
    //console.log('topAccountsParam:', JSON.parse(topAccountsParam || '[]'));

    const topAccountsParsed: CommunityData["topAccounts"] = topAccountsParam ? JSON.parse(topAccountsParam) : [];


    const data: CommunityData = {
        topAccounts: [], // will populate below after fetching avatars
        handle: searchParams.get('handle') || 'user.bsky.social',
    }

    const avatarBuffers = (await Promise.all(
        topAccountsParsed.map(async (account) => {
            if (account.avatarUrl) {
                try {
                    const response = await fetch(account.avatarUrl);
                    const bufferData = await response.arrayBuffer()
                    data.topAccounts.push({
                        did: account.did,
                        handle: account.handle,
                        displayName: account.displayName,
                        avatarUrl: account.avatarUrl,
                        interactionCount: account.interactionCount,
                        hasAvatarLoaded: true
                    });
                    return {
                        //url: account.avatarUrl,
                        data: bufferData,
                        handle: account.handle
                    }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    data.topAccounts.push({
                        did: account.did,
                        handle: account.handle,
                        displayName: account.displayName,
                        avatarUrl: account.avatarUrl,
                        interactionCount: account.interactionCount,
                        hasAvatarLoaded: false
                    });
                    //console.error(`Error fetching avatar for ${account.handle}:`, error);
                    return undefined;
                }

            }
        })
    )).filter(buffer => buffer !== undefined)



    const persistentImages: PersistentImage[] = avatarBuffers.map((buffer) => {
        if (buffer !== undefined && buffer.data) {
            return {
                src: buffer.handle,
                data: buffer.data
            }
        }
    }).filter(image => image !== undefined)

    //console.log('persistentImages:', persistentImages);
    //console.log('avatarBuffers:', avatarBuffers);
    //console.log('data in Community GET:', data);

    return new ImageResponse(<CommunityImage data={data} />, {
        width: 1200,
        height: 1200,
        persistentImages
    });
}