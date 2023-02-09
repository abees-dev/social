import { Button, IconButton, Input, InputAdornment, styled, SxProps } from '@mui/material';
import { ChangeEvent, Dispatch, KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import IconButtonAnimate from 'src/components/animate/IconButtonAnimate';
import EmojiPicker from 'src/components/EmojiPicker';
import Iconify from 'src/components/Iconify';
import MyAvatar from 'src/components/MyAvatar';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { PostValues } from 'src/sections/post/PostCreateForm';
import { ICommentResponse, ICreateComment } from 'src/interface/CommentResponse';
import { FormProvider } from 'src/components/hook-form';
import { FileType } from 'src/types/Base';
import { LoadingButton } from '@mui/lab';
import UpLoadIcon from 'src/components/upload/UploadIcon';
import { useMutation } from '@tanstack/react-query';
import { uploadSingle } from 'src/api/upload.api';
import { HttpStatus } from 'src/enums/httpStatus';
import { createComment } from 'src/api/nestjs.comment.api';

type TypeProp = 'reply' | 'comment';
interface CommentInputProps {
  postId: string;
  commentId?: string;
  type?: TypeProp;
  sx?: SxProps;
  onSuccess: (value: ICommentResponse) => void;
  focus?: boolean;
}

interface IRootProp {
  isReply?: boolean;
}

const RootStyled = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isReply',
})<IRootProp>(({ theme, isReply }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  position: 'relative',
}));

const InputStyled = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  minHeight: 42,
  paddingLeft: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
}));

const CommentSchema = Yup.object().shape({
  content: Yup.string(),
  post_id: Yup.string(),
});

const defaultValues: ICreateComment = {
  content: '',
  post_id: '',
  tag: [],
  comment_reply_id: '',
  media: '',
  thumbnail: '',
};

export default function CommentInput({ sx, postId, onSuccess, commentId, focus }: CommentInputProps) {
  const handleKeyUp = ({ key }: KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      // handleSubmit();
    }
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    register,
    setFocus,
    getFieldState,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setValue('post_id', postId);
    if (commentId) {
      setValue('comment_reply_id', commentId);
    }
  }, [postId, commentId, watch('post_id'), watch('comment_reply_id')]);

  useEffect(() => {
    focus && setFocus('content', { shouldSelect: true });
  }, [focus]);

  const onSubmit = (data: ICreateComment) => {
    createCommentMutate(data);
    reset();
  };

  const { mutate: uploadMutate } = useMutation((data: FormData) => uploadSingle(data), {
    onSuccess: (data) => {
      if (data.status === HttpStatus.OK) {
        onSubmit({
          post_id: postId,
          content: '',
          tag: [],
          media: data.data._id,
          comment_reply_id: commentId ? commentId : '',
          thumbnail: '',
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const { mutate: createCommentMutate } = useMutation((data: ICreateComment) => createComment(data), {
    onSuccess: (data) => {
      onSuccess(data.data);
    },
  });

  const handleOndrop = (files: FileType[]) => {
    const file = files[0];
    const fromData = new FormData();
    fromData.append('file', file);
    uploadMutate(fromData);
  };

  return (
    <RootStyled sx={sx} isReply={!!commentId}>
      <MyAvatar sx={{ width: 35, height: 35 }} />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <InputStyled>
          <Input
            fullWidth
            disableUnderline
            {...register('content')}
            placeholder="Comments"
            endAdornment={
              <InputAdornment position="start" sx={{ gap: 1, mr: 2 }}>
                <UpLoadIcon single onDrop={handleOndrop} icon="carbon:camera" color="info" />
                {/*<EmojiPicker setValue={setValue} value={value} size="small" />*/}
                <IconButton size="small" type="submit">
                  <Iconify icon="fluent:send-20-regular" />
                </IconButton>
              </InputAdornment>
            }
          />
        </InputStyled>
      </FormProvider>
    </RootStyled>
  );
}
