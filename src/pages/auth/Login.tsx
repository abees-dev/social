import { Card, Container, Link as MUILink, Stack, styled, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { DeveloperIllustrator } from 'src/assets';
import Page from 'src/components/Page';
import { PATH_AUTH } from 'src/routes/path';
import { LoginForm } from 'src/sections/auth';

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

export default function Login() {
  return (
    <Page title="Login">
      <RootStyled>
        <TextStyled>
          <Typography variant="body2">Don’t have an account?</Typography>
          <MUILink
            component={Link}
            to={PATH_AUTH.register}
            underline="hover"
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
          >
            Get stated
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
            <Typography variant="h5">Login to assess</Typography>
            <LoginForm />
          </Stack>
        </Container>
      </RootStyled>
    </Page>
  );
}
