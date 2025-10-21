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
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const banks = await db.bank.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ banks })

  } catch (error) {
    console.error('Get banks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bankName, accountName, accountNumber, qrisImage } = await request.json()

    if (!bankName || !accountName || !accountNumber) {
      return NextResponse.json(
        { error: 'Bank name, account name, and account number are required' },
        { status: 400 }
      )
    }

    const bank = await db.bank.create({
      data: {
        userId: user.userId,
        bankName,
        accountName,
        accountNumber,
        qrisImage
      }
    })

    return NextResponse.json({
      message: 'Bank account added successfully',
      bank
    })

  } catch (error) {
    console.error('Add bank error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}