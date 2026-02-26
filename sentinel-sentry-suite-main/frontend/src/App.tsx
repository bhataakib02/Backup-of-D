import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { 
  AppBar, Toolbar, Typography, Container, 
  Drawer, List, ListItem, ListItemIcon, 
  ListItemText, IconButton, Box, Theme
} from '@mui/material'
import {
  Security as SecurityIcon,
  BugReport as MalwareIcon,
  PhishingOutlined as PhishingIcon,
  NetworkCheck as NetworkIcon,
  Menu as MenuIcon
} from '@mui/icons-material'

import './utils/chartSetup'
import {
  Dashboard,
  PhishingAnalysis,
  MalwareScanner,
  NetworkMonitoring,
} from './pages'

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const menuItems = [
    { text: 'Dashboard', icon: <SecurityIcon />, path: '/' },
    { text: 'Phishing Analysis', icon: <PhishingIcon />, path: '/phishing' },
    { text: 'Malware Scanner', icon: <MalwareIcon />, path: '/malware' },
    { text: 'Network Monitoring', icon: <NetworkIcon />, path: '/network' },
  ]

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Sentinel Security Platform
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            display: { xs: 'none', sm: 'block' }
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem button key={item.text} component={Link} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem 
                  button 
                  key={item.text} 
                  component={Link} 
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/phishing" element={<PhishingAnalysis />} />
              <Route path="/malware" element={<MalwareScanner />} />
            <Route path="/network" element={<NetworkMonitoring />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  )
}

export default App