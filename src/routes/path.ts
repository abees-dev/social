function paths(path: string, subPath: string) {
  return `${path}/${subPath}`;
}

const ROOT_DASHBOARD = '/dashboard';
const ROOT_AUTH = '/auth';
const ROOT_PAGE = '/';

export const PATH_DASHBOARD = {
  root: ROOT_DASHBOARD,
  task: paths(ROOT_DASHBOARD, 'task'),
  notification: paths(ROOT_DASHBOARD, 'notification'),
  message: paths(ROOT_DASHBOARD, 'message'),
  inbox: paths(ROOT_DASHBOARD, 'inbox'),
  post: paths(ROOT_DASHBOARD, 'post'),
  profile: (id: string) => paths(ROOT_DASHBOARD, `profile/${id}`),
  lookingFriend: paths(ROOT_DASHBOARD, 'looking-friend'),
  messageTo: (id: string) => paths(ROOT_DASHBOARD, `message/t/${id}`),
};

export const PATH_PAGE = {
  root: ROOT_PAGE,
  post: '/post',
  friend: '/friend',
  profile: (id: string) => `/profile/${id}`,
  message: (id: string) => `/message/t/${id}`,
};

export const PATH_AUTH = {
  root: ROOT_AUTH,
  login: paths(ROOT_AUTH, 'login'),
  register: paths(ROOT_AUTH, 'register'),
};

export const PATH_COMMON = {
  root: '/',
  notFound: '/404',
};

export const PATH_FRIEND = {
  root: '/friends',
  friendRequest: '/friends/requests',
  friendList: '/friends/lists',
  suggestions: '/friends/suggestions',
  friendSendRequest: '/friends/send-requests',
};
