import { PATH_DASHBOARD, PATH_PAGE } from 'src/routes/path';

export function getActive<T extends string>(path: T, pathname: T) {
  const currentPath = path.split('/').pop() as string;
  const pathnameRouter = pathname.split('/').pop() as string;
  return pathnameRouter.includes(currentPath);
}

export interface IList {
  title: string;
  path: string;
  icon: string;
  children?: IChildren[];
}

export interface IChildren {
  title: string;
  path: string;
  children?: IChildren[];
}

export interface INavBar {
  subheader: string;
  lists: IList[];
}

export const navConfig: INavBar[] = [
  {
    subheader: 'DashBoard',
    lists: [
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.root,
        icon: 'ci:home-alt-fill',
      },
      {
        title: 'post',
        path: PATH_PAGE.post,
        icon: 'ic:sharp-forward-to-inbox',
      },
      {
        title: 'Message',
        path: PATH_DASHBOARD.message,
        icon: 'ant-design:message-filled',
      },
      {
        title: 'Inbox',
        path: PATH_DASHBOARD.inbox,
        icon: 'ic:sharp-forward-to-inbox',
      },
      {
        title: 'Friend',
        path: PATH_PAGE.friend,
        icon: 'ic:sharp-forward-to-inbox',
      },
    ],
  },
  {
    subheader: 'user',
    lists: [
      {
        title: 'User',
        path: '/user',
        icon: 'ic:round-space-dashboard',
        children: [
          {
            title: 'user',
            path: '/',
          },
        ],
      },
    ],
  },
];
