'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#F0F4F0',     // Light, soft green background
            paper: '#F5F7F5'         // Slightly lighter green for cards
        },
        primary: {
            main: '#4CAF50',         // Vibrant green as primary color
            dark: '#388E3C',          // Darker green for hover states
            light: '#8BC34A'          // Light green for accents
        },
        secondary: {
            main: '#00BFA5',         // Teal as secondary color
            dark: '#00897B'           // Darker teal for hover
        },
        text: {
            primary: '#0A2112',       // Dark green text for high readability
            secondary: '#183A22'       // Slightly lighter green for secondary text
        },
        error: {
            main: '#FF5252'           // Red for error states
        }
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            color: '#0A2112'
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            color: '#0A2112'
        },
        body1: {
            fontSize: '1rem',
            color: '#183A22'
        },
        body2: {
            fontSize: '0.875rem',
            color: '#183A22'
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: '#E6EDE6',  // Light green for input fields
                    borderRadius: 8,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#4CAF50',
                        },
                        '&:hover fieldset': {
                            borderColor: '#8BC34A',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00BFA5',
                        }
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8
                },
                containedPrimary: {
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                        backgroundColor: '#388E3C'
                    }
                },
                containedSecondary: {
                    backgroundColor: '#00BFA5',
                    '&:hover': {
                        backgroundColor: '#00897B'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F5F7F5',
                    borderRadius: 12,
                    boxShadow: '0 4px 6px rgba(10,33,18,0.1)'
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                standardError: {
                    backgroundColor: '#FFE5E5',
                    color: '#FF5252'
                },
                standardSuccess: {
                    backgroundColor: '#E6F4E6',
                    color: '#4CAF50'
                },
                standardWarning: {
                    backgroundColor: '#FFF3E0',
                    color: '#FF9800'
                },
                standardInfo: {
                    backgroundColor: '#E0F7FA',
                    color: '#00BFA5'
                }
            }
        }
    }
});

export default theme;