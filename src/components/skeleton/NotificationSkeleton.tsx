import { Skeleton, Stack, StackProps } from '@mui/material';
import React, { forwardRef } from 'react';

// eslint-disable-next-line react/display-name
const NotificationSkeleton = forwardRef(({ ...other }: StackProps, ref) => (
  <Stack direction="row" spacing={1} alignItems="center" ref={ref} {...other}>
    <Skeleton variant="circular" width={40} height={40} />
    <Stack sx={{ flex: 1 }}>
      <Skeleton />
      <Skeleton />
    </Stack>
  </Stack>
));

export default NotificationSkeleton;
