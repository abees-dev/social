/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { alpha, PaletteColor, styled, Theme, Tooltip, Typography } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { AngryIconSvg, DearIconSvg, HahaIconSvg, LiveIconSvg, LoveIconSvg, SadIconSvg, WowIconSvg } from 'src/assets';

import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useMutation } from '@tanstack/react-query';
import { IReactionPostBody } from 'src/interface/ReactionPost';
import { reactionPost } from 'src/api/nestjs.reaction';
import { ReactionType } from 'src/enums/reaction';
import { debounce } from 'lodash';
import { Palette } from '@mui/material/styles/createPalette';
import { updateReactionPost } from 'src/redux/slice/post.slice';

const RootStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
}));

const ContentStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  padding: theme.spacing(1, 2),
  gap: theme.spacing(2),
  alignItems: 'center',
  borderRadius: theme.spacing(1),
  position: 'relative',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ':active': {
    backgroundColor: theme.palette.action.focus,
  },
}));
const StartIconStyled = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
}));

interface IPostSocialAction {
  postId: string;
  myReaction: number;
}
export default function PostSocialAction({ postId, myReaction }: IPostSocialAction) {
  const user = useAppSelector((state) => state.auth.user);

  const [myReactionState, setMyReactionState] = useState(myReaction);
  const dispatch = useAppDispatch();

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => setMyReactionState(myReaction), [myReaction]);

  const { mutate: reactionPostMutate } = useMutation((variables: IReactionPostBody) => reactionPost(variables), {
    onSuccess: (data, variables) => {
      dispatch(
        updateReactionPost({
          post_id: variables.post_id,
          type: variables.type == myReactionState ? 0 : variables.type,
          method: variables.type == myReactionState ? -1 : 1,
        })
      );
      setMyReactionState((prev) => (prev === variables.type ? 0 : variables.type));
      setIsOpened(false);
    },
  });

  const handleReaction = debounce((type: number) => {
    reactionPostMutate({ post_id: postId, type });
  }, 0);

  const handleOnMouseEnter = () => {
    setIsOpened(true);
  };
  const handleOnMouseLeave = () => {
    setIsOpened(false);
  };

  const handleToggleReaction = (type: number) => {
    handleReaction(myReactionState !== 0 ? myReactionState : type);
  };

  return (
    <RootStyled>
      <Tooltip
        placement="top"
        open={isOpened}
        onOpen={handleOnMouseEnter}
        onClose={handleOnMouseLeave}
        title={<HoverReaction onReaction={handleReaction} />}
        translate="yes"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: 'transparent',
            },
          },
        }}
      >
        <ContentStyled onClick={() => handleToggleReaction(ReactionType.LIKE)}>
          <StartIconStyled>{hasReaction(myReactionState)?.icon}</StartIconStyled>
          <Typography variant="subtitle2" color={getColorReaction(myReactionState)}>
            {hasReaction(myReactionState)?.title || 'Thích'}
          </Typography>
        </ContentStyled>
      </Tooltip>

      <ContentStyled>
        <Typography variant="subtitle2" color="text.secondary">
          Comment
        </Typography>
      </ContentStyled>

      <ContentStyled>
        <Typography variant="subtitle2" color="text.secondary">
          Chia sẻ
        </Typography>
      </ContentStyled>
    </RootStyled>
  );
}

interface TooltipIemProp {
  type?: number;
  onReaction: (type: number) => void;
}

interface ListIconType {
  icon: ReactElement;
  type: number;
  title: string;
}

const LIST_ICON: ListIconType[] = [
  {
    icon: <LiveIconSvg />,
    type: ReactionType.LIKE,
    title: 'Thích',
  },
  {
    icon: <LoveIconSvg />,
    type: ReactionType.LOVE,
    title: 'Yêu thích',
  },
  {
    icon: <HahaIconSvg />,
    type: ReactionType.HAHA,
    title: 'Haha',
  },
  {
    icon: <WowIconSvg />,
    type: ReactionType.WOW,
    title: 'Wow',
  },
  {
    icon: <SadIconSvg />,
    type: ReactionType.SAD,
    title: 'Buồn',
  },

  {
    icon: <AngryIconSvg />,
    type: ReactionType.ANGRY,
    title: 'Phẩn nộ',
  },
  {
    icon: <DearIconSvg />,
    type: ReactionType.CARE,
    title: 'Thương thương',
  },
];

const RootReactionStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.customShadows.z1,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[200]}`,
}));

const ReactionIconStyle = styled('div')(({ theme }) => ({
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeOut,
  }),
  width: 32,
  height: 32,
  '&:hover': {
    transform: 'scale(1.3) translateY(-4px)',
    cursor: 'pointer',
  },
}));

function HoverReaction({ type, onReaction }: TooltipIemProp) {
  return (
    <RootReactionStyle>
      {LIST_ICON.map((item) => (
        <ReactionIconStyle key={item.type} onClick={() => onReaction(item.type)}>
          {item.icon}
        </ReactionIconStyle>
      ))}
    </RootReactionStyle>
  );
}

function hasReaction(type: number) {
  return LIST_ICON.find((item) => item.type === type);
}

function getColorReaction(type: number) {
  switch (type) {
    case ReactionType.LIKE:
      return 'secondary.main';
    case ReactionType.LOVE:
      return 'error.main';
    case ReactionType.HAHA:
      return 'warning.main';
    case ReactionType.WOW:
      return 'warning.main';
    case ReactionType.SAD:
      return 'warning.main';
    case ReactionType.ANGRY:
      return 'warning.main';
    case ReactionType.CARE:
      return 'warning.main';
    default:
      return 'text.secondary';
  }
}

function getName(name: string) {
  return name.split('.')[0] as keyof Pick<Palette, 'error'>;
}
