import { useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus, Star } from "lucide-react";

const initialNotifications = [
  { id: 1, type: "like", user: "Tim Schau", text: "hat deinen Post geliked", time: "vor 5 Min", read: false },
  { id: 2, type: "comment", user: "Yuki Watanabe", text: "hat kommentiert: \"Mega cool! 🔥\"", time: "vor 15 Min", read: false },
  { id: 3, type: "follow", user: "Jason Lee", text: "folgt dir jetzt", time: "vor 1 Std", read: false },
  { id: 4, type: "mention", user: "Hana Kim", text: "hat dich in einem Post erwähnt", time: "vor 2 Std", read: true },
  { id: 5, type: "like", user: "Max Müller", text: "hat deinen Kommentar geliked", time: "vor 3 Std", read: true },
];

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-3 h-3 text-anime-brand" />;
      case "comment":
        return <MessageCircle className="w-3 h-3 text-primary" />;
      case "follow":
        return <UserPlus className="w-3 h-3 text-anime-online" />;
      case "mention":
        return <Star className="w-3 h-3 text-yellow-500" />;
      default:
        return <Bell className="w-3 h-3" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1.5 rounded-md hover:bg-secondary transition-colors"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-anime-brand text-[9px] text-white flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 rounded-lg bg-anime-surface border border-anime-border shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-anime-border">
              <span className="text-xs font-semibold text-foreground">
                Benachrichtigungen
              </span>

              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-primary hover:underline"
                >
                  Alle gelesen
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-2 px-3 py-2.5 hover:bg-secondary/50 transition-colors border-b border-anime-border last:border-0 ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="mt-0.5">{getIcon(n.type)}</div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-foreground">
                      <span className="font-semibold">{n.user}</span>{" "}
                      {n.text}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      {n.time}
                    </p>
                  </div>

                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;