export function handleViewName(view: number) {
  switch (view) {
    case 0:
      return {
        label: 'Công khai',
        icon: 'material-symbols:public',
      };
    case 1:
      return {
        label: 'Bạn bè',
        icon: 'material-symbols:person-rounded',
      };
    case 2:
      return {
        label: 'Chỉnh mình tôi',
        icon: 'bxs:lock-alt',
      };
    default:
      return {
        label: 'Công khai',
        icon: 'material-symbols:public',
      };
  }
}
