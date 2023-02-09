import useRouter from 'src/hooks/useRouter';

export default function Home() {
  const { push } = useRouter();

  const handlePush = () => {
    push('auth/login');
  };

  return (
    <div>
      <h1 onClick={handlePush}>login</h1>
    </div>
  );
}
