import React from 'react';
import { alpha, Box, IconButton, Stack, styled } from '@mui/material';
import AvatarUpload from 'src/components/AvatarUpload';
import Iconify from 'src/components/Iconify';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { addConversationId, removeConversationMinimized } from 'src/redux/slice/conversationPopup.slice';
import { Minimize } from '@mui/icons-material';

const RootStyled = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  gap: theme.spacing(1),
}));

const CloseIconStyle = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '50%',
  width: 20,
  height: 20,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  boxShadow: theme.shadows['2'],
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
  }),
  zIndex: 1,
  ':hover': {
    cursor: 'pointer',
    backgroundColor: theme.palette.action.disabled,
  },
}));

interface IConversationMinimized {
  length: number;
}

const MinimizeStyle = styled('div')<IConversationMinimized>(({ theme, length }) => ({
  position: 'relative',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
  }),
  ...(length > 0 && {
    '& :nth-of-type(3)': {
      ':after': {
        content: `'+${length}'`,
        position: 'absolute',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.palette.background.paper,
        fontWeight: 600,
        fontSize: theme.spacing(2),
        backgroundColor: alpha(theme.palette.action.active, 0.6),
        borderRadius: '50%',
      },
    },
  }),
}));
function ConversationMinimized() {
  const [conversationId, setConversationId] = React.useState<string>('');
  const dispatch = useAppDispatch();

  const conversationMinimized = useAppSelector((state) => state.conversationPopup.conversationMinimized);
  const handleOnMouseEnter = (conversationId: string) => {
    setConversationId(conversationId);
  };

  const handleOnMouseLeave = (conversationId: string) => {
    setConversationId('');
  };

  const handleRemoveMinimized = (conversationId: string) => {
    dispatch(removeConversationMinimized(conversationId));
  };

  const handleOpenConversation = (conversationId: string) => {
    dispatch(addConversationId(conversationId));
  };
  return (
    <RootStyled>
      <MinimizeStyle length={conversationMinimized.slice(3).length}>
        {conversationMinimized.slice(0, 3).map((conversation) => (
          <Box
            sx={{ position: 'relative', cursor: 'pointer' }}
            key={conversation._id}
            onMouseEnter={() => handleOnMouseEnter(conversation._id)}
            onMouseLeave={() => handleOnMouseLeave(conversation._id)}
            onClick={() => handleOpenConversation(conversation._id)}
          >
            <AvatarUpload url={conversation.avatar} sx={{ width: 50, height: 50 }} />
            {conversationId === conversation._id && (
              <CloseIconStyle onClick={() => handleRemoveMinimized(conversation._id)}>
                <Iconify icon="ic:round-close" />
              </CloseIconStyle>
            )}
          </Box>
        ))}
      </MinimizeStyle>
    </RootStyled>
  );
}

export default ConversationMinimized;
