import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Verify this is a cron job request (you can add authentication here)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'cron-secret-key'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Call the refund expired rooms API
    const refundResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/rooms/refund-expired`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!refundResponse.ok) {
      throw new Error('Failed to process refunds')
    }

    const refundData = await refundResponse.json()

    return NextResponse.json({
      message: 'Cron job completed successfully',
      timestamp: new Date().toISOString(),
      ...refundData
    })

  } catch (error) {
    console.error('Cron refund rooms error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}