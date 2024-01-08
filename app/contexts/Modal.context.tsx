import {
  MouseEventHandler,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import cls from "classnames";

type ModalContextValues = {
  isHidden: boolean;
  hideModal: () => void;
  showModal: (content: React.ReactNode) => void;
};

const ModalContext = createContext<ModalContextValues>({
  isHidden: false,
  hideModal: () => {},
  showModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export const ModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const hideModal = () => setIsHidden(true);

  const showModal = (newContent: React.ReactNode) => {
    setContent(newContent);
    setIsHidden(false);
  };

  const modalContainerRef = useRef<HTMLDivElement>(null);

  const modalContainerClickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === modalContainerRef.current) {
      hideModal();
    }
  };

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (isHidden || !content) return;

      if (e.key === "Escape") {
        hideModal();
      }
    };

    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [content, isHidden]);

  return (
    <ModalContext.Provider
      value={{
        isHidden,
        showModal,
        hideModal,
      }}
    >
      {children}

      {content && (
        <div
          ref={modalContainerRef}
          onClick={modalContainerClickHandler}
          className={cls({
            "absolute left-0 top-0 z-20 flex h-[100svh] w-full items-center justify-center bg-black/10":
              true,
            hidden: isHidden,
          })}
        >
          {content}
        </div>
      )}
    </ModalContext.Provider>
  );
};
