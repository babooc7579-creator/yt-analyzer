import ChannelNotesModal from './ChannelNotesModal';
import CreatorSidebar from './CreatorSidebar';
import CreatorWorkspaceHeader from './CreatorWorkspaceHeader';
import SyncWarningBanner from './SyncWarningBanner';
import TopCommentsModal from './TopCommentsModal';

export default function CreatorAppLayout({
  activeCreatorItem,
  channelCount,
  children,
  commentModal,
  creatorView,
  discoveryCandidateCount,
  notesModal,
  onAddNote,
  onChangeNoteText,
  onCloseNotes,
  onCloseTopComments,
  onOpenCreatorView,
  savedVideoCount,
  selectedChannelCount,
  syncWarnings,
  videoCount,
}) {
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 font-sans text-slate-100">
      <TopCommentsModal
        modal={commentModal}
        onClose={onCloseTopComments}
      />

      <ChannelNotesModal
        modal={notesModal}
        onChangeText={onChangeNoteText}
        onAddNote={onAddNote}
        onClose={onCloseNotes}
      />

      <div className="mx-auto flex w-full max-w-[2600px] flex-col gap-4 xl:flex-row">
        <CreatorSidebar
          activeView={creatorView}
          onOpenView={onOpenCreatorView}
        />

        <div className="min-w-0 flex-1 space-y-4">
          <CreatorWorkspaceHeader
            item={activeCreatorItem}
            channelCount={channelCount}
            discoveryCandidateCount={discoveryCandidateCount}
            videoCount={videoCount}
            selectedChannelCount={selectedChannelCount}
            savedVideoCount={savedVideoCount}
          />

          <SyncWarningBanner messages={syncWarnings} />

          {children}
        </div>
      </div>
    </div>
  );
}
