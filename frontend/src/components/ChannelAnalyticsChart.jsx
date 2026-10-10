
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { Box, Paper, Typography } from '@mui/material'

function ChannelAnalyticsChart({ channels = [] }) {
    const formatCurrency = (value) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value)

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || payload.length === 0) {
            return null
        }

        const data = payload[0].payload

        return (
            <Paper
                elevation={3}
                sx={{ p: 2, borderRadius: 2, border: '1px solid #e5eaf2' }}
            >
                <Typography fontWeight={700}>{label}</Typography>
                <Typography variant="body2">
                    Transactions: {data.count}
                </Typography>
                <Typography variant="body2">
                    Transaction Value: {formatCurrency(data.total_amount)}
                </Typography>
            </Paper>
        )
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                mt: 3,
                border: '1px solid #e5eaf2',
                borderRadius: 3,
                minWidth: 0,
                backgroundColor: '#fff',
            }}
        >
            <Typography variant="h6" fontWeight={700} color="#092f68">
                Channel Analytics
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Transaction count by payment channel
            </Typography>

            {channels.length > 0 ? (
                <Box sx={{ width: '100%', height: 320, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={channels}
                            margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5eaf2"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="channel"
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                axisLine={{ stroke: '#cbd5e1' }}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="count"
                                name="Transactions"
                                fill="#1765d1"
                                maxBarSize={70}
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            ) : (
                <Typography sx={{ py: 5 }} color="text.secondary">
                    No channel data available.
                </Typography>
            )}
        </Paper>
    )
}

export default ChannelAnalyticsChart
