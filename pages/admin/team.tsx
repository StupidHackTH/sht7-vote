import { app } from "@/utils/firebase";

import {
  collection,
  addDoc,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const Team = () => {
  const db = getFirestore(app);

  const [teamName, setTeamName] = useState<string>("");
  const [teams, setTeams] = useState([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await addDoc(collection(db, "teams"), {
      name: teamName,
      createdAt: serverTimestamp(),
    });

    setTeamName("");
  };

  useEffect(() => {
    const q = query(collection(db, "teams"), orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) return;
      const allTeam: any = [];
      querySnapshot.forEach((doc) => {
        const res = doc.data();
        allTeam.push(res);
      });
      setTeams(allTeam);
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center my-8">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Team Name"
          onChange={(e: any) => setTeamName(e.target.value)}
          value={teamName}
          className="bg-transparent outline-none border-2 border-indigo-600 px-4 py-1 rounded-l-lg"
        />
        <button
          type="submit"
          className="rounded-r-lg bg-indigo-600 py-1 px-4 text-white border-2 border-indigo-600 hover:brightness-90"
        >
          Add
        </button>
      </form>

      <div>
        {teams.map((team: any) => (
          <div>{team.name}</div>
        ))}
      </div>
    </div>
  );
};

export default Team;
