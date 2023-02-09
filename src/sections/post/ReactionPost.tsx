import {
  alpha,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  styled,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import { AngryIconSvg, DearIconSvg, HahaIconSvg, LiveIconSvg, LoveIconSvg, SadIconSvg, WowIconSvg } from 'src/assets';
import { IPostResponse } from 'src/interface/PostResponse';
import { useState } from 'react';
import { IReactionPostResponse } from 'src/interface/ReactionPost';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QueryKey } from 'src/enums/querykey';
import { getListReaction } from 'src/api/nestjs.reaction';
import { flatten, isEmpty } from 'lodash';
import Dialog from 'src/components/Dialog';
import { reactionArray } from 'src/enums/reaction';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as React from 'react';
import useTabs from 'src/hooks/useTabs';
import AvatarUpload from 'src/components/AvatarUpload';
import { useAppSelector } from 'src/redux/hooks';
import ScrollBar from 'src/components/ScrollBar';
import { PersonAddIcon } from 'src/components/icons';

const AvatarIconStyled = styled(Avatar)(() => ({
  width: 20,
  height: 20,
  border: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const TextStyled = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

const TabRootStyled = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  maxHeight: 600,
  minHeight: 'calc(100vh - 600px)',
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.complex,
  }),
}));

const ContentStyled = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.complex,
  }),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  boxShadow: theme.customShadows.z1,
}));

interface IReactionPost {
  post: IPostResponse;
}

function ReactionPost({ post }: IReactionPost) {
  const [openDialogReaction, setOpenDialogReaction] = useState(false);
  const [currenTabs, onChangeTabs] = useTabs(0);
  const user = useAppSelector((state) => state.auth.user);

  const handleOpenDialog = () => {
    setOpenDialogReaction(true);
  };
  const handleCloseDialog = () => {
    setOpenDialogReaction(false);
  };

  const { data } = useInfiniteQuery(
    [QueryKey.REACTION_POST, { post_id: post._id, type: currenTabs }],
    async ({ pageParam = 0 }) =>
      getListReaction(post._id, {
        position: pageParam,
        limit: 10,
        type: currenTabs,
      }),
    {
      enabled: !!post._id,
    }
  );

  const REACT_TAB = Object.entries(post).reduce(
    (acc, [key, value]) =>
      reactionArray.includes(key) && value > 0
        ? [...acc, { no_of_reaction: value, type: reactionArray.indexOf(key) + 1, [key]: value }]
        : acc,
    [{ no_of_reaction: 0, type: 0 }]
  );

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1} mb={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <AvatarGroup
          spacing={4}
          max={3}
          sx={{ cursor: 'pointer', '& .MuiAvatar-root': { border: 'none' } }}
          onClick={handleOpenDialog}
        >
          <AvatarIconStyled>
            <LiveIconSvg />
          </AvatarIconStyled>
          {post.no_of_love && (
            <AvatarIconStyled>
              <LoveIconSvg />
            </AvatarIconStyled>
          )}

          {post.no_of_haha && (
            <AvatarIconStyled>
              <HahaIconSvg />
            </AvatarIconStyled>
          )}
        </AvatarGroup>
        <TextStyled>{post.no_of_reaction || 0}</TextStyled>
      </Stack>
      <Stack direction="row" spacing={1}>
        <TextStyled>{post.no_of_reaction || 0} Like</TextStyled>
        <TextStyled>{post.no_of_comment} comments</TextStyled>
      </Stack>

      <Dialog open={openDialogReaction} onClose={handleCloseDialog}>
        <TabRootStyled>
          <Tabs value={currenTabs} onChange={onChangeTabs} variant="scrollable">
            {REACT_TAB.map((item, index) => (
              <Tab
                key={index}
                disableFocusRipple
                value={item.type}
                label={<TabPanel type={item.type} noOfReaction={item.no_of_reaction} postId={post._id} />}
                sx={{
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.light, 0.09),
                    borderRadius: 1,
                  },
                }}
              />
            ))}
          </Tabs>
          <ContentStyled>
            <ScrollBar
              sx={{
                height: 'calc(100vh - 600px)',
              }}
            >
              <List>
                {flatten(data?.pages).map((item, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar sx={{ cursor: 'pointer' }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              border: (theme: Theme) => `1px solid ${theme.palette.grey[200]}`,
                              borderRadius: '100%',
                            }}
                          >
                            {getComponentICon(item.type)}
                          </Box>
                        }
                      >
                        <AvatarUpload url={item.user.avatar} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText>
                      <Link underline="hover" variant="subtitle2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                        {item.user.full_name}
                      </Link>
                    </ListItemText>

                    {user?._id !== item.user._id && (
                      <ButtonStyled variant="contained" color="inherit" startIcon={<PersonAddIcon />}>
                        Thêm bạn bè
                      </ButtonStyled>
                    )}
                  </ListItem>
                ))}
              </List>
            </ScrollBar>
          </ContentStyled>
        </TabRootStyled>
      </Dialog>
    </Stack>
  );
}

interface IReactionPostTooltip {
  reaction: IReactionPostResponse[];
}

interface ITabPanel {
  type: number;
  noOfReaction?: number;
  postId: string;
}

function TabPanel({ type, noOfReaction, postId }: ITabPanel) {
  return (
    <Box>
      {type === 0 ? (
        <Typography variant="subtitle2" color="text.secondary">
          Tất cả
        </Typography>
      ) : (
        <Stack direction="row" spacing={1}>
          <Box sx={{ width: 24, height: 24 }}>{getComponentICon(type)}</Box>
          <Typography variant="subtitle2" color="text.secondary">
            {noOfReaction}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

const getComponentICon = (type: number) => {
  switch (type) {
    case 1:
      return <LiveIconSvg />;
    case 2:
      return <LoveIconSvg />;
    case 3:
      return <HahaIconSvg />;
    case 4:
      return <WowIconSvg />;
    case 5:
      return <SadIconSvg />;
    case 6:
      return <AngryIconSvg />;
    case 7:
      return <DearIconSvg />;
    default:
      return '';
  }
};

export default ReactionPost;
