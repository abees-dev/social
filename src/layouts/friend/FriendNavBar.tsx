import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, styled, Typography } from '@mui/material';
import { HEADER, NAVBAR } from 'src/config';
import { useAppSelector } from 'src/redux/hooks';
import { GroupAddIcon, GroupIcon, PersonAddAlt1Icon, PersonIcon, PersonRemoveAlt1Icon } from 'src/components/icons';
import ScrollBar from 'src/components/ScrollBar';
import useRouter from 'src/hooks/useRouter';
import { PATH_FRIEND } from 'src/routes/path';
import * as path from 'path';

interface RootStyleProps {
  isOffset: boolean;
}

interface IListNavbar {
  value: string;
  icon: React.ReactNode;
  title: string;
  path: string;
}
const LIST_NAVBAR = [
  {
    value: 'friend',
    icon: <PersonIcon sx={{ width: 24, height: 24 }} />,
    title: 'Tất cả bạn bè',
    path: PATH_FRIEND.root,
  },
  {
    value: 'request',
    icon: <PersonAddAlt1Icon sx={{ width: 24, height: 24 }} />,
    title: 'Lời mời kết bạn',
    path: PATH_FRIEND.friendRequest,
  },
  {
    value: 'request-sent',
    icon: <PersonRemoveAlt1Icon sx={{ width: 24, height: 24 }} />,
    title: 'Lời mời đã gửi',
    path: PATH_FRIEND.friendSendRequest,
  },
  {
    value: 'suggestion',
    icon: <GroupAddIcon sx={{ width: 24, height: 24 }} />,
    title: 'Gợi ý kết bạn',
    path: PATH_FRIEND.suggestions,
  },
];

const RootStyle = styled('div', {
  shouldForwardProp: (props) => props !== 'isOffset',
})<RootStyleProps>(({ theme, isOffset }) => ({
  position: 'fixed',
  top: isOffset ? HEADER.HEADER_DESKTOP_OFFSET_HEIGHT : HEADER.HEADER_DESKTOP_HEIGHT,
  left: 0,
  bottom: 0,
  width: NAVBAR.NAV_DESKTOP_WIDTH,
  padding: theme.spacing(2),
  boxShadow: theme.customShadows.z1,
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
  }),
}));

const ListItemIconStyle = styled(ListItemIcon)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '100%',
  backgroundColor: theme.palette.action.hover,
  minWidth: 0,
  marginRight: theme.spacing(2),
  width: 34,
  height: 34,
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
  }),
}));

function FriendNavBar() {
  const isOffset = useAppSelector((state) => state.offset.isOffsetTop);

  const { push, pathname } = useRouter();

  const handleSelectItem = (path: string) => {
    push(path);
  };

  console.log('pathname', pathname);

  return (
    <RootStyle isOffset={isOffset}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        Bạn bè
      </Typography>
      <ScrollBar sx={{ height: '100%' }}>
        <List>
          {LIST_NAVBAR.map((item: IListNavbar) => (
            <ListItemButton
              selected={item.path === pathname}
              key={item.value}
              sx={{ borderRadius: 1 }}
              onClick={() => handleSelectItem(item.path)}
            >
              <ListItemIconStyle>{item.icon}</ListItemIconStyle>

              <ListItemText>
                <Typography variant="subtitle1" sx={{ fontWeight: 550 }}>
                  {item.title}
                </Typography>
              </ListItemText>
            </ListItemButton>
          ))}
        </List>
      </ScrollBar>
    </RootStyle>
  );
}

export default FriendNavBar;
