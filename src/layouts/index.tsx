import { styled } from '@mui/material';
import React, { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/guards/AuthGuard';
import DashboardLayout from './dashboard';
import LogoOnly from './LogoOnly';
import MainLayout from './main';
import { useAppSelector } from 'src/redux/hooks';
import { ConversationMinimized, ConversationPopup } from 'src/sections/conversation';

type Variants = 'dashboard' | 'logoOnly' | 'main';
interface ILayout {
  variants?: Variants;
}

export default function Layout({ variants = 'main' }: ILayout) {
  if (variants === 'logoOnly') {
    return <LogoOnly />;
  }

  if (variants === 'dashboard') {
    return (
      <RenderContent>
        <DashboardLayout />
      </RenderContent>
    );
  }

  return (
    <RenderContent>
      <MainLayout />
    </RenderContent>
  );
}

const RootStyle = styled('div')(() => ({
  display: 'flex',
}));

const MainStyle = styled('main')<MainStyleProps>(({ theme, variants }) => ({
  flex: 1,
  paddingTop: theme.spacing(15),
  paddingRight: theme.spacing(4),
  paddingLeft: theme.spacing(4),
  paddingBottom: theme.spacing(15),

  ...(variants === 'main' && {
    [theme.breakpoints.up('lg')]: {},
  }),
}));

interface MainStyleProps {
  variants?: Variants;
}

interface RenderContentProps {
  children: ReactElement;
  variants?: Variants;
}

function RenderContent({ children, variants }: RenderContentProps) {

  return (
    <RootStyle>
      <AuthGuard>{children}</AuthGuard>

      <MainStyle>
        <Outlet />
      </MainStyle>

      <ConversationMinimized />

      <ConversationPopup />
    </RootStyle>
  );
}
