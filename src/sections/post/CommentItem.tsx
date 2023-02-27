import { alpha, Avatar, Box, CardMedia, Link as MUILink, Stack, styled, SxProps, Typography } from '@mui/material';
import ProfileTooltip from 'src/components/ProfileTooltip';
import { useAppSelector } from 'src/redux/hooks';
import { fDistanceToNow } from 'src/utils/formatTime';
import { Link } from 'react-router-dom';
import { PATH_DASHBOARD } from 'src/routes/path';
import { IUserResponse } from 'src/interface/UserReponse';
import { ICommentResponse } from 'src/interface/CommentResponse';
import { forwardRef } from 'react';
import AvatarUpload from 'src/components/AvatarUpload';

interface MediaProps {
  isMedia: boolean;
}

const CommentsItemStyled = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  width: 'fit-content',
}));

const ActionStyled = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  fontWeight: 700,
  cursor: 'pointer',

  '&:hover': {
    textDecoration: 'underline',
  },
}));

const CardMediaStyled = styled(CardMedia)(({ theme }) => ({
  marginTop: theme.spacing(2),

  objectFit: 'contain',
  // backgroundColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  borderStyle: 'solid',
  borderWidth: 0.5,
  borderColor: alpha(theme.palette.action.hover, 0.2),
  boxShadow: theme.customShadows.card,
  maxWidth: 240,
  maxHeight: 240,
})) as typeof CardMedia;

interface CommentItemProp {
  comment: ICommentResponse;
  sx?: SxProps;
  handleOpenRely?: () => void;
  type?: string;
}

interface CommentItemRootProp extends CommentProp {
  comment: ICommentResponse;
  count?: number;
  post_id: string;
  onOpenReply?: () => void;
}

interface CommentProp {
  isReply?: boolean;
}

const AvatarStyled = styled(AvatarUpload)(() => ({
  width: 35,
  height: 35,
  cursor: 'pointer',
  position: 'relative',
}));

const CommentRootStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isReply',
})<CommentProp>(({ theme, isReply }) => ({
  position: 'relative',
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const ContentStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isReply',
})<CommentProp>(({ theme, isReply }) => ({
  position: 'relative',
  ...(isReply && {
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 40,
      left: -27,
      bottom: 0,
      borderLeftStyle: 'solid',
      borderLeftWidth: 2,
      borderLeftColor: theme.palette.grey.A200,
    },
  }),
}));

// eslint-disable-next-line react/display-name
export const CommentItemRoot = forwardRef(({ comment, isReply, onOpenReply }: CommentItemRootProp, ref) => {
  const { avatar, full_name, _id: userId } = comment.user;
  const user = useAppSelector((state) => state.auth.user) as IUserResponse;
  return (
    <CommentRootStyled isReply={isReply} ref={ref}>
      <ProfileTooltip user={user}>
        <AvatarStyled url={avatar} />
      </ProfileTooltip>
      <ContentStyled sx={{ width: 1 }} isReply={false}>
        <CommentsItemStyled
          sx={{
            bgcolor: (theme) => (comment.media ? 'transparent' : alpha(theme.palette.divider, 0.2)),
          }}
        >
          <Stack>
            <ProfileTooltip user={user}>
              <MUILink
                component={Link}
                to={PATH_DASHBOARD.profile(userId as string)}
                variant="caption"
                underline="hover"
                color="inherit"
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {full_name}
              </MUILink>
            </ProfileTooltip>

            {comment.media ? (
              <CardMediaStyled component="img" src={`${process.env.REACT_APP_UPLOAD_API_URL}${comment.media.url}`} />
            ) : (
              <Typography variant="body2" sx={{ lineHeight: (theme) => theme.typography.caption.lineHeight, wordBreak: "break-word", }}>
                {comment.content}
              </Typography>
            )}
          </Stack>
        </CommentsItemStyled>
        <Stack direction="row" spacing={2} mt={0.5} ml={1} alignItems="baseline">
          <ActionStyled>Like</ActionStyled>
          <ActionStyled onClick={onOpenReply}>Reply</ActionStyled>
          <ActionStyled sx={{ fontWeight: 300, fontSize: 11 }}>{fDistanceToNow(comment?.createdAt)}</ActionStyled>
        </Stack>
      </ContentStyled>
    </CommentRootStyled>
  );
});
export default CommentItemRoot;
