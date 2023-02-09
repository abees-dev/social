import { SxProps } from '@mui/material';
import { DropzoneOptions } from 'react-dropzone';
import { Controller, useFormContext } from 'react-hook-form';
import { UploadMultiple } from '../upload';

interface IRHFUploadMultiple {
  name: string;
  showPreview?: boolean;
  sx?: SxProps;
  singlePreview?: boolean;
}

type RHFUploadMultipleType = IRHFUploadMultiple & DropzoneOptions;

export const RHFUploadMultiple = ({ name, showPreview, singlePreview, sx, ...other }: RHFUploadMultipleType) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <UploadMultiple
          {...field}
          files={field.value}
          singlePreview={singlePreview}
          showPreview={showPreview}
          sx={sx}
          {...other}
        />
      )}
    />
  );
};
