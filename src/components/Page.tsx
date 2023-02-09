import { forwardRef, ReactElement } from 'react';
import { Box, BoxProps } from '@mui/material';
import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------

interface IPage extends BoxProps {
  title: string;
  meta?: ReactElement;
}

// eslint-disable-next-line react/display-name
const Page = forwardRef(({ children, title = '', meta, ...other }: IPage, ref) => (
  <>
    <Helmet>
      <title>{`${title} | Page`}</title>
      {meta}
    </Helmet>

    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));

export default Page;
