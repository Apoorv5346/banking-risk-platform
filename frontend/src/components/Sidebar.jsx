import { Box, Typography } from '@mui/material'

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'

const MENU_ITEMS = [
    { label: 'Dashboard', icon: DashboardRoundedIcon, target: 'dashboard' },
    { label: 'Transactions', icon: ReceiptLongRoundedIcon, target: 'transactions' },
    { label: 'Customers', icon: GroupsRoundedIcon, target: 'customers' },
    { label: 'Risk Analysis', icon: BarChartRoundedIcon, target: 'risk-analysis' },
    { label: 'Analytics', icon: PieChartRoundedIcon, target: 'analytics' },
    { label: 'Reports', icon: AssessmentRoundedIcon, target: 'reports' },
    { label: 'Settings', icon: SettingsRoundedIcon, target: 'settings' },
]

function Sidebar({ activeItem = 'Dashboard', onNavigate }) {
    function handleNavigation(item) {
        if (typeof onNavigate === 'function') {
            onNavigate(item)
            return
        }

        const section = document.getElementById(item.target)

        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }

    return (
        <Box
            component="aside"
            className="sidebar"
            sx={{
                position: { xs: 'relative', md: 'fixed' },
                top: 0,
                left: 0,
                zIndex: 20,
                width: { xs: '100%', md: 240 },
                minWidth: 0,
                height: { xs: 'auto', md: '100vh' },
                minHeight: { xs: 'auto', md: '100vh' },
                overflowY: { xs: 'visible', md: 'auto' },
                boxSizing: 'border-box',
                background: 'linear-gradient(180deg, #092b58 0%, #041a38 100%)',
                color: '#fff',
                p: 2,
            }}
        >
            <Typography
                component="div"
                sx={{
                    fontSize: 22,
                    fontWeight: 800,
                    lineHeight: 1.25,
                    px: 1.5,
                    py: 1.5,
                    mb: 2,
                    letterSpacing: '-0.5px',
                }}
            >
                Banking Risk
                <Box component="span" sx={{ display: 'block' }}>
                    Platform
                </Box>
            </Typography>

            <Box
                component="nav"
                aria-label="Main navigation"
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', md: 'column' },
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    gap: 0.75,
                }}
            >
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon
                    const active = activeItem === item.label

                    return (
                        <Box
                            key={item.target}
                            component="button"
                            type="button"
                            onClick={() => handleNavigation(item)}
                            aria-current={active ? 'page' : undefined}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                flex: { xs: '1 1 135px', md: '0 0 auto' },
                                width: { xs: 'auto', md: '100%' },
                                minWidth: 0,
                                minHeight: 44,
                                px: 1.5,
                                py: 1,
                                border: 0,
                                borderRadius: 2,
                                color: active ? '#fff' : '#d7e5fa',
                                backgroundColor: active ? '#1765d1' : 'transparent',
                                cursor: 'pointer',
                                textAlign: 'left',
                                font: 'inherit',
                                transition: 'background-color 160ms ease',
                                '&:hover': {
                                    backgroundColor: active
                                        ? '#1765d1'
                                        : 'rgba(255,255,255,0.10)',
                                },
                                '&:focus-visible': {
                                    outline: '2px solid #93c5fd',
                                    outlineOffset: 2,
                                },
                            }}
                        >
                            <Icon sx={{ fontSize: 22, flexShrink: 0 }} />

                            <Typography
                                component="span"
                                sx={{
                                    fontSize: 13,
                                    fontWeight: active ? 700 : 500,
                                    color: 'inherit',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )

}

export default Sidebar