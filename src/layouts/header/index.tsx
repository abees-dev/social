import { alpha, IconButton, styled, Tab, Tabs } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Stack } from '@mui/system';
import {
  DarkModeIcon,
  HomeIcon,
  LightModeIcon,
  OndemandVideoIcon,
  PeopleAltIcon,
  SettingsIcon,
} from 'src/components/icons';
import { HEADER, NAVBAR } from 'src/config';
import useCollapse from 'src/hooks/useCollapse';
import useRouter from 'src/hooks/useRouter';
import useSetting from 'src/hooks/useSetting';
import useTabs from 'src/hooks/useTabs';
import { useAppSelector } from 'src/redux/hooks';
import { PATH_FRIEND, PATH_PAGE } from 'src/routes/path';
import AccountPopover from './AccountPopover';
import NotificationPopover from './NotificationPopover';
import ConversationPopover from 'src/layouts/header/ConversationPopover';

interface AppBarProps {
  isCollapse: boolean;
  isOffset: boolean;
  isDashBoard: boolean;
}
interface HeaderProps {
  variants?: 'main' | 'dashboard';
}

const PROFILE_TABS = [
  {
    value: 'home',
    icon: <HomeIcon sx={{ width: 32, height: 32 }} />,
    path: PATH_PAGE.root,
  },
  {
    value: 'friends',
    icon: <PeopleAltIcon sx={{ width: 32, height: 32 }} />,
    path: PATH_FRIEND.root,
  },
  {
    value: 'introduce',
    icon: <OndemandVideoIcon sx={{ width: 32, height: 32 }} />,
    path: PATH_PAGE.post,
  },
];

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (props) => props !== 'isCollapse' && props !== 'isOffset' && props !== 'isDashBoard',
})<AppBarProps>(({ theme, isCollapse, isOffset, isDashBoard }) => ({
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  boxShadow: theme.customShadows.z1,
  backgroundImage: 'none',
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  height: isOffset ? HEADER.HEADER_DESKTOP_OFFSET_HEIGHT : HEADER.HEADER_DESKTOP_HEIGHT,

  ...(isDashBoard && {
    width: `calc(100% - ${NAVBAR.NAV_COLLAPSE_WIDTH}px)`,
  }),

  ...(!isCollapse &&
    isDashBoard && {
      width: `calc(100% - ${NAVBAR.NAV_DESKTOP_WIDTH}px)`,
    }),
}));

const TabRootStyled = styled('div')(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

export default function Header({ variants = 'main' }: HeaderProps) {
  const { isCollapse } = useCollapse();
  const { themeMode, onToggleMode } = useSetting();
  const { pathname } = useRouter();

  const [currenTabs, onChangeTabs] = useTabs(pathname.split('/')[1] || 'home');
  const isOffset = useAppSelector((state) => state.offset.isOffsetTop);

  const { push } = useRouter();

  const isLight = themeMode === 'light';

  const handleSelectTab = (path: string) => {
    push(path);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBarStyled position="fixed" isCollapse={isCollapse} isOffset={isOffset} isDashBoard={variants === 'dashboard'}>
        <Toolbar sx={{ height: 1 }}>
          {variants === 'main' && (
            <TabRootStyled>
              <Tabs value={currenTabs} onChange={onChangeTabs} variant="scrollable">
                {PROFILE_TABS.map(({ value, icon, path }) => (
                  <Tab
                    key={value}
                    disableFocusRipple
                    value={value}
                    icon={icon}
                    onClick={() => handleSelectTab(path)}
                    sx={{
                      minWidth: 120,
                      py: 1,
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.light, 0.09),
                        borderRadius: 1,
                      },
                    }}
                  />
                ))}
              </Tabs>
            </TabRootStyled>
          )}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              position: 'absolute',
              right: 16,
            }}
          >
            <NotificationPopover />
            <ConversationPopover />
            <IconButton onClick={onToggleMode}>{isLight ? <DarkModeIcon /> : <LightModeIcon />}</IconButton>
            <IconButton>
              <SettingsIcon />
            </IconButton>
            <AccountPopover />
          </Stack>
        </Toolbar>
      </AppBarStyled>
    </Box>
  );
}
