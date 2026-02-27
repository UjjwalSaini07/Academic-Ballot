import { useEffect, useState } from "react";
import axios from "axios";
import PollCard from "../components/PollCard";

export default function PollHistory() {

  const [polls, setPolls] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/poll/history")
      .then(res => setPolls(res.data));
  }, []);

  return (
    <div className="min-h-screen p-12">

      <h2 className="text-3xl font-bold mb-8">View Poll History</h2>

      {polls.map(p => (
        <div key={p._id} className="mb-8">
          <PollCard poll={p} voted />
        </div>
      ))}

    </div>
  );
}