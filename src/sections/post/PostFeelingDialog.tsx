import Dialog from 'src/components/Dialog';
import { PostValues } from 'src/sections/post/PostCreateForm';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  Theme,
  Typography,
} from '@mui/material';
import { ArrowBackIcon } from 'src/components/icons';
import Iconify from 'src/components/Iconify';
import { CloseIconStyle, FooterStyle, HeaderStyle, InputStyled } from 'src/sections/post/styles';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QueryKey } from 'src/enums/querykey';
import { getFeelingPost } from 'src/api/post.api';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { DialogName } from 'src/enums/dialog';
import { debounce, flatten, isEmpty } from 'lodash';
import FeelingSkeleton from 'src/components/skeleton/FeelingSkeleton';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ScrollBar from 'src/components/ScrollBar';
import { closeModal } from 'src/redux/slice/modal.slice';
import { IFeelingResponse } from 'src/interface/FeelingResponse';
import { addFeelingState } from 'src/redux/slice/post.slice';

interface IPostFeelingDialogProps {
  open: boolean;
  onClose: () => void;
  setValues: (key: keyof PostValues, value: any) => void;
}

const ContentStyle = styled('section')(({ theme }) => ({
  padding: theme.spacing(2),
  maxHeight: '100%',
  paddingTop: 0,
}));
const ListItemAvatarStyle = styled(ListItemAvatar)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  fontSize: 20,
  minWidth: 0,
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(1),
  borderRadius: theme.spacing(10),
}));

function PostFeelingDialog({ open, onClose, setValues }: IPostFeelingDialogProps) {
  const modalState = useAppSelector((state) => state.modal);
  const [isNextPage, setIsNextPage] = useState(true);
  const [ref, inView] = useInView();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState('');
  const [value, setValue] = useState('');

  const limit = 10;

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
    [QueryKey.FEELING_POST, { search }],
    async ({ pageParam }) =>
      getFeelingPost({
        position: pageParam,
        limit: 10,
        search: search,
      }),
    {
      enabled: !!open,

      getNextPageParam: (lastPage) => {
        if (!isEmpty(lastPage) && lastPage.length === limit) {
          return lastPage[lastPage.length - 1].position;
        }
        return false;
      },
      onSuccess(data) {
        if (data.pages[data.pages.length - 1].length < limit && !search) {
          setIsNextPage(false);
        }
      },
    }
  );

  useEffect(() => {
    if (inView) {
      isNextPage && console.log('isNextPage', isNextPage);
      isNextPage && fetchNextPage();
    }
  }, [inView]);

  const debounceValue = useCallback(
    debounce((search) => {
      setSearch(search);
    }, 500),
    []
  );

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(event.target.value);
    debounceValue(event.target.value);
  };

  const handleSelectFeeling = (feeling: IFeelingResponse) => {
    setValues('feeling_id', feeling._id);

    dispatch(addFeelingState(feeling));

    dispatch(closeModal('feeling'));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        sx={{
          maxHeight: 'calc(100vh - 300px)',
          minHeight: 'calc(100vh - 300px)',
        }}
      >
        <HeaderStyle>
          <Typography variant="h6" component="h2" align="center" sx={{ width: 1 }}>
            Bạn đang cảm thấy thế nào?
          </Typography>
          <CloseIconStyle>
            <IconButton
              onClick={onClose}
              sx={{
                bgcolor: (theme: Theme) => theme.palette.action.hover,
                '&:hover': {
                  bgcolor: (theme: Theme) => theme.palette.action.focus,
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </CloseIconStyle>
        </HeaderStyle>
        <Divider />

        <Box sx={{ p: 2 }}>
          <InputStyled>
            <Input
              fullWidth
              disableUnderline
              placeholder="Tìm kiếm cảm xúc"
              value={value}
              onChange={handleOnChange}
              startAdornment={
                <InputAdornment position="start" sx={{ gap: 1, mr: 1 }}>
                  <IconButton size="small" disabled={true}>
                    <Iconify icon="uil:search" />
                  </IconButton>
                </InputAdornment>
              }
            />
          </InputStyled>
        </Box>

        {isLoading ? (
          <Stack direction="row" justifyContent="center">
            <CircularProgress color="inherit" />
          </Stack>
        ) : (
          <ScrollBar sx={{ height: 'calc(100vh - 444px)' }}>
            <ContentStyle>
              <List>
                <Grid2 container spacing={2}>
                  {flatten(data?.pages).map((item) => (
                    <Grid2 xs={6} key={item._id}>
                      <ListItemButton
                        onClick={() => handleSelectFeeling(item)}
                        sx={{
                          borderRadius: 1,
                        }}
                      >
                        <ListItemAvatarStyle>
                          <Avatar
                            src={item.icon}
                            sx={{
                              width: 24,
                              height: 24,
                            }}
                          />
                        </ListItemAvatarStyle>
                        <ListItemText>
                          <Typography variant="subtitle1">{item.name}</Typography>
                        </ListItemText>
                      </ListItemButton>
                    </Grid2>
                  ))}
                </Grid2>
              </List>
              {!isLoading && hasNextPage && <Box sx={{ height: 4 }} ref={ref} />}
            </ContentStyle>
          </ScrollBar>
        )}
      </Box>
    </Dialog>
  );
}

export default PostFeelingDialog;
