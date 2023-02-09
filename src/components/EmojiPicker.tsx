import {
  Box,
  ClickAwayListener,
  GlobalStyles,
  IconButton,
  IconButtonProps,
  styled,
  SxProps,
  useTheme,
} from '@mui/material';
import { Dispatch, ReactNode, useState } from 'react';
import Iconify from './Iconify';
import MyEmojiPicker from 'src/components/MyEmojPicker';
// @ts-ignore
import { BaseEmoji } from 'emoji-mart';

import data from '@emoji-mart/data';

interface PickerProps {
  isLight: boolean;
}

const PickerStyled = styled('div')<PickerProps>(({ theme, isLight }) => ({
  backgroundColor: !isLight ? theme.palette.grey[600] : theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  position: 'absolute',
  bottom: 40,
  right: 0,
  zIndex: theme.zIndex.modal,
  '& .search': {
    backgroundColor: 'red',
  },
}));

interface EmojiPickerProps {
  value?: string;
  setValue?: Dispatch<string>;
  sx?: SxProps;
  children: ReactNode;
}

export default function EmojiPicker({ value, setValue, children, sx }: EmojiPickerProps) {
  const [isPicker, setIsPicker] = useState<boolean>(false);

  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <ClickAwayListener onClickAway={() => setIsPicker(false)}>
      <Box position="relative">
        <GlobalStyles
          styles={{
            'em-emoji-picker': {
              // '--rgb-background': '#fff',
            },
          }}
        />

        {isPicker && (
          <PickerStyled isLight={isLight}>
            <MyEmojiPicker
              data={data}
              onEmojiSelect={(emoji: BaseEmoji) => setValue && setValue(value + emoji.native)}
              previewPosition="none"
              skinTonePosition="none"
              searchPosition="none"
            />
          </PickerStyled>
        )}

        {/*<IconButton size={size} onClick={() => setIsPicker(true)}>*/}
        {/*  <Iconify icon={icon} sx={sx} />*/}
        {/*</IconButton>*/}
        <Box sx={sx} onClick={() => setIsPicker(true)}>
          {children}
        </Box>
      </Box>
    </ClickAwayListener>
  );
}
