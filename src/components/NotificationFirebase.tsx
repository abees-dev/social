import React, { useEffect, useState } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from 'src/utils/firebase';
import { Alert, Snackbar, styled, Typography } from '@mui/material';
import AvatarUpload from 'src/components/AvatarUpload';

const MessageRootStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: 0.5,
}));

const AlertStyled = styled(Alert)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  backgroundColor: theme.palette.grey[100],
  boxShadow: theme.customShadows.z24,
}));

function NotificationFirebase() {
  const [open, setOpen] = useState(false);

  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    console.log('Message listing');

    console.log(payload);

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      setPayload(payload.data);
      setOpen(true);
      // ...
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {payload && open && (
        <Snackbar
          open={open}
          onClose={handleClose}
          autoHideDuration={1000}
          // key={transition ? transition.name : ''}
        >
          <AlertStyled icon={false} onClose={handleClose}>
            <MessageRootStyled>
              <AvatarUpload
                url={payload.avatar}
                sx={{
                  width: 32,
                  height: 32,
                }}
              />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {payload.name}
              </Typography>
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {payload.content}
              </Typography>
            </MessageRootStyled>
          </AlertStyled>
        </Snackbar>
      )}
    </div>
  );
}

interface INotificationFirebase {
  notification_type: string;
  user_id: string;
  name: string;
  avatar: string;
  title: string;
  object_id: string;
  content: string;
}

interface MessageSnackbarProps {
  notification: INotificationFirebase;
  onClose: () => void;
}

function MessageSnackbar({ notification, onClose }: MessageSnackbarProps) {
  return (
    <AlertStyled icon={false} onClose={onClose}>
      <MessageRootStyled>
        <AvatarUpload
          url={notification.avatar}
          sx={{
            width: 32,
            height: 32,
          }}
        />
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {notification.name}
        </Typography>
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {notification.content}
        </Typography>
      </MessageRootStyled>
    </AlertStyled>
  );
}

export default NotificationFirebase;
