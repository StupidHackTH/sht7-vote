import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
} from "firebase/firestore";
import { app } from "@/utils/firebase";

const db = getFirestore(app);

export const getCurrentPitchingTeam = async () => {
  const currentTeam = (
    await getDocs(query(collection(db, "current_pitching_team")))
  ).docs[0].data().name;
};

export const setCurrentPitchingTeam = async (teamName: string) => {
  const ref = doc(db, "current_pitching_team", "current_pitching_team");

  await setDoc(
    ref,
    {
      name: teamName,
    },
    {
      merge: true,
    }
  );
};

export const vote = (voterId: string, votedTeam: string) => {};
