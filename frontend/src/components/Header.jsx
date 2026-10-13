
import { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Box,
    TextField,
    Button,
    IconButton,
    Avatar,
    InputAdornment,
    Tooltip,
    Typography,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'

function Header({ onSearch }) {
    const [searchText, setSearchText] = useState('')

    function handleSearch(event) {
        event.preventDefault()
        onSearch(searchText.trim())
    }

    function handleClear() {
        setSearchText('')
        onSearch('')
    }

    return (
        <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{
                borderBottom: '1px solid #e5eaf2',
                background: '#f3f7fd',
                minWidth: 0,
            }}
        >
            <Toolbar
                sx={{
                    minHeight: { xs: 68, sm: 76 },
                    px: { xs: 1.5, sm: 2.5, md: 3 },
                    gap: 2,
                    justifyContent: 'space-between',
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    py: { xs: 1, md: 0 },
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flex: 1,
                        minWidth: { xs: '100%', md: 220 },
                        maxWidth: 590,
                        p: 0.5,
                        borderRadius: 3,
                        backgroundColor: '#e5effb',
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        placeholder="Search transactions, customers, or risk alerts..."
                        slotProps={{
                            htmlInput: {
                                'aria-label': 'Search by Transaction ID',
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#17477e' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            minWidth: 0,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'transparent',
                                borderRadius: 2,
                                '& fieldset': { border: 'none' },
                            },
                            '& input': { fontSize: 14 },
                        }}
                    />

                    {searchText && (
                        <Button
                            type="button"
                            color="inherit"
                            onClick={handleClear}
                            sx={{ minWidth: 'auto', textTransform: 'none' }}
                        >
                            Clear
                        </Button>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        aria-label="Search transactions"
                        sx={{
                            minWidth: { xs: 40, sm: 44 },
                            px: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        <SearchIcon fontSize="small" />
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: { xs: 0.5, sm: 1.5 },
                        flexShrink: 0,
                        ml: 'auto',
                    }}
                >
                    <Box
                        sx={{
                            display: { xs: 'none', lg: 'flex' },
                            alignItems: 'center',
                            gap: 1,
                            px: 1.5,
                            py: 1,
                            borderRadius: 3,
                            backgroundColor: '#e5effb',
                            color: '#173b70',
                        }}
                    >
                        <CalendarMonthRoundedIcon fontSize="small" />
                        <Typography variant="body2" fontWeight={600}>
                            Transaction Overview
                        </Typography>
                    </Box>

                    <Tooltip title="Notifications">
                        <IconButton aria-label="Notifications" size="small">
                            <NotificationsNoneIcon sx={{ color: '#173b70' }} />
                        </IconButton>
                    </Tooltip>

                    <Avatar
                        sx={{
                            bgcolor: '#075ed3',
                            width: { xs: 34, sm: 42 },
                            height: { xs: 34, sm: 42 },
                            fontSize: 15,
                            fontWeight: 700,
                        }}
                    >
                        AK
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header
