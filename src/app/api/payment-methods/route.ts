import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get all banks with QRIS images for players to see available payment methods
    const banks = await db.bank.findMany({
      where: {
        qrisImage: {
          not: null
        }
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group by bank name and account details to avoid duplicates
    const uniqueBanks = banks.reduce((acc: any[], bank) => {
      const existing = acc.find(b => 
        b.bankName === bank.bankName && 
        b.accountName === bank.accountName && 
        b.accountNumber === bank.accountNumber
      )
      
      if (!existing) {
        acc.push({
          id: bank.id,
          bankName: bank.bankName,
          accountName: bank.accountName,
          accountNumber: bank.accountNumber,
          qrisImage: bank.qrisImage,
          username: bank.user.username
        })
      }
      
      return acc
    }, [])

    return NextResponse.json({ 
      paymentMethods: uniqueBanks,
      total: uniqueBanks.length
    })

  } catch (error) {
    console.error('Get payment methods error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}