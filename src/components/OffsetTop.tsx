import React, { useEffect } from 'react';
import { useAppDispatch } from 'src/redux/hooks';
import { setOffset } from 'src/redux/slice/offset.slice';
import { HEADER } from 'src/config';

function OffsetTop() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset > HEADER.HEADER_DESKTOP_HEIGHT) {
        dispatch(setOffset(true));
      } else {
        dispatch(setOffset(false));
      }
    };
    return () => {
      window.onscroll = null;
    };
  }, []);
  return <> </>;
}

export default OffsetTop;
