import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Activity, ClipboardList } from "lucide-react";
import ProfileTab from "@/components/profile/ProfileTab";
import ActivityTab from "@/components/profile/ActivityTab";
import MyTasksTab from "@/components/profile/MyTasksTab";

import { toast } from "sonner";
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  // const [openEdit, setOpenEdit] = useState(false);

  // const [openPassword, setOpenPassword] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [openEditPassword, setOpenPassword] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://localhost:8001/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      setProfile(result.data);

      setForm({
        full_name: result.data.full_name || "",

        email: result.data.email || "",

        phone: result.data.phone || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  const initials = profile.full_name
    ?.split(" ")
    ?.map((x) => x[0])
    ?.join("")
    ?.substring(0, 2);

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://localhost:8001/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.status === "success") {
        await loadProfile();
        setOpenEdit(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold">User Profile</h1>

        <p className="text-gray-500">Manage your account information</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className=" inline-flex h-auto rounded-2xl border bg-white p-2 shadow-sm gap-2">
          <TabsTrigger value="profile" className=" rounded-xl px-6 py-3 text-sm font-medium data-[state=active]:bg-[#8a79ab] data-[state=active]:text-white data-[state=active]:shadow-sm">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>

          <TabsTrigger
            value="activity"
            className="
    rounded-xl
    px-6
    py-3
    text-sm
    font-medium
    data-[state=active]:bg-[#8a79ab]
    data-[state=active]:text-white
  "
          >
            <Activity className="h-4 w-4 mr-2" />
            Activity
            <Badge variant="secondary" className="ml-2">
              12
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="tasks"
            className="
    rounded-xl
    px-6
    py-3
    text-sm
    font-medium
    data-[state=active]:bg-[#8a79ab]
    data-[state=active]:text-white
  "
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            My Tasks{" "}
            <Badge variant="secondary" className="ml-2">
              5
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab profile={profile} onEdit={() => setOpenEdit(true)} openEditPassword={() => setOpenPassword(true)} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTab />
        </TabsContent>

        <TabsContent value="tasks">
          <MyTasksTab />
        </TabsContent>
      </Tabs>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent
          className="w-[95vw] max-w-[420px] p-0 overflow-hidden">
          <DialogHeader
            className="
 px-6
 pt-6
 pb-2
 "
          >
            <DialogTitle>Edit Profile</DialogTitle>

            <DialogDescription>Update your account information</DialogDescription>
          </DialogHeader>

          <div
            className="
    px-6
    py-4
    space-y-4
  "
          >
            <div className="space-y-2">
              <Label>Full Name</Label>

              <Input
                value={form.full_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    full_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>

              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter
            className="
    px-6
    py-4
    border-t
    flex-row
    justify-end
    gap-2
  "
          >
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>

            <Button onClick={saveProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEditPassword} onOpenChange={setOpenPassword}>
        <DialogContent
          className="w-[95vw] max-w-[420px] p-0 overflow-hidden">
          <DialogHeader
            className="
 px-6
 pt-6
 pb-2
 "
          >
            <DialogTitle>Change Password</DialogTitle>

            <DialogDescription>Update your account information</DialogDescription>
          </DialogHeader>

          <div
            className="
    px-6
    py-4
    space-y-4
  "
          >
            <div className="space-y-2">
              <Label>Full Name</Label>

              <Input
                value={form.full_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    full_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>

              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter
            className="
    px-6
    py-4
    border-t
    flex-row
    justify-end
    gap-2
  "
          >
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>

            <Button onClick={saveProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
