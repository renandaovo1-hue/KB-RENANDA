import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.role !== 'ADMIN') {
      return null
    }
    return decoded
  } catch {
    return null
  }
}

// Default settings
const DEFAULT_SETTINGS = {
  siteName: 'KB RENAN',
  minDeposit: 1000,
  minWithdraw: 1000,
  tax: 15
}

export async function GET(request: NextRequest) {
  try {
    const admin = verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

export async function PUT(request: NextRequest) {
  try {
    const admin = verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { siteName, minDeposit, minWithdraw, tax } = await request.json()

    // Validate input
    if (!siteName || !siteName.trim()) {
      return NextResponse.json(
        { error: 'Site name is required' },
        { status: 400 }
      )
    }

    if (minDeposit < 1000) {
      return NextResponse.json(
        { error: 'Minimum deposit cannot be less than 1000' },
        { status: 400 }
      )
    }

    if (minWithdraw < 1000) {
      return NextResponse.json(
        { error: 'Minimum withdraw cannot be less than 1000' },
        { status: 400 }
      )
    }

    if (tax < 0 || tax > 100) {
      return NextResponse.json(
        { error: 'Tax must be between 0 and 100' },
        { status: 400 }
      )
    }

    // For now, just return success
    // In a real app, you would save these to a database
    const updatedSettings = {
      siteName: siteName.trim(),
      minDeposit,
      minWithdraw,
      tax
    }

    console.log('Settings updated by admin', admin.username, ':', updatedSettings)

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: updatedSettings
    })
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}