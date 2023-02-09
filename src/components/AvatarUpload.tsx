import React from 'react';
import { Avatar, AvatarProps } from '@mui/material';
import { getAvatarUrl } from 'src/utils/createAvatar';

interface AvatarUploadProps extends AvatarProps {
  url: string;
}

function AvatarUpload({ url, sx, ...other }: AvatarUploadProps) {
  return <Avatar src={getAvatarUrl(url)} sx={sx} {...other} />;
}

export default AvatarUpload;
