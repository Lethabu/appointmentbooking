// flags.js
export const FEATURES = {
  ECOMMERCE: process.env.NEXT_PUBLIC_FEAT_ECOMMERCE === 'true',
  AI_AGENTS: process.env.NEXT_PUBLIC_FEAT_AI === 'true'
}