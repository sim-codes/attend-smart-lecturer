'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Box,
  useScrollTrigger,
  Fade,
  Zoom
} from '@mui/material';
import { authUtils } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FaceRetouchingNatural, AccessTime, Assessment } from '@mui/icons-material';

// Animate on scroll component
const AnimatedBox = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

// Shrinking header on scroll
function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    sx: {
      transition: 'all 0.3s ease-in-out',
      ...(trigger ? {
        padding: '0.5rem 0',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      } : {
        padding: '1rem 0',
      }),
    },
  });
}

export default function LandingPage() {
  const user = authUtils.getUserData();
  const loggedIn = user !== null;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Feature cards data with icons
  const features = [
    {
      title: 'Facial Recognition',
      description: 'Instant student check-in using facial recognition technology.',
      icon: <FaceRetouchingNatural fontSize="large" color="secondary" />,
    },
    {
      title: 'Real-Time Tracking',
      description: 'Monitor attendance in real-time with live updates.',
      icon: <AccessTime fontSize="large" color="secondary" />,
    },
    {
      title: 'Detailed Reports',
      description: 'Generate comprehensive reports for your records.',
      icon: <Assessment fontSize="large" color="secondary" />,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Navigation Bar */}
      <ElevationScroll>
        <AppBar position="sticky" color="primary">
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                '&:hover': {
                  letterSpacing: '0.5px',
                  transform: 'scale(1.01)',
                }
              }}
            >
              Smart Attendance
            </Typography>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {loggedIn ? (
                <Button 
                  color="inherit" 
                  href="/dashboard"
                  sx={{ 
                    borderRadius: '20px',
                    padding: '8px 16px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <Button 
                  color="inherit" 
                  href="/login"
                  sx={{ 
                    borderRadius: '20px',
                    padding: '8px 16px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  Login
                </Button>
              )}
            </motion.div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>

      {/* Hero Section */}
      <Box 
        sx={{
          bgcolor: 'background.paper',
          pt: 12,
          pb: 8,
          background: 'linear-gradient(45deg, #f3f4f6 30%, #e5e7eb 90%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background elements */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden' }}>
          {mounted && [...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                background: `rgba(66, 133, 244, ${0.03 + i * 0.01})`,
                borderRadius: '50%',
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </Box>

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={mounted} timeout={1000}>
            <div>
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                Smart Attendance System
              </Typography>
            </div>
          </Fade>
          <Fade in={mounted} timeout={1500}>
            <div>
              <Typography 
                variant="h5" 
                align="center" 
                color="text.secondary" 
                paragraph
                sx={{ 
                  maxWidth: '800px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                Revolutionizing classroom attendance management for educators.
                Track, manage, and analyze student attendance with cutting-edge technology.
              </Typography>
            </div>
          </Fade>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Zoom in={mounted} timeout={2000}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  href={loggedIn ? "/dashboard" : "/login"}
                  sx={{ 
                    borderRadius: '30px',
                    padding: '12px 30px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  {loggedIn ? "Go to Dashboard" : "Get Started"}
                </Button>
              </motion.div>
            </Zoom>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 10 }} maxWidth="md">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 6 }}
        >
          <AnimatedBox>
            Our Features
          </AnimatedBox>
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={feature.title} xs={12} sm={6} md={4}>
              <AnimatedBox delay={index * 0.2}>
                <motion.div
                  whileHover={{ 
                    y: -10,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ 
                      flexGrow: 1, 
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography gutterBottom variant="h5" component="h2">
                        {feature.title}
                      </Typography>
                      <Typography>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <AnimatedBox>
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            py: 8,
            mt: 8,
            position: 'relative', 
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
              Ready to transform your attendance system?
            </Typography>
            <Typography variant="h6" align="center" sx={{ mb: 4, fontWeight: 'normal' }}>
              Join thousands of educators who have already made the switch.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  href="/signup"
                  sx={{ 
                    borderRadius: '30px',
                    padding: '12px 30px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'white',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  Sign Up Now
                </Button>
              </motion.div>
            </Box>
          </Container>
        </Box>
      </AnimatedBox>

      {/* Footer */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper', 
          p: 6, 
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }} 
        component="footer"
      >
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
          © {new Date().getFullYear()} Smart Attendance System. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Made with ❤️ for educators everywhere
        </Typography>
      </Box>
    </div>
  );
}
