import TopCommentsModalBody from './TopCommentsModalBody';
import TopCommentsModalHeader from './TopCommentsModalHeader';
import TopCommentsModalVideoTitle from './TopCommentsModalVideoTitle';

export default function TopCommentsModal({ modal, onClose }) {
  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        <TopCommentsModalHeader onClose={onClose} />
        <TopCommentsModalVideoTitle videoTitle={modal.videoTitle} />
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <TopCommentsModalBody modal={modal} />
        </div>
      </div>
    </div>
  );
}
