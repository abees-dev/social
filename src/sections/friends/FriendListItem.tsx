import React from 'react';
import { Card, styled } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { FriendCard } from 'src/sections/friends/index';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  QueryKey as QueryClientKey,
  InfiniteData,
} from '@tanstack/react-query';
import { QueryKey } from 'src/enums/querykey';
import {
  acceptFriend,
  addFriend,
  deniedRequest,
  getSuggestions,
  removeFriend,
  revokeRequest,
} from 'src/api/friendship.api';
import { IUserResponse } from 'src/interface/UserReponse';
import { IFriendResponse } from 'src/interface/FriendReponse';
import { CONTACT_TYPE } from 'src/enums';

const RootStyle = styled('div')(({ theme }) => ({}));

interface IFriendListItemProps {
  users: IFriendResponse[];
}
interface IHandleChangeContact {
  query: QueryClientKey;
  user_id: string;
  oldContact: number;
  isRemove?: boolean;
  newContact: number;
  changeSuggestions?: boolean;
}

function FriendListItem({ users }: IFriendListItemProps) {
  const { mutate: addFriendMutate } = useMutation((user_id: string) => addFriend(user_id), {
    onSuccess: (_, variables) => {
      console.log('add friend success', variables);
    },
  });

  const { mutate: removeFriendMutate } = useMutation((user_id: string) => removeFriend(user_id), {
    onSuccess: (_, variables) => {
      console.log('remove friend success', variables);
    },
  });

  const { mutate: revokeRequestMutate } = useMutation((user_id: string) => revokeRequest(user_id), {
    onSuccess: (_, variables) => {
      console.log('revoke request success', variables);
    },
  });

  const { mutate: acceptFriendMutate } = useMutation((user_id: string) => acceptFriend(user_id), {
    onSuccess: (_, variables) => {
      console.log('accept friend success', variables);
    },
  });

  const { mutate: deniedRequestMutate } = useMutation((user_id: string) => deniedRequest(user_id), {
    onSuccess: (_, variables) => {
      console.log('denied request success', variables);
    },
  });

  const queryClient = useQueryClient();

  const handleChangeContact = ({ query, user_id, oldContact, isRemove, newContact }: IHandleChangeContact) => {
    if (oldContact === 0) {
      queryClient.setQueryData<InfiniteData<IUserResponse[]>>(query, (prev) => {
        if (!prev) return prev;
        if (isRemove) {
          return {
            ...prev,
            pages: prev.pages.map((page) => page.filter((user) => user._id !== user_id)),
          };
        } else {
          return {
            ...prev,
            pages: prev.pages.map((page) =>
              page.map((user) => (user._id === user_id ? { ...user, contact_type: newContact } : user))
            ),
          };
        }
      });
    } else {
      queryClient.setQueryData<InfiniteData<IFriendResponse[]>>(query, (prev) => {
        if (!prev) return prev;
        if (isRemove) {
          return {
            ...prev,
            pages: prev.pages.map((page) => page.filter((user) => user.user._id !== user_id)),
          };
        } else {
          return {
            ...prev,
            pages: prev.pages.map((page) =>
              page.map((user) => (user.user._id === user_id ? { ...user, contact_type: newContact } : user))
            ),
          };
        }
      });
    }
  };

  const handleActionResult = (user_id: string, contact: number) => {
    switch (contact) {
      case 0:
        addFriendMutate(user_id);
        handleChangeContact({
          query: [QueryKey.SUGGEST_FRIEND],
          user_id,
          oldContact: contact,
          newContact: CONTACT_TYPE.REQUEST,
        });
        queryClient.invalidateQueries([QueryKey.FRIEND_REQUEST]).then(console.log);
        break;
      case 1:
        removeFriendMutate(user_id);
        handleChangeContact({
          query: [QueryKey.FRIEND, { user_id: user_id }],
          user_id,
          oldContact: contact,
          isRemove: true,
          newContact: CONTACT_TYPE.NONE,
        });

        handleChangeContact({
          query: [QueryKey.FRIEND_RECEIVED],
          user_id,
          oldContact: contact,
          isRemove: true,
          newContact: CONTACT_TYPE.NONE,
        });
        break;
      case 2:
        revokeRequestMutate(user_id);
        handleChangeContact({
          query: [QueryKey.FRIEND_REQUEST],
          user_id,
          oldContact: contact,
          isRemove: true,
          newContact: CONTACT_TYPE.NONE,
        });
        handleChangeContact({
          query: [QueryKey.SUGGEST_FRIEND],
          user_id,
          oldContact: 0,
          newContact: 0,
        });
        break;
      case 3:
        acceptFriendMutate(user_id);
        handleChangeContact({
          query: [QueryKey.FRIEND_RECEIVED],
          user_id,
          oldContact: contact,
          newContact: CONTACT_TYPE.FRIEND,
        });
        break;
      default:
        break;
    }
  };

  return (
    <RootStyle>
      <Grid2 container spacing={2}>
        {users.map((friend) => (
          <Grid2 key={friend._id} xs={12} sm={6} md={4} lg={3}>
            <FriendCard
              user={friend.user}
              contactType={friend.contact_type}
              onAccept={() => handleActionResult(friend.user._id, friend.contact_type)}
            />
          </Grid2>
        ))}
      </Grid2>
    </RootStyle>
  );
}

export default FriendListItem;
