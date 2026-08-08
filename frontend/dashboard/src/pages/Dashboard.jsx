import {
  Routes,
  Route
} from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout"
import { Card } from "@/components/ui/card"
import KPICards from "@/components/dashboard/KPICards"
import RealtimeTaskTable from "@/components/dashboard/RealtimeTaskTable"
 
import HomePage from "@/pages/HomePage"
import ProfilePage from "@/pages/ProfilePage"
// export default function Dashboard() {
//   return (
//     <AppLayout>
//      <div className="w-full space-y-6">

//         <div className="w-full">
//           <KPICards />
//         </div>

//         <div className="w-full">
//           <RealtimeTaskTable />
//         </div>

//       </div>
//     </AppLayout>
//   )
// }


export default function Dashboard() {

  return (
    <AppLayout>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

      </Routes>
    </AppLayout>
  );
}