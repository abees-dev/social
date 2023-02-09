import { alpha, Avatar, Box, CardMedia, Stack, styled, Typography } from '@mui/material';
import { capitalCase } from 'change-case';
import { useAppSelector } from 'src/redux/hooks';
import { fDateTime, fDistanceStrict, fTime, getMinutesBetween } from 'src/utils/formatTime';
import { IMessageResponse } from 'src/interface/MesssageReponse';
import AvatarUpload from 'src/components/AvatarUpload';
import { MESSAGE_TYPE } from 'src/enums';
import Grid2 from '@mui/material/Unstable_Grid2';
import Image from 'src/components/Image';
import { isEmpty } from 'lodash';
import { getAvatarUrl } from 'src/utils/createAvatar';

interface RootProps {
  reply: boolean;
}

const RootStyled = styled('div')<RootProps>(({ theme, reply }) => ({
  display: 'flex',
  padding: theme.spacing(0, 1),
  flexDirection: 'column',
  maxWidth: '100%',
  gap: theme.spacing(0.5),

  ...(!reply && {
    justifyContent: 'flex-end',
  }),
}));

const TimeStyled = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(2),
}));

interface MessageItemProp {
  message: IMessageResponse;
  prevMessage?: IMessageResponse;
}

export default function MessageItem({ message, prevMessage }: MessageItemProp) {
  const user = useAppSelector((state) => state.auth.user);

  const isOwner = message.user._id === user?._id;

  const isTimeLine = getMinutesBetween(message.createdAt, prevMessage?.createdAt) > 5;
  const isNextMessage = prevMessage?.user._id !== message.user._id || isTimeLine;

  return (
    <Box>
      {isTimeLine && (
        <Stack direction="row" justifyContent="center" mt={2} mb={2}>
          <TimeStyled>{fDateTime(message?.createdAt || '')}</TimeStyled>
        </Stack>
      )}
      <RootStyled reply={!isOwner}>
        <Stack spacing={0.5} direction="row" sx={{ maxWidth: '100%' }} alignItems="center">
          {!isOwner && isNextMessage && (
            <AvatarUpload url={user?.avatar || ''} sx={{ width: 35, height: 35, alignSelf: 'flex-start', mr: 1 }} />
          )}
          {isNextMessage && !isOwner && (
            <Typography variant="caption" align={!isOwner ? 'left' : 'right'} mr={1}>
              {`${message.user.full_name}, ${fDistanceStrict(message.createdAt)}`}
            </Typography>
          )}
        </Stack>
        <MessageContent isReply={!isOwner} isNextMessage={isNextMessage} message={message} />
      </RootStyled>
    </Box>
  );
}

interface IMessageContent {
  message: IMessageResponse;
  isReply: boolean;
  isNextMessage: boolean;
}

interface MessageProp {
  isReply: boolean;
  isNextMessage: boolean;
}

const MessageTextStyled = styled('div')<MessageProp>(({ theme, isReply, isNextMessage }) => ({
  width: 'fit-content',
  maxWidth: '100%',
  backgroundColor: isReply ? alpha(theme.palette.grey[500], 0.3) : alpha(theme.palette.primary.main, 0.9),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1.5),
  overflowWrap: 'break-word',
  display: 'flex',
  ...(isReply && {
    marginLeft: 42,
  }),
  ...(!isReply && {
    alignSelf: 'flex-end',
    color: theme.palette.primary.contrastText,
  }),
}));

const MessageImageStyled = styled('div')<MessageProp>(({ theme, isReply, isNextMessage }) => ({
  display: 'flex',
  ...(!isNextMessage && {
    marginTop: theme.spacing(0.5),
  }),
  ...(isReply && {
    marginLeft: 42,
  }),
  ...(!isReply && {
    justifyContent: 'flex-end',
  }),
}));

const GridItemStyled = styled(Grid2)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function MessageContent({ message, isReply, isNextMessage }: IMessageContent) {
  const getGridColumn = (length: number) => {
    switch (length) {
      case 1:
        return 12;
      case 2:
        return 6;
      case 3:
        return 4;
      default:
        return 4;
    }
  };
  switch (message.type) {
    case MESSAGE_TYPE.TEXT:
      return (
        <MessageTextStyled isReply={isReply} isNextMessage={isNextMessage}>
          <Typography variant="body1">{message.message}</Typography>
        </MessageTextStyled>
      );
    case MESSAGE_TYPE.IMAGE:
      return (
        <MessageImageStyled isReply={isReply} isNextMessage={isNextMessage}>
          <Grid2 container sx={{ width: '70%' }} spacing={0.5}>
            {message.medias.map((item) => (
              <GridItemStyled key={item._id} xs={getGridColumn(message.medias.length)}>
                <Image src={getAvatarUrl(item.url)} sx={{ borderRadius: 1 }} />
              </GridItemStyled>
            ))}
          </Grid2>
        </MessageImageStyled>
      );
    case MESSAGE_TYPE.VIDEO:
      return (
        <MessageImageStyled isReply={isReply} isNextMessage={isNextMessage}>
          <CardMedia
            component="video"
            src={getAvatarUrl(message.medias[0].url)}
            controls
            loop
            defaultValue={10}
            sx={{
              width: '70%',
              borderRadius: 1,
            }}
          />
        </MessageImageStyled>
      );
    case MESSAGE_TYPE.STICKER:
      return (
        <MessageImageStyled isReply={isReply} isNextMessage={isNextMessage}>
          <Image src={message.sticker} sx={{ borderRadius: 1, width: '40%', minHeight: '120px' }} />
        </MessageImageStyled>
      );

    default:
      return <></>;
  }
}
