import { AtpAgent } from '@atproto/api'

const blueskyAgent = new AtpAgent({ service: 'https://public.api.bsky.app/' })

export default blueskyAgent