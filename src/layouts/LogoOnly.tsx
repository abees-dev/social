import { Box, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Logo from 'src/components/Logo';

const LogoStyled = styled('header')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  width: '100%',
  paddingTop: theme.spacing(6),
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}));

export default function LogoOnly() {
  return (
    <Box>
      <LogoStyled>
        <Logo sx={{ width: 32, height: 32 }} link="/" />
      </LogoStyled>
      <Outlet />
    </Box>
  );
}
