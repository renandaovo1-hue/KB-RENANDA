import React from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Building2,
  CreditCard,
  User
} from 'lucide-react'
import { Transaction } from '@/types'

interface TransactionTableProps {
  transactions: Transaction[]
  onUpdateStatus: (transactionId: string, status: 'COMPLETED' | 'REJECTED') => void
  loading: boolean
}

export function TransactionTable({ transactions, onUpdateStatus, loading }: TransactionTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      COMPLETED: 'default',
      REJECTED: 'destructive',
      PENDING: 'secondary'
    }
    
    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    return type === 'DEPOSIT' 
      ? <TrendingUp className="h-4 w-4 text-green-500" />
      : <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const formatAmount = (amount: number, type: string) => {
    const color = type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
    const sign = type === 'DEPOSIT' ? '+' : '-'
    
    return (
      <span className={`font-semibold ${color}`}>
        {sign}Rp {amount.toLocaleString('id-ID')}
      </span>
    )
  }

  const BankInfo = ({ user, type }: { user: any, type: string }) => {
    // Only show bank info for withdrawal requests
    if (type !== 'WITHDRAW') {
      return <span className="text-gray-400">-</span>
    }

    // Check if bank information is available
    if (!user.bankName && !user.bankAccountNumber && !user.bankAccountName) {
      return (
        <div className="text-red-500 text-sm">
          <div className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Bank info tidak ada</span>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-1">
        {user.bankName && (
          <div className="flex items-center gap-1 text-sm">
            <Building2 className="h-3 w-3 text-gray-500" />
            <span className="font-medium">{user.bankName}</span>
          </div>
        )}
        {user.bankAccountNumber && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <CreditCard className="h-3 w-3" />
            <span>{user.bankAccountNumber}</span>
          </div>
        )}
        {user.bankAccountName && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <User className="h-3 w-3" />
            <span>{user.bankAccountName}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Waktu</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Bank Info (WD)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Tidak ada transaksi
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(transaction.createdAt), 'dd MMM yyyy', { locale: id })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(transaction.createdAt), 'HH:mm:ss')}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{transaction.user.username}</div>
                    <div className="text-xs text-gray-500">{transaction.user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(transaction.type)}
                    <span className="font-medium">{transaction.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {formatAmount(transaction.amount, transaction.type)}
                </TableCell>
                <TableCell>
                  <BankInfo user={transaction.user} type={transaction.type} />
                </TableCell>
                <TableCell>
                  {getStatusBadge(transaction.status)}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.status === 'PENDING' && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(transaction.id, 'COMPLETED')}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onUpdateStatus(transaction.id, 'REJECTED')}
                        disabled={loading}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {transaction.status !== 'PENDING' && (
                    <span className="text-sm text-gray-500">Selesai</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}