import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get all admin bank accounts
    const adminBanks = await db.bank.findMany({
      where: {
        user: {
          role: 'ADMIN'
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      banks: adminBanks
    })
  } catch (error) {
    console.error('Failed to fetch admin banks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin banks' },
      { status: 500 }
    )
  }
}