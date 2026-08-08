import KPICards from "@/components/dashboard/KPICards";
import RealtimeTaskTable from "@/components/dashboard/RealtimeTaskTable";

export default function HomePage() {

  return (
    <div className="w-full space-y-6">

     
         <div className="w-full">
           <KPICards />
         </div>

         <div className="w-full">
           <RealtimeTaskTable />
         </div>

    </div>
  );

}