import { Card, Divider, List, ListItem, ListItemIcon, ListItemText, styled, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Iconify from 'src/components/Iconify';
import TextMaxLine from 'src/components/TextMaxLine';
import { HEADER } from 'src/config';
import PostPage from 'src/pages/home/Post';
import { useAppSelector } from 'src/redux/hooks';

const RootStyled = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

interface IntroduceList {
  icon: string;
  title: string;
}
export const ProfilePost = () => {
  const INTRODUCE_LIST: IntroduceList[] = [
    {
      icon: 'el:map-marker',
      title: 'Live at Ho Chi Minh City',
    },
    {
      icon: 'el:map-marker',
      title: 'have 400 friends',
    },
    {
      icon: 'el:map-marker',
      title: 'Manager at Gleichner, Mueller and Tromp',
    },
    {
      icon: 'el:map-marker',
      title: 'Studied at Nikolaus - Leuschke',
    },
  ];

  const user = useAppSelector((state) => state.auth.user);

  return (
    <RootStyled>
      <Grid container spacing={2}>
        <Grid xs={4}>
          <Card sx={{ p: 2, position: 'sticky', top: HEADER.HEADER_DESKTOP_HEIGHT + 16 }}>
            <Typography variant="h5">Introduce</Typography>
            {/* <Typography variant="caption">{user?.profile?.story}</Typography> */}
            <Divider sx={{ my: 2 }} />
            <List>
              {INTRODUCE_LIST.map(({ icon, title }, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Iconify icon={icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <TextMaxLine variant="body2" line={1}>
                        {title}
                      </TextMaxLine>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
        <Grid xs={8}>
          <PostPage />
        </Grid>
      </Grid>
    </RootStyled>
  );
};
