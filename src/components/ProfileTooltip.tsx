import { Avatar, Box, Button, Stack, Tooltip, TooltipProps, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { capitalCase } from 'change-case';
import { ReactElement, useEffect, useState } from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { fDistanceToNow } from 'src/utils/formatTime';
import ButtonText from './ButtonText';
import Iconify from './Iconify';
import ProfileHoverSkeleton from './skeleton/ProfileHoverSkeleton';
import { IUserResponse } from 'src/interface/UserReponse';
import AvatarUpload from 'src/components/AvatarUpload';

interface ProfileTooltipProp extends Partial<TooltipProps> {
  children: ReactElement;
  user: IUserResponse;
}

const ProfileTooltip = ({ children, placement = 'top-end', user, sx, ...other }: ProfileTooltipProp) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Tooltip
      title={<ProfileItem user={user} open={open} />}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      enterDelay={400}
      leaveDelay={100}
      placement={placement}
      {...other}
      sx={{
        maxWidth: 600,
        '& :nth-of-type(1)': {
          cursor: 'pointer',
        },
        ...sx,
      }}
    >
      <Box>{children}</Box>
    </Tooltip>
  );
};

interface ProfileItemProp {
  user: IUserResponse;
  open: boolean;
}

function ProfileItem({ user, open }: ProfileItemProp) {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (user) {
      setIsOwner(currentUser?.id === user?.id);
    }
  }, [open]);

  if (!user) {
    return (
      <Box p={1}>
        <ProfileHoverSkeleton />
      </Box>
    );
  }

  return (
    <>
      {user && (
        <Stack p={1} sx={{ width: 'fit-content' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AvatarUpload url={user.avatar} />
            <Box>
              <Typography variant="subtitle1">{user.full_name}</Typography>
              {/*<Typography variant="caption">Embark {fDistanceToNow(user.createdAt)}</Typography>*/}
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} mt={2} justifyContent="center">
            {!isOwner ? (
              <>
                <ButtonText
                  color="inherit"
                  sx={{ px: 2 }}
                  size="medium"
                  startIcon={<Iconify icon={user._id ? 'bi:person-check-fill' : 'ant-design:user-add-outlined'} />}
                >
                  {user._id ? 'friend' : 'Add friend'}
                </ButtonText>
                <Button
                  variant="contained"
                  startIcon={
                    <Iconify icon={user._id ? 'ant-design:message-outlined' : 'healthicons:ui-user-profile'} />
                  }
                >
                  {user._id ? 'Message' : 'View Profile'}
                </Button>
              </>
            ) : (
              <Button variant="contained" startIcon={<Iconify icon="healthicons:ui-user-profile" />}>
                Edit Profile
              </Button>
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default ProfileTooltip;
