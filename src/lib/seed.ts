import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function seedData() {
  try {
    const existingAdmin = await db.user.findFirst({
      where: { role: 'ADMIN' }
    })

    let adminUser = existingAdmin
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      adminUser = await db.user.create({
        data: {
          username: 'admin',
          email: 'admin@kbrenan.com',
          password: hashedPassword,
          name: 'Administrator',
          role: 'ADMIN',
          balance: 1000000
        }
      })
      
      console.log('Admin user created successfully')
    }

    const existingPlayer = await db.user.findFirst({
      where: { role: 'PLAYER' }
    })

    if (!existingPlayer) {
      const hashedPassword = await bcrypt.hash('player123', 10)
      
      await db.user.create({
        data: {
          username: 'player1',
          email: 'player1@kbrenan.com',
          password: hashedPassword,
          name: 'Player One',
          role: 'PLAYER',
          balance: 10000
        }
      })
      
      console.log('Sample player created successfully')
    }

    // Create sample admin banks
    const existingAdminBanks = await db.bank.findMany({
      where: {
        user: {
          role: 'ADMIN'
        }
      }
    })

    if (existingAdminBanks.length === 0 && adminUser) {
      await db.bank.createMany({
        data: [
          {
            userId: adminUser.id,
            bankName: 'BCA',
            accountName: 'Admin KB RENAN',
            accountNumber: '1234567890'
          },
          {
            userId: adminUser.id,
            bankName: 'Mandiri',
            accountName: 'Admin KB RENAN',
            accountNumber: '9876543210'
          },
          {
            userId: adminUser.id,
            bankName: 'BNI',
            accountName: 'Admin KB RENAN',
            accountNumber: '555566667777'
          }
        ]
      })
      
      console.log('Sample admin banks created successfully')
    }

    // Create sample transactions
    const existingTransactions = await db.transaction.count()
    if (existingTransactions === 0) {
      const playerUser = await db.user.findFirst({
        where: { role: 'PLAYER' }
      })

      if (playerUser && adminUser) {
        // Create player bank for withdrawals
        await db.bank.create({
          data: {
            userId: playerUser.id,
            bankName: 'BCA',
            accountName: 'Player One',
            accountNumber: '111122223333'
          }
        })

        // Create sample transactions
        await db.transaction.createMany({
          data: [
            {
              userId: playerUser.id,
              type: 'DEPOSIT',
              amount: 50000,
              description: 'Deposit request from player',
              status: 'COMPLETED'
            },
            {
              userId: playerUser.id,
              type: 'WITHDRAW',
              amount: 25000,
              description: 'Withdraw request from player',
              status: 'PENDING'
            },
            {
              userId: playerUser.id,
              type: 'WITHDRAW',
              amount: 10000,
              description: 'Another withdraw request',
              status: 'COMPLETED'
            },
            {
              userId: playerUser.id,
              type: 'DEPOSIT',
              amount: 100000,
              description: 'Another deposit request',
              status: 'PENDING'
            }
          ]
        })
        
        console.log('Sample transactions created successfully')
      }
    }

  } catch (error) {
    console.error('Seeding error:', error)
  }
}