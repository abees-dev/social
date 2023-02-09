import { useEffect, useState } from 'react';

export default function useOffsetTop(top?: number) {
  const [offsetTop, setOffsetTop] = useState(false);

  const isTop = top || 100;

  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset > isTop) {
        setOffsetTop(true);
      } else {
        setOffsetTop(false);
      }
    };
    return () => {
      window.onscroll = null;
    };
  }, [isTop]);

  return offsetTop;
}
