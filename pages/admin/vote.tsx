import { setCurrentPitchingTeam } from "@/lib/vote";
import { app } from "@/utils/firebase";

import {
  collection,
  addDoc,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  orderBy,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const Team = () => {
  const db = getFirestore(app);

  const [teams, setTeams] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState("");

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

  const handleSelectTeam = async (teamName: string) => {
    if (teamName == selectedTeam) {
      await setCurrentPitchingTeam("");
      setSelectedTeam("");
    } else {
      await setCurrentPitchingTeam(teamName);
      setSelectedTeam(teamName);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center my-8">
      <div>Current team: {selectedTeam}</div>

      <div>
        {teams.map((team: any) => (
          <div>
            <button
              className="p-4 bg-slate-600 w-full m-4 text-white text-lg"
              onClick={() => handleSelectTeam(team.name)}
            >
              {team.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
