import { Picker } from 'emoji-mart';
import React, { useEffect, useRef } from 'react';

export default function MyEmojiPicker(props: any) {
  const ref = useRef<any>(null);
  const instance = useRef<any>(null);

  if (instance.current) {
    instance.current.update(props);
  }

  useEffect(() => {
    instance.current = new Picker({ ...props, ref });

    return () => {
      instance.current = null;
    };
  }, []);

  return React.createElement('div', { ref });
}
