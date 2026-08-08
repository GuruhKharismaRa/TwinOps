import { Button } from "@/components/ui/button";
export default function ProfileTab({
  profile,
  onEdit,
  onChangePassword,
}) {
  const initials = profile.full_name
    ?.split(" ")
    ?.map((x) => x[0])
    ?.join("")
    ?.substring(0, 2);

  return (
    <div className="space-y-6">

      {/* Hero */}

      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <div className="flex items-center gap-6">

          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-2xl
              bg-purple-100
              text-2xl
              font-bold
            "
          >
            {initials}
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              {profile.full_name}
            </h2>

            <p className="text-muted-foreground">
              {profile.role_name}
            </p>

            <p className="text-sm text-muted-foreground">
              {profile.username}
            </p>
          </div>

          <div className="ml-auto flex gap-2">

            <Button
              onClick={onEdit}
              className="
              "
            >
              Edit Profile
            </Button>

            <Button
              onClick={onChangePassword}
              className="
              "
            >
              Change Password
            </Button>

          </div>

        </div>

      </div>

      {/* Info Grid */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border bg-white p-6">

          <h3 className="mb-4 text-lg font-semibold">
            Account Information
          </h3>

          <div className="space-y-4">

            <InfoRow
              label="Full Name"
              value={profile.full_name}
            />

            <InfoRow
              label="Username"
              value={profile.username}
            />

            <InfoRow
              label="Email"
              value={profile.email}
            />

            <InfoRow
              label="Phone"
              value={profile.phone || "-"}
            />

          </div>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <h3 className="mb-4 text-lg font-semibold">
            Notification Channels
          </h3>

          <div className="space-y-3">

            <ChannelCard
              title="Email"
              value={profile.email}
            />

            <ChannelCard
              title="Telegram"
              value="Not Connected"
            />

          </div>

        </div>

      </div>

      {/* Warehouse */}

      <div className="rounded-2xl border bg-white p-6">

        <h3 className="mb-4 text-lg font-semibold">
          Warehouse Access
        </h3>

        <div className="flex flex-wrap gap-2">

          {profile.warehouses?.map((w) => (
            <span
              key={w}
              className="
                rounded-lg
                bg-purple-100
                px-3
                py-1
                text-sm
              "
            >
              {w}
            </span>
          ))}

        </div>

      </div>

    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">
        {label}
      </div>

      <div className="font-medium">
        {value}
      </div>
    </div>
  );
}

function ChannelCard({ title, value }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="font-medium">{title}</div>

      <div className="text-sm text-muted-foreground">
        {value}
      </div>
    </div>
  );
}