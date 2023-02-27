import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { capitalCase } from 'change-case';
import { capitalize, flatten, isEmpty } from 'lodash';
import { MouseEvent, useState } from 'react';
import IconButtonAnimate from 'src/components/animate/IconButtonAnimate';
import Iconify from 'src/components/Iconify';
import { NotificationsIcon } from 'src/components/icons';
import Popover from 'src/components/Popover';
import NotificationSkeleton from 'src/components/skeleton/NotificationSkeleton';
import TextMaxLine from 'src/components/TextMaxLine';
import { useAppSelector } from 'src/redux/hooks';

import { NotificationQueryResponse } from 'src/types/Response';
import { fDistanceToNow } from 'src/utils/formatTime';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getNotification } from 'src/api/nestjs.notification';

const NotificationPopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { isLoading, fetchNextPage, hasNextPage, data } = useInfiniteQuery(
    [
      'NOTIFICATION',
      {
        user_id: user?._id,
      },
    ],
    async ({ pageParam }) =>
      getNotification({
        limit: 10,
        position: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage?.length === 10) {
          return lastPage?.[lastPage?.length - 1]?.position;
        }
        return false;
      },
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleOpenPopover = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOpenPopover}>
        <Badge badgeContent={1} color="error">
          {/* <Iconify icon="ooui:bell" sx={{ width: 22, height: 22 }} /> */}
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClosePopover} sx={{ maxHeight: 600 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, pb: 1 }}>
          <Box>
            <Typography variant="subtitle1">Notification</Typography>
            <Typography variant="caption">{`You have 1 unread messages`}</Typography>
          </Box>
          <IconButtonAnimate size="small">
            <Iconify icon="charm:tick-double" />
          </IconButtonAnimate>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <List disablePadding>
          {!isLoading ? (
            flatten(data?.pages)?.map((notification, index) => (
              <ListItemButton key={index} selected={notification.is_read == 0}>
                <ListItemAvatar>
                  <Avatar alt={notification?.name} src={notification?.avatar} />
                </ListItemAvatar>

                <ListItemText>
                  <TextMaxLine variant="subtitle2">
                    <Typography variant="body2" component="span" ml={0.5}>
                      {capitalize(notification.title)}
                    </Typography>
                  </TextMaxLine>
                  <Typography variant="caption" ml={0.5}>{`${notification.name} ${notification.content}`}</Typography>
                </ListItemText>
              </ListItemButton>
            ))
          ) : (
            <NotificationSkeleton sx={{ px: 2, py: 1 }} />
          )}
        </List>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            size="small"
            sx={{
              color: (theme) => theme.palette.text.primary,
              '&:hover': {
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            View all
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPopover;
