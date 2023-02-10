import React from 'react';
import { styled } from '@mui/material';
import { useAppSelector } from 'src/redux/hooks';
import { useQuery } from '@tanstack/react-query';
import { getSuggestions } from 'src/api/friendship.api';
import Suggestions from './Suggestions';
import Contact from 'src/sections/home/Contact';

interface RootStyleProps {
  isOffset?: boolean;
}
const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

function RightNavBar() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <RootStyle>
      <Suggestions />
      <Contact />
    </RootStyle>
  );
}

export default RightNavBar;
