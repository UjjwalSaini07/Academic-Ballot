export default function ParticipantsModal({ open, participants, onKick, onClose }) {
  if (!open) return null;

  // Ensure participants is an array
  const safeParticipants = Array.isArray(participants) ? participants : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">

      <div className="bg-white w-[400px] rounded-xl p-6 shadow-lg">

        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Participants</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {safeParticipants.map((p) => (
          <div key={p.id || p.name} className="flex justify-between mb-2 text-sm">
            <span>{p.name}</span>
            <button
              onClick={() => onKick(p.name)}
              className="text-red-500"
            >
              Kick out
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}