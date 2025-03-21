
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { colorPalette } from '../constants/color';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    backgroundColor: colorPalette.background.paper,
    color: colorPalette.text.primary,
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    border: `1px solid ${colorPalette.background.field}`
}));

export default Card;
