import React from "react";
import { useModal } from "../hooks/dialog-modal";

export function Model(props: any) {
  // let [show, setShow] = useState(false);
  const modal = useModal();

  return (
    <React.Fragment>
      {props.children}
      {props.show}
      <div className={props.show ? "modal-backdrop fade show" : "d-none"}></div>
      <div
        className={
          props.show ? "modal d-block show fade" : "modal d-block fade"
        }
        tabIndex={-1}
        style={{
          zIndex: props.show ? 999999 : -1,
          transition: props.show
            ? "opacity .15s linear, z-index 0s linear 0s"
            : "opacity .15s linear, z-index 0s linear .5s",
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {modal.title}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  modal.hideModal();
                }}
              ></button>
            </div>
            <div className="modal-body">{modal.content}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  modal.hideModal();
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  modal.onOkClick();
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
