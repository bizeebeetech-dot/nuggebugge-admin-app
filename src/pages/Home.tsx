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
} from '@mui/material';
import { Logout, Person, KeyboardArrowDown, Category, People, Home as HomeIcon, Event, Groups, BarChart, Dashboard, School, PersonSearch, Receipt, FitnessCenter, Assignment, Flag, Business, Build, MenuBook, Visibility, Group, Report, Feedback } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

function Home() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
      {/* Header / AppBar */}
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
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1a1a2e', mb: 1 }}>
          Welcome, {user?.first_name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your dashboard and access all features
        </Typography>

        {/* Quick Access Cards */}
        <Grid container spacing={3}>
          {/* Dashboard Card - First */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%)',
                color: '#fff',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                },
              }}
              onClick={() => navigate('/dashboard')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#7877c6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Dashboard sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Dashboard
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  View live stats, downloads & invoices
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/entities')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Category sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Add Entities
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage States, Districts, and School Boards
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Schools Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/schools')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#0891b2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <School sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Schools
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage schools with state, district & board
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Evaluation Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/evaluation')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#22c55e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Assignment sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Evaluation
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Evaluate student submissions (Active & Archive)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Activities Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/activities')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FitnessCenter sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Activities
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage activities and activity tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/users')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <People sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    User List
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage admin users and their access
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Student Profiles Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/student-profiles')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PersonSearch sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Student Profiles
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  View & manage student accounts with APP IDs
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Student Orders Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/student-orders')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#8b5cf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Receipt sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Student Orders
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Payment & invoice management with Excel export
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        {/* Website Pages Section */}
        <Typography variant="h5" component="h2" sx={{ color: '#1a1a2e', mt: 4, mb: 2 }}>
          Website Pages Management
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/home')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#ec4899',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <HomeIcon sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Page 1: Home
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  4 Sliding Cover Photos & Text Content
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/activities')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#8b5cf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Event sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Page 2: Activities
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  List of Activities with Photo Attachments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/about-us')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#14b8a6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Groups sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Page 3: About Us
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Team Members, Photos & Contact Details
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/statistics')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BarChart sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Page 4: Statistics
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Stats & App Feedback Scrolling Window
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Objective */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/objective')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Flag sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Objective
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage objective descriptions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Govt Projects */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/govt-projects')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Business sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Govt. Projects
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage government projects descriptions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* How To Implement */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/how-to-implement')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Build sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    How to Implement
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage implementation guides
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* User Manual */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/user-manual')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#8b5cf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MenuBook sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    User Manual
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage user manual content
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Vision and Mission */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/vision-mission')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#ec4899',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Visibility sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Vision and Mission
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage vision and mission statements
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Our Team */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/our-team')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#14b8a6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Group sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Our Team
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage team descriptions & photos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Complaints */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/complaints')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Report sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Complaints
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage complaints with title & description
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Feedback Page */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate('/website/feedback-page')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#06b6d4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feedback sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Feedback Page
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage feedback page descriptions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
