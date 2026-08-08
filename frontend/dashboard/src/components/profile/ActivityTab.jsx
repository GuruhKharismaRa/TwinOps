import { useEffect, useState, useRef } from "react";
import ActivityTimeline from "./ActivityTimeline";
import { Input } from "@/components/ui/input";
import { Search, XCircle } from "lucide-react";
 

export default function ActivityTab() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const token = localStorage.getItem("access_token");

    const response = await fetch("http://localhost:8001/auth/activity", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    setActivities(result.data || []);
  };

  const keyword = search.toLowerCase();

  const filtered = activities.filter(
    (x) =>
      x.action
        ?.toLowerCase()
        ?.includes(keyword) ||

      x.remarks
        ?.toLowerCase()
        ?.includes(keyword)
  );

//   const filtered = activities.filter((x) => x.action?.toLowerCase()?.includes(search.toLowerCase()) || x.remarks?.toLowerCase()?.includes(search.toLowerCase()));

  return (
    <div
      className="
        rounded-2xl
        border
        bg-white
        p-6
      "
    >
      <h3
        className="
          mb-6
          text-lg
          font-semibold
        "
      >
        Activity Feed
      </h3>
      <div
        className="
    relative
    mb-6
  "
      >
        <Search
          className="
      absolute
      left-3
      top-1/2
      h-4
      w-4
      -translate-y-1/2
      text-muted-foreground
    "
        />

        <Input
          ref={searchRef}
          placeholder="Search activity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
      pl-10
      pr-10
    "
        />

        {search.length >= 2 && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              searchRef.current?.focus();
            }}
            className="
        absolute
    right-3
    top-1/2
    -translate-y-1/2
    text-xs
    font-medium
    text-[#8a79ab]
    hover:underline
      "   
          >
            <XCircle
              className="
         h-3
    w-3
    text-muted-foreground
    hover:text-red-500
    transition-colors
        "
            />
          </button>
        )}
      </div>
      <div
        className="
    mb-4
    text-sm
    text-muted-foreground
  "
      >
        Showing {filtered.length} activities
      </div>

      <ActivityTimeline activities={filtered} />
    </div>
  );
}
