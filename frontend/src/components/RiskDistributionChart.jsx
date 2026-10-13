
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { Box, Paper, Typography } from '@mui/material'

const RISK_COLORS = {
    Low: '#10b981',
    Medium: '#f59e0b',
    High: '#f97316',
    Critical: '#e11d48',
}

function RiskDistributionChart({ distribution = {} }) {
    const data = ['Low', 'Medium', 'High', 'Critical'].map((level) => ({
        name: level,
        value: distribution[level] || 0,
    }))

    const visibleData = data.filter((item) => item.value > 0)
    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5 },
                height: '100%',
                minWidth: 0,
                boxSizing: 'border-box',
                border: '1px solid #e6edf5',
                borderRadius: 3,
                background: '#fff',
            }}
        >
            <Typography variant="h6" fontWeight={700} color="#092f68">
                Risk Distribution
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Transaction counts by risk level
            </Typography>

            {visibleData.length > 0 ? (
                <>
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: { xs: 220, sm: 240 },
                            mt: 1,
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={visibleData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="48%"
                                    innerRadius="52%"
                                    outerRadius="76%"
                                    paddingAngle={2}
                                    stroke="none"
                                >
                                    {visibleData.map((item) => (
                                        <Cell key={item.name} fill={RISK_COLORS[item.name]} />
                                    ))}
                                </Pie>

                                <Tooltip
                                    formatter={(value, name) => [`${value} transactions`, name]}
                                    contentStyle={{
                                        borderRadius: 10,
                                        border: '1px solid #e6edf5',
                                        boxShadow: '0 4px 14px rgba(15, 40, 80, 0.08)',
                                    }}
                                />

                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <Box
                            sx={{
                                position: 'absolute',
                                top: '48%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                pointerEvents: 'none',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: 23, sm: 26 },
                                    fontWeight: 800,
                                    color: '#092f68',
                                    lineHeight: 1.2,
                                }}
                            >
                                {total.toLocaleString('en-IN')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Transactions
                            </Typography>
                        </Box>
                    </Box>
                </>
            ) : (
                <Typography sx={{ py: 5 }} color="text.secondary">
                    No transaction risk data available.
                </Typography>
            )}
        </Paper>
    )
}

export default RiskDistributionChart
