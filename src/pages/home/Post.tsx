import { Box, Card, Container, styled } from '@mui/material';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { flatten, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getPost } from 'src/api/post.api';
import Page from 'src/components/Page';
import PostSkeleton from 'src/components/skeleton/PostSkeleton';
import useRouter from 'src/hooks/useRouter';
import { CommentList, PostCreate, PostList } from 'src/sections/post';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { initialPostResponse } from 'src/redux/slice/post.slice';
import Grid2 from '@mui/material/Unstable_Grid2';
import { RightNavBar } from 'src/sections/home';
import { HEADER } from 'src/config';
import ScrollBar from 'src/components/ScrollBar';

const ContainerStyle = styled('div')(({ theme }) => ({
  maxWidth: theme.breakpoints.values.md - 100,

  margin: 'auto',
  [theme.breakpoints.up('lg')]: {
    maxWidth: theme.breakpoints.values.md - 100,
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: theme.breakpoints.values.md - 100,
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: theme.breakpoints.values.md - 100,
  },
  [theme.breakpoints.down('xs')]: {
    maxWidth: theme.breakpoints.values.md - 100,
  },
}));

interface IGridProps {
  isOffset?: boolean;
}

const GridStyled = styled(Grid2)<IGridProps>(({ isOffset, theme }) => ({
  position: 'sticky',
  top: isOffset ? HEADER.HEADER_DESKTOP_OFFSET_HEIGHT : HEADER.HEADER_DESKTOP_HEIGHT + 32,
  height: 'calc(100vh - 120px)',
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
  }),
}));

export default function PostPage() {
  const [isNextPage, setIsNextPage] = useState(true);
  const postResponse = useAppSelector((state) => state.postReducer.posts);
  const isOffset = useAppSelector((state) => state.offset.isOffsetTop);
  const dispatch = useAppDispatch();

  const { params, pathname } = useRouter();
  const limit = 5;

  const hashUrl = !isEmpty(params) && pathname.includes('profile');

  const user = useAppSelector((state) => state.auth.user);

  const { hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery(
    ['POST', { user_id: hashUrl ? params.id : user?._id }],
    ({ pageParam }) =>
      getPost({
        limit: limit,
        position: pageParam,
      }),

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
        dispatch(initialPostResponse(flatten(data.pages)));
      },
      onError(error) {
        console.log(error);
      },
    }
  );

  const [ref, inView] = useInView();

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (inView) {
      isNextPage && fetchNextPage();
    }
  }, [inView]);

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Page title="Post">
      <Grid2 container spacing={4}>
        {!hashUrl && (
          <Grid2 lg={2.5} display={{ lg: hashUrl ? 'none' : 'block', md: 'none', sm: 'none', xs: 'none' }}></Grid2>
        )}

        <Grid2 lg={hashUrl ? 12 : 7} md={hashUrl ? 12 : 9} sm={12} xs={12}>
          <ContainerStyle>
            <PostCreate handleSuccess={handleSuccess} open={open} handleClose={handleClose} handleOpen={handleOpen} />

            {isLoading
              ? [...Array(2)].map((_, index) => <PostSkeleton key={index} />)
              : postResponse.map((post) => (
                  <Card key={post._id} sx={{ pb: 2, mt: 2 }}>
                    <Box>
                      <PostList post={post} />
                    </Box>
                  </Card>
                ))}

            {!isLoading && hasNextPage && (
              <PostSkeleton
                sx={{
                  mt: 2,
                }}
                ref={ref}
              />
            )}
          </ContainerStyle>
        </Grid2>

        {!hashUrl && (
          <GridStyled
            xs={2}
            lg={2.5}
            md={3}
            display={{ lg: hashUrl ? 'none' : 'block', md: 'block', sm: 'none', xs: 'none' }}
            isOffset={isOffset}
          >
            <ScrollBar>
              <RightNavBar />
            </ScrollBar>
          </GridStyled>
        )}
      </Grid2>
    </Page>
  );
}
