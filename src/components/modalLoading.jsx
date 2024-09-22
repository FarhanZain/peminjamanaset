export default function ModalLoading() {
  return (
    <>
      <div className="modal modal-open modal-middle">
        <div className="modal-box">
          <div className="flex flex-col justify-center items-center py-12">
            <span className="loading loading-spinner loading-md"></span>
            <p>Loading</p>
          </div>
        </div>
      </div>
    </>
  );
}
