import { Box, Divider, Link as MUILink, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import MyAvatar from 'src/components/MyAvatar';
import Popover from 'src/components/Popover';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { userLogout } from 'src/redux/slice/auth.slice';
import { PATH_PAGE } from 'src/routes/path';

export default function AccountPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const user = useAppSelector((state) => state.auth.user);

  const handleOpenPopover = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(userLogout());
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <MyAvatar onClick={handleOpenPopover} sx={{ cursor: 'pointer' }} />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        width={240}
        sx={{ maxHeight: 400 }}
      >
        <List disablePadding>
          <Box p={1}>
            <MUILink component={Link} underline="none" to={PATH_PAGE.profile(user?._id as string)} color="text.primary">
              <ListItemButton dense sx={{ borderRadius: 1 }}>
                <ListItemText primary={<Typography variant="body2">Profile</Typography>} />
              </ListItemButton>
            </MUILink>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />
          <Box p={1}>
            <ListItemButton dense sx={{ borderRadius: 1 }} onClick={handleLogout}>
              <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
            </ListItemButton>
          </Box>
        </List>
      </Popover>
    </div>
  );
}
