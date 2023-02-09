import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  Theme,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ArrowBackIcon, PeopleAltIcon, PublicIcon } from 'src/components/icons';
import Dialog from 'src/components/Dialog';
import { PostValues } from 'src/sections/post/PostCreateForm';
import { FooterStyle, HeaderStyle } from 'src/sections/post/styles';

const listView = [
  {
    type: 0,
    title: 'Công khai',
    description: 'Bất kì ai ở trên app',
    icon: <PublicIcon />,
  },
  {
    type: 1,
    title: 'Bạn bè',
    description: 'Bất kì ai là bạn bè ở trên app',
    icon: <PeopleAltIcon />,
  },
  {
    type: 2,
    title: 'Chỉ mình tôi',
    description: 'Chỉnh mình bạn xem được bài viết',
    icon: <PeopleAltIcon />,
  },
];

const RootStyle = styled('div')(() => ({}));

const CloseIconStyle = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: theme.spacing(4),
  transform: 'translate(-50%, -50%)',
}));

const ListItemIconStyle = styled(ListItemIcon)(({ theme }) => ({
  marginRight: theme.spacing(3),
  fontSize: 20,
  minWidth: 0,
  backgroundColor: theme.palette.action.focus,
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(10),
}));

interface IPostChangeView {
  type: number;
  onClose: () => void;
  setValues: (key: keyof PostValues, value: any) => void;
  open: boolean;
}

export default function PostChangeViewDialog({ open, onClose, setValues, type }: IPostChangeView) {
  const [view, setView] = useState(type);

  const handleChangeView = (value: number) => {
    setView(value);
  };

  const handleSuccess = () => {
    setValues('view', view);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <RootStyle>
        <HeaderStyle>
          <Typography variant="h6" component="h2" align="center" sx={{ width: 1 }}>
            Đối tượng bài viết
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
          <Typography variant="subtitle1">Ai có thể xem bài viết của bạn?</Typography>
          <Typography variant="body2">
            Bài viết của bạn sẽ hiển thị ở Bảng feed, trang cá nhân và kết quả tìm kiếm.
            <br />
            Tuy đối tượng mặc định là <strong>Công khai</strong>, nhưng bạn có thể thay đổi đối tượng của riêng bài viết
            này.
          </Typography>

          <List>
            {listView.map((item) => (
              <ListItemButton
                onClick={() => handleChangeView(item.type)}
                selected={item.type === view}
                key={item.type}
                sx={{
                  borderRadius: 1,
                }}
              >
                <ListItemIconStyle>{item.icon}</ListItemIconStyle>
                <ListItemText
                  primary={<Typography variant="subtitle1">{item.title}</Typography>}
                  secondary={<Typography variant="body2">{item.description}</Typography>}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Divider />
        <FooterStyle>
          <Stack direction="row" spacing={1}>
            <Button variant="text" onClick={onClose}>
              Huỷ
            </Button>
            <Button variant="contained" sx={{ minWidth: 80 }} onClick={handleSuccess}>
              Xong
            </Button>
          </Stack>
        </FooterStyle>
      </RootStyle>
    </Dialog>
  );
}
