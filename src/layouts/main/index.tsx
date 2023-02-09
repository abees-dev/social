import { styled } from '@mui/material';
import Header from '../header';

const RootStyle = styled('div')(() => ({}));
export default function MainLayout() {
  return (
    <RootStyle>
      <Header variants="main" />
    </RootStyle>
  );
}
