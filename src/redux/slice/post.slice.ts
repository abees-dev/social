import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFeelingResponse } from 'src/interface/FeelingResponse';
import { IFriendResponse } from 'src/interface/FriendReponse';
import { IPostResponse } from 'src/interface/PostResponse';
import { IReactionPostRedux } from 'src/interface/ReactionPost';
import { IUserResponse } from 'src/interface/UserReponse';

interface ICreatePostState {
  tag: IUserResponse[];
  feeling?: IFeelingResponse;
}
export interface PostState {
  posts: IPostResponse[];
  createPost: ICreatePostState;
}

const initialState: PostState = {
  posts: [],
  createPost: {
    tag: [],
  },
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addFeelingState: (state, action: PayloadAction<IFeelingResponse>) => {
      state.createPost.feeling = action.payload;
    },
    addTagState: (state, action: PayloadAction<IFriendResponse[]>) => {
      state.createPost.tag = action.payload.map((item) => item.user);
    },
    addPost: (state, action: PayloadAction<IPostResponse>) => {
      state.posts = [action.payload, ...state.posts];
      state.createPost.tag = [];
      state.createPost.feeling = undefined;
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((item) => item._id !== action.payload);
    },
    initialPostResponse: (state, action: PayloadAction<IPostResponse[]>) => {
      state.posts = action.payload;
    },

    updateReactionPost: (state, action: PayloadAction<IReactionPostRedux>) => {
      state.posts = state.posts.map((item) => {
        if (item._id === action.payload.post_id) {
          return {
            ...item,
            no_of_reaction: item.no_of_reaction + handleUpdateReactionPost(item.my_reaction, action.payload.type),
            my_reaction: action.payload.type,
          };
        }
        return item;
      });
    },
  },
});

export const { initialPostResponse, deletePost, addPost, updateReactionPost, addFeelingState, addTagState } =
  postSlice.actions;

export default postSlice.reducer;
const handleUpdateReactionPost = (my_reaction: number, type: number) => {
  console.log(my_reaction, type);
  if (my_reaction === type || type === 0) {
    return -1;
  } else if (my_reaction !== type && my_reaction === 0) {
    return 1;
  }
  return 0;
};
