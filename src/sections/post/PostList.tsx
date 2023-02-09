import {
  Avatar,
  AvatarGroup,
  Box,
  CardMedia,
  Divider,
  Link as MUILink,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';
import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import IconButtonAnimate from 'src/components/animate/IconButtonAnimate';
import Iconify from 'src/components/Iconify';
import PreviewImageMultiple from 'src/components/PreviewImageMultiple';
import ProfileTooltip from 'src/components/ProfileTooltip';
import { IPostResponse } from 'src/interface/PostResponse';
import { useAppSelector } from 'src/redux/hooks';
import { PATH_DASHBOARD } from 'src/routes/path';
import { CurrentLike, LikePostResponse } from 'src/types/Response';
import { fDistanceToNow } from 'src/utils/formatTime';
import { handleViewName } from 'src/utils/getViewName';
import PostSocialAction from './PostSocialAction';
import Popover from 'src/components/Popover';
import PostMenuList from 'src/sections/post/PostMenuList';
import { CommentList } from 'src/sections/post/index';
import { HahaIconSvg, LiveIconSvg, LoveIconSvg } from 'src/assets';
import ReactionPost from 'src/sections/post/ReactionPost';
import { IUserResponse } from 'src/interface/UserReponse';
import { isEmpty } from 'lodash';
import AvatarUpload from 'src/components/AvatarUpload';
import TagFeelingUser from 'src/sections/post/TagFeelingUser';

const RootStyled = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 2),
}));

const HeaderStyled = styled('header')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const ContentStyled = styled('section')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const TextStyled = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

const CardMediaStyled = styled(CardMedia)(({ theme }) => ({
  marginTop: theme.spacing(2),
  maxHeight: theme.breakpoints.values.sm,
  objectFit: 'contain',
  backgroundColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
})) as typeof CardMedia;

interface PostListProps {
  post: IPostResponse;
}

export default function PostList({ post }: PostListProps) {
  const currenUser = useAppSelector((state) => state.auth.user);

  const { avatar, full_name, _id: userId } = post.user;
  const { medias, content, createdAt } = post;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const linkTo = (id: string) => PATH_DASHBOARD.profile(id);

  const handleOpenPopover = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <RootStyled>
      <HeaderStyled>
        <Stack direction="row" spacing={1} alignItems="center">
          <ProfileTooltip user={post.user}>
            <AvatarUpload url={avatar} />
          </ProfileTooltip>
          <Stack>
            <Stack direction="row" spacing={0.5}>
              <MUILink
                variant="subtitle2"
                component={Link}
                to={linkTo(userId as string)}
                color="inherit"
                underline="hover"
                sx={{ textTransform: 'capitalize', cursor: 'pointer' }}
              >
                {full_name}
              </MUILink>
              <TagFeelingUser tag={post.tag} feeling={post.feeling} />
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <Typography variant="caption">{fDistanceToNow(createdAt)}</Typography>
              <Tooltip title={handleViewName(post.view).label} placement="top">
                <Box>
                  <Iconify icon={handleViewName(post.view).icon} />
                </Box>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>

        <Box>
          <IconButtonAnimate onClick={handleOpenPopover}>
            <Iconify icon="mingcute:more-1-line" />
          </IconButtonAnimate>
          <Popover anchorEl={anchorEl} onClose={handleClosePopover} open={Boolean(anchorEl)} width={180}>
            <PostMenuList isOwner={userId === currenUser?._id} postId={post._id} />
          </Popover>
        </Box>
      </HeaderStyled>

      <ContentStyled>
        {content && (
          <Typography
            mb={2}
            variant="body2"
            sx={{
              wordBreak: 'break-word',
            }}
          >
            {content}
          </Typography>
        )}

        {medias.length === 1 ? (
          medias[0].type === 'mp4' ? (
            <CardMediaStyled
              component="video"
              src={`${process.env.REACT_APP_UPLOAD_API_URL}${medias[0].url}`}
              controls
              loop
              defaultValue={10}
            />
          ) : (
            <CardMediaStyled component="img" src={`${process.env.REACT_APP_UPLOAD_API_URL}${medias[0].url}`} />
          )
        ) : (
          <PreviewImageMultiple listImage={medias} />
        )}
      </ContentStyled>
      <ReactionPost post={post} />
      <Divider />
      <PostSocialAction postId={post._id} myReaction={post.my_reaction} />
      <Divider />
      <CommentList postId={post._id} noOfComment={post.no_of_comment} isComment />
    </RootStyled>
  );
}
