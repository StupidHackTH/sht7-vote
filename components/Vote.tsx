import { app } from "@/utils/firebase";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Vote = ({ userId }: { userId: string }) => {
  const db = getFirestore(app);

  const [currentTeam, setCurrentTeam] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "current_pitching_team", "current_pitching_team"),
      async (doc) => {
        const res = doc.data();
        if (res) {
          setCurrentTeam({
            id: res.id,
            name: res.name,
          });
        }
      }
    );

    return () => {
      unsub();
    };
  }, [db]);

  useEffect(() => {
    if (count == 0) return;

    if (currentTeam.id !== "end") {
      console.log(currentTeam.id, count);
      setDoc(
        doc(db, "results", userId),
        {
          [currentTeam.id]: count,
        },
        {
          merge: true,
        }
      );
    }
  }, [currentTeam.id, db]);

  const handleShake = () => {
    if (currentTeam.id !== "end") {
      setCount((prev) => prev + 1);
    }
  };

  return (
    <div>
      <div>Now you vote for : {currentTeam.name}</div>
      <div>You clicked : {count}</div>
      <button onClick={handleShake}>Click me</button>
    </div>
  );
};

export default Vote;
