export const getTextContact = (contactType: number) => {
  switch (contactType) {
    case 0:
      return 'Gửi yêu cầu';
    case 1:
      return 'Xoá bạn bè';
    case 2:
      return 'Xoá lời mời';
    case 3:
      return 'Chấp nhận';
    default:
      return 'Chờ xác nhận';
  }
};
