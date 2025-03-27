'use client';

import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Box } from '@mui/material';
import { authUtils } from '@/lib/utils';

export default function LandingPage() {
  const user = authUtils.getUserData();
  const loggedIn = user !== null;

  return (
      <div style={{ minHeight: '100vh' }}>
        {/* Navigation Bar */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Smart Attendance
            </Typography>
            {loggedIn ? (
              <Button color="inherit" href="/dashboard">Dashboard</Button>
            ) : (
              <Button color="inherit" href="/login">Login</Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          background: 'linear-gradient(45deg, #f3f4f6 30%, #e5e7eb 90%)',
        }}>
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Smart Attendance System
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Revolutionizing classroom attendance management for educators.
              Track, manage, and analyze student attendance with cutting-edge technology.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                href={loggedIn ? "/dashboard" : "/login"}
              >
                {loggedIn ? "Go to Dashboard" : "Get Started"}
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {[
              {
                title: 'Facial Recognition',
                description: 'Instant student check-in using facial recognition technology.',
              },
              {
                title: 'Real-Time Tracking',
                description: 'Monitor attendance in real-time with live updates.',
              },
              {
                title: 'Detailed Reports',
                description: 'Generate comprehensive reports for your records.',
              },
            ].map((feature) => (
              <Grid item key={feature.title} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {feature.title}
                    </Typography>
                    <Typography>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Footer */}
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Smart Attendance System. All rights reserved.
          </Typography>
        </Box>
      </div>
  );
}
