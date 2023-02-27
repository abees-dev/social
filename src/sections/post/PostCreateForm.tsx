import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Button, Container, Stack, styled, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useCallback, useState } from 'react';
import { createPost } from 'src/api/post.api';
import { uploadMultiple } from 'src/api/upload.api';
import Dialog from 'src/components/Dialog';
import { FormProvider } from 'src/components/hook-form';
import RHFTextArea from 'src/components/hook-form/RHFTextArea';
import Iconify from 'src/components/Iconify';
import MyAvatar from 'src/components/MyAvatar';
import PreviewImageMultiple from 'src/components/upload/MultiplePreview';
import { HttpStatus } from 'src/enums/httpStatus';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { FileType } from 'src/types/Base';
import { PostInput } from 'src/types/InputValue';
import { handleViewName } from 'src/utils/getViewName';
import * as Yup from 'yup';
import PostAction from './PostAction';
import PostChangeViewDialog from './PostChangeViewDialog';
import PostTagUserDialog from 'src/sections/post/PostTagUserDialog';
import { addPost } from 'src/redux/slice/post.slice';
import { closeModal, openModal } from 'src/redux/slice/modal.slice';
import { DialogName } from 'src/enums/dialog';
import PostFeelingDialog from 'src/sections/post/PostFeelingDialog';
import TagFeelingUser from 'src/sections/post/TagFeelingUser';

// eslint-disable-next-line no-empty-pattern
const RootStyled = styled('div')(() => ({}));

export interface PostValues extends Omit<PostInput, 'user'> {
  files?: FileType[];
}

interface IAction {
  addImage: boolean;
  value: string;
}

const PostSchema = Yup.object().shape({
  content: Yup.string(),
  files: Yup.mixed(),
});

export default function PostCreateForm() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const modalState = useAppSelector((state) => state.modal);
  const createPostState = useAppSelector((state) => state.postReducer.createPost);

  const defaultValues: PostValues = {
    content: '',
    files: [],
    caption: '',
    location: '',
    medias: [],
    tag: [],
    status: 0,
    view: 0,
  };

  const methods = useForm({
    resolver: yupResolver(PostSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting },
  } = methods;

  const handleOndrop = useCallback(
    (acceptedFiles: FileType[]) =>
      setValue('files', [
        ...(getValues('files') as Array<FileType>),
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]),
    [setValue]
  );

  const { mutateAsync } = useMutation((values: PostValues) => createPost(values));

  const onSubmit = async (postValue: PostValues) => {
    try {
      const formData = new FormData();

      postValue.files?.map((file) => formData.append('files', file));

      const uploadResponse = await uploadMultiple(formData);

      if (uploadResponse.status === HttpStatus.OK) {
        const data = await mutateAsync({
          ...postValue,
          medias: uploadResponse.data?.map((item) => item._id),
        });
        dispatch(closeModal(DialogName.CREATE_POST));
        dispatch(addPost(data.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAction = (value: string) => {
    dispatch(openModal(value));
  };

 
  //
  const handleSetValue = (key: keyof PostValues, value: any) => setValue(key, value);
  const handleClose = (value: string) => {
    dispatch(closeModal(value));
  };

  return (
    <RootStyled>
      <Container>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack mt={2} direction="row" spacing={2} alignItems="center">
            <MyAvatar sx={{ width: 45, height: 45 }} />
            <Stack spacing={0.5}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 700 }}>
                  {user?.full_name}
                </Typography>
                <TagFeelingUser tag={createPostState.tag} feeling={createPostState?.feeling} />
              </Stack>

              <Button
                size="small"
                color="inherit"
                variant="contained"
                sx={{ py: 0, textTransform: 'none', width: 'fit-content' }}
                onClick={() => handleSelectAction('change-view')}
                startIcon={<Iconify icon="material-symbols:public" sx={{ width: 15, height: 15 }} />}
                endIcon={<Iconify icon="bi:caret-down-fill" sx={{ width: 12, height: 12 }} />}
              >
                {handleViewName(watch('view')).label}
              </Button>
            </Stack>
          </Stack>

          <Stack mt={2}>
            <RHFTextArea
              name="content"
              sx={{
                border: 'none',
              }}
              placeholder="What are you thinking?"
              minRows={3}
            />
            {!isEmpty(watch('files')) && <PreviewImageMultiple files={getValues('files')} />}
          </Stack>
          <PostAction handleClick={handleSelectAction} onDrop={handleOndrop} />
          <LoadingButton loading={isSubmitting} type="submit" fullWidth size="large" variant="contained">
            Post
          </LoadingButton>

          <PostChangeViewDialog
            open={modalState['change-view']}
            onClose={() => handleClose('change-view')}
            setValues={handleSetValue}
            type={getValues('view')}
          />
          <PostTagUserDialog open={modalState['tag']} onClose={() => handleClose('tag')} setValues={handleSetValue} />
          <PostFeelingDialog
            open={modalState['feeling']}
            onClose={() => handleClose('feeling')}
            setValues={handleSetValue}
          />
        </FormProvider>
      </Container>
    </RootStyled>
  );
}
