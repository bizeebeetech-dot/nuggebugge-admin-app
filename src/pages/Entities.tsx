import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import { Logout, Person, KeyboardArrowDown } from '@mui/icons-material';
import EntityTable from '../components/EntityTable';
import authService from '../services/auth.service';
import { EntityType } from '../services/entity.service';

interface TabConfig {
  label: string;
  entityType: EntityType;
  title: string;
}

const tabs: TabConfig[] = [
  { label: 'State', entityType: 'state', title: 'State' },
  { label: 'Degree', entityType: 'degree', title: 'Degree' },
  { label: 'Branch', entityType: 'branch', title: 'Branch' },
  { label: 'Batch', entityType: 'batch', title: 'Batch' },
  { label: 'Implementation year', entityType: 'implementation_year', title: 'Implementation Year' },
  { label: 'Activity Category', entityType: 'activity_category', title: 'Activity Category' },
  { label: 'Activity Type', entityType: 'activity_type', title: 'Activity Type' },
];

export default function Entities() {
  const [activeTab, setActiveTab] = useState(0);
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    authService.logout();
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: '#1a1a2e',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #7877c6 0%, #5a59a5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            nuggebugge
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#7877c6',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                {getInitials()}
              </Avatar>
              <Box sx={{ ml: 1.5, textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                <Typography
                  sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.2 }}
                >
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                  {user?.email}
                </Typography>
              </Box>
              <KeyboardArrowDown sx={{ color: 'rgba(255,255,255,0.5)', ml: 0.5 }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  bgcolor: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '& .MuiMenuItem-root': {
                    color: '#fff',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  },
                },
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Person sx={{ mr: 1.5, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }} />
                Profile
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <MenuItem onClick={handleLogout} sx={{ color: '#ff6b6b !important' }}>
                <Logout sx={{ mr: 1.5, fontSize: '1.2rem' }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Page Title */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
              ADD ENTITIES
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: '1px solid #e5e7eb' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#64748b',
                  minHeight: 48,
                  '&.Mui-selected': {
                    color: '#3b82f6',
                  },
                },
                '& .MuiTabs-indicator': {
                  bgcolor: '#3b82f6',
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.entityType}
                  label={tab.label}
                  sx={{
                    bgcolor: activeTab === index ? '#fff' : '#e5e7eb',
                    borderRight: '1px solid #d1d5db',
                    '&:first-of-type': {
                      borderTopLeftRadius: 0,
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            <EntityTable
              entityType={tabs[activeTab].entityType}
              title={tabs[activeTab].title}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

