import { styled } from '@mui/material';
import Header from '../header';
import Navbar from './navbar';

const RootStyle = styled('div')(() => ({}));

export default function DashboardLayout() {
  return (
    <RootStyle>
      <Header variants="dashboard" />
      <Navbar />
    </RootStyle>
  );
}
