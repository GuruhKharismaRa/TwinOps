import { useEffect, useState } from "react";

export default function MyTasksTab() {
      const [tasks, setTasks] = useState([]);
      useEffect(() => {
            loadMyTasks();
  }, []);
    const loadMyTasks = async () => {
    const token = localStorage.getItem("access_token");

    const response = await fetch("http://localhost:8001/auth/my-tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    setTasks(result.data || []);
  };
 
  return (
    <div className="rounded-2xl border bg-white p-6">

      <h3 className="mb-4 text-lg font-semibold">
        My Tasks
      </h3>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="py-2 text-left">
              Task
            </th>

            <th className="text-left">
              Type
            </th>

            <th className="text-left">
              Status
            </th>

          </tr>

        </thead>

        <tbody>
            {tasks.map((item, index) => (
            <tr>
            <td className="py-3">
               {item.task_code}
            </td>

            <td>
               {item.task_type}
            </td>

            <td>
             {item.status}
            </td>
          </tr>            
            ))}

        </tbody>

      </table>

    </div>
  );
}