import { createContext, useContext, useState } from "react";
import { Model } from "../components/Modal";

const modalContext = createContext({} as IModalProvider);

export const ModalProvider = (props: any) => {
  let hook = useModalProvider();
  return (
    <modalContext.Provider value={hook}>
      <Model show={hook.show}>{props.children}</Model>
    </modalContext.Provider>
  );
};

export function useModal() {
  return useContext(modalContext);
}

function useModalProvider(): IModalProvider {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("Confirmation");
  const [content, setContent] = useState("");
  const [onCustomOkClick, setOnCustomOkClick] = useState(Function);

  function showModal(title: string, content: string, customOkClick: Function) {
    setTitle(title);
    setContent(content);
    setOnCustomOkClick(customOkClick);
    setShow(true);
  }

  function hideModal() {
    setShow(false);
  }

  function onOkClick() {
    if (onCustomOkClick) onCustomOkClick();
    hideModal();
  }

  return { show, title, content, onOkClick, showModal, hideModal };
}

export interface IModalProvider {
  show: boolean;
  title: string;
  content: string;
  onOkClick(): void;
  showModal(title: string, content: string, customOkClick: Function): void;
  hideModal: Function;
}
