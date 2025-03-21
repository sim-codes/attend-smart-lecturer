import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { colorPalette } from '../constants/color';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: colorPalette.background.paper,
    color: colorPalette.text.primary,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    border: `1px solid ${colorPalette.background.field}`,
  },
}));

const StyledButton = styled(Button)({
  backgroundColor: colorPalette.primary.main,
  color: colorPalette.text.primary,
  padding: '10px 0',
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: colorPalette.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: colorPalette.background.field,
    color: colorPalette.text.secondary,
  },
});

// Updated usage in component
function ForgotPassword({ open, handleClose }) {
  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleClose();
          },
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <StyledButton variant='outlined' onClick={handleClose}>Cancel</StyledButton>
        <StyledButton variant="contained" type="submit">
          Continue
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
}

ForgotPassword.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ForgotPassword;
