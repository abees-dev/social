import { IUserResponse } from 'src/interface/UserReponse';
import { isEmpty } from 'lodash';
import { Avatar, Box, Link as MUILink, Stack, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { IFeelingResponse } from 'src/interface/FeelingResponse';
import { Maybe } from 'src/types';

interface ITagFeelingUserProp {
  tag: IUserResponse[];
  feeling?: IFeelingResponse;
}

export default function TagFeelingUser({ tag, feeling }: ITagFeelingUserProp) {
  const tagName = tag
    .slice(0, 2)
    .map((item) => item.full_name)
    .join(' và ');

  const isTag = !isEmpty(tag);
  const isFeeling = !isEmpty(feeling);

  const handleFeeling = () => {
    if (isFeeling) {
      return (
        <Stack direction="row" spacing={0.5}>
          <Avatar src={feeling.icon} sx={{ width: 20, height: 20 }} />
          <Typography variant="caption">cảm thấy {feeling.name}</Typography>
        </Stack>
      );
    }
  };

  return (
    <>
      {(isTag || isFeeling) && (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.85rem',
            }}
          >
            đang
          </Typography>
          {handleFeeling()}

          {isTag && (
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.85rem',
              }}
            >
              cùng với
            </Typography>
          )}

          <MUILink
            variant="subtitle2"
            component={Link}
            color="inherit"
            underline="hover"
            to=""
            sx={{ textTransform: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {tagName}
          </MUILink>
          {tag.length > 2 && (
            <Tooltip
              title={tag.slice(2, tag.length).map((item) => (
                <Stack key={item._id}>
                  <Typography variant="caption">{item.full_name}</Typography>
                </Stack>
              ))}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                và {tag.length - 2} người khác
              </Typography>
            </Tooltip>
          )}
        </Stack>
      )}
    </>
  );
}
