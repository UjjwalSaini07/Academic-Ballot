export default function ParticipantsPopup({ participants = [], onClose }) {
  return (
    <div className="fixed bottom-28 right-8 w-[340px] bg-white rounded-xl shadow-2xl border border-[#E2E2E8] overflow-hidden">

      <div className="flex justify-between items-center px-4 py-3 border-b border-[#E2E2E8]">
        <h3 className="text-sm font-medium">Participants</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>

      <div className="p-4 h-[260px] overflow-y-auto text-sm">

        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>Name</span>
          <span>Action</span>
        </div>

        <div className="space-y-3">
          {participants.length > 0 ? (
            participants.map((user, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{user.name || user}</span>

                <button className="text-[#6D5DF6] text-xs font-medium hover:underline">
                  Kick out
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-8">
              No participants yet
            </p>
          )}
        </div>
      </div>
    </div>
  )
}