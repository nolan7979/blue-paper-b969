interface RenderIfProps {
  isTrue: boolean;
  children: React.ReactNode;
}
const RenderIf: React.FC<RenderIfProps> = ({ isTrue, children }) => {
  return isTrue ? <>{children}</> : <></>;
};
export default RenderIf;
