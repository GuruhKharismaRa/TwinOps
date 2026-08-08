import { ClipboardList, Boxes, User, Warehouse } from "lucide-react";

const getIcon = (module) => {
  switch (module) {
    case "TASK":
      return <ClipboardList className="h-4 w-4" />;

    case "INVENTORY":
      return <Boxes className="h-4 w-4" />;

    case "USER":
      return <User className="h-4 w-4" />;

    default:
      return <Warehouse className="h-4 w-4" />;
  }
};

const getBadgeColor = (module) => {
  switch (module) {
    case "TASK":
      return "bg-blue-100 text-blue-700";

    case "INVENTORY":
      return "bg-green-100 text-green-700";

    case "USER":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function ActivityTimeline({ activities }) {
  return (
    <div
      className="
        relative
        space-y-6
      "
    >
      {activities.map((item, index) => (
        <div
          key={index}
          className="
            relative
            flex
            gap-4
          "
        >
          {index !== activities.length - 1 && (
            <div
              className="
                absolute
                left-5
                top-10
                h-full
                w-px
                bg-border
              "
            />
          )}

          <div
            className="
              z-10
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-[#f4efff]
              text-[#8a79ab]
            "
          >
            {getIcon(item.module)}
          </div>

          <div
            className="
              flex-1
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div>
                <h4
                  className="
                    font-medium
                  "
                >
                  {item.action}
                </h4>

                <p
                  className="
                    mt-1
                    text-sm
                    text-muted-foreground
                  "
                >
                  {item.remarks}
                </p>
              </div>

              <span
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                {item.event_time}
              </span>
            </div>

            <div
              className="
                mt-2
              "
            >
              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-medium
                  ${getBadgeColor(item.module)}
                `}
              >
                {item.module}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
