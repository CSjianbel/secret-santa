import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faCheckCircle} className="text-6xl" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">
          Emails Sent Successfully!
        </h2>
        <p className="text-center text-gray-700">
          The Secret Santa assignments have been emailed to all participants.
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onClose}
            className="text-white py-2 px-6 rounded-full hover:bg-gray-600 transition duration-300"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
