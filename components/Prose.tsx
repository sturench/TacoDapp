type Props = {
  children: React.ReactNode;
};

export default function Prose({ children }: Props) {
  return <div className="max-w-screen-md mx-auto px-4">{children}</div>;
}
