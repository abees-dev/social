import { Button, Divider, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Data } from 'emoji-mart';
import { isEmpty } from 'lodash';
import React from 'react';
import { getFriendReceived, getFriendRequest, getSuggestions } from 'src/api/friendship.api';
import AvatarUpload from 'src/components/AvatarUpload';

export default function Suggestions() {
  const { data: suggestFriend, isLoading } = useQuery(['SUGGEST_FRIEND', { limit: 3 }], () =>
    getSuggestions({
      limit: 3,
    })
  );

  const { data: requestFriend, isLoading: loadingRequest } = useQuery(['REQUEST_FRIENDS_SUGGEST', { limit: 3 }], () =>
    getFriendReceived({ limit: 3 })
  );

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
