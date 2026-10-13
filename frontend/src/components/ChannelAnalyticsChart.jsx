import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'
import { Box, Paper, Typography } from '@mui/material'

const BAR_COLORS = ['#1765d1', '#0788f9', '#36a9f5', '#7bc4fa', '#b6ddfb']

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0)

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null

    const item = payload[0].payload

    return (
        <Paper
            elevation={3}
            sx={{
                p: 1.5,
                border: '1px solid #e5eaf2',
                borderRadius: 2,
                backgroundColor: '#fff',
            }}
        >
            <Typography fontWeight={700} color="#092f68">
                {item.channel}
            </Typography>
            <Typography variant="body2">
                Transactions: {item.count}
            </Typography>
            <Typography variant="body2">
                Transaction Value: {formatCurrency(item.total_amount)}
            </Typography>
        </Paper>
    )
}

function ChannelAnalyticsChart({ channels = [] }) {
    const validChannels = Array.isArray(channels)
        ? channels.filter((item) => item && item.channel)
        : []

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                mt: 0,
                border: '1px solid #e5eaf2',
                borderRadius: 3,
                minWidth: 0,
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
            }}
        >
            <Typography variant="h6" fontWeight={700} color="#092f68">
                Channel Analytics
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Transaction count by payment channel
            </Typography>

            {validChannels.length > 0 ? (
                <Box sx={{ width: '100%', height: 260, mt: 2, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={validChannels}
                            margin={{ top: 20, right: 8, left: -20, bottom: 4 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5eaf2"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="channel"
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: '#64748b', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: '#f1f6fd' }}
                            />
                            <Bar
                                dataKey="count"
                                name="Transactions"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={48}
                                label={{
                                    position: 'top',
                                    fill: '#092f68',
                                    fontSize: 12,
                                }}
                            >
                                {validChannels.map((item, index) => (
                                    <Cell
                                        key={item.channel}
                                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            ) : (
                <Typography
                    color="text.secondary"
                    textAlign="center"
                    sx={{ py: 5 }}
                >
                    No channel data available.
                </Typography>
            )}
        </Paper>
    )
}

export default ChannelAnalyticsChart