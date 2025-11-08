import Button from "../button/Button";
import Modal from "./Modal";
import ModalTitle from "./ModalTitle";

const DeleteModal = ({
  title,
  question,
  onClick,
  active,
  setActive,
  isLoading,
  actionText = "Supprimer",
  cancelText = "Annuler",
  className,
}: {
  title: string;
  question: string;
  active: boolean;
  setActive: SetState;
  isLoading: boolean;
  className?: string;
  onClick: () => void;
  actionText?: string;
  cancelText?: string;
}) => {
  return (
    <Modal
      isActive={active}
      setIsActive={setActive}
      className={`px-8 min-w-[35%] max-w-[500px] !rounded-[20px] ${className} sm:!px-5`}
    >
      <ModalTitle title={title} setActive={setActive} className="!mb-4" />

      <p className="text-gray-700 sm:!whitespace-normal">{question}</p>

      <div className="flex justify-end float-end mt-4">
        <Button
          onClick={() => setActive(false)}
          className="bg-gray-100 mr-2 !bg-dark/20 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none"
        >
          {cancelText}
        </Button>

        <Button
          onClick={onClick}
          isLoading={isLoading}
          className="primary-btn !w-[150px] !bg-red-500 text-white py-2 !justify-center"
        >
          {actionText}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
