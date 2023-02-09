import { Button, styled, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import { PATH_DASHBOARD } from 'src/routes/path';

const RootStyled = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
}));

export default function NotFound() {
  return (
    <RootStyled>
      <Stack justifyContent="center" alignItems="center" mt={5}>
        <Typography variant="h3">Sorry, page not found!</Typography>
        <Typography variant="subtitle2" align="center" color="text.secondary" mb={2}>
          Sorry, we couldn’t find the page you’re looking for.
          <br /> Perhaps you’ve mistyped the URL? Be sure to check your spelling.
        </Typography>
        {/* <Illustrator404
        sx={{
          width: 300,
          mb: 2,
        }}
      /> */}
        <Link to={PATH_DASHBOARD.root || '/'}>
          <Button variant="contained" size="large">
            Go to Home
          </Button>
        </Link>
      </Stack>
    </RootStyled>
  );
}
