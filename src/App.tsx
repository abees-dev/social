import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import NotistackProvider from './components/Notistack';
import { OverrideScroll } from './components/OverrideScroll';
import ProgressBar, { ProgressBarStyle } from './components/ProgressBar';
import { router } from './routes';
import OffsetTop from 'src/components/OffsetTop';
import NotificationFirebase from 'src/components/NotificationFirebase';
import NotFound from './pages/Page404';
function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 1000 * 60 * 60 * 24,
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NotistackProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ProgressBarStyle />
            <ProgressBar />
            <OffsetTop />
            <NotificationFirebase />
            <OverrideScroll />
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </LocalizationProvider>
        </NotistackProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
