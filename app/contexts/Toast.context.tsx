import { createContext, useContext, useState } from "react";
import cls from "classnames";

type ToastContextValues = {
  toast: (content: string) => void;
};

const defaultValues: ToastContextValues = {
  toast: () => {},
};

const ToastContext = createContext(defaultValues);

export const useToast = () => useContext(ToastContext);

export default function ToastContextProvider({
  children,
}: React.PropsWithChildren) {
  const [content, setContent] = useState<string | null>();

  const toast = (content: string) => {
    setContent(content);

    setTimeout(() => setContent(null), 5000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {content && <div
        role="alert"
        className={cls({
          "absolute right-4 top-2 z-50 rounded bg-white p-4 text-sm text-black shadow":
            true,
          hidden: !content,
        })}
      >
        {content}
        <div className="absolute bottom-0 w-full h-1 bg-black left-0 animate-progress"></div>
      </div>}
      
      {children}
    </ToastContext.Provider>
  );
}
