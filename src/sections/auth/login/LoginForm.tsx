import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Divider, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { GraphQLError } from 'graphql';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { loginRequest } from 'src/api/auth.api';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useAppDispatch } from 'src/redux/hooks';
import { loginSuccess } from 'src/redux/slice/auth.slice';
import { LoginValues } from 'src/types/InputValue';
import * as Yup from 'yup';
import SocialButton from '../SocialButton';
import { HttpStatus } from 'src/enums/httpStatus';
import { registerDevice } from 'src/api/nestjs.notification';
import { IRegisterDeviceBody } from 'src/interface/RegisterDevice';
import { getPushToken } from 'src/utils/firebase';

export default function LoginForm() {
  // const socket = useSocket();
  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string().required(),
  });

  const methods = useForm<LoginValues>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: 'abeesdevjs@gmail.com',
      password: '123456',
    },
  });

  const { mutate: registerDeviceMutate } = useMutation((device: IRegisterDeviceBody) => registerDevice(device), {
    onSuccess: (response) => {
      console.log(response);
    },
  });

  const { mutate, isLoading } = useMutation((value: LoginValues) => loginRequest(value), {
    onSuccess: async (response) => {
      console.log(response);
      if (response.status === HttpStatus.OK) {
        enqueueSnackbar(response?.message, {
          variant: 'success',
        });
        dispatch(loginSuccess(response.data));
        const push_token = await getPushToken();

        console.log(push_token);
        registerDeviceMutate({
          device_id: '123123aabnsb',
          platform: 'web',
          push_token: push_token,
          user_id: response.data.user._id,
        });
      } else {
        enqueueSnackbar(response?.message, {
          variant: 'error',
        });
      }
    },
    onError: (error: GraphQLError) => {
      console.log(error);

      enqueueSnackbar(error?.message, {
        variant: 'error',
      });
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (input: LoginValues) => {
    mutate(input);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <RHFTextField fullWidth name="email" label="Email" />
        <RHFTextField fullWidth name="password" label="Password" type="password" />
        <LoadingButton variant="contained" size="large" loading={isLoading} type="submit">
          Login
        </LoadingButton>
        <Divider>
          <Typography variant="subtitle1" color="text.secondary">
            Or
          </Typography>
        </Divider>
        <SocialButton />
      </Stack>
    </FormProvider>
  );
}
