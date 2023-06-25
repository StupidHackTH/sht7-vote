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

  const [motion, setMotion] = useState(0);

  useEffect(() => {
    console.log(session?.userId);
  }, [session]);

  // useEffect(() => {
  //   DeviceMotionEvent.requestPermission().then((response: any) => {
  //     if (response == "granted") {
  //       window.addEventListener("devicemotion", (e) => {
  //         setMotion(event.acceleration.x);
  //       });
  //     }
  //   });
  // }, [motion]);

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
