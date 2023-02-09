import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material';
import { FriendCard, FriendListItem } from 'src/sections/friends';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  QueryKey as QueryClientKey,
} from '@tanstack/react-query';
import { QueryKey } from 'src/enums/querykey';
import {
  addFriend,
  getFriendRequest,
  getListFriend,
  getSuggestions,
  removeFriend,
  revokeRequest,
} from 'src/api/friendship.api';
import { flatten, isEmpty } from 'lodash';
import Grid2 from '@mui/material/Unstable_Grid2';
import FriendSkeleton from 'src/components/skeleton/FriendSkeleton';
import { useInView } from 'react-intersection-observer';
import { IUserResponse } from 'src/interface/UserReponse';
import { IFriendResponse } from 'src/interface/FriendReponse';
import { useAppSelector } from 'src/redux/hooks';

const RootStyled = styled('div')(({ theme }) => ({}));



function FriendList() {
  const limit = 9;
  const [isNextPage, setIsNextPage] = useState(true);
  const user = useAppSelector((state) => state.auth.user) as IUserResponse;

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    [QueryKey.FRIEND, { user_id: user._id }],
    ({ pageParam }) => getListFriend(user._id, { limit: 9, position: pageParam }),
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

  const { mutate: removeFriendMutate } = useMutation((user_id: string) => removeFriend(user_id), {
    onSuccess: (_, variables) => {
      queryClient.setQueryData<InfiniteData<IFriendResponse[]>>([QueryKey.FRIEND, { user_id: user._id }], (prev) => {
        if (!prev) return;
        return {
          ...prev,
          pages: prev?.pages.map((page) => page.filter((friend) => friend.user._id !== variables)),
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

  const handleAccept = (user_id: string) => {
    removeFriendMutate(user_id);
  };

  const handleRemoveRequest = (user_id: string) => {
    console.log('remove request', user_id);
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
        <Grid2 container spacing={2}>
          {flatten(data?.pages).map((friend) => (
            <Grid2 key={friend._id} xs={12} sm={6} md={4} lg={3}>
              <FriendCard
                user={friend.user}
                contactType={friend.contact_type}
                onAccept={() => handleAccept(friend.user._id)}
                onRemove={() => handleRemoveRequest(friend.user._id)}
              />
            </Grid2>
          ))}
        </Grid2>
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

export default FriendList;
