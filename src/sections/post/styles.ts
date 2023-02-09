import { styled } from '@mui/material';

export const HeaderStyle = styled('header')(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'relative',
}));
export const CloseIconStyle = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: theme.spacing(4),
  transform: 'translate(-50%, -50%)',
}));

export const InputStyled = styled('div')(({ theme }) => ({
  minHeight: 48,
  paddingLeft: theme.spacing(1),
  flex: 1,
  display: 'flex',
  width: '100%',
  backgroundColor: theme.palette.action.focus,
  borderRadius: theme.spacing(1),
}));

export const FooterStyle = styled('footer')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.spacing(2),
}));
