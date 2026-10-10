
import { useEffect, useState } from 'react'

const API_URL = 'http://127.0.0.1:8000'

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
                    throw new Error('Could not fetch transactions')
                }

                const data = await response.json()
                setTransactions(data.data || [])
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Something went wrong')
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
        }).format(amount)

    const hasFilters = Boolean(
        searchId.trim() || riskLevel || channel
    )

    return (
        <div className="transaction-section">
            <div className="section-header">
                <div>
                    <h2>
                        {searchId.trim()
                            ? 'Search Results'
                            : riskLevel && channel
                                ? 'Filtered Transactions'
                                : riskLevel
                                    ? `${riskLevel} Risk Transactions`
                                    : channel
                                        ? `${channel} Transactions`
                                        : 'Recent Transactions'}
                    </h2>

                    <p>
                        {searchId.trim() &&
                            `Transaction ID: ${searchId.trim()}`}

                        {searchId.trim() && (riskLevel || channel) && ' · '}

                        {riskLevel && `Risk Level: ${riskLevel}`}

                        {riskLevel && channel && ' · '}

                        {channel && `Channel: ${channel}`}

                        {!hasFilters && 'Latest banking activity'}
                    </p>
                </div>
            </div>

            {loading && <p>Loading transactions...</p>}

            {error && <p role="alert">Error: {error}</p>}

            {!loading && !error && (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Customer ID</th>
                                <th>Amount</th>
                                <th>Channel</th>
                                <th>Location</th>
                                <th>Risk Level</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6">
                                        {searchId.trim()
                                            ? `No transaction found for "${searchId.trim()}"${riskLevel ? ` with risk level "${riskLevel}"` : ''}${channel ? ` in channel "${channel}"` : ''}.`
                                            : riskLevel && channel
                                                ? `No ${riskLevel} risk transactions found for ${channel}.`
                                                : riskLevel
                                                    ? `No ${riskLevel} risk transactions found.`
                                                    : channel
                                                        ? `No transactions found for channel "${channel}".`
                                                        : 'No transactions found.'}
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => {
                                    const risk =
                                        transaction.risk_level || 'Unknown'

                                    return (
                                        <tr key={transaction.transaction_id}>
                                            <td>{transaction.transaction_id}</td>
                                            <td>{transaction.customer_id}</td>
                                            <td>
                                                {formatCurrency(transaction.amount)}
                                            </td>
                                            <td>{transaction.channel}</td>
                                            <td>{transaction.location}</td>
                                            <td>
                                                <span
                                                    className={`risk ${risk.toLowerCase()}`}
                                                >
                                                    {risk}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default TransactionTable
