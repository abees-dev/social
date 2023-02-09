import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, MenuItem, Stack, styled, TextField, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { capitalize } from 'lodash';
import { useSnackbar } from 'notistack';
import { SyntheticEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import RHFSelect from 'src/components/hook-form/RHFSelect';
import useDistrict, { UseDistrictReturn } from 'src/hooks/useDistrict';
import useProvince, { useProvinceReturn } from 'src/hooks/useProvince';
import useWard, { UseWardReturn } from 'src/hooks/useWard';
import { IUserResponse } from 'src/interface/UserReponse';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { updateUser } from 'src/redux/slice/auth.slice';
import { closeModal } from 'src/redux/slice/modal.slice';
import { AutocompleteValue, Maybe } from 'src/types';
import { User } from 'src/types/Base';
import { ProfileInput } from 'src/types/InputValue';
import { ProfileUserResponse } from 'src/types/Response';
import * as Yup from 'yup';

export type OmitProfile = 'updatedAt' | 'createdAt' | '__typename' | 'thumbnail' | 'id' | 'user';

interface AddressState {
  wardId?: string;
  districtId?: string;
  provinceId?: string;
}

type ProfileValue = Omit<ProfileInput, OmitProfile>;

const RootStyled = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const ProfileCreateForm = () => {
  const ProfileSchema = Yup.object().shape({
    province: Yup.string().required(),
    district: Yup.string().required(),
    ward: Yup.string().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    liveAt: Yup.string().required(),
    phoneNumber: Yup.string().required(),
    gender: Yup.string().required(),
    dayOfBirth: Yup.date().required(),
    story: Yup.string().required(),
  });

  const enableQuery = useAppSelector((state) => state.enableQuery);

  const user = useAppSelector((state) => state.auth.user) as IUserResponse;

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const { data: profileUser } = useQuery<ProfileUserResponse>(['PROFILE_USER', { user_id: user.id }], {
    enabled: !!enableQuery['profile'],
  });

  const defaultValues: ProfileValue = {
    province: '',
    district: '',
    ward: '',
    firstName: profileUser?.user.firstName || '',
    lastName: profileUser?.user.lastName || '',
    liveAt: profileUser?.user.profile?.liveAt || '',
    phoneNumber: profileUser?.user.profile?.phoneNumber || '',
    gender: profileUser?.user.profile?.gender || '',
    dayOfBirth: new Date((profileUser?.user.profile?.dayOfBirth as Date) || new Date()),
    story: profileUser?.user.profile?.story || '',
  };

  const methods = useForm<ProfileValue>({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const [address, setAddress] = useState<AddressState>({
    provinceId: '',
    wardId: '',
    districtId: '',
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const provinces = useProvince();

  const districts = useDistrict(address.provinceId);

  const wards = useWard(address.districtId);

  const handleOnChangeProvince = (_: SyntheticEvent, value: AutocompleteValue<useProvinceReturn>) => {
    if (typeof value !== 'string') {
      setAddress((prev) => ({ ...prev, provinceId: String(value?.province_id) }));
      setValue('province', value?.province_name || '');
    }
  };

  const handleOnChangeDistrict = (_: SyntheticEvent, value: AutocompleteValue<UseDistrictReturn>) => {
    if (typeof value !== 'string') {
      setAddress((prev) => ({ ...prev, districtId: String(value?.district_id) }));
      setValue('district', value?.district_name || '');
    }
  };

  const handleOnChangeWard = (_: SyntheticEvent, value: AutocompleteValue<UseWardReturn>) => {
    if (typeof value !== 'string') {
      setAddress((prev) => ({ ...prev, wardId: String(value?.ward_id) }));
      setValue('ward', value?.ward_name || '');
    }
  };

  const handleOnchangePicker = (newDate: Maybe<Date>) => {
    setValue('dayOfBirth', newDate as Date);
  };

  // const [updateProfileMutation, { loading }] = useUpdateUserProfileMutation();
  const onSubmit = async (formValue: ProfileValue) => {
    console.log(formValue);
  };

  return (
    <RootStyled>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6">Edit personal information</Typography>
        <Stack spacing={2} mt={2} mb={2}>
          <Stack direction="row" spacing={2}>
            <RHFTextField name="firstName" label="First name" />
            <RHFTextField name="lastName" label="Last name" />
          </Stack>

          <Stack direction="row" spacing={2}>
            <DesktopDatePicker
              label="Date desktop"
              value={watch('dayOfBirth')}
              onChange={handleOnchangePicker}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />

            <RHFSelect name="gender" label="Gender">
              {['male', 'female', 'other'].map((option, index) => (
                <MenuItem key={index} value={option}>
                  {capitalize(option)}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>

          <Stack direction="row" spacing={2}>
            <RHFTextField name="phoneNumber" label="Phone" />
            <RHFTextField name="liveAt" label="Live" />
          </Stack>
          <RHFTextField name="story" label="Story" />

          <Stack direction="row" spacing={2}>
            <Autocomplete
              options={provinces}
              freeSolo
              fullWidth
              renderOption={(props, option) => (
                <Typography component={'li'} {...props}>
                  {option.province_name}
                </Typography>
              )}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                return String(option.province_name);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Province"
                  helperText={
                    <Typography variant="caption" color="error.main">
                      {errors?.province && errors.province.message}
                    </Typography>
                  }
                />
              )}
              onChange={handleOnChangeProvince}
            />

            <Autocomplete
              options={districts}
              freeSolo
              fullWidth
              disabled={!watch('province')}
              renderOption={(props, option) => (
                <Typography component={'li'} {...props}>
                  {option.district_name}
                </Typography>
              )}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                return String(option.district_name);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="District"
                  helperText={
                    <Typography variant="caption" color="error.main">
                      {errors?.district && errors.district.message}
                    </Typography>
                  }
                />
              )}
              onChange={handleOnChangeDistrict}
            />
            <Autocomplete
              options={wards}
              freeSolo
              fullWidth
              disabled={!watch('district')}
              renderOption={(props, option) => (
                <Typography component={'li'} {...props}>
                  {option.ward_name}
                </Typography>
              )}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                return String(option.ward_name);
              }}
              onChange={handleOnChangeWard}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Wards"
                  helperText={
                    <Typography variant="caption" color="error.main">
                      {errors?.ward && errors.ward.message}
                    </Typography>
                  }
                />
              )}
            />
          </Stack>
        </Stack>
        <LoadingButton type="submit" variant="contained" size="large" fullWidth>
          Update
        </LoadingButton>
      </FormProvider>
    </RootStyled>
  );
};
