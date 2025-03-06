import classnames from "classnames";

interface QuickviewColumnWrapperProps {
  sticky?: boolean;
  isDetail?: boolean;
  top?: boolean;
  className?: string;
  children?: React.ReactNode;
  [x: string]: any;
}

export const QuickviewColumnWrapper = ({
  sticky,
  isDetail,
  top,
  className,
  children,
}: QuickviewColumnWrapperProps) => {
  const wrapperClasses = classnames(className, {
    "w-full lg:h-[91vh]": sticky,
    "mt-2": !isDetail,
    "top-[5.375rem]": top,
    "sticky z-[9]": sticky,
  });

  return <div className={wrapperClasses}>{children}</div>;
};
