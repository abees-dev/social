/* eslint-disable no-unused-vars */
import { alpha, Box, Button, Card, Divider, Stack, styled, Typography } from '@mui/material';
import { CameraIllustrator, LiveIllustrator, LoveIcon } from 'src/assets';
import IconButtonAnimate from 'src/components/animate/IconButtonAnimate';
import Dialog from 'src/components/Dialog';
import Iconify from 'src/components/Iconify';
import MyAvatar from 'src/components/MyAvatar';
import PostCreateForm from './PostCreateForm';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { closeModal, openModal } from 'src/redux/slice/modal.slice';
import { DialogName } from 'src/enums/dialog';

const RootStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const InputStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  padding: theme.spacing(1, 2),
  flex: 1,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  minHeight: 48,
  '&:hover': {
    backgroundColor: alpha(theme.palette.divider, 0.3),
  },
}));

export interface PostCreateProps {
  open: boolean;
  handleSuccess: () => void;
  handleOpen: () => void;
  handleClose: () => void;
}

export default function PostCreate({ open }: PostCreateProps) {
  const dispatch = useAppDispatch();

  const modalState = useAppSelector((state) => state.modal);

  const handleOpen = () => {
    dispatch(openModal(DialogName.CREATE_POST));
  };

  const handleClose = () => {
    dispatch(closeModal(DialogName.CREATE_POST));
  };

  return (
    <RootStyled>
      <Stack direction="row" spacing={2}>
        <MyAvatar />
        <InputStyle onClick={handleOpen}>
          <Typography variant="body2">What are you thinking?</Typography>
        </InputStyle>
      </Stack>
      <Stack direction="row" mt={2}>
        <Button
          variant="text"
          color="inherit"
          fullWidth
          size="large"
          startIcon={<LiveIllustrator sx={{ width: 20, mr: 1 }} />}
        >
          Live stream
        </Button>
        <Button
          variant="text"
          color="inherit"
          fullWidth
          size="large"
          onClick={handleOpen}
          startIcon={<CameraIllustrator sx={{ width: 20, mr: 1 }} />}
        >
          photo/video
        </Button>
        <Button
          variant="text"
          color="inherit"
          fullWidth
          size="large"
          startIcon={<LoveIcon sx={{ width: 20, mr: 1 }} />}
        >
          feeling
        </Button>
      </Stack>
      <Dialog open={Boolean(modalState[DialogName.CREATE_POST])} onClose={handleClose} maxWidth="sm">
        <Box py={2}>
          <Box position="relative">
            <Typography variant="h5" align="center" mb={2}>
              Create Post
            </Typography>
            <IconButtonAnimate
              sx={{
                position: 'absolute',
                right: 10,
                top: -5,
              }}
              onClick={handleClose}
            >
              <Iconify icon="gg:close" />
            </IconButtonAnimate>
          </Box>
          <Divider />
          <PostCreateForm />
        </Box>
      </Dialog>
    </RootStyled>
  );
}
