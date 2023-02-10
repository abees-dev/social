import { Button, Divider, Stack, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Data } from 'emoji-mart';
import { isEmpty } from 'lodash';
import React from 'react';
import { acceptFriend, addFriend, getFriendReceived, getFriendRequest, getSuggestions } from 'src/api/friendship.api';
import AvatarUpload from 'src/components/AvatarUpload';
import { IFriendResponse } from 'src/interface/FriendReponse';
import { IUserResponse } from 'src/interface/UserReponse';

export default function Suggestions() {
  const queryClient = useQueryClient();

  const { data: suggestFriend, isLoading } = useQuery(['SUGGEST_FRIEND', { limit: 3 }], () =>
    getSuggestions({
      limit: 3,
    })
  );

  const { data: requestFriend, isLoading: loadingRequest } = useQuery(['REQUEST_FRIENDS_SUGGEST', { limit: 3 }], () =>
    getFriendReceived({ limit: 3 })
  );

  // const { mutate: addFriendMutate } = useMutation((user_id: string) => addFriend(user_id), {
  //   onSuccess: (_, variables) => {
  //     console.log('add friend success', variables);
  //   },
  // });

  const { mutate: addFriendMutate } = useMutation((user_id: string) => addFriend(user_id), {
    onSuccess: (_, variables) => {
      queryClient.setQueryData<IUserResponse[]>(['SUGGEST_FRIEND', { limit: 3 }], (prev) =>
        prev?.filter((item) => item._id !== variables)
      );
    },
  });

  const { mutate: acceptFriendMutate } = useMutation((user_id: string) => acceptFriend(user_id), {
    onSuccess: (_, variables) => {
      queryClient.setQueryData<IFriendResponse[]>(['REQUEST_FRIENDS_SUGGEST', { limit: 3 }], (prev) =>
        prev?.filter((item) => item.user._id !== variables)
      );
    },
  });

  const handleAddFriend = (user_id: string) => {
    addFriendMutate(user_id);
  };

  const handleAcceptFriend = (user_id: string) => {
    acceptFriendMutate(user_id);
  };

  return (
    <>
      {!isLoading && !isEmpty(suggestFriend) && (
        <Stack>
          <Typography variant="subtitle2" color="text.secondary">
            Gợi ý kết bạn
          </Typography>
          {suggestFriend?.map((item) => (
            <Stack key={item._id} sx={{ mt: 1 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                  <AvatarUpload url={item.address} />
                  <Typography variant="subtitle2" sx={{ ml: 1 }}>
                    {item.full_name}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleAddFriend(item._id)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Gửi lời mời
                </Button>
              </Stack>
            </Stack>
          ))}
          <Divider sx={{ mt: 2 }} />
        </Stack>
      )}

      {!loadingRequest && !isEmpty(requestFriend) && (
        <Stack>
          <Typography variant="subtitle2" color="text.secondary">
            Lời mời kết bạn
          </Typography>
          {requestFriend?.map((item) => (
            <Stack key={item._id} sx={{ mt: 1 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                  <AvatarUpload url={item.user.avatar} />
                  <Typography variant="subtitle2" sx={{ ml: 1 }}>
                    {item.user.full_name}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                  onClick={() => handleAcceptFriend(item.user._id)}
                >
                  Chấp nhận
                </Button>
              </Stack>
            </Stack>
          ))}
          <Divider sx={{ mt: 2 }} />
        </Stack>
      )}
    </>
  );
}
