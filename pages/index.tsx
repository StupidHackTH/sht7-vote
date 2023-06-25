import Vote from "@/components/Vote";
import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import type { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  const [motion1, setMotion1] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [motion2, setMotion2] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    setInterval(function () {
      var change = Math.abs(
        motion1.x - motion2.x + motion1.y - motion2.x + motion1.z - motion2.x
      );

      if (change > 2000) {
        alert("Shake!");
      }

      // Update new position
      motion2.x = motion1.x;
      motion2.y = motion1.y;
      motion2.z = motion1.y;
    }, 150);
  });

  const handleRequestMotion = async () => {
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
  };

  if (!session) {
    return (
      <>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Link href="/api/auth/signin">
            <button>sign in</button>
          </Link>
          status: {status}
        </main>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          {session?.userId && <Vote userId={session?.userId} />}
          status: {status}
          motion1: {JSON.stringify(motion1)}
          motion2: {JSON.stringify(motion2)}
          <button onClick={handleRequestMotion}>Request Motion</button>
        </main>
      </>
    );
  }
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      session: await getServerSession(context.req, context.res, authOptions),
    },
  };
}
function then(arg0: (response: any) => void) {
  throw new Error("Function not implemented.");
}
