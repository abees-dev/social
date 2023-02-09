import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material';
import { FriendCard, FriendListItem } from 'src/sections/friends';
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from 'src/enums/querykey';
import { addFriend, getFriendRequest, getSuggestions, revokeRequest } from 'src/api/friendship.api';
import { flatten, isEmpty } from 'lodash';
import Grid2 from '@mui/material/Unstable_Grid2';
import FriendSkeleton from 'src/components/skeleton/FriendSkeleton';
import { useInView } from 'react-intersection-observer';
import { initialPostResponse } from 'src/redux/slice/post.slice';
import { IUserResponse } from 'src/interface/UserReponse';
import { CONTACT_TYPE } from 'src/enums';
import { IFriendResponse } from 'src/interface/FriendReponse';

const RootStyled = styled('div')(({ theme }) => ({}));

function FriendSendRequest() {
  const limit = 9;
  const [isNextPage, setIsNextPage] = useState(true);

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    [QueryKey.FRIEND_REQUEST],
    ({ pageParam }) => getFriendRequest({ limit: 9, position: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        if (!isEmpty(lastPage) && lastPage.length === limit) {
          return lastPage[lastPage.length - 1].position;
        }
        return false;
      },
      onSuccess(data) {
        if (data.pages[data.pages.length - 1].length < limit) {
          setIsNextPage(false);
        }
      },
    }
  );

  const queryClient = useQueryClient();

  const { mutate: revokeRequestMutate } = useMutation((user_id: string) => revokeRequest(user_id), {
    onSuccess: (_, variables) => {
      console.log('revoke request success', variables);
      queryClient.setQueryData<InfiniteData<IFriendResponse[]>>([QueryKey.FRIEND_REQUEST], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page) => page.filter((item) => item.user._id !== variables)),
        };
      });
    },
  });

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      isNextPage && fetchNextPage();
    }
  }, [inView]);

  const handleAddFriend = (user_id: string) => {
    console.log('add friend', user_id);
  };

  const handleRemoveRequest = (user_id: string) => {
    console.log('remove request', user_id);
    revokeRequestMutate(user_id);
  };

  return (
    <RootStyled>
      {isLoading ? (
        <Grid2 container spacing={2}>
          {[...Array(3)].map((_, index) => (
            <Grid2 key={index} xs={12} sm={6} md={4} lg={3}>
              <FriendSkeleton />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <FriendListItem users={flatten(data?.pages)} />
      )}
      {!isLoading && hasNextPage && (
        <Grid2 container spacing={2} ref={ref}>
          {[...Array(3)].map((_, index) => (
            <Grid2 key={index} xs={12} sm={6} md={4} lg={3}>
              <FriendSkeleton />
            </Grid2>
          ))}
        </Grid2>
      )}
    </RootStyled>
  );
}

export default FriendSendRequest;
