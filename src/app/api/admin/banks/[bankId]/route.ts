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
  { params }: { params: { bankId: string } }
) {
  try {
    const admin = verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bankId } = params
    const { bankName, accountName, accountNumber, qrisImage } = await request.json()

    const existingBank = await db.bank.findUnique({
      where: { id: bankId }
    })

    if (!existingBank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (bankName !== undefined) updateData.bankName = bankName
    if (accountName !== undefined) updateData.accountName = accountName
    if (accountNumber !== undefined) updateData.accountNumber = accountNumber
    if (qrisImage !== undefined) updateData.qrisImage = qrisImage

    const bank = await db.bank.update({
      where: { id: bankId },
      data: updateData,
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Bank account updated successfully',
      bank
    })

  } catch (error) {
    console.error('Update bank error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { bankId: string } }
) {
  try {
    const admin = verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bankId } = params

    const existingBank = await db.bank.findUnique({
      where: { id: bankId }
    })

    if (!existingBank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 })
    }

    await db.bank.delete({
      where: { id: bankId }
    })

    return NextResponse.json({
      message: 'Bank account deleted successfully'
    })

  } catch (error) {
    console.error('Delete bank error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}