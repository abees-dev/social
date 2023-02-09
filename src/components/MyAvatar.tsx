import { Avatar, AvatarProps } from '@mui/material';
import { useAppSelector } from 'src/redux/hooks';
import createAvatar from '../utils/createAvatar';

export default function MyAvatar({ sx, ...other }: AvatarProps) {
  const user = useAppSelector((state) => state.auth.user);

  const handleGetUrl = () => {
    if (user?.avatar.split('/')[1] === 'public') {
      return `${process.env.REACT_APP_UPLOAD_API_URL}${user?.avatar}`;
    }
    return user?.avatar;
  };

  return (
    <Avatar
      src={handleGetUrl()}
      color="primary"
      sx={{
        width: 40,
        height: 40,
        bgcolor: () => createAvatar(String(user?.full_name)),
        ...sx,
      }}
      {...other}
    >
      {createAvatar(String(user?.full_name)).name}
    </Avatar>
  );
}
