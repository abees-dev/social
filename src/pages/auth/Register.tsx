import { Card, Container, Link as MUILink, styled, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import { DeveloperIllustrator } from 'src/assets';
import Page from 'src/components/Page';
import { PATH_AUTH } from 'src/routes/path';
import { RegisterForm } from 'src/sections/auth';

const RootStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  padding: theme.spacing(2),
}));

const TextStyled = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(6),
  top: theme.spacing(6),
  display: 'flex',
  gap: theme.spacing(0.5),
}));

export default function Register() {
  return (
    <Page title="Register">
      <RootStyled>
        <TextStyled>
          <Typography variant="body2">Already have an account?</Typography>
          <MUILink
            component={Link}
            to={PATH_AUTH.login}
            underline="hover"
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
          >
            Login
          </MUILink>
        </TextStyled>
        <Card
          sx={{
            width: 500,
            height: 1,
            display: {
              xs: 'none',
              lg: 'block',
            },
          }}
        >
          <Typography variant="h4" align="center" mt={15} mb={5}>
            Hi, Wellcome my app
          </Typography>
          <DeveloperIllustrator sx={{ maxWidth: 500 }} />
        </Card>
        <Container maxWidth="sm">
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{
              height: 1,
            }}
          >
            <Typography variant="h5">Register Now</Typography>
            <RegisterForm />
          </Stack>
        </Container>
      </RootStyled>
    </Page>
  );
}
