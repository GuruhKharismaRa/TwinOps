import { Bell, ClipboardList,  Package,
  Forklift,
  AlertTriangle,
  User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent
} from "@/components/ui/sheet";

import {
  getNotifications, 
  markAsRead
} from "@/services/notificationService";
import {
  CheckCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function NotificationBell() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadNotifications();
    const handleNotification = event => {
      console.log("REALTIME NOTIFICATION", event.detail);
      loadNotifications();
    };

    window.addEventListener("notification-created", handleNotification);
    return () => {
      window.removeEventListener("notification-created", handleNotification); 
    };
  }, []);

  async function loadNotifications() {

    try {

      const response =
        await getNotifications();

      console.log(
        "Notifications:",
        response
      );

      if (
        response.status ===
        "success"
      ) {

        setNotifications(
          response.data || []
        );

        setUnreadCount(
          response.unread_count || 0
        );

      }

    } catch (error) {

      console.error(error);

    }

  }

  // fungsi untuk memformat usia notifikasi menjadi "x seconds ago", "x minutes ago", dll.
  function formatAge(dateString) {

  if (!dateString)
    return "";

  const date =
    new Date(dateString);

  const now =
    new Date();

  const diff =
    Math.floor(
      (now - date) / 1000
    );

  if (diff < 60)
    return `${diff}s ago`;

  if (diff < 3600)
    return `${Math.floor(diff / 60)}m ago`;

  if (diff < 86400)
    return `${Math.floor(diff / 3600)}h ago`;

  if (diff < 604800)
    return `${Math.floor(diff / 86400)}d ago`;

  return date.toLocaleDateString();
}

  const filteredNotifications =
    filter === "UNREAD"
      ? notifications.filter(
          n =>
            n.status?.toUpperCase() ===
            "UNREAD"
        )
      : notifications;

  // fungsi untuk mendapatkan icon berdasarkan tipe notifikasi
  function getNotificationIcon(type) {

  switch (type) {

    case "TASK":
      return (
        <ClipboardList
          className="
            h-4
            w-4
            text-[#6d5fa8]
          "
        />
      );

    case "INVENTORY":
      return (
        <Package
          className="
            h-4
            w-4
            text-[#6d5fa8]
          "
        />
      );

    case "FORKLIFT":
      return (
        <Forklift
          className="
            h-4
            w-4
            text-[#6d5fa8]
          "
        />
      );

    case "ALERT":
      return (
        <AlertTriangle
          className="
            h-4
            w-4
            text-[#ef4444]
          "
        />
      );

    case "USER":
      return (
        <User
          className="
            h-4
            w-4
            text-[#6d5fa8]
          "
        />
      );

    default:
      return (
        <Bell
          className="
            h-4
            w-4
            text-[#6d5fa8]
          "
        />
      );

  }

}

  return (
    <>
      {/* Bell */}

      <Button
        onClick={() =>
          setOpen(true)
        }
        className="
          relative

          flex
          items-center
          justify-center

          h-9
          w-9

          rounded-xl

          border
          border-[#e7e2ee]

          bg-white

          transition-all

          hover:bg-[#f8f6fb]
          hover:shadow-sm
          cursor-pointer
        "
      >

        <Bell
          className="
            h-5
            w-5
            text-[#5f586b]
          "
        />

        {unreadCount > 0 && (

          <span
            className="
              absolute
              -top-1.5
              -right-1.5

              flex
              items-center
              justify-center

              min-w-[20px]
              h-[20px]

              rounded-full

              border-2
              border-white

              bg-[#8a79ab]

              text-white
              text-[11px]
              font-bold
              
              shadow-sm
            " style={{color: "white"}}
          >
            {unreadCount}
          </span>

        )}

      </Button>

      {/* Notification Center */}

      <Sheet
        open={open}
        onOpenChange={setOpen}
      >

        <SheetContent side="right"
          className="    !w-[420px]
    p-0 gap-0"
        >

          {/* Header */}

          <div className="px-5 py-1 border-b">
           <div className=" flex items-start justify-between">
            <div>
              <h2 className="mt-1 text-sm text-[#3d3c4f]">
                Notifications
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-[#7a7392]
                "
              >
                {notifications.length}
                {" "}
                total notifications
                ·
                {" "}
                {unreadCount}
                {" "}
                unread
              </p>
            </div>
            <Button className=" flex
    items-center
    gap-2

    rounded-lg
    bg-[#f4f1fa]
    border
    border-[#d9d3e7]
      gap-2
mt-10
    bg-white

    px-3
    py-1.5

    text-xs
    font-medium

    text-[#6d5fa8]

    transition-all
    hover:border-[#8a79ab]
    hover:bg-[#e8e2f5]
    cursor-pointer

    active:scale-[0.98]"> <CheckCheck
    className="
      h-4
      w-4
    "
  />Mark all read</Button>
          </div>
          </div>
          {/* Filter */}

          <div
            className="
              px-6
              py-2
              border-b
            "
          >

            <div
              className="
                inline-flex
                rounded-lg
                bg-[#f4f1fa]
                p-1
              "
            >

              <Button
                onClick={() =>
                  setFilter("ALL")
                }
                className={`
                  px-4
                  py-2
                  rounded-md
                  text-sm
                  transition-all

                  ${
                    filter === "ALL"
                      ? "bg-white border border-[#8a79ab] shadow-sm text-[#3d3c4f]"
                      : "text-[#7a7392]"
                  }
                `}
              >
                All ({notifications.length})
              </Button>

              <Button
                onClick={() =>
                  setFilter(
                    "UNREAD"
                  )
                }
                className={`
                  px-4
                  py-2
                  rounded-md
                  text-sm
                  transition-all

                  ${
                    filter ===
                    "UNREAD"
                      ? "bg-white border border-[#8a79ab] shadow-sm text-[#3d3c4f]"
                      : "text-[#7a7392]"
                  }
                `}
              >
                Unread ({unreadCount})
              </Button>

            </div>

          </div>

          {/* List */}

          <div
            className="
              overflow-y-auto
              h-[calc(100vh-170px)]
            "
          >

            {filteredNotifications.length === 0 && (

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  h-72
                "
              >

                <Bell
                  className="
                    h-12
                    w-12
                    text-[#5f586b]
                  "
                />

                <div
                  className="
                    mt-1
                    text-sm
                    text-[#7a7392]
                  "
                >
                  No notifications found
                </div>
                <div
                  className="
                    mt-1
                    text-sm
                    text-[#a29ab8]
                  "
                >
                  You're all caught up.
                </div>


              </div>

            )}

            {filteredNotifications.map(
              notification => (

                <div
                  key={
                    notification.id
                  }
                  onClick={async () => {
                    if (
                      notification.status ===
                      "UNREAD"
                    ) {

                      await markAsRead(
                        notification.id
                      );

                      await loadNotifications();

                    }

                    if (
                      notification.url
                    ) {

                      navigate(
                        notification.url
                      );

                      setOpen(false);

                    }

                  }}
                  className={`
                    px-6
                    py-4

                    border-b

                    transition-all

                    hover:bg-[#f4f1fa]
                    hover:cursor-pointer
                    ${
                      notification.status === "UNREAD"
                        ? "bg-[#faf8ff]   border-l-4 border-l-[#8a79ab] "
                        : "bg-white"
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      gap-4
                    "
                  >

                    <div
                      className="
                        h-9
                        w-9
                        rounded-xl
                        bg-[#f4f1fa]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div
                      className="
                        flex-1 min-w-0 flex items-start justify-between
                      "
                    >
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="
                            font-medium
                            text-sm
                            text-[#3d3c4f]
                          "
                        >
                          {notification.title}
                        </div>

                        <div
                          className="
                            mt-1
                            text-sm
                            text-[#7a7392]
                          "
                        >
                          {notification.message}
                        </div>

                        </div>
                        <div className="text-xs text-[#a29ab8] whitespace-nowrap ml-4 shrink-0">
                          {formatAge(
                            notification.created_at
                          )}
                        </div>
                      {/* <div
                        className="
                          mt-2
                          text-xs
                          text-[#a29ab8]
                        "
                      >
                        {notification.status}
                      </div> */}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </SheetContent>

      </Sheet>
    </>
  );
}
 