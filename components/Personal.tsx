/* eslint-disable @next/next/no-img-element */

const Personal = ({ session }: { session: any }) => {
  return (
    <div className="bg-gray-800 text-white px-8 py-4 flex flex-row justify-start items-center space-x-4">
      <div className="relative w-16 h-16">
        <img
          src={session.user.image}
          alt=""
          className="rounded-lg object-cover"
        />
      </div>
      <div>
        <div>{session.user.name}</div>
        <div>
          REF CODE:{" "}
          {
            session.tickets.filter((item: any) => item.eventId == "15113")[0]
              .refCode
          }
        </div>
      </div>
    </div>
  );
};

export default Personal;
