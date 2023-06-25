import NextAuth, { NextAuthOptions } from "next-auth";
import type { OAuthConfig } from "next-auth/providers";

/**
 * Data contained in ID token returned by Authgarten OIDC provider.
 * https://github.com/creatorsgarten/creatorsgarten.org/blob/main/src/backend/auth/mintIdToken.ts
 */
export interface AuthgartenOidcClaims {
  /** Unique user ID (24 characters hexadecimal) */
  sub: string;

  /** Full name */
  name: string;

  /** Avatar URL */
  picture: string;

  /** Email (requires `email` scope) */
  email?: string;

  /** Connections */
  connections: {
    eventpop: {
      /** Eventpop user ID */
      id: number;
    };
  };

  /** Associated Eventpop tickets */
  eventpopTickets?: {
    /** Event ID */
    eventId: number;

    /** Ticket ID */
    ticketId: number;

    /** Reference code */
    refCode: string;

    /** Ticket holder’s first name */
    firstName: string;

    /** Ticket holder’s last name */
    lastName: string;

    /** Ticket holder’s email address */
    email: string;

    /** Ticket type */
    ticketType: {
      /** Ticket type ID */
      id: number;
      /** Ticket type name */
      name: string;
    };
  }[];

  /** The nonce value, per https://openid.net/specs/openid-connect-core-1_0.html#IDToken */
  nonce?: string;
}

const creatorsgartenProvider: OAuthConfig<AuthgartenOidcClaims> = {
  type: "oauth",
  id: "creatorsgarten",
  name: "Creatorsgarten",
  issuer: "https://creatorsgarten.org",
  wellKnown: "https://creatorsgarten.org/.well-known/openid-configuration",
  authorization: {
    params: {
      response_type: "id_token",
      scope: "openid https://eventpop.me/e/15113",
    },
  },

  // Add your Client ID to this URL to integrate with Authgarten:
  // https://github.com/creatorsgarten/creatorsgarten.org/blob/main/src/constants/oauth.ts
  clientId: "https://github.com/StupidHackTH/sht7-vote",

  idToken: true,
  profile: (profile) => {
    const tickets =
      profile.eventpopTickets?.filter((ticket) => ticket.eventId === 15113) ??
      [];
    const ticket = tickets[0];
    if (!ticket) {
      throw new Error("You must have a ticket to join this event.");
    }
    return {
      id: profile.sub,
      name: profile.name,
      image: profile.picture,
      email: ticket.email,
      tickets: tickets,
    };
  },
};

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [creatorsgartenProvider],
  callbacks: {
    async jwt({ token, user }) {
      token.userRole = "admin";
      const tickets = (
        user as unknown as {
          tickets: AuthgartenOidcClaims["eventpopTickets"];
        } | null
      )?.tickets;
      if (tickets) {
        token.tickets = tickets;
      }
      return token;
    },
    async session({ session, token }) {
      session.tickets =
        token.tickets as AuthgartenOidcClaims["eventpopTickets"];
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    tickets: AuthgartenOidcClaims["eventpopTickets"];
  }
}

export default NextAuth(authOptions);
