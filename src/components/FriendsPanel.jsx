import { Check, UserMinus, UserPlus, X } from "lucide-react";
import { useFriends } from "@/hooks/useFriends";

const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

const Avatar = ({ user, online }) => (
  <div className="relative h-10 w-10 shrink-0">
    {user.photoURL ? (
      <img src={user.photoURL} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
    ) : (
      <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-bold text-anime-brand">
        {getInitial(user.name)}
      </div>
    )}
    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-anime-surface ${online ? "bg-anime-online" : "bg-anime-offline"}`} />
  </div>
);

const FriendsPanel = () => {
  const {
    friends,
    discoverUsers,
    incomingRequests,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
  } = useFriends();

  return (
    <section className="rounded-lg border border-anime-border bg-anime-surface p-4">
      <h2 className="mb-4 text-lg font-bold">Freunde</h2>

      <div className="space-y-4">
        {friends.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Noch keine Freunde. Sende unten eine Anfrage.
          </p>
        ) : (
          friends.map((friend) => (
            <div key={friend.uid} className="flex items-center gap-3">
              <Avatar user={friend} online={friend.online} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{friend.name}</p>
                <p className="text-xs text-muted-foreground">
                  {friend.online ? "Jetzt aktiv" : "Offline"}
                </p>
              </div>
              <button type="button" onClick={() => removeFriend(friend.uid)} className="grid h-8 w-8 place-items-center rounded-md bg-destructive/10 text-destructive" title="Freund entfernen">
                <UserMinus className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {incomingRequests.length > 0 && (
        <div className="mt-6 border-t border-anime-border pt-4">
          <h3 className="mb-3 text-sm font-bold">Anfragen</h3>
          <div className="space-y-3">
            {incomingRequests.map((request) => (
              <div key={request.id} className="flex items-center gap-2">
                <Avatar user={{ name: request.fromName, photoURL: request.fromPhotoURL }} online={false} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{request.fromName}</p>
                  <p className="text-xs text-muted-foreground">möchte befreundet sein</p>
                </div>
                <button type="button" onClick={() => acceptRequest(request)} className="grid h-8 w-8 place-items-center rounded-md bg-anime-online/20 text-anime-online" title="Annehmen">
                  <Check className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => declineRequest(request)} className="grid h-8 w-8 place-items-center rounded-md bg-destructive/10 text-destructive" title="Ablehnen">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-anime-border pt-4">
        <h3 className="mb-3 text-sm font-bold">Nutzer entdecken</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {discoverUsers.length === 0 ? (
            <p className="text-xs text-muted-foreground">Keine neuen Nutzer gefunden.</p>
          ) : (
            discoverUsers.map((person) => (
              <div key={person.uid} className="w-28 shrink-0 rounded-lg border border-anime-border bg-background p-3 text-center">
                <div className="mx-auto w-fit">
                  <Avatar user={person} online={person.online} />
                </div>
                <p className="mt-2 truncate text-xs font-semibold">{person.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {person.isFriend ? "Freund" : person.requestSent ? "Angefragt" : person.requestIncoming ? "Anfrage offen" : "Nutzer"}
                </p>
                {!person.isFriend && !person.requestSent && !person.requestIncoming && (
                  <button type="button" onClick={() => sendRequest(person)} className="mx-auto mt-2 grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground" title="Anfrage senden">
                    <UserPlus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FriendsPanel;
