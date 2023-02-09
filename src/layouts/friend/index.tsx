import { Container, styled } from '@mui/material';
import Page from 'src/components/Page';
import { NAVBAR } from 'src/config';
import { Outlet } from 'react-router-dom';
import FriendNavBar from 'src/layouts/friend/FriendNavBar';

const RootStyled = styled('div')(({ theme }) => ({}));
const MainStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: theme.spacing(3),
  marginLeft: NAVBAR.NAV_DESKTOP_WIDTH,
}));

export default function Friend() {
  return (
    <Page title="Friend">
      <RootStyled>
        <FriendNavBar />
        <MainStyled>
          <Outlet />
        </MainStyled>
      </RootStyled>
    </Page>
  );
}
