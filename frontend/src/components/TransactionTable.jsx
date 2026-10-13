import { useEffect, useState } from 'react'
import {
    Alert,
    Box,
    Chip,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'

const API_URL = 'http://127.0.0.1:8000'

const RISK_STYLES = {
    Low: {
        backgroundColor: '#dcfce7',
        color: '#15803d',
    },
    Medium: {
        backgroundColor: '#fef3c7',
        color: '#a16207',
    },
    High: {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
    },
    Critical: {
        backgroundColor: '#fce7f3',
        color: '#9d174d',
    },
}

function TransactionTable({
    searchId = '',
    riskLevel = '',
    channel = '',
}) {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const controller = new AbortController()

        async function fetchTransactions() {
            setLoading(true)
            setError('')

            try {
                const params = new URLSearchParams({
                    page: '1',
                    limit: '5',
                })

                if (searchId.trim()) {
                    params.set('transaction_id', searchId.trim())
                }

                if (riskLevel) {
                    params.set('risk_level', riskLevel)
                }

                if (channel) {
                    params.set('channel', channel)
                }

                const response = await fetch(
                    `${API_URL}/transactions?${params.toString()}`,
                    { signal: controller.signal }
                )

                if (!response.ok) {
                    throw new Error('Could not fetch transactions.')
                }

                const result = await response.json()

                if (!controller.signal.aborted) {
                    setTransactions(
                        Array.isArray(result.data) ? result.data : []
                    )
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(
                        err.message || 'Something went wrong while loading transactions.'
                    )
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchTransactions()

        return () => controller.abort()
    }, [searchId, riskLevel, channel])

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0)

    const hasFilters = Boolean(searchId.trim() || riskLevel || channel)

    const heading = searchId.trim()
        ? 'Search Results'
        : riskLevel && channel
            ? 'Filtered Transactions'
            : riskLevel
                ? `${riskLevel} Risk Transactions`
                : channel
                    ? `${channel} Transactions`
                    : 'Recent Transactions'

    const subtitle = [
        searchId.trim() ? `Transaction ID: ${searchId.trim()}` : '',
        riskLevel ? `Risk: ${riskLevel}` : '',
        channel ? `Channel: ${channel}` : '',
    ].filter(Boolean).join(' · ') || 'Latest banking activity'

    return (
        <Paper
            elevation={0}
            className="transaction-section"
            sx={{
                mt: 3,
                p: { xs: 1.5, sm: 2.5 },
                border: '1px solid #e5eaf2',
                borderRadius: 3,
                backgroundColor: '#fff',
                minWidth: 0,
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 2.5,
                }}
            >
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1765d1',
                        backgroundColor: '#e8f2ff',
                        flexShrink: 0,
                    }}
                >
                    <ReceiptLongOutlinedIcon />
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                        component="h2"
                        sx={{
                            color: '#092f68',
                            fontSize: { xs: 17, sm: 20 },
                            fontWeight: 750,
                        }}
                    >
                        {heading}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.25, overflowWrap: 'anywhere' }}
                    >
                        {subtitle}
                    </Typography>
                </Box>

                {!loading && !error && (
                    <Chip
                        size="small"
                        label={`${transactions.length} shown`}
                        sx={{
                            flexShrink: 0,
                            backgroundColor: '#edf4ff',
                            color: '#1765d1',
                            fontWeight: 600,
                        }}
                    />
                )}
            </Box>

            {loading && (
                <Box aria-label="Loading transactions">
                    {[1, 2, 3].map((item) => (
                        <Skeleton
                            key={item}
                            variant="rounded"
                            height={48}
                            sx={{ mb: 1, borderRadius: 1.5 }}
                        />
                    ))}
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && (
                <TableContainer
                    sx={{
                        width: '100%',
                        overflowX: 'auto',
                        border: '1px solid #edf1f7',
                        borderRadius: 2,
                    }}
                >
                    <Table
                        size="small"
                        aria-label="Banking transactions"
                        sx={{
                            minWidth: 700,
                            '& .MuiTableCell-root': {
                                borderBottom: '1px solid #edf1f7',
                                px: 2,
                                py: 1.8,
                            },
                            '& .MuiTableHead-root .MuiTableCell-root': {
                                backgroundColor: '#f5f8fd',
                                color: '#536782',
                                fontWeight: 700,
                                fontSize: 12,
                                whiteSpace: 'nowrap',
                            },
                            '& .MuiTableBody-root .MuiTableRow-root:hover': {
                                backgroundColor: '#f8fbff',
                            },
                            '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
                                borderBottom: 0,
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Transaction ID</TableCell>
                                <TableCell>Customer ID</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Channel</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Risk Level</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography
                                            sx={{
                                                py: 4,
                                                color: '#64748b',
                                                fontSize: 14,
                                            }}
                                        >
                                            {hasFilters
                                                ? 'No transactions match your search and filters.'
                                                : 'No transactions available yet.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((transaction) => {
                                    const risk = transaction.risk_level || 'Unknown'
                                    const riskStyle = RISK_STYLES[risk] || {
                                        backgroundColor: '#f1f5f9',
                                        color: '#475569',
                                    }

                                    return (
                                        <TableRow
                                            key={transaction.transaction_id}
                                            hover
                                        >
                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color: '#1765d1',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {transaction.transaction_id}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        color: '#334155',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {transaction.customer_id || '—'}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="right">
                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: '#092f68',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {formatCurrency(transaction.amount)}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography
                                                    sx={{ fontSize: 13, color: '#334155' }}
                                                >
                                                    {transaction.channel || '—'}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        color: '#334155',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {transaction.location || '—'}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={risk}
                                                    sx={{
                                                        ...riskStyle,
                                                        minWidth: 76,
                                                        fontWeight: 700,
                                                        fontSize: 11,
                                                        borderRadius: 1.5,
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    )

}

export default TransactionTable