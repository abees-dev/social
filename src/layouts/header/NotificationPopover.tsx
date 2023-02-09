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
import { isEmpty } from 'lodash';
import { MouseEvent, useState } from 'react';
import IconButtonAnimate from 'src/components/animate/IconButtonAnimate';
import Iconify from 'src/components/Iconify';
import { NotificationsIcon } from 'src/components/icons';
import Popover from 'src/components/Popover';
import NotificationSkeleton from 'src/components/skeleton/NotificationSkeleton';
import TextMaxLine from 'src/components/TextMaxLine';

import { NotificationQueryResponse } from 'src/types/Response';
import { fDistanceToNow } from 'src/utils/formatTime';

const NotificationPopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // const { push } = useRouter();

  // const [ref, inView] = useInView();

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
          {!isEmpty([]) ? (
            []?.map((notification, index) => {
              return (
                <ListItemButton key={index} sx={{ ...(!index && { bgcolor: (theme) => theme.palette.divider }) }}>
                  <ListItemAvatar></ListItemAvatar>

                  <ListItemText>
                    <TextMaxLine line={2} variant="subtitle2">
                      <Typography variant="body2" component="span" ml={0.5}></Typography>
                    </TextMaxLine>
                    <Typography variant="caption"></Typography>
                  </ListItemText>
                </ListItemButton>
              );
            })
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
