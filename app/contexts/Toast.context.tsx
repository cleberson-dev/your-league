import { createContext, useContext, useState } from "react";

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
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {content && (
        <div className="z-50 rounded bg-white text-black p-4 shadow absolute right-4 top-2" role="alert">
          {content}
        </div>
      )}
      {children}
    </ToastContext.Provider>
  );
}
