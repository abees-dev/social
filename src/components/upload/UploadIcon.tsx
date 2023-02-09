import { Box, SxProps } from '@mui/material';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { FileType } from 'src/types/Base';
import IconButtonAnimate from '../animate/IconButtonAnimate';
import Iconify from '../Iconify';

interface IUpLoadIcon {
  file?: Partial<FileType>;
  sx?: SxProps;
  helpText?: string;
  icon?: string;
  color?: string;
  single?: boolean;
}

type UploadSingleType = IUpLoadIcon & DropzoneOptions;

export default function UpLoadIcon({ sx, single, ...other }: UploadSingleType) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: single ? false : true,
    accept: {
      'image/*': [],
      'video/*': [],
    },
    ...other,
  });

  return (
    <Box sx={{ ...sx }} {...getRootProps()}>
      <IconButtonAnimate size="medium">
        <Iconify
          icon={other?.icon ? other.icon : 'bi:card-image'}
          color={other?.color ? other.color : 'success.main'}
          sx={{ width: 18, height: 18 }}
        />
      </IconButtonAnimate>
      <input {...getInputProps()} />
    </Box>
  );
}
