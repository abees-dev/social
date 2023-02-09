import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removePost } from 'src/api/post.api';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { IPostResponse } from 'src/interface/PostResponse';
import Iconify from 'src/components/Iconify';
import { deletePost } from 'src/redux/slice/post.slice';

const RootStyle = styled('main')(({ theme }) => ({
  padding: theme.spacing(1),
}));

const ListItemIconStyle = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 0,
  marginRight: theme.spacing(2),
}));

interface IPostMenuListProps {
  isOwner: boolean;
  postId: string;
}
function PostMenuList({ isOwner, postId }: IPostMenuListProps) {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const { mutate } = useMutation((values: string) => removePost(values), {
    onSuccess: (data) => {
      const postValue = queryClient.getQueryData<IBaseResponse<IPostResponse[]>>(['POST', { user_id: user?._id }]);
      if (postValue) {
        queryClient.setQueryData<IBaseResponse<IPostResponse[]>>(['POST', { user_id: user?._id }], {
          ...postValue,
          data: postValue?.data?.filter((post) => post._id !== postId),
        });
        dispatch(deletePost(postId));
      }
    },
  });

  const handleDeletePost = () => {
    mutate(postId);
  };
  return (
    <RootStyle>
      <List disablePadding>
        {isOwner ? (
          <ListItemButton
            onClick={handleDeletePost}
            sx={{
              borderRadius: 1,
            }}
          >
            <ListItemIconStyle>
              <Iconify icon="bi:trash" />
            </ListItemIconStyle>
            <ListItemText primary="Xoá bài viêt" />
          </ListItemButton>
        ) : (
          <ListItemButton>
            <ListItemIcon>
              <Iconify icon="material-symbols:bookmark-remove" />
            </ListItemIcon>
            <ListItemText primary="Ẩn bài viết" />
          </ListItemButton>
        )}
        {/* <ListItemButton>
          <ListItemIcon></ListItemIcon>

          <ListItemText primary="Live stream" />
        </ListItemButton> */}
      </List>
    </RootStyle>
  );
}

export default PostMenuList;
