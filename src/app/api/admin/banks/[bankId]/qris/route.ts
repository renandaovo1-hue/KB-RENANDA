import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
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

function validateFile(file: File) {
  // Check file type (hanya gambar)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return 'Hanya file gambar yang diperbolehkan (JPG, PNG, GIF, WebP)'
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return 'Ukuran file maksimal 5MB'
  }

  return null
}

async function ensureUploadsDir() {
  const uploadsDir = join(process.cwd(), 'public', 'uploads')
  try {
    await mkdir(uploadsDir, { recursive: true })
  } catch (error) {
    console.error('Error creating uploads directory:', error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { bankId: string } }
) {
  try {
    const admin = verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Tidak memiliki izin' }, { status: 401 })
    }

    const { bankId } = params

    const existingBank = await db.bank.findUnique({
      where: { id: bankId }
    })

    if (!existingBank) {
      return NextResponse.json({ error: 'Bank tidak ditemukan' }, { status: 404 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 })
    }

    // Validasi file
    const validationError = validateFile(file)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Pastikan folder uploads ada
    await ensureUploadsDir()

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filename = `qris-${bankId}-${timestamp}.${fileExtension}`
    const filepath = join(process.cwd(), 'public', 'uploads', filename)

    await writeFile(filepath, buffer)

    const qrisUrl = `/uploads/${filename}`

    const bank = await db.bank.update({
      where: { id: bankId },
      data: { qrisImage: qrisUrl },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'QRIS berhasil diperbarui',
      bank,
      qrisUrl
    })

  } catch (error) {
    console.error('Update QRIS error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { bankId: string } }
) {
  try {
    const admin = verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Tidak memiliki izin' }, { status: 401 })
    }

    const { bankId } = params

    const existingBank = await db.bank.findUnique({
      where: { id: bankId }
    })

    if (!existingBank) {
      return NextResponse.json({ error: 'Bank tidak ditemukan' }, { status: 404 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 })
    }

    // Validasi file
    const validationError = validateFile(file)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Pastikan folder uploads ada
    await ensureUploadsDir()

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filename = `qris-${bankId}-${timestamp}.${fileExtension}`
    const filepath = join(process.cwd(), 'public', 'uploads', filename)

    await writeFile(filepath, buffer)

    const qrisUrl = `/uploads/${filename}`

    const bank = await db.bank.update({
      where: { id: bankId },
      data: { qrisImage: qrisUrl },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'QRIS berhasil diunggah',
      bank,
      qrisUrl
    })

  } catch (error) {
    console.error('Upload QRIS error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}