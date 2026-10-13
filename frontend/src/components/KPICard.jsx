import { Box, Paper, Typography } from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ShieldIcon from '@mui/icons-material/Shield'

const CARD_CONFIG = {
    'Total Transactions': {
        icon: SwapHorizIcon,
        color: '#1765d1',
        background: '#e8f2ff',
        description: 'All recorded transactions',
    },
    'Medium+ Risk Transactions': {
        icon: WarningAmberIcon,
        color: '#e59a00',
        background: '#fff4d6',
        description: 'Transactions requiring attention',
    },
    'High Risk Transactions': {
        icon: ShieldIcon,
        color: '#dc3545',
        background: '#ffeaed',
        description: 'High and critical risk',
    },
    'Total Transaction Value': {
        icon: AccountBalanceWalletIcon,
        color: '#079669',
        background: '#e2f8ef',
        description: 'Combined transaction amount',
    },
}

function KPICard({ title, value }) {
    const config = CARD_CONFIG[title] || {
        icon: AccountBalanceWalletIcon,
        color: '#1765d1',
        background: '#e8f2ff',
        description: 'Banking overview',
    }

    const Icon = config.icon

    return (
        <Paper
            elevation={0}
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: { xs: 1.5, sm: 2 },
                p: { xs: 2, sm: 2.5 },
                minWidth: 0,
                minHeight: 132,
                backgroundColor: '#ffffff',
                border: '1px solid #e5eaf2',
                borderRadius: 3,
                boxShadow: '0 4px 16px rgba(15, 45, 85, 0.04)',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(15, 45, 85, 0.09)',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    width: { xs: 42, sm: 48 },
                    height: { xs: 42, sm: 48 },
                    borderRadius: 2.5,
                    backgroundColor: config.background,
                    color: config.color,
                }}
            >
                <Icon sx={{ fontSize: { xs: 23, sm: 26 } }} />
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    component="h3"
                    sx={{
                        color: '#536782',
                        fontSize: { xs: 12, sm: 13 },
                        fontWeight: 600,
                        lineHeight: 1.5,
                        overflowWrap: 'anywhere',
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    component="p"
                    sx={{
                        mt: 1,
                        color: '#092f68',
                        fontSize: {
                            xs: 'clamp(20px, 4vw, 26px)',
                            sm: 'clamp(20px, 2vw, 29px)',
                        },
                        fontWeight: 750,
                        lineHeight: 1.25,
                        letterSpacing: '-0.5px',
                        overflowWrap: 'anywhere',
                    }}
                >
                    {value}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.75,
                        color: '#8291a7',
                        fontSize: 11,
                        lineHeight: 1.4,
                    }}
                >
                    {config.description}
                </Typography>
            </Box>
        </Paper>
    )

}

export default KPICard