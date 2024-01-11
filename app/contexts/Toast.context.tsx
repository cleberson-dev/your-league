import { createContext, useContext, useState } from "react";
import cls from "classnames";
import {
  InformationCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/16/solid";

type ToastTypes = "info" | "success" | "error" | "warning";

type ToastContextValues = {
  toast: (content: string, type: ToastTypes) => void;
};

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

  const Icon = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  }[type];

  return (
    <ToastContext.Provider value={{ toast }}>
      {content && (
        <div
          role="alert"
          className={cls({
            "absolute right-4 top-2 z-50 flex items-center gap-x-2 rounded bg-white p-4 text-sm text-black shadow":
              true,
            hidden: !content,
          })}
        >
          <Icon
            className={cls(
              {
                info: "text-blue-500",
                warning: "text-yellow-400",
                error: "text-red",
                success: "text-green",
              }[type],
              "h-5 w-5"
            )}
          />
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
