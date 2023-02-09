import { useEffect, useState } from 'react';
import { Maybe } from 'src/types';
import socket from 'src/utils/socket';

const useSocket = <T>(message: string): Maybe<T> => {
  const [data, setData] = useState<Maybe<T>>(null);

  useEffect(() => {
    socket.on(message, (res: T) => {
      setData(res);
    });
  }, []);
  return data;
};

export default useSocket;
