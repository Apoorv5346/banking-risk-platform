
import { useEffect, useState } from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
} from '@mui/material'

import RiskDistributionChart from './components/RiskDistributionChart'
import ChannelAnalyticsChart from './components/ChannelAnalyticsChart'
import TransactionTable from './components/TransactionTable'
import KPICard from './components/KPICard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import './App.css'

const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchId, setSearchId] = useState('')
  const [riskLevel, setRiskLevel] = useState('')
  const [channel, setChannel] = useState('')

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`${API_URL}/analytics/summary`)

        if (!response.ok) {
          throw new Error('Could not fetch analytics data')
        }

        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  const riskDistribution = analytics?.risk_distribution || {}

  const suspiciousTransactions =
    (riskDistribution.Medium || 0) +
    (riskDistribution.High || 0) +
    (riskDistribution.Critical || 0)

  const highRiskTransactions =
    (riskDistribution.High || 0) +
    (riskDistribution.Critical || 0)

  function clearFilters() {
    setRiskLevel('')
    setChannel('')
    setSearchId('')
  }

  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        <Header onSearch={setSearchId} />

        <main className="content">
          <div className="page-heading">
            <div>
              <p>OVERVIEW</p>
              <h1>Banking Risk Platform</h1>
              <span>
                Monitor transactions and identify potentially suspicious activity.
              </span>
            </div>
          </div>

          {loading && <p>Loading analytics...</p>}

          {error && <p role="alert">Analytics error: {error}</p>}

          {!loading && !error && analytics && (
            <>
              {!searchId.trim() && (
                <div className="kpi-container">
                  <KPICard
                    title="Total Transactions"
                    value={analytics.total_transactions.toLocaleString('en-IN')}
                  />

                  <KPICard
                    title="Suspicious Transactions"
                    value={suspiciousTransactions.toLocaleString('en-IN')}
                  />

                  <KPICard
                    title="High Risk Transactions"
                    value={highRiskTransactions.toLocaleString('en-IN')}
                  />

                  <KPICard
                    title="Total Transaction Value"
                    value={formatCurrency(analytics.total_amount)}
                  />
                </div>
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
                  sx={{ flex: 1, flexWrap: 'wrap' }}
                >
                  <FormControl size="small" sx={{ minWidth: 190 }}>
                    <InputLabel id="risk-level-label">
                      Risk Level
                    </InputLabel>

                    <Select
                      labelId="risk-level-label"
                      id="risk-level"
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
                    <InputLabel id="channel-label">
                      Channel
                    </InputLabel>

                    <Select
                      labelId="channel-label"
                      id="channel"
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

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={clearFilters}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    minHeight: 40,
                  }}
                >
                  Clear Filters
                </Button>
              </Box>

              <TransactionTable
                searchId={searchId}
                riskLevel={riskLevel}
                channel={channel}
              />

              <RiskDistributionChart
                distribution={riskDistribution}
              />

              <ChannelAnalyticsChart
                channels={analytics.channel_distribution || []}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
