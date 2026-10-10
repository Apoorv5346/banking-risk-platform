
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
    Low: '#2e9d65',
    Medium: '#e5a000',
    High: '#e05252',
    Critical: '#8b1e3f',
}

function RiskDistributionChart({ distribution = {} }) {
    const data = ['Low', 'Medium', 'High', 'Critical'].map((level) => ({
        name: level,
        value: distribution[level] || 0,
    }))

    const hasData = data.some((item) => item.value > 0)

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mt: 3,
                border: '1px solid #e5eaf2',
                borderRadius: 3,
                minWidth: 0,
            }}
        >
            <Typography variant="h6" fontWeight={700} color="#092f68">
                Risk Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Transaction counts by risk level
            </Typography>

            {hasData ? (
                <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.filter((item) => item.value > 0)}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                outerRadius="65%"
                                label
                            >
                                {data
                                    .filter((item) => item.value > 0)
                                    .map((item) => (
                                        <Cell
                                            key={item.name}
                                            fill={RISK_COLORS[item.name]}
                                        />
                                    ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            ) : (
                <Typography sx={{ py: 5 }} color="text.secondary">
                    No transaction risk data available.
                </Typography>
            )}
        </Paper>
    )
}

export default RiskDistributionChart
