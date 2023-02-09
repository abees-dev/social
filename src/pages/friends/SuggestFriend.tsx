import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material';
import { FriendCard, FriendListItem } from 'src/sections/friends';
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from 'src/enums/querykey';
import { addFriend, getSuggestions, revokeRequest } from 'src/api/friendship.api';
import { flatten, isEmpty } from 'lodash';
import Grid2 from '@mui/material/Unstable_Grid2';
import FriendSkeleton from 'src/components/skeleton/FriendSkeleton';
import { useInView } from 'react-intersection-observer';
import { initialPostResponse } from 'src/redux/slice/post.slice';
import { IUserResponse } from 'src/interface/UserReponse';
import { CONTACT_TYPE } from 'src/enums';
import { UseInfiniteQueryResult } from '@tanstack/react-query/src/types';

const RootStyled = styled('div')(({ theme }) => ({}));

interface ISuggestFriendProps {
  isNext?: boolean;
  isHeader?: boolean;
}

function SuggestFriend() {
  const limit = 9;
  const [isNextPage, setIsNextPage] = useState(true);

  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    [QueryKey.SUGGEST_FRIEND],
    ({ pageParam }) => getSuggestions({ limit: 9, position: pageParam }),
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

  const handleSetQueryData = (user_id: string, contactType: number) => {
    queryClient.setQueryData<InfiniteData<IUserResponse[]>>([QueryKey.SUGGEST_FRIEND], (prev) => {
      if (prev) {
        return {
          ...prev,
          pages: prev.pages.map((page) => {
            return page.map((user) => ({
              ...user,
              contact_type: user._id === user_id ? contactType : user.contact_type,
            }));
          }),
        };
      }
      return prev;
    });

    queryClient.invalidateQueries([QueryKey.FRIEND_REQUEST]).then(console.log);
  };

  const { mutate: addFriendMutate } = useMutation((user_id: string) => addFriend(user_id), {
    onSuccess: (_, variables) => {
      handleSetQueryData(variables, CONTACT_TYPE.REQUEST);
    },
  });

  const { mutate: revokeRequestMutate } = useMutation((user_id: string) => revokeRequest(user_id), {
    onSuccess: (_, variables) => {
      handleSetQueryData(variables, CONTACT_TYPE.NONE);
    },
  });

  const handleAddFriend = (user_id: string, oldContact?: number) => {
    if (oldContact === CONTACT_TYPE.REQUEST) return revokeRequestMutate(user_id);
    return addFriendMutate(user_id);
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
          {flatten(data?.pages).map((user) => (
            <Grid2 key={user._id} xs={12} sm={6} md={4} lg={3}>
              <FriendCard
                user={user}
                contactType={user.contact_type}
                onAccept={() => handleAddFriend(user._id, user.contact_type)}
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

export default SuggestFriend;
