import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { colorPalette } from '../constants/color';

const StyledButton = styled(Button)({
    // Base styles
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '8px',
    
    // Contained variant (default)
    backgroundColor: colorPalette.primary.main,
    color: colorPalette.text.primary,
    padding: '10px 0',
    '&:hover': {
        backgroundColor: colorPalette.primary.dark,
    },
    
    // Outlined variant
    '&.MuiButton-outlined': {
        backgroundColor: 'transparent',
        borderColor: colorPalette.primary.main,
        color: colorPalette.primary.main,
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderColor: colorPalette.primary.dark,
        }
    },
    
    // Disabled state
    '&.Mui-disabled': {
        backgroundColor: colorPalette.background.field,
        color: colorPalette.text.secondary,
    },
});

export default StyledButton;
