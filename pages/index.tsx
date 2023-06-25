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
import Header from "@/components/Header";

export default function Home() {
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <>
        <Header />
        <main>
          <Login />
        </main>
      </>
    );
  } else {
    return (
      <>
        <Header />
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
