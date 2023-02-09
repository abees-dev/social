import { Skeleton, Stack, StackProps } from '@mui/material';
import React, { forwardRef } from 'react';

// eslint-disable-next-line react/display-name
const FeelingSkeleton = forwardRef(({ ...other }: StackProps, ref) => (
  <Stack spacing={1} direction="row" alignItems="center" ref={ref} {...other}>
    <Skeleton animation="wave" variant="rounded" width="100%" height={56} />
    <Skeleton animation="wave" variant="rounded" width="100%" height={56} />
  </Stack>
));

export default FeelingSkeleton;
