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
        mode: 'dark',
        background: {
            default: '#0A1F0A',
            paper: '#102110'
        },
        primary: {
            main: '#4CAF50',
            dark: '#388E3C',
            light: '#8BC34A'
        },
        secondary: {
            main: '#00BFA5',
            dark: '#00897B'
        },
        text: {
            primary: '#E0E6E0',
            secondary: '#A0AFA0'
        },
        error: {
            main: '#FF5252'
        },
        divider: '#1E3E1E',
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            color: '#E0E6E0'
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            color: '#E0E6E0'
        },
        body1: {
            fontSize: '1rem',
            color: '#C0D0C0'
        },
        body2: {
            fontSize: '0.875rem',
            color: '#A0AFA0'
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: '#152715',
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
                    },
                    '& .MuiInputLabel-root': {
                        color: '#A0AFA0',
                    },
                    '& .MuiInputBase-input': {
                        color: '#E0E6E0',
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
                },
                outlined: {
                    borderColor: '#4CAF50',
                    color: '#4CAF50',
                    '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.08)'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#102110',
                    borderRadius: 12,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#102110',
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                standardError: {
                    backgroundColor: '#3F1E1E',
                    color: '#FF7070'
                },
                standardSuccess: {
                    backgroundColor: '#1F3F1F',
                    color: '#7AFF7A'
                },
                standardWarning: {
                    backgroundColor: '#3F2E1F',
                    color: '#FFBB70'
                },
                standardInfo: {
                    backgroundColor: '#1F3F3F',
                    color: '#70FFFF'
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#061506',
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#0A1F0A',
                }
            }
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    color: '#4CAF50',
                    '&.Mui-checked': {
                        color: '#4CAF50',
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#388E3C',
                    },
                },
                track: {
                    backgroundColor: '#1E3E1E',
                }
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#4CAF50',
                    '&.Mui-checked': {
                        color: '#4CAF50',
                    }
                }
            }
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: '#4CAF50',
                    '&.Mui-checked': {
                        color: '#4CAF50',
                    }
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(76, 175, 80, 0.16)',
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.24)',
                    },
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1E3E1E',
                }
            }
        }
    }
});

export default theme;
