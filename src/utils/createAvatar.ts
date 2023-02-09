const PRIMARY_NAME = ['A', 'N', 'H', 'L', 'Q', '9', '8'];
const INFO_NAME = ['F', 'G', 'T', 'I', 'J', '1', '2', '3'];
const SUCCESS_NAME = ['K', 'D', 'Y', 'B', 'O', '4', '5'];
const WARNING_NAME = ['P', 'E', 'R', 'S', 'C', 'U', '6', '7'];
const ERROR_NAME = ['V', 'W', 'X', 'M', 'Z'];

function getFirstCharacter(name: string) {
  return name && name.charAt(0).toUpperCase();
}

function getAvatarColor(name: string) {
  if (PRIMARY_NAME.includes(getFirstCharacter(name))) return 'primary';
  if (INFO_NAME.includes(getFirstCharacter(name))) return 'info';
  if (SUCCESS_NAME.includes(getFirstCharacter(name))) return 'success';
  if (WARNING_NAME.includes(getFirstCharacter(name))) return 'warning';
  if (ERROR_NAME.includes(getFirstCharacter(name))) return 'error';
  return 'default';
}

export default function createAvatar(name: string) {
  return {
    name: getFirstCharacter(name),
    color: getAvatarColor(name),
  };
}

export const getAvatarUrl = (url?: string) => {
  if (!url) return 'http://13.215.193.218:3009/public/resource/image/c2fe5d733b0b4cff8da9774ec6b1d1e8.ng';
  if (url.split('/')[1] === 'public') {
    return `${process.env.REACT_APP_UPLOAD_API_URL}${url}`;
  }
  return url;
};
