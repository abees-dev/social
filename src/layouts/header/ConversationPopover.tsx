import React from 'react';
import { Badge, Box, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';
import { ChatIcon, NotificationsIcon } from 'src/components/icons';
import Popover from 'src/components/Popover';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getConversation } from 'src/api/nestjs.conversation';
import { flatten } from 'lodash';
import AvatarUpload from 'src/components/AvatarUpload';
import { IMessageResponse } from 'src/interface/MesssageReponse';
import { MESSAGE_TYPE } from 'src/enums';
import { addConversationId } from 'src/redux/slice/conversationPopup.slice';
import { joinRoom } from 'src/api/socket.event';
import { IConversationResponse } from 'src/interface/Conversation';

function ConversationPopover() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const [isNextPage, setIsNextPage] = React.useState<boolean>(true);
  const dispatch = useAppDispatch();
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const queryClient = useQueryClient();

  const handleReadMessage = (conversationId: string) => {
    queryClient.setQueryData<InfiniteData<IConversationResponse[]>>(
      ['CONVERSATION_LIST', { user_id: user?._id }],
      (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page) =>
            page.map((conversation) => {
              if (conversation._id === conversationId) {
                return {
                  ...conversation,
                  no_of_not_seen: 0,
                };
              }
              return conversation;
            })
          ),
        };
      }
    );
  };
  const handleOpenPopup = (conversationId: string) => {
    setAnchorEl(null);
    dispatch(addConversationId(conversationId));
    joinRoom(conversationId);
    handleReadMessage(conversationId);
  };

  const { data, isLoading } = useInfiniteQuery(
    ['CONVERSATION_LIST', { user_id: user?._id }],
    async ({ pageParam }) => getConversation({ position: pageParam || 0 }),
    {
      enabled: Boolean(anchorEl),
      getNextPageParam: (lastPage) => {
        if (lastPage?.length === 10) {
          return lastPage?.[lastPage?.length - 1]?.position;
        }
        return false;
      },
      onSuccess: (data) => {
        console.log(data);
        if (data.pages[data.pages.length - 1].length < 10) {
          setIsNextPage(false);
        }
      },
    }
  );

  return (
    <>
      <IconButton onClick={handleOpenPopover}>
        <Badge badgeContent={1} color="error">
          <ChatIcon />
        </Badge>
      </IconButton>

      <Popover anchorEl={anchorEl} onClose={handleClosePopover} open={Boolean(anchorEl)}>
        <List sx={{ px: 1 }}>
          {!isLoading &&
            flatten(data?.pages).map((conversation) => (
              <ListItemButton
                key={conversation._id}
                onClick={() => handleOpenPopup(conversation._id)}
                sx={{
                  borderRadius: 1,
                }}
              >
                <ListItemAvatar>
                  <AvatarUpload url={conversation.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle2">{conversation.name}</Typography>}
                  secondary={
                    <Typography variant="body2">{handleLastMessage(conversation.last_message, user?._id)}</Typography>
                  }
                ></ListItemText>

                {conversation.no_of_not_seen > 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      p: 1,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: 'error.main',
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {conversation.no_of_not_seen}
                  </Typography>
                )}
              </ListItemButton>
            ))}
        </List>
      </Popover>
    </>
  );
}

const handleLastMessage = (lastMessage: IMessageResponse, current_user_id?: string) => {
  const isOwner = lastMessage.user._id === current_user_id;
  switch (lastMessage.type) {
    case MESSAGE_TYPE.TEXT:
      return isOwner ? 'Bạn: ' + lastMessage.message : lastMessage.message;
    case MESSAGE_TYPE.IMAGE:
      return isOwner
        ? `Bạn đã gửi ${lastMessage.medias.length} hình ảnh`
        : `đã gửi ${lastMessage.medias.length} hình ảnh`;
    case MESSAGE_TYPE.VIDEO:
      return isOwner ? `Bạn đã gửi ${lastMessage.medias.length} video` : `đã gửi ${lastMessage.medias.length} video`;
    case MESSAGE_TYPE.STICKER:
      return isOwner ? `Bạn đã gửi một nhãn dán` : `đã gửi một nhãn dán`;
    default:
      return '';
  }
};

export default ConversationPopover;
