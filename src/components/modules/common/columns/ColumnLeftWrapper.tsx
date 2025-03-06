import { cn } from "@/utils/tailwindUtils";

const ColumnLeftWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        'lg:flex lg:flex-col sticky top-[5.375rem] mt-2 hidden w-full max-w-[209px] flex-shrink-0 gap-y-3 no-scrollbar lg:h-[91vh] lg:overflow-y-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ColumnLeftWrapper;
