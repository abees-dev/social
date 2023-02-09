import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { registerRequest } from 'src/api/auth.api';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { RegisterValues } from 'src/types/InputValue';
import * as Yup from 'yup';
import { IBaseResponse } from 'src/interface/BaseResponse';
import { HttpStatus } from 'src/enums/httpStatus';

export default function RegisterForm() {
  const RegisterSchema = Yup.object().shape({
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required().min(6),
    confirm_password: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const defaultValues: RegisterValues = {
    first_name: 'abees',
    last_name: 'dev',
    email: 'abeesdevjs@gmail.com',
    password: '123456',
    confirm_password: '123456',
  };

  const methods = useForm<RegisterValues>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const { mutate, isLoading } = useMutation((value: RegisterValues) => registerRequest(value), {
    onSuccess: (response) => {
      if (response?.status === HttpStatus.OK) {
        return enqueueSnackbar(response.message);
      }
    },
    onError: (error: IBaseResponse) => {
      enqueueSnackbar(error?.message, { variant: 'error' });
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (value: RegisterValues) => {
    console.log(value);
    mutate(value);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <RHFTextField name="first_name" label="Fist name" />
          <RHFTextField name="last_name" label="Last name" />
        </Stack>
        <RHFTextField name="email" label="Email" />
        <RHFTextField name="password" label="Password" type="password" />
        <RHFTextField name="confirm_password" label="Confirm" type="password" />
        <LoadingButton variant="contained" size="large" loading={isLoading} type="submit">
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
