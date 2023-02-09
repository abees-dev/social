import { Box, Link, styled } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { flatten, isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { IUserResponse } from 'src/interface/UserReponse';
import { useAppSelector } from 'src/redux/hooks';

import { getCommentByPost } from 'src/api/nestjs.comment.api';
import { ICommentResponse } from 'src/interface/CommentResponse';
import CommentInput from './CommentInput';
import CommentItemRoot from './CommentItem';

interface RootProps {
  isReply?: boolean;
}

const RootStyled = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isReply',
})<RootProps>(({ theme, isReply }) => ({
  paddingLeft: isReply ? theme.spacing(6) : theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
}));

const ContentStyled = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isReply',
})<RootProps>(({ theme, isReply }) => ({
  position: 'relative',
}));

interface CommentListProps {
  postId: string;
  noOfComment: number;
  commentId?: string;
  nestedLevel?: number;
  isComment?: boolean;
  isSeenReply?: boolean;
  isReplyComment?: boolean;
}

export default function CommentList({
  postId,
  noOfComment,
  commentId,
  nestedLevel = 1,
  isComment,
  isReplyComment,
}: CommentListProps) {
  const [commentResponse, setCommentResponse] = useState<ICommentResponse[]>([]);
  const [isNextPage, setIsNextPage] = useState(true);
  const [seenReply, setSeenReply] = useState('');
  const [replyId, setReplyId] = useState('');
  const [isReply, setIsReply] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReplyComment) {
      setIsReply(true);
    } else {
      setIsReply(false);
    }
  }, [isReplyComment]);

  const limit = 3;
  const isNested = nestedLevel < Number(process.env.REACT_APP_NESTED_LEVEL);

  const user = useAppSelector((state) => state.auth.user) as IUserResponse;

  const { hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery(
    ['COMMENTS_POST', { post_id: postId, ...(commentId && { comment_id: commentId }) }],
    ({ pageParam }) =>
      getCommentByPost(postId, {
        limit: limit,
        position: pageParam,
        order: 'desc',
        ...(commentId && { comment_id: commentId }),
      }),

    {
      getNextPageParam: (lastPage) => {
        if (!isEmpty(lastPage) && lastPage.length === limit && noOfComment - commentResponse.length > 0) {
          return lastPage[lastPage.length - 1].position;
        }
        return false;
      },
      onSuccess(data) {
        if (data.pages[data.pages.length - 1].length < limit || noOfComment - commentResponse.length <= 0) {
          setIsNextPage(false);
        }
        setCommentResponse(flatten(data.pages).reverse());
      },
      onError(error) {
        console.log(error);
      },
    }
  );

  const handleLoadMore = () => {
    isNextPage && fetchNextPage();
  };

  const handleSendComment = (data: ICommentResponse) => {
    setCommentResponse((prev) => [...prev, data]);
    setIsReply(false);
  };

  const handleSeenReply = (comment_id: string) => {
    setSeenReply(comment_id);
    setIsReply((prev) => (commentId === comment_id ? !prev : false));
  };
  const handleReply = (comment_id: string) => {
    setSeenReply(comment_id);
    if (!isNested) {
      setIsReply((prev) => !prev);
      return setReplyId(String(commentId));
    }
    setIsReply((prev) => (commentId === comment_id ? !prev : false));
    setReplyId(comment_id);
    return true;
  };

  const hashSeen = (comment_id: string) => seenReply === comment_id;

  const hashReply = (comment_id: string) => replyId === comment_id;

  const hashReplyComment = (comment_id: string, no_of_reply: number) => {
    if (hashReply(comment_id) && isNested) {
      return true;
    }
    if (no_of_reply > 0 && isNested && hashSeen(comment_id)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log(ref.current);
  }, [ref?.current]);

  return (
    <RootStyled isReply={!isComment}>
      {hasNextPage && (
        <Link
          variant="caption"
          mb={1}
          color="text.secondary"
          underline="hover"
          onClick={handleLoadMore}
          sx={{
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Xem thêm {noOfComment - commentResponse.length} {isComment ? 'bình luận' : 'Phản hồi'}
        </Link>
      )}

      {!isEmpty(commentResponse) &&
        commentResponse?.map((comment) => (
          <Box key={comment._id}>
            <CommentItemRoot
              comment={comment}
              post_id={postId}
              isReply={!isComment}
              onOpenReply={() => handleReply(comment._id)}
            />

            {hashReplyComment(comment._id, comment.no_of_reply) && (
              <CommentList
                postId={postId}
                noOfComment={comment.no_of_reply}
                commentId={comment._id}
                nestedLevel={nestedLevel + 1}
                isReplyComment={hashReply(comment._id)}
              />
            )}
            {comment.no_of_reply > 0 && isNested && !hashSeen(comment._id) && (
              <Box sx={{ ml: 6 }}>
                <Link
                  variant="caption"
                  color="text.secondary"
                  underline="hover"
                  onClick={() => handleSeenReply(comment._id)}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Xem thêm {comment.no_of_reply} phản hồi
                </Link>
              </Box>
            )}
          </Box>
        ))}

      {!isLoading && isReply && !isComment && (
        <CommentInput postId={postId} onSuccess={handleSendComment} commentId={commentId} focus />
      )}
      {isComment && <CommentInput postId={postId} onSuccess={handleSendComment} commentId={commentId} />}
    </RootStyled>
  );
}
