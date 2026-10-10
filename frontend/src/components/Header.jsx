
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
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

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
                backgroundColor: '#fff',
                minWidth: 0,
            }}
        >
            <Toolbar
                sx={{
                    minHeight: { xs: 72, sm: 88 },
                    px: { xs: 1.5, sm: 2, md: 4 },
                    gap: { xs: 1, sm: 2 },
                    justifyContent: 'space-between',
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 0.5, sm: 1 },
                        flex: 1,
                        minWidth: 0,
                        maxWidth: 600,
                        p: { xs: 0.5, sm: 1 },
                        borderRadius: 3,
                        backgroundColor: '#f2f6fc',
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        placeholder="Search Transaction ID..."
                        slotProps={{
                            htmlInput: {
                                'aria-label': 'Search by Transaction ID',
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            minWidth: 0,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                borderRadius: 2,
                            },
                        }}
                    />

                    {searchText && (
                        <Button
                            type="button"
                            color="inherit"
                            onClick={handleClear}
                            sx={{
                                minWidth: { xs: 'auto', sm: 64 },
                                px: { xs: 0.5, sm: 1 },
                            }}
                        >
                            Clear
                        </Button>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            minWidth: { xs: 40, sm: 100 },
                            px: { xs: 1, sm: 2 },
                            borderRadius: 2,
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <Box
                            component="span"
                            sx={{ display: { xs: 'none', sm: 'inline' } }}
                        >
                            Search
                        </Box>
                        <Box
                            component="span"
                            sx={{ display: { xs: 'inline', sm: 'none' } }}
                        >
                            <SearchIcon fontSize="small" />
                        </Box>
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 0, sm: 1.5 },
                        flexShrink: 0,
                    }}
                >
                    <Tooltip title="Notifications">
                        <IconButton aria-label="Notifications" size="small">
                            <NotificationsNoneIcon />
                        </IconButton>
                    </Tooltip>

                    <Avatar
                        sx={{
                            bgcolor: '#1765d1',
                            width: { xs: 34, sm: 44 },
                            height: { xs: 34, sm: 44 },
                            fontSize: { xs: 14, sm: 20 },
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
