import { app } from "@/utils/firebase";
import { getMobileOperatingSystem } from "@/utils/getMobileOperatingSystem";
import { collectTime, resetTime, tickTime } from "@/utils/timeCounter";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

let shaking: { x: number; y: number; z: number } | undefined;

function normalize(x: number, y: number, z: number) {
  const len = Math.hypot(x, y, z);
  return [x / len, y / len, z / len];
}

const Vote = ({ userId }: { userId: string }) => {
  const [motion1, setMotion1] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const motion2 = useRef({
    x: 0,
    y: 0,
    z: 0,
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    // const change = Math.abs(
    //   motion1.x -
    //     motion2.current.x +
    //     motion1.y -
    //     motion2.current.x +
    //     motion1.z -
    //     motion2.current.x
    // );

    // if (change > 80) {
    //   setTimeout(() => {
    //     if (currentTeam.id !== "end") {
    //       setCount(count + 1);
    //       tickTime();
    //     }
    //   }, 280);
    // }
    const hypot = Math.hypot(motion1.x, motion1.y, motion1.z);

    if (hypot > 30) {
      if (shaking) {
        const [a, b, c] = normalize(motion1.x, motion1.y, motion1.z);
        const [d, e, f] = normalize(shaking.x, shaking.y, shaking.z);
        // check if [a,b,c] and [d,e,f] are pointing to the same direction by using dot product
        if (Math.abs(a * d + b * e + c * f) < 0.3) {
          shaking = undefined;
        }
      }
      if (!shaking) {
        shaking = {
          x: motion1.x,
          y: motion1.y,
          z: motion1.z,
        };
        setCount(count + 1);
        tickTime();
      }
    } else if (hypot < 20) {
      shaking = undefined;
    }

    // document.querySelector("#debug")!.textContent = `${Math.round(max)}`;

    // Update new position
    motion2.current = {
      x: motion1.x,
      y: motion1.y,
      z: motion1.z,
    };
  }, [motion1, motion2.current]);

  const handleRequestMotion = async () => {
    const mobile = getMobileOperatingSystem();
    if (mobile === "iOS") {
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        (DeviceMotionEvent as any)
          .requestPermission()
          .then((permissionState: any) => {
            if (permissionState === "granted") {
              window.addEventListener("devicemotion", (e: any) => {
                setMotion1({
                  x: e.accelerationIncludingGravity.x,
                  y: e.accelerationIncludingGravity.y,
                  z: e.accelerationIncludingGravity.z,
                });
              });
            }
          })
          .catch(console.error);
      } else {
        // handle regular non iOS 13+ devices
        console.log("Not Supported");
      }
    } else {
      window.addEventListener("devicemotion", (e: any) => {
        setMotion1({
          x: e.accelerationIncludingGravity.x,
          y: e.accelerationIncludingGravity.y,
          z: e.accelerationIncludingGravity.z,
        });
      });
    }
  };

  // useEffect(() => {
  //   const shake = new Shake({});
  //   shake.start();
  //   window.addEventListener("shake", () => {
  //     console.log("shake");

  //     setCount(count + 1);
  //     tickTime();
  //   });
  //   return () => {
  //     shake.stop();
  //   };
  // }, []);

  const db = getFirestore(app);

  const [currentTeam, setCurrentTeam] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });

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
      const time = collectTime();
      console.log(currentTeam.id, count, time);
      setDoc(
        doc(db, "results", userId),
        {
          [currentTeam.id]: { count, time },
        },
        {
          merge: true,
        }
      );

      setCount(0);
      resetTime();
    }
  }, [currentTeam.id, db]);

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <button
          onClick={handleRequestMotion}
          className="bg-red-500 text-white py-2 px-8 rounded-lg hover:brightness-90"
        >
          กดกูวววววววววว
        </button>
      </div>
      <div className="flex flex-col justify-center items-center space-y-2">
        <h3 className="text-gray-700 text-sm font-medium">Shaking for Team</h3>
        <div className="text-4xl font-bold">{currentTeam.name}</div>
      </div>
      <div className="text-center text-8xl font-bold">{count}</div>
    </div>
  );
};

export default Vote;
