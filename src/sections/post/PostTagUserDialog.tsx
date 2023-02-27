import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  styled,
  Theme,
  Typography,
} from '@mui/material';
import { ArrowBackIcon } from 'src/components/icons';
import Iconify from 'src/components/Iconify';
import EmojiPicker from 'src/components/EmojiPicker';
import { ChangeEvent, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from 'src/enums/querykey';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getListFriend } from 'src/api/friendship.api';
import { IUserResponse } from 'src/interface/UserReponse';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { isEmpty } from 'lodash';
import { PostValues } from 'src/sections/post/PostCreateForm';
import AvatarUpload from 'src/components/AvatarUpload';
import Dialog from 'src/components/Dialog';
import { CloseIconStyle, FooterStyle, HeaderStyle, InputStyled } from 'src/sections/post/styles';
import { addTagState } from 'src/redux/slice/post.slice';
import { IFriendResponse } from 'src/interface/FriendReponse';

const RootStyle = styled('div')(({ theme }) => ({}));

const ContentStyle = styled('section')(({ theme }) => ({
  padding: theme.spacing(2),
}));

const TagInputStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: theme.palette.action.focus,
  borderRadius: theme.spacing(1),
  minHeight: 56,
  marginBottom: theme.spacing(2),
}));
const ChipStyle = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.light, 0.3),
  color: theme.palette.secondary.main,
  fontSize: theme.spacing(1.8),
  borderRadius: theme.spacing(1),
  fontWeight: 600,
  '& .MuiChip-deleteIcon': {
    color: alpha(theme.palette.secondary.main, 0.7),
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
}));

interface IPostTagUserProps {
  onClose: () => void;
  setValues: (key: keyof PostValues, value: any) => void;
  open: boolean;
}

function PostTagUserDialog({ open, onClose, setValues }: IPostTagUserProps) {
  const [value, setValue] = useState('');
  const [userTag, setUserTag] = useState<IFriendResponse[]>([]);
  const queryClient = useQueryClient();

  const user = useAppSelector((state) => state.auth.user) as IUserResponse;

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const { data, isLoading } = useQuery<IFriendResponse[]>(
    [QueryKey.TAG_USER_POST, { user_id: user?._id }],
    async () => await getListFriend(user?._id)
  );

  const handleSetUserTag = (userSelect: IFriendResponse) => {
    const userTagQuery = queryClient.getQueryData([
      QueryKey.TAG_USER_POST,
      { user_id: user?._id },
    ]) as IFriendResponse[];

    queryClient.setQueryData<IFriendResponse[]>(
      [QueryKey.TAG_USER_POST, { user_id: user?._id }],
      userTagQuery.filter((item) => item._id !== userSelect._id)
    );

    setUserTag((prev) => [...prev, userSelect]);
  };

  const handleDeleteTag = (id: string) => {
    const userDelete = userTag.find((item) => item._id === id);
    setUserTag((prev) => prev.filter((item) => item._id !== id));

    if (userDelete) {
      const userTagQuery = queryClient.getQueryData([
        QueryKey.TAG_USER_POST,
        { user_id: user?._id },
      ]) as IFriendResponse[];
      queryClient.setQueryData<IFriendResponse[]>(
        [QueryKey.TAG_USER_POST, { user_id: user?._id }],
        [...userTagQuery, userDelete]
      );
    }
  };

  const dispatch = useAppDispatch();

  const handleSuccess = () => {
    setValues(
      'tag',
      userTag.map((item) => item.user._id)
    );
    dispatch(addTagState(userTag));

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <RootStyle>
        <HeaderStyle>
          <Typography variant="h6" component="h2" align="center" sx={{ width: 1 }}>
            Gắn thẻ người khác
          </Typography>
          <CloseIconStyle>
            <IconButton
              onClick={onClose}
              sx={{
                bgcolor: (theme: Theme) => theme.palette.action.hover,
                '&:hover': {
                  bgcolor: (theme: Theme) => theme.palette.action.focus,
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </CloseIconStyle>
        </HeaderStyle>

        <Box sx={{ p: 2 }}>
          <InputStyled>
            <Input
              fullWidth
              disableUnderline
              value={value}
              onChange={handleOnChange}
              placeholder="Tìm kiếm bạn bè"
              startAdornment={
                <InputAdornment position="start" sx={{ gap: 1, mr: 1 }}>
                  <IconButton size="small" disabled={true}>
                    <Iconify icon="uil:search" />
                  </IconButton>
                </InputAdornment>
              }
            />
          </InputStyled>
        </Box>

        <ContentStyle>
          <Typography variant="body1" color="text.secondary" mb={1}>
            Đã gắn thẻ
          </Typography>
          <TagInputStyle>
            {userTag.map((item) => (
              <ChipStyle key={item._id} label={item.user.full_name} onDelete={() => handleDeleteTag(item._id)} />
            ))}
          </TagInputStyle>

          <Typography variant="body1" color="text.secondary" mb={1}>
            Gợi ý
          </Typography>
          <List>
            {!isLoading &&
              data?.map((item, index) => (
                <ListItemButton key={index} sx={{ borderRadius: 1 }} onClick={() => handleSetUserTag(item)}>
                  <ListItemAvatar>
                    <AvatarUpload url={item.user.avatar} />
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography variant="subtitle1" color="text.secondary">
                      {item.user.full_name}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              ))}
          </List>
        </ContentStyle>

        <FooterStyle>
          <Stack direction="row" spacing={1}>
            <Button variant="text" onClick={onClose}>
              Huỷ
            </Button>
            <Button variant="contained" sx={{ minWidth: 80 }} onClick={handleSuccess}>
              Xong
            </Button>
          </Stack>
        </FooterStyle>
      </RootStyle>
    </Dialog>
  );
}

export default PostTagUserDialog;
