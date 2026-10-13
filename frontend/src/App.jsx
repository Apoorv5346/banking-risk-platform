import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material'

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'

import RiskDistributionChart from './components/RiskDistributionChart'
import ChannelAnalyticsChart from './components/ChannelAnalyticsChart'
import TransactionTable from './components/TransactionTable'
import KPICard from './components/KPICard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import './App.css'

const API_URL = 'http://127.0.0.1:8000'

const MENU_LABELS = [
  'Dashboard',
  'Transactions',
  'Customers',
  'Risk Analysis',
  'Analytics',
  'Reports',
  'Settings',
]

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)
}

function getField(transaction, ...keys) {
  for (const key of keys) {
    if (transaction?.[key] !== undefined && transaction[key] !== null) {
      return transaction[key]
    }
  }

  return ''
}

function downloadCSV(filename, rows) {
  if (!rows.length) {
    return false
  }

  const headers = Object.keys(rows[0])

  const escapeCSV = (value) => {
    const text = String(value ?? '')
    return `"${text.replace(/"/g, '""')}"`
  }

  const csv = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) =>
      headers.map((header) => escapeCSV(row[header])).join(',')
    ),
  ].join('\r\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)

  return true
}

function SectionHeading({ title, description, action }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary">
          {description}
        </Typography>
      </Box>

      {action}
    </Box>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('Dashboard')

  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [analyticsError, setAnalyticsError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const [transactions, setTransactions] = useState([])
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [transactionsError, setTransactionsError] = useState('')

  const [searchId, setSearchId] = useState('')
  const [riskLevel, setRiskLevel] = useState('')
  const [channel, setChannel] = useState('')

  const [compactMode, setCompactMode] = useState(false)
  const [showAmounts, setShowAmounts] = useState(true)
  const [settingsMessage, setSettingsMessage] = useState('')

  // Load dashboard analytics.
  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function loadAnalytics() {
      setAnalyticsLoading(true)
      setAnalyticsError('')

      try {
        const response = await fetch(`${API_URL}/analytics/summary`, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Analytics API returned HTTP ${response.status}`)
        }

        const data = await response.json()

        if (
          typeof data.total_transactions !== 'number' ||
          typeof data.total_amount !== 'number' ||
          !data.risk_distribution ||
          !Array.isArray(data.channel_distribution)
        ) {
          throw new Error('Invalid analytics response from backend.')
        }

        if (active) {
          setAnalytics(data)
        }
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          setAnalyticsError(
            error instanceof TypeError
              ? 'Cannot connect to FastAPI. Check that the backend is running.'
              : error.message || 'Unable to load analytics.'
          )
          console.error('Analytics API error:', error)
        }
      } finally {
        if (active) {
          setAnalyticsLoading(false)
        }
      }
    }

    loadAnalytics()

    return () => {
      active = false
      controller.abort()
    }
  }, [refreshKey])

  // Load transaction records for customer summaries and CSV reports.
  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function loadTransactions() {
      setTransactionsLoading(true)
      setTransactionsError('')

      try {
        const response = await fetch(
          `${API_URL}/transactions?page=1&limit=100`,
          {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(`Transactions API returned HTTP ${response.status}`)
        }

        const result = await response.json()

        // API returns an object containing a data array.
        const records = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : []

        if (active) {
          setTransactions(records)
        }
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          setTransactionsError(
            error instanceof TypeError
              ? 'Could not load transaction records.'
              : error.message || 'Unable to load transactions.'
          )
          console.error('Transactions API error:', error)
        }
      } finally {
        if (active) {
          setTransactionsLoading(false)
        }
      }
    }

    loadTransactions()

    return () => {
      active = false
      controller.abort()
    }
  }, [refreshKey])

  const riskDistribution = analytics?.risk_distribution || {}

  const mediumPlusRiskTransactions =
    Number(riskDistribution.Medium || 0) +
    Number(riskDistribution.High || 0) +
    Number(riskDistribution.Critical || 0)

  const highRiskTransactions =
    Number(riskDistribution.High || 0) +
    Number(riskDistribution.Critical || 0)

  const customers = useMemo(() => {
    const customerMap = new Map()

    for (const transaction of transactions) {
      const customerId = getField(
        transaction,
        'customer_id',
        'customerId'
      )

      if (!customerId) {
        continue
      }

      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          customerId,
          transactionCount: 0,
          totalAmount: 0,
          highRiskCount: 0,
          channels: new Set(),
        })
      }

      const customer = customerMap.get(customerId)
      const amount = Number(
        getField(transaction, 'amount', 'transaction_amount')
      ) || 0

      const risk = String(
        getField(transaction, 'risk_level', 'riskLevel')
      ).toLowerCase()

      const paymentChannel = getField(
        transaction,
        'channel',
        'payment_channel'
      )

      customer.transactionCount += 1
      customer.totalAmount += amount

      if (risk === 'high' || risk === 'critical') {
        customer.highRiskCount += 1
      }

      if (paymentChannel) {
        customer.channels.add(paymentChannel)
      }
    }

    return Array.from(customerMap.values())
      .map((customer) => ({
        ...customer,
        channels: Array.from(customer.channels).join(', '),
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
  }, [transactions])

  const reportRows = useMemo(
    () =>
      transactions.map((transaction) => ({
        transaction_id: getField(
          transaction,
          'transaction_id',
          'transactionId'
        ),
        customer_id: getField(
          transaction,
          'customer_id',
          'customerId'
        ),
        amount: getField(
          transaction,
          'amount',
          'transaction_amount'
        ),
        channel: getField(
          transaction,
          'channel',
          'payment_channel'
        ),
        location: getField(transaction, 'location'),
        risk_level: getField(
          transaction,
          'risk_level',
          'riskLevel'
        ),
      })),
    [transactions]
  )

  function handleNavigation(item) {
    if (MENU_LABELS.includes(item.label)) {
      setActiveSection(item.label)
      setSearchId('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function clearFilters() {
    setRiskLevel('')
    setChannel('')
    setSearchId('')
  }

  function refreshData() {
    setRefreshKey((key) => key + 1)
  }

  function exportTransactions() {
    const success = downloadCSV(
      'banking-risk-transactions.csv',
      reportRows
    )

    if (success) {
      setSettingsMessage('Transaction CSV exported successfully.')
    } else {
      setSettingsMessage('No transaction records are available to export.')
    }
  }

  function exportCustomers() {
    const rows = customers.map((customer) => ({
      customer_id: customer.customerId,
      transaction_count: customer.transactionCount,
      total_amount: customer.totalAmount,
      high_risk_count: customer.highRiskCount,
      channels: customer.channels,
    }))

    const success = downloadCSV('banking-risk-customers.csv', rows)

    setSettingsMessage(
      success
        ? 'Customer CSV exported successfully.'
        : 'No customer records are available to export.'
    )
  }

  const pageDescription = {
    Dashboard: 'Monitor banking activity and transaction risk.',
    Transactions: 'Review and filter individual transaction records.',
    Customers: 'Summaries calculated from the transaction records loaded by this dashboard.',
    'Risk Analysis': 'Review the distribution of rule-based transaction risk levels.',
    Analytics: 'Explore payment-channel activity and risk distribution.',
    Reports: 'Export the currently loaded transaction and customer records as CSV files.',
    Settings: 'Configure local dashboard display preferences.',
  }

  return (
    <div className={`app${compactMode ? ' compact-mode' : ''}`}>
      <Sidebar
        activeItem={activeSection}
        onNavigate={handleNavigation}
      />

      <div className="main">
        <Header onSearch={setSearchId} />

        <main className="content" id="dashboard">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
            }}
          >
            <Box className="page-heading">
              <div>
                <p>{activeSection.toUpperCase()}</p>
                <h1>
                  {activeSection === 'Dashboard'
                    ? 'Banking Risk Platform'
                    : activeSection}
                </h1>
                <span>{pageDescription[activeSection]}</span>
              </div>
            </Box>

            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={refreshData}
              disabled={analyticsLoading || transactionsLoading}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Refresh Data
            </Button>
          </Box>

          {(analyticsLoading || transactionsLoading) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 2,
              }}
            >
              <CircularProgress size={22} />
              <Typography color="text.secondary">
                Loading project data...
              </Typography>
            </Box>
          )}

          {analyticsError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" onClick={refreshData}>
                  Retry
                </Button>
              }
            >
              {analyticsError}
            </Alert>
          )}

          {transactionsError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {transactionsError}
            </Alert>
          )}

          {/* DASHBOARD */}
          {activeSection === 'Dashboard' && (
            <>
              {analytics && (
                <Box
                  className="kpi-container"
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'minmax(0, 1fr)',
                      sm: 'repeat(2, minmax(0, 1fr))',
                      xl: 'repeat(4, minmax(0, 1fr))',
                    },
                    gap: 2,
                    '& > *': { minWidth: 0 },
                  }}
                >
                  <KPICard
                    title="Total Transactions"
                    value={analytics.total_transactions.toLocaleString('en-IN')}
                  />

                  <KPICard
                    title="Medium+ Risk Transactions"
                    value={mediumPlusRiskTransactions.toLocaleString('en-IN')}
                  />

                  <KPICard
                    title="High Risk Transactions"
                    value={highRiskTransactions.toLocaleString('en-IN')}
                  />

                  <KPICard
                    title="Total Transaction Value"
                    value={formatCurrency(analytics.total_amount)}
                  />
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 2,
                  my: 3,
                  p: 2,
                  backgroundColor: '#fff',
                  border: '1px solid #e5eaf2',
                  borderRadius: 3,
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  <FormControl fullWidth size="small">
                    <InputLabel id="dashboard-risk-label">
                      Risk Level
                    </InputLabel>
                    <Select
                      labelId="dashboard-risk-label"
                      value={riskLevel}
                      label="Risk Level"
                      onChange={(event) => setRiskLevel(event.target.value)}
                    >
                      <MenuItem value="">All Risk Levels</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Critical">Critical</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel id="dashboard-channel-label">
                      Channel
                    </InputLabel>
                    <Select
                      labelId="dashboard-channel-label"
                      value={channel}
                      label="Channel"
                      onChange={(event) => setChannel(event.target.value)}
                    >
                      <MenuItem value="">All Channels</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                      <MenuItem value="ATM">ATM</MenuItem>
                      <MenuItem value="Online">Online</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Button variant="outlined" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Box>

              <Box id="dashboard-transactions">
                <TransactionTable
                  searchId={searchId}
                  riskLevel={riskLevel}
                  channel={channel}
                />
              </Box>

              {analytics && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'minmax(0, 1fr)',
                      md: 'repeat(2, minmax(0, 1fr))',
                    },
                    gap: 3,
                    mt: 3,
                    '& > *': { minWidth: 0, maxWidth: '100%' },
                  }}
                >
                  <RiskDistributionChart
                    distribution={riskDistribution}
                  />
                  <ChannelAnalyticsChart
                    channels={analytics.channel_distribution}
                  />
                </Box>
              )}
            </>
          )}

          {/* TRANSACTIONS */}
          {activeSection === 'Transactions' && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}
              >
                <FormControl size="small" sx={{ minWidth: 190 }}>
                  <InputLabel id="transactions-risk-label">
                    Risk Level
                  </InputLabel>
                  <Select
                    labelId="transactions-risk-label"
                    value={riskLevel}
                    label="Risk Level"
                    onChange={(event) => setRiskLevel(event.target.value)}
                  >
                    <MenuItem value="">All Risk Levels</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 190 }}>
                  <InputLabel id="transactions-channel-label">
                    Channel
                  </InputLabel>
                  <Select
                    labelId="transactions-channel-label"
                    value={channel}
                    label="Channel"
                    onChange={(event) => setChannel(event.target.value)}
                  >
                    <MenuItem value="">All Channels</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                    <MenuItem value="ATM">ATM</MenuItem>
                    <MenuItem value="Online">Online</MenuItem>
                  </Select>
                </FormControl>

                <Button variant="outlined" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Box>

              <TransactionTable
                searchId={searchId}
                riskLevel={riskLevel}
                channel={channel}
              />
            </>
          )}

          {/* CUSTOMERS */}
          {activeSection === 'Customers' && (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <SectionHeading
                  title="Customer Overview"
                  description={`${customers.length} unique customers in the loaded transaction records`}
                  action={
                    <Button
                      variant="contained"
                      startIcon={<DownloadRoundedIcon />}
                      onClick={exportCustomers}
                    >
                      Export Customers
                    </Button>
                  }
                />

                {transactionsLoading ? (
                  <CircularProgress />
                ) : customers.length === 0 ? (
                  <Alert severity="info">
                    No customer records are available. Check the transactions API.
                  </Alert>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Customer ID</th>
                          <th>Transactions</th>
                          <th>Total Amount</th>
                          <th>High/Critical Risk</th>
                          <th>Channels</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((customer) => (
                          <tr key={customer.customerId}>
                            <td>{customer.customerId}</td>
                            <td>{customer.transactionCount}</td>
                            <td>
                              <td>
                                {showAmounts
                                  ? formatCurrency(customer.totalAmount)
                                  : '••••••'}
                              </td>
                            </td>
                            <td>{customer.highRiskCount}</td>
                            <td>{customer.channels || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* RISK ANALYSIS */}
          {activeSection === 'Risk Analysis' && (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'minmax(0, 1fr)',
                    sm: 'repeat(3, minmax(0, 1fr))',
                  },
                  gap: 2,
                  mb: 3,
                }}
              >
                <KPICard
                  title="Medium+ Risk"
                  value={mediumPlusRiskTransactions.toLocaleString('en-IN')}
                />
                <KPICard
                  title="High/Critical Risk"
                  value={highRiskTransactions.toLocaleString('en-IN')}
                />
                <KPICard
                  title="Risk Engine"
                  value="Rule-based"
                />
              </Box>

              {analytics && (
                <Box sx={{ maxWidth: 800 }}>
                  <RiskDistributionChart
                    distribution={riskDistribution}
                  />
                </Box>
              )}

              <Alert severity="info" sx={{ mt: 3 }}>
                Risk levels are generated by the project's rule-based scoring
                engine. They are risk indicators, not confirmed fraud findings.
              </Alert>

              <Card variant="outlined" sx={{ mt: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Risk Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                    <Box
                      key={level}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1.25,
                      }}
                    >
                      <Typography>{level}</Typography>
                      <Chip
                        label={Number(riskDistribution[level] || 0)}
                        color={
                          level === 'Low'
                            ? 'success'
                            : level === 'Medium'
                              ? 'warning'
                              : 'error'
                        }
                        variant="outlined"
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {/* ANALYTICS */}
          {activeSection === 'Analytics' && (
            <>
              {analytics && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'minmax(0, 1fr)',
                      md: 'repeat(2, minmax(0, 1fr))',
                    },
                    gap: 3,
                    '& > *': { minWidth: 0, maxWidth: '100%' },
                  }}
                >
                  <RiskDistributionChart
                    distribution={riskDistribution}
                  />
                  <ChannelAnalyticsChart
                    channels={analytics.channel_distribution}
                  />
                </Box>
              )}

              {analytics && (
                <Card variant="outlined" sx={{ mt: 3, borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Channel Summary
                    </Typography>

                    <Box sx={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Channel</th>
                            <th>Transactions</th>
                            <th>Total Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.channel_distribution.map((item) => (
                            <tr key={item.channel}>
                              <td>{item.channel}</td>
                              <td>{item.count}</td>
                              <td>{formatCurrency(item.total_amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* REPORTS */}
          {activeSection === 'Reports' && (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <SectionHeading
                  title="Export Reports"
                  description="Download CSV files from the records currently loaded by this dashboard."
                />

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'minmax(0, 1fr)',
                      sm: 'repeat(2, minmax(0, 1fr))',
                    },
                    gap: 2,
                  }}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>
                        Transaction Report
                      </Typography>
                      <Typography color="text.secondary" sx={{ my: 2 }}>
                        Export transaction IDs, customer IDs, amounts,
                        channels, locations and risk levels.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<DownloadRoundedIcon />}
                        onClick={exportTransactions}
                        disabled={reportRows.length === 0}
                      >
                        Download Transactions CSV
                      </Button>
                    </CardContent>
                  </Card>

                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>
                        Customer Report
                      </Typography>
                      <Typography color="text.secondary" sx={{ my: 2 }}>
                        Export customer transaction counts, amounts,
                        channels and high/critical risk counts.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<DownloadRoundedIcon />}
                        onClick={exportCustomers}
                        disabled={customers.length === 0}
                      >
                        Download Customers CSV
                      </Button>
                    </CardContent>
                  </Card>
                </Box>

                {settingsMessage && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    {settingsMessage}
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* SETTINGS */}
          {activeSection === 'Settings' && (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <SectionHeading
                  title="Dashboard Settings"
                  description="These preferences affect the current browser session only."
                />

                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                      py: 2,
                    }}
                  >
                    <Box>
                      <Typography fontWeight={700}>
                        Compact Layout
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Reduce spacing in the dashboard.
                      </Typography>
                    </Box>
                    <Switch
                      checked={compactMode}
                      onChange={(event) =>
                        setCompactMode(event.target.checked)
                      }
                      inputProps={{ 'aria-label': 'Compact layout' }}
                    />
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                      py: 2,
                    }}
                  >
                    <Box>
                      <Typography fontWeight={700}>
                        Show Amounts
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Control amount visibility in the customer summary.
                      </Typography>
                    </Box>
                    <Switch
                      checked={showAmounts}
                      onChange={(event) =>
                        setShowAmounts(event.target.checked)
                      }
                      inputProps={{ 'aria-label': 'Show amounts' }}
                    />
                  </Box>

                  <Button
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start', mt: 2 }}
                    onClick={() => {
                      setCompactMode(false)
                      setShowAmounts(true)
                      setSettingsMessage('Dashboard preferences reset.')
                    }}
                  >
                    Reset Preferences
                  </Button>

                  {settingsMessage && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      {settingsMessage}
                    </Alert>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

export default App