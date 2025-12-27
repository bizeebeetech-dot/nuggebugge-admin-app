import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Logout,
  Person,
  KeyboardArrowDown,
  ArrowBack,
  AdminPanelSettings,
  People,
  PhoneAndroid,
  Apple,
  CloudDownload,
  Receipt,
  Refresh,
  Circle,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import authService from '../services/auth.service';
import dashboardService from '../services/dashboard.service';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
  isLive?: boolean;
}

function StatCard({ title, value, icon, color, bgColor, subtitle, isLive }: StatCardProps) {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      {isLive && (
        <Chip
          icon={<Circle sx={{ fontSize: 8, color: '#22c55e', animation: 'pulse 2s infinite' }} />}
          label="LIVE"
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 10,
            bgcolor: '#dcfce7',
            color: '#166534',
            fontWeight: 600,
            fontSize: '0.65rem',
            '& .MuiChip-icon': { ml: 0.5 },
          }}
        />
      )}
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color, lineHeight: 1 }}>
              {value.toLocaleString()}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: bgColor,
              color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* CSS for pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: '#fff' }}>
              <ArrowBack />
            </IconButton>
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
              Dashboard
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => refetch()}
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
            >
              <Refresh />
            </IconButton>
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
              <KeyboardArrowDown sx={{ color: 'rgba(255,255,255,0.5)', ml: 0.5 }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
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
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress size={48} />
          </Box>
        ) : (
          <>
            {/* Live Stats Section */}
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Circle sx={{ fontSize: 12, color: '#22c55e', animation: 'pulse 2s infinite' }} />
              Live Statistics
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Admin Users Online */}
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Admin Users Online"
                  value={stats?.admin_users_online || 0}
                  icon={<AdminPanelSettings sx={{ fontSize: 28 }} />}
                  color="#7c3aed"
                  bgColor="#ede9fe"
                  isLive
                  subtitle={`of ${stats?.total_admin_users || 0} total admins`}
                />
              </Grid>

              {/* Students on Android */}
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Students Live on Android"
                  value={stats?.students_on_android || 0}
                  icon={<PhoneAndroid sx={{ fontSize: 28 }} />}
                  color="#16a34a"
                  bgColor="#dcfce7"
                  isLive
                />
              </Grid>

              {/* Students on iOS */}
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Students Live on iOS"
                  value={stats?.students_on_ios || 0}
                  icon={<Apple sx={{ fontSize: 28 }} />}
                  color="#1d4ed8"
                  bgColor="#dbeafe"
                  isLive
                />
              </Grid>
            </Grid>

            {/* Download Stats Section */}
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudDownload sx={{ color: '#6366f1' }} />
              App Downloads
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Android Downloads */}
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Android Downloads"
                  value={stats?.android_downloads || 0}
                  icon={<PhoneAndroid sx={{ fontSize: 28 }} />}
                  color="#16a34a"
                  bgColor="#dcfce7"
                  subtitle="Total Google Play downloads"
                />
              </Grid>

              {/* iOS Downloads */}
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="iOS Downloads"
                  value={stats?.ios_downloads || 0}
                  icon={<Apple sx={{ fontSize: 28 }} />}
                  color="#1d4ed8"
                  bgColor="#dbeafe"
                  subtitle="Total App Store downloads"
                />
              </Grid>

              {/* Total Downloads */}
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Total Downloads"
                  value={stats?.total_downloads || 0}
                  icon={<CloudDownload sx={{ fontSize: 28 }} />}
                  color="#6366f1"
                  bgColor="#e0e7ff"
                  subtitle="Combined all platforms"
                />
              </Grid>
            </Grid>

            {/* Other Stats Section */}
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Receipt sx={{ color: '#f59e0b' }} />
              Other Statistics
            </Typography>

            <Grid container spacing={3}>
              {/* Total Invoices */}
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Total Invoices"
                  value={stats?.total_invoices || 0}
                  icon={<Receipt sx={{ fontSize: 28 }} />}
                  color="#f59e0b"
                  bgColor="#fef3c7"
                  subtitle="All time invoice count"
                />
              </Grid>

              {/* Total Students */}
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Total Students"
                  value={stats?.total_students || 0}
                  icon={<People sx={{ fontSize: 28 }} />}
                  color="#0891b2"
                  bgColor="#cffafe"
                  subtitle="Registered in system"
                />
              </Grid>

              {/* Total Admin Users */}
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Total Admin Users"
                  value={stats?.total_admin_users || 0}
                  icon={<AdminPanelSettings sx={{ fontSize: 28 }} />}
                  color="#7c3aed"
                  bgColor="#ede9fe"
                  subtitle="Active admin accounts"
                />
              </Grid>
            </Grid>

            {/* Last Updated */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Auto-refreshes every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

