import {
  Badge,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getListFriend } from 'src/api/friendship.api';
import { createConversation } from 'src/api/nestjs.conversation';
import AvatarUpload from 'src/components/AvatarUpload';
import Iconify from 'src/components/Iconify';
import { CreateConversationBody } from 'src/interface/Conversation';
import { IUserResponse } from 'src/interface/UserReponse';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { addConversationId } from 'src/redux/slice/conversationPopup.slice';
import socket from 'src/utils/socket';

const RootStyle = styled('div')(({ theme }) => ({}));

const HeaderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const BadgeStyle = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius: '50%',
    width: 12,
    height: 12,
  },
}));

function Contact() {
  const user = useAppSelector((state) => state.auth.user) as IUserResponse;
  const dispatch = useAppDispatch();
  const conversationIds = useAppSelector((state) => state.conversationPopup.conversationIds);

  const { data, isLoading } = useQuery(['CONTACT'], () => getListFriend(user._id));

  const { mutate } = useMutation((variables: CreateConversationBody) => createConversation(variables), {
    onSuccess: (data) => {
      dispatch(addConversationId(data.data.conversation_id));
      socket.emit('join_room', { room_id: data.data.conversation_id });
    },
  });

  const handleCreateConversation = (friendId: string) => {
    mutate({
      members: [friendId],
    });
  };

  return (
    <RootStyle>
      <HeaderStyle>
        <Typography variant="subtitle2" color="text.secondary">
          Liên hệ
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small">
            <Iconify icon="eva:search-outline" />
          </IconButton>
          <IconButton size="small">
            <Iconify icon="mingcute:more-1-line" />
          </IconButton>
        </Stack>
      </HeaderStyle>
      <List>
        {!isLoading &&
          data?.map((friend) => (
            <ListItemButton
              key={friend._id}
              sx={{ borderRadius: 1 }}
              onClick={() => handleCreateConversation(friend.user._id)}
            >
              <ListItemAvatar>
                <BadgeStyle
                  overlap="circular"
                  color="success"
                  variant="dot"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <AvatarUpload url={friend.user.avatar} />
                </BadgeStyle>
              </ListItemAvatar>
              <ListItemText>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                  {friend.user.full_name}
                </Typography>
              </ListItemText>
            </ListItemButton>
          ))}
      </List>
    </RootStyle>
  );
}

export default Contact;
