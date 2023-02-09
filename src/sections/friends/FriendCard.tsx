import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { IUserResponse } from 'src/interface/UserReponse';
import { getAvatarUrl } from 'src/utils/createAvatar';
import { getTextContact } from 'src/utils/contact';

const RootStyle = styled(Card)(({ theme }) => ({
  height: '100%',
}));

interface IFriendCardProps {
  user: IUserResponse;
  contactType: number;
  onAccept?: () => void;
  onRemove?: () => void;
}

function FriendCard({ user, contactType, onRemove, onAccept }: IFriendCardProps) {
  return (
    <RootStyle>
      <CardMedia
        component="img"
        alt=""
        image={getAvatarUrl(user.avatar)}
        sx={{
          minHeight: 220,
          maxHeight: 220,
        }}
      />

      <CardContent>
        <Typography variant="subtitle1" component="div">
          {user.full_name}
        </Typography>
        <Typography variant="caption">{user.no_of_friends} bạn bè</Typography>
      </CardContent>

      <CardActions>
        <Stack direction="column" spacing={1} width="100%">
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
            }}
            onClick={onAccept}
          >
            {getTextContact(contactType)}
          </Button>
          <Button
            variant="contained"
            color="inherit"
            sx={{
              textTransform: 'none',
            }}
            onClick={onRemove}
          >
            Xoá
          </Button>
        </Stack>
      </CardActions>
    </RootStyle>
  );
}

export default FriendCard;
