// app/api/monitoring/route.js
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET() {
  try {
    // Check system health
    const healthChecks = [
      checkDatabaseConnection(),
      checkPaymentGateway(),
      checkAIEndpoints()
    ]
    
    const results = await Promise.all(healthChecks)
    const failures = results.filter(r => !r.healthy)
    
    if (failures.length > 0) {
      // Send alerts
      await sendAlertEmail(failures.map(f => f.message).join('\n'))
      return NextResponse.json({ 
        status: 'degraded', 
        failures: failures.map(f => f.message) 
      })
    }
    
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Monitoring failed:', error)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}

async function checkDatabaseConnection() {
  try {
    await supabase.from('salons').select('id').limit(1)
    return { healthy: true }
  } catch (error) {
    return {
      healthy: false,
      message: 'Database connection failed: ' + error.message
    }
  }
}

async function checkPaymentGateway() {
  try {
    const response = await fetch('https://paygate.netcash.co.za/ping')
    if (response.status !== 200) throw new Error('Unhealthy response')
    return { healthy: true }
  } catch (error) {
    return {
      healthy: false,
      message: 'Payment gateway unreachable'
    }
  }
}

// app/api/alerts/route.js
export async function POST(req) {
  const { type, salonId, message } = await req.json()
  
  // Save alert to database
  await supabase.from('alerts').insert({
    type,
    salon_id: salonId,
    message,
    status: 'triggered'
  })
  
  // Notify relevant parties
  switch(type) {
    case 'billing':
      await notifyBillingTeam(salonId, message)
      break
    case 'performance':
      await notifySalonOwner(salonId, message)
      break
    case 'security':
      await notifySecurityTeam(message)
      break
  }
  
  return NextResponse.json({ success: true })
}