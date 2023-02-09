import React, { useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getStickerPackageInfo, getStickerPackages } from 'src/api/sticker.api';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Box, Card, CardMedia, Divider, IconButton, Stack, styled, Typography } from '@mui/material';
import Image from 'src/components/Image';
import { useInView } from 'react-intersection-observer';
import { flatten } from 'lodash';
import TextMaxLine from 'src/components/TextMaxLine';
import { AddIcon, VisibilityIcon } from 'src/components/icons';
import MessageItem from 'src/sections/conversation/MessageItem';
import { Virtuoso } from 'react-virtuoso';
import ScrollBar from 'src/components/ScrollBar';

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));

const HeaderStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));

function Sticker() {
  const [page, setPage] = React.useState(1);
  const [isNextPage, setIsNextPage] = useState(true);

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
    ['sticker-store'],
    ({ pageParam }) => getStickerPackages(page),
    {
      getNextPageParam: (lastPage) => page + 1,
      onSuccess: (data) => {
        if (data.pages[data.pages.length - 1].length < 20) {
          setIsNextPage(false);
        }
      },
    }
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && isNextPage) {
      setPage((prev) => prev + 1);

      fetchNextPage();
    }
  }, [inView]);

  const followOutput = useCallback((isAtBottom: boolean) => {
    return isAtBottom ? 'smooth' : false;
  }, []);

  return (
    <RootStyle>
      <HeaderStyle>
        <Typography variant="h3">Sticker Store</Typography>
        <Typography variant="subtitle1">Choose your favorite sticker</Typography>
      </HeaderStyle>
      <ContentStyle>
        <Grid2 container spacing={2}>
          {!isLoading &&
            flatten(data?.pages).map((item, index) => (
              <Grid2 xs={6} key={index}>
                <Card>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Image
                      sx={{
                        maxHeight: 240,
                        width: 320,
                      }}
                      src={item.packageImg}
                    />
                    <StickerPackageItem packageId={item.packageId} />
                  </Stack>
                  <Divider />

                  <Stack direction="row" justifyContent="space-between" sx={{ p: 1 }}>
                    <Box>
                      <TextMaxLine
                        variant="caption"
                        line={1}
                        sx={{
                          fontWeight: 550,
                          fontSize: 14,
                        }}
                      >
                        {item.packageName}
                      </TextMaxLine>
                      <TextMaxLine line={1} variant="caption">
                        {item.artistName}
                      </TextMaxLine>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="large"
                        sx={{
                          bgcolor: (theme) => theme.palette.action.hover,
                          '&:hover': {
                            bgcolor: (theme) => theme.palette.action.focus,
                          },
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      <IconButton
                        size="large"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              </Grid2>
            ))}
        </Grid2>
        {!isLoading && hasNextPage && <Box ref={ref} sx={{ height: 2 }} />}
      </ContentStyle>
    </RootStyle>
  );
}

interface IStickerPackageItem {
  packageId: number;
}

function StickerPackageItem({ packageId }: IStickerPackageItem) {
  const { data, isLoading } = useQuery(['sticker-package-info', { packageId }], () => getStickerPackageInfo(packageId), {
    enabled: !!packageId,
  });

  return (
    <Grid2 container sx={{ width: '100%' }} spacing={2}>
      {!isLoading &&
        data?.package?.stickers?.slice(0, 8).map((sticker, index) => (
          <Grid2 xs={3} key={index}>
            <Image src={sticker.stickerImg} />
          </Grid2>
        ))}
    </Grid2>
  );
}

export default Sticker;
