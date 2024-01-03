import {
  KeyboardEventHandler,
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
  showModal: () => void;
  hideModal: () => void;
  destroyModal: () => void;
  setModal: (content: React.ReactNode) => void;
};

const ModalContext = createContext<ModalContextValues>({
  isHidden: false,
  showModal: () => {},
  hideModal: () => {},
  destroyModal: () => {},
  setModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export const ModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const showModal = () => setIsHidden(true);
  const hideModal = () => setIsHidden(false);

  const destroyModal = () => {
    setContent(null);
    setIsHidden(false);
  };

  const setModal = (newContent: React.ReactNode) => {
    setContent(newContent);
    setIsHidden(false);
  };

  const modalContainerRef = useRef<HTMLDivElement>(null);

  const modalContainerClickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === modalContainerRef.current) {
      destroyModal();
    }
  };

  useEffect(() => {
    const close = (e: any) => {
      if (isHidden || !content) return;
      
      if (e.key === 'Escape') {
        destroyModal();
      }
    }

    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [content, isHidden]);

  return (
    <ModalContext.Provider
      value={{
        isHidden,
        setModal,
        showModal,
        hideModal,
        destroyModal,
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
            invisible: isHidden,
          })}
        >
          {content}
        </div>
      )}
    </ModalContext.Provider>
  );
};
