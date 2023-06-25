import { app } from "@/utils/firebase";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { use, useEffect, useState } from "react";

const Vote = () => {
  const db = getFirestore(app);

  const [currentTeam, setCurrentTeam] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });

  const [history, setHistory] = useState<any>({});

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
    const history = localStorage.getItem("history");
    if (history) {
      setHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(history).length === 0) return;
    localStorage.setItem("history", JSON.stringify(history));

    if (currentTeam.id === "end") {
      addDoc(collection(db, "results"), history);
    }
  }, [currentTeam.id, db, history]);

  return (
    <div>
      <div>Now you vote for : {currentTeam.name}</div>
      <div>You clicked : {history[currentTeam.id]}</div>
      <button
        onClick={() => {
          if (history[currentTeam.id]) {
            setHistory({
              ...history,
              [currentTeam.id]: history[currentTeam.id] + 1,
            });
          } else {
            setHistory({
              ...history,
              [currentTeam.id]: 1,
            });
          }
        }}
      >
        Click me
      </button>
    </div>
  );
};

export default Vote;
