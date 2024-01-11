import { createContext, useContext, useState } from "react";
import cls from "classnames";

type ToastContextValues = {
  toast: (content: string) => void;
};

type ToastTypes = "info" | "success" | "error" | "warning";

const defaultValues: ToastContextValues = {
  toast: () => {},
};

const ToastContext = createContext(defaultValues);

export const useToast = () => useContext(ToastContext);

export default function ToastContextProvider({
  children,
}: React.PropsWithChildren) {
  const [content, setContent] = useState<string | null>(null);
  const [type, setType] = useState<ToastTypes>("info");

  const toast = (content: string, type: ToastTypes = "info") => {
    setContent(content);
    setType(type);

    setTimeout(() => setContent(null), 5000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {content && (
        <div
          role="alert"
          className={cls({
            "absolute right-4 top-2 z-50 rounded bg-white p-4 text-sm text-black shadow":
              true,
            hidden: !content,
          })}
        >
          {content}
          <div
            className={cls(
              "absolute bottom-0 left-0 h-1 w-full animate-progress",
              {
                info: "bg-blue-500",
                warning: "bg-yellow-400",
                error: "bg-red",
                success: "bg-green",
              }[type]
            )}
          />
        </div>
      )}

      {children}
    </ToastContext.Provider>
  );
}
