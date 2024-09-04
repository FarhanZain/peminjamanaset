export default function Modal(props) {
  const { children, title, onCloseModal } = props;

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <div className="modal modal-open modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          {children}
          <div className="modal-action">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onCloseModal}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
