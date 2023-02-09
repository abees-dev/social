import { alpha, Box, styled, SxProps } from '@mui/material';
import { ReactNode, useEffect, useRef } from 'react';
import SimpleBarReact from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const RootStyle = styled('div')(() => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
}));

const SimpleBarStyle = styled(SimpleBarReact)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: alpha(theme.palette.grey[600], 0.48),
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 8,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6,
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
}));

interface ScrollBarProps extends SimpleBarReact.Props {
  children: ReactNode;
  sx?: SxProps;
}
// type ScrollBarType = ScrollBarProp & SimpleBarReact.Props;

const ScrollBar = ({ children, sx, ...other }: ScrollBarProps) => {
  return (
    <RootStyle>
      <SimpleBarStyle clickOnTrack={false} sx={sx} {...other}>
        {children}
      </SimpleBarStyle>
    </RootStyle>
  );
};

export default ScrollBar;
