import { lazy, LazyExoticComponent, Suspense } from 'react';
import { createBrowserRouter, useRoutes } from 'react-router-dom';
import GuestGuard from 'src/guards/GuestGuard';
import Layout from 'src/layouts';
import Friend from 'src/layouts/friend';
import NotFound from 'src/pages/Page404';
import Sticker from 'src/pages/sticker/Sticker';
// import Layout from 'src/layouts';

// eslint-disable-next-line react/display-name, arrow-body-style
const Loadable = (Component: LazyExoticComponent<() => JSX.Element>) => (props: JSX.IntrinsicAttributes) => {
  return (
    <Suspense fallback={<></>}>
      <Component {...props} />
    </Suspense>
  );
};

const Login = Loadable(lazy(() => import('src/pages/auth/Login')));
const Register = Loadable(lazy(() => import('src/pages/auth/Register')));

// Dashboard

const PostPage = Loadable(lazy(() => import('src/pages/home/Post')));

// const NotFound = Loadable(lazy(() => import('src/pages/Page404')));

// Home
const Profile = Loadable(lazy(() => import('src/pages/home/Profile')));
// Friend
const RequestFriend = Loadable(lazy(() => import('src/pages/friends/FriendRequest')));
const SuggestFriend = Loadable(lazy(() => import('src/pages/friends/SuggestFriend')));
const FriendList = Loadable(lazy(() => import('src/pages/friends/FriendsList')));
const FriendSendRequest = Loadable(lazy(() => import('src/pages/friends/FriendSendRequest')));

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
      ],
    },
    {
      path: '/',
      // element: <Layout />,
      element: <PostPage />,

      children: [
        { path: 'post', element: <PostPage /> },
        { path: 'friend', element: <Friend /> },
        { path: 'profile/:id', element: <Profile /> },
      ],
    },
  ]);
}

export const router = createBrowserRouter([
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { element: <PostPage />, index: true },
      { path: 'sticker', element: <Sticker /> },
      {
        path: 'friends',
        element: <Friend />,
        children: [
          { element: <FriendList />, index: true },
          { path: 'requests', element: <RequestFriend /> },
          { path: 'send-requests', element: <FriendSendRequest /> },
          { path: 'suggestions', element: <SuggestFriend /> },
        ],
      },
      { path: 'profile/:id', element: <Profile /> },
    ],
  },
  {
    path: '*',
    errorElement: <NotFound />,
    element: <NotFound />,
  },
]);
