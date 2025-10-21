import { NextResponse } from 'next/server'

// Default settings (same as admin settings)
const DEFAULT_SETTINGS = {
  siteName: 'KB RENAN',
  minDeposit: 1000,
  minWithdraw: 1000,
  tax: 15
}

export async function GET() {
  try {
    // For now, return default settings
    // In a real app, you might store these in a database table
    return NextResponse.json({
      settings: DEFAULT_SETTINGS
    })
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}