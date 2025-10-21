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

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const admin = verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params
    const { balance } = await request.json()

    if (typeof balance !== 'number' || balance < 0) {
      return NextResponse.json(
        { error: 'Invalid balance amount' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const oldBalance = user.balance
    const difference = balance - oldBalance

    await db.user.update({
      where: { id: userId },
      data: { balance }
    })

    if (difference !== 0) {
      await db.transaction.create({
        data: {
          userId,
          type: difference > 0 ? 'DEPOSIT' : 'WITHDRAW',
          amount: Math.abs(difference),
          description: `Balance adjusted by admin ${admin.username}`,
          status: 'COMPLETED'
        }
      })
    }

    return NextResponse.json({
      message: 'User balance updated successfully',
      newBalance: balance
    })

  } catch (error) {
    console.error('Update user balance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}