import { Box, IconButton, Input, InputAdornment, Stack, styled } from '@mui/material';
import { ChangeEventHandler, Dispatch, KeyboardEvent, useState } from 'react';
import Iconify from 'src/components/Iconify';
import { UploadIcon } from 'src/components/upload';
import IconButtonAnimate from 'src/components/animate/IconButtonAnimate';
import { useDropzone } from 'react-dropzone';
import socket, { sendMessageSocket } from 'src/utils/socket';
import { FileType } from 'src/types/Base';
import { useMutation } from '@tanstack/react-query';
import { uploadMultiple } from 'src/api/upload.api';
import { Upload } from 'src/types/UploadResponse';
import EmojiPicker from 'src/components/EmojiPicker';
import StickerPopover from 'src/sections/conversation/StickerPopover';

const RootStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 1),
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const InputStyled = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5),
  paddingLeft: theme.spacing(2),
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  bottom: 0,
  width: '100%',
  borderRadius: theme.spacing(4),
  backgroundColor: theme.palette.action.hover,
}));

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

interface ConversationInputProps {
  conversationId: string;
}

export default function ConversationInput({ conversationId }: ConversationInputProps) {
  const [value, setValue] = useState('');

  const { mutate: uploadMutate } = useMutation((variables: FormData) => uploadMultiple(variables), {
    onSuccess: (data) => {
      console.log(data);

      const [listImage, listFile] = data.data.reduce(
        (prev: Upload[][], current) => {
          const index = current.mimetype === 'image' ? 0 : 1;
          prev[index].push(current);
          return prev;
        },
        [[], []]
      );

      sendMessageSocket('message_image', {
        conversation_id: conversationId,
        link: '',
        medias: listImage.map((item) => item._id),
        message: '',
        message_reply_id: '',
        tag: [],
        thumbnail: '',
      });

      listFile.forEach((item) => {
        const key = item.mimetype == 'video' ? 'message_video' : 'message_file';

        sendMessageSocket(key, {
          conversation_id: conversationId,
          link: '',
          medias: [item._id],
          message: '',
          message_reply_id: '',
          tag: [],
          thumbnail: '',
        });
      });
    },
  });

  const handleOndrop = (acceptedFiles: FileType[]) => {
    const formData = new FormData();

    acceptedFiles.forEach((file) => formData.append('files', file));

    uploadMutate(formData);
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: handleOndrop,
  });

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value) {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    sendMessageSocket('message_text', {
      conversation_id: conversationId,
      message: value,
      message_reply_id: '',
      medias: [],
      tag: [],
      thumbnail: '',
      link: '',
    });
    setValue('');
  };

  return (
    <RootStyled>
      <Stack direction="row">
        <IconStyled {...getRootProps()}>
          <Iconify icon="fa-solid:images" sx={{ width: 25, height: 25, color: 'secondary.main' }} />
          <input {...getInputProps()} />
        </IconStyled>
        <StickerPopover conversationId={conversationId} />
      </Stack>

      <InputStyled>
        <Input
          fullWidth
          disableUnderline
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Message"
          onKeyDown={handleEnter}
          endAdornment={
            <InputAdornment position="start" sx={{ gap: 1, mr: 1 }}>
              <EmojiPicker setValue={setValue} value={value}>
                <IconStyled>
                  <Iconify
                    icon="fluent:sticker-24-filled"
                    sx={{ width: 25, height: 25, color: 'secondary.main', rotate: '-25deg' }}
                  />
                </IconStyled>
              </EmojiPicker>
            </InputAdornment>
          }
        />
      </InputStyled>
    </RootStyled>
  );
}
