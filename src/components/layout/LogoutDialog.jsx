import { ModalComponents } from "@/components/ui/Modal";

export default function LogoutDialog({ isOpen, onCancel, onConfirm }) {
  return (
    <ModalComponents title="Logout" isOpen={isOpen} toggle={onCancel} size="sm">
      <p className="text-center mb-4">Do you want to log out?</p>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-primary1 flex-fill py-2" onClick={onCancel}>
          Stay
        </button>
        <button className="btn btn-primary1 flex-fill py-2" onClick={onConfirm}>
          Log out
        </button>
      </div>
    </ModalComponents>
  );
}
