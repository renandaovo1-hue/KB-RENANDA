import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    console.log('=== DEBUG ADMIN TRANSACTIONS ===')
    
    // Test simple query
    const totalTransactions = await db.transaction.count()
    console.log('Total transactions:', totalTransactions)
    
    // Test query with user
    const transactionsWithUser = await db.transaction.findMany({
      take: 3,
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    console.log('Sample transactions:', transactionsWithUser.length)
    
    // Test query with banks
    const transactionsWithBanks = await db.transaction.findMany({
      take: 3,
      include: {
        user: {
          include: {
            banks: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    console.log('Transactions with banks:', transactionsWithBanks.length)
    
    return NextResponse.json({
      totalTransactions,
      sampleCount: transactionsWithUser.length,
      withBanksCount: transactionsWithBanks.length,
      sampleData: transactionsWithUser.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        status: t.status,
        createdAt: t.createdAt,
        user: t.user.username
      }))
    })
    
  } catch (error) {
    console.error('DEBUG ERROR:', error)
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}