import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material';
import { FriendCard, FriendListItem } from 'src/sections/friends';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { QueryKey } from 'src/enums/querykey';
import { addFriend, getFriendReceived, getFriendRequest, getSuggestions, revokeRequest } from 'src/api/friendship.api';
import { flatten, isEmpty } from 'lodash';
import Grid2 from '@mui/material/Unstable_Grid2';
import FriendSkeleton from 'src/components/skeleton/FriendSkeleton';
import { useInView } from 'react-intersection-observer';

import { IFriendResponse } from 'src/interface/FriendReponse';

const RootStyled = styled('div')(({ theme }) => ({}));

function FriendRequest() {
  const limit = 9;
  const [isNextPage, setIsNextPage] = useState(true);

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    [QueryKey.FRIEND_RECEIVED],
    ({ pageParam }) => getFriendReceived({ limit: limit, position: pageParam }),
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

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      isNextPage && fetchNextPage();
    }
  }, [inView]);

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

export default FriendRequest;
