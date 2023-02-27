import { alpha, IconButton, Stack, styled } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { MouseEvent, useState } from 'react';
import {
  getRecentlyStickerPackages,
  getStickerPackageInfo,
  getStickerPackagesUser,
  registerRecentSticker,
} from 'src/api/sticker.api';
import Dialog from 'src/components/Dialog';
import Iconify from 'src/components/Iconify';
import { AccessTimeIcon, StorefrontIcon } from 'src/components/icons';
import Image from 'src/components/Image';
import Popover from 'src/components/Popover';
import ScrollBar from 'src/components/ScrollBar';
import useTabs from 'src/hooks/useTabs';
import { ISticker, IStickerStoreResponse } from 'src/interface/StickerResponse';
import { IUserResponse } from 'src/interface/UserReponse';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { closeModal, openModal } from 'src/redux/slice/modal.slice';
import StickerStore from 'src/sections/conversation/StickerStore';
import { sendMessageSocket } from 'src/utils/socket';

const IconStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(0.5),
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
  },
  '&:active': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const TabRootStyled = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
}));

const ContentStyled = styled('div')(({ theme }) => ({
  width: '100%',
  height: 380,
}));
const GridItemStyled = styled(Grid2)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: theme.palette.action.hover,
  },
}));

interface IStickerPopoverProp {
  conversationId: string;
}

function StickerPopover({ conversationId }: IStickerPopoverProp) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user) as IUserResponse;

  const [currenTabs, onChangeTabs] = useTabs(0);

  const [stickerPackageUser, setStickerPackageUser] = useState<IStickerStoreResponse[]>([
    {
      packageId: 0,
      packageName: '',
      packageImg: '',
      packageCategory: '',
      packageKeywords: '',
      isNew: '',
      packageAnimated: '',
      artistName: '',
      language: '',
      isDownload: '',
      isWish: '',
    },
  ]);

  const handleOpenPopover = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const { data: stickerPackageQuery, isLoading } = useQuery(
    ['stickerPackageUser'],
    () => getStickerPackagesUser(user._id),
    {
      enabled: Boolean(anchorEl),
    }
  );

  const handleOpenModal = () => {
    dispatch(openModal('sticker-store'));
  };
  const handleCloseModal = () => {
    dispatch(closeModal('sticker-store'));
  };

  return (
    <div>
      <IconStyled onClick={handleOpenPopover}>
        <Iconify
          icon="fluent:sticker-24-filled"
          sx={{ width: 25, height: 25, color: 'secondary.main', rotate: '-25deg' }}
        />
      </IconStyled>
      <Popover
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <TabRootStyled>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
            <Tabs value={currenTabs} onChange={onChangeTabs} variant="scrollable">
              {!isLoading &&
                [...stickerPackageUser, ...(stickerPackageQuery?.packageList || [])]?.map((item) => (
                  <Tab
                    disableFocusRipple
                    key={item.packageId}
                    value={item.packageId}
                    icon={
                      item.packageId == 0 ? (
                        <AccessTimeIcon sx={{ width: 30, height: 30 }} />
                      ) : (
                        <Image src={item.packageImg} alt="" width={40} height={40} />
                      )
                    }
                    sx={{
                      padding: 0,
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.light, 0.09),
                        borderRadius: 1,
                      },
                    }}
                  />
                ))}
            </Tabs>
            <IconButton onClick={handleOpenModal}>
              <StorefrontIcon />
            </IconButton>
          </Stack>

          <ContentStyled>
            <ScrollBar sx={{ height: '100%' }}>
              {!isLoading &&
                !isEmpty(stickerPackageQuery) &&
                [...stickerPackageUser, ...(stickerPackageQuery?.packageList || [])].map(
                  (item) =>
                    item.packageId == currenTabs && (
                      <StickerPackageItem
                        key={item.packageId}
                        conversationId={conversationId}
                        open={Boolean(anchorEl)}
                        packageId={item.packageId}
                      />
                    )
                )}
            </ScrollBar>
          </ContentStyled>
        </TabRootStyled>

        <Dialog open={modal['sticker-store'] || false} onClose={handleCloseModal} maxWidth="lg">
          <StickerStore />
        </Dialog>
      </Popover>
    </div>
  );
}

interface IStickerPackageItem {
  packageId: number;
  open: boolean;
  conversationId: string;
}

function StickerPackageItem({ packageId, open, conversationId }: IStickerPackageItem) {
  const user = useAppSelector((state) => state.auth.user) as IUserResponse;

  const { data, isLoading } = useQuery(
    ['sticker-package-info', { packageId }],
    () => getStickerPackageInfo(packageId, user._id),
    {
      enabled: !!packageId && packageId !== 0 && open,
    }
  );

  const { data: recentStickerQuery } = useQuery(['recentSticker'], () => getRecentlyStickerPackages(user._id), {
    enabled: open && packageId == 0,
  });

  const { mutate: addStickerToChat } = useMutation((stickerId: number) => registerRecentSticker(stickerId, user._id));

  const handleAddStickerToChat = (sticker: ISticker) => {
    addStickerToChat(sticker.stickerId);

    sendMessageSocket('message_sticker', {
      message: '',
      conversation_id: conversationId,
      link: '',
      medias: [],
      tag: [],
      thumbnail: '',
      message_reply_id: '',
      sticker: sticker.stickerImg,
    });
  };

  return (
    <Grid2 container sx={{ width: '100%' }} spacing={2}>
      {!isLoading &&
        data?.package?.stickers?.map((sticker, index) => (
          <GridItemStyled xs={3} key={index} onClick={() => handleAddStickerToChat(sticker)}>
            <Image src={sticker.stickerImg} />
          </GridItemStyled>
        ))}
      {packageId == 0 && (
        <Grid2 container spacing={2}>
          {recentStickerQuery?.stickerList?.map((item, index) => (
            <GridItemStyled xs={3} key={index} onClick={() => handleAddStickerToChat(item)}>
              <Image src={item.stickerImg} alt="" />
            </GridItemStyled>
          ))}
        </Grid2>
      )}
    </Grid2>
  );
}

export default StickerPopover;
