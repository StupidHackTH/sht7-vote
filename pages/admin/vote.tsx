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
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const Team = () => {
  const db = getFirestore(app);

  const [teams, setTeams] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });

  useEffect(() => {
    const q = query(collection(db, "teams"), orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) return;
      const allTeam: any = [];
      querySnapshot.forEach((doc) => {
        const res = doc.data();
        allTeam.push({
          id: doc.id,
          ...res,
        });
      });
      setTeams(allTeam);
    });

    const getCurrentTeam = async () => {
      const docRef = doc(db, "current_pitching_team", "current_pitching_team");
      const docSnap = await getDoc(docRef);
      const res = docSnap.data();

      if (res)
        setSelectedTeam({
          id: res.id,
          name: res.name,
        });
    };
    getCurrentTeam();
  }, []);

  const handleSelectTeam = async (team: { id: string; name: string }) => {
    if (team == selectedTeam) {
      await setCurrentPitchingTeam({
        id: "",
        name: "",
      });
      setSelectedTeam({
        id: "",
        name: "",
      });
    } else {
      await setCurrentPitchingTeam(team);
      setSelectedTeam(team);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center my-8">
      <div>Current team: {selectedTeam.name}</div>

      <div>
        {teams.map((team: any) => (
          <div>
            <button
              className="p-4 bg-slate-600 w-full m-4 text-white text-lg"
              onClick={() => handleSelectTeam(team)}
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
