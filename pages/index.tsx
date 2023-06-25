import Vote from "@/components/Vote";
import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import type { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Login from "@/components/Login";
import Personal from "@/components/Personal";

export default function Home() {
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <>
        <Head>
          <title>sht7 vote</title>
          <meta name="description" content="Vote your favourite team" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Login />
        </main>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>sht7 vote</title>
          <meta name="description" content="Vote your favourite team" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          {session?.userId && (
            <>
              <Personal session={session} />
              <Vote userId={session?.userId} />
            </>
          )}
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
