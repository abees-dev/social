import { Badge, Box, IconButton, Stack, styled, Typography } from '@mui/material';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { flatten, isEmpty } from 'lodash';
import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { getDetailConversation } from 'src/api/nestjs.conversation';
import { getListMessage } from 'src/api/nestjs.message';
import AvatarUpload from 'src/components/AvatarUpload';
import Iconify from 'src/components/Iconify';
import { IConversationResponse } from 'src/interface/Conversation';
import { IUserResponse } from 'src/interface/UserReponse';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { addConversationMinimized, removeConversationId } from 'src/redux/slice/conversationPopup.slice';
import ConversationInput from 'src/sections/conversation/ConversationInput';
import MessageItem from 'src/sections/conversation/MessageItem';

interface ConversationPopupItemProps {
  conversationId: string;
}

const RootStyle = styled('div')(({ theme }) => ({
  width: 320,
  height: 420,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows['18'],
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'space-between',
}));

const HeaderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0.5),
  boxShadow: theme.shadows['2'],
}));

const BadgeStyle = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius: '50%',
    width: 12,
    height: 12,
  },
}));

const BoxStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  width: 'fit-content',
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  alignItems: 'center',
  ':hover': {
    cursor: 'pointer',
    backgroundColor: theme.palette.action.hover,
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  flex: 1,
  height: 'calc(100% - 96px)',
  padding: theme.spacing(1, 0),
  // overflow: 'scroll',
  overflow: 'auto',
}));

const ConversationPopupItem = forwardRef(({ conversationId }: ConversationPopupItemProps, ref: Ref<any>) => {
  const user = useAppSelector((state) => state.auth.user) as IUserResponse;
  const dispatch = useAppDispatch();
  const [isNextPage, setIsNextPage] = useState(true);

  const { data, isLoading } = useQuery(
    ['CONVERSATION_DETAIL', { conversationId }],
    () => getDetailConversation(conversationId),
    {
      enabled: !!conversationId,
    }
  );

  const refVirtuoso = useRef<VirtuosoHandle>(null);

  const handleClose = () => {
    dispatch(removeConversationId(conversationId));
  };

  const handleMinimize = () => {
    dispatch(removeConversationId(conversationId));
    dispatch(
      addConversationMinimized({
        _id: data?.data._id || '',
        name: data?.data.name || '',
        avatar: data?.data.avatar || '',
      })
    );
  };

  const limit = 10;

  const {
    data: listMessage,
    isLoading: messageLoading,
    fetchNextPage,
  } = useInfiniteQuery(
    ['MESSAGE_LIST', { conversation_id: conversationId, user_id: user._id }],
    ({ pageParam }) =>
      getListMessage(conversationId, {
        position: pageParam || 0,
        limit: limit,
      }),
    {
      enabled: !!conversationId,
      getNextPageParam: (lastPage) => {
        if (!isEmpty(lastPage) && lastPage.length === limit) {
          return lastPage[lastPage.length - 1].position;
        }
        return false;
      },
      onSuccess(data) {
        if (data.pages[data.pages.length - 1].length < limit) {
          setIsNextPage(false);
        }
      },
    }
  );

  useImperativeHandle(
    ref,
    () => ({
      scrollBottom() {
        if (refVirtuoso.current) {
          console.log('scrollBottom');
          // refVirtuoso.current.autoscrollToBottom();
        }
      },
    }),
    []
  );

  return (
    <RootStyle>
      {!isLoading && (
        <HeaderStyle>
          <BoxStyle>
            <BadgeStyle
              color="success"
              variant="dot"
              overlap="circular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <AvatarUpload url={data?.data.avatar || ''} sx={{ width: 32, height: 32 }} />
            </BadgeStyle>

            <Stack>
              <Typography variant="subtitle2" lineHeight={1}>
                {data?.data.name}
              </Typography>
              <Typography variant="caption" lineHeight={1}>
                Đang hoạt động
              </Typography>
            </Stack>
            <Iconify icon="material-symbols:keyboard-arrow-down-rounded" />
          </BoxStyle>
          <Stack direction="row" alignItems="center">
            <IconButton size="small" onClick={handleMinimize}>
              <Iconify icon="ic:round-minus" />
            </IconButton>
            <IconButton size="small" onClick={handleClose}>
              <Iconify icon="ic:round-close" />
            </IconButton>
          </Stack>
        </HeaderStyle>
      )}

      <Virtuoso
        ref={refVirtuoso}
        style={{ height: 'calc(100% - 96px)' }}
        firstItemIndex={300 - flatten(listMessage?.pages).length}
        startReached={() => {
          isNextPage && fetchNextPage().then();
        }}
        followOutput={(isAtBottom) => (isAtBottom ? 'smooth' : false)}
        data={flatten(listMessage?.pages).reverse()}
        totalCount={flatten(listMessage?.pages).length}
        initialTopMostItemIndex={flatten(listMessage?.pages).length - 1}
        itemContent={(index, message) => (
          <MessageItem
            key={message._id}
            message={message}
            prevMessage={
              flatten(listMessage?.pages).reverse()[flatten(listMessage?.pages).reverse().indexOf(message) - 1]
            }
          />
        )}
      />
      <ConversationInput conversationId={conversationId} />
    </RootStyle>
  );
});

interface IHeaderProps {
  data?: IConversationResponse;
}

function Header({ data }: IHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 2,
        mb: 2,
      }}
    >
      <AvatarUpload
        url={data?.avatar || ''}
        sx={{
          width: 60,
          height: 60,
        }}
      />
      <Typography variant="subtitle2">{data?.name}</Typography>
      <Typography variant="caption">Các bạn đã là bạn bè, hãy cũng nhau trò truyện</Typography>
    </Box>
  );
}

export default ConversationPopupItem;
