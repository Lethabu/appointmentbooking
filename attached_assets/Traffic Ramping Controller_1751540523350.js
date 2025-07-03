// pages/api/traffic-control.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const { action, percent } = req.body
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  
  try {
    switch(action) {
      case 'set':
        await setTrafficPercentage(percent)
        break
      case 'increase':
        await increaseTraffic(percent)
        break
      case 'decrease':
        await decreaseTraffic(percent)
        break
      default:
        return res.status(400).json({ error: 'Invalid action' })
    }
    
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Traffic control failed' })
  }
}

async function setTrafficPercentage(percent) {
  // Update Cloudflare rules
  await fetch('https://api.cloudflare.com/client/v4/workers/rules', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pattern: 'appointmentbookings.co.za/*',
      percentage: percent
    })
  })
  
  // Log traffic change
  await supabase
    .from('traffic_changes')
    .insert({
      action: 'set',
      value: percent,
      direction: percent > currentTraffic ? 'up' : 'down'
    })
}

async function increaseTraffic(percent) {
  const current = await getCurrentTraffic()
  const newPercent = Math.min(100, current + percent)
  await setTrafficPercentage(newPercent)
}

async function decreaseTraffic(percent) {
  const current = await getCurrentTraffic()
  const newPercent = Math.max(0, current - percent)
  await setTrafficPercentage(newPercent)
}