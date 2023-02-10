import React, { useEffect, useRef, useState } from 'react';
import { Button, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { IUserResponse } from 'src/interface/UserReponse';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import socket from 'src/utils/socket';
import ConversationPopupItem from 'src/sections/conversation/ConversationPopupItem';
import { IMessageResponse } from 'src/interface/MesssageReponse';
import { VirtuosoHandle } from 'react-virtuoso';
import { flatten } from 'lodash';
import { addConversationId } from 'src/redux/slice/conversationPopup.slice';

const ConversationPopupStyle = styled('div')(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  bottom: 0,
  right: theme.spacing(11),
  zIndex: 99,
  gap: theme.spacing(2),
}));

interface IRefScroll {
  log?: () => void;
  scrollBottom: () => void;
}

function ConversationPopup() {
  const conversationIds = useAppSelector((state) => state.conversationPopup.conversationIds);
  const user = useAppSelector((state) => state.auth.user) as IUserResponse;
  const queryClient = useQueryClient();
  const ref = useRef<IRefScroll>();
  const dispatch = useAppDispatch();

  const handleSetMessage = (data: IMessageResponse) => {
    queryClient.setQueryData<InfiniteData<IMessageResponse[]>>(
      ['MESSAGE_LIST', { conversation_id: data.conversation_id, user_id: user._id }],
      (prev) => {
        if (!prev) return prev;

        if (prev.pages[0].length < 10) {
          return {
            ...prev,
            pages: [[data, ...prev.pages[0]], ...prev.pages.slice(1)],
          };
        }
        return {
          ...prev,
          pages: [[data], ...prev.pages],
        };
      }
    );
  };

  useEffect(() => {
    socket.on('message_text', (data: IMessageResponse) => {
      handleSetMessage(data);
    });

    socket.on('message_image', (data: IMessageResponse) => {
      handleSetMessage(data);
    });

    socket.on('message_video', (data: IMessageResponse) => {
      handleSetMessage(data);
    });

    socket.on('last_message', (data: IMessageResponse) => {
      dispatch(addConversationId(data.conversation_id));
    });

    socket.on('message_sticker', (data: IMessageResponse) => {
      console.log('message_sticker', data);

      handleSetMessage(data);
    });
  }, []);

  return (
    <ConversationPopupStyle>
      {conversationIds.map((conversationId) => (
        <ConversationPopupItem ref={ref} key={conversationId} conversationId={conversationId} />
      ))}
    </ConversationPopupStyle>
  );
}

export default ConversationPopup;
