import {
      useState,
      useEffect
} from "react";
import socket from "@/services/websocket";
import { apiFetch } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow
} from "@/components/ui/table";
export default function RealtimeTaskTable() {
      // =========================================
      // STATE
      // =========================================
      const [tasks, setTasks] =
            useState([]);
      const [loading, setLoading] =
            useState(true);
      // =========================================
      // LOAD INITIAL TASKS
      // =========================================
      const loadTasks = async () => {
            setLoading(true);
            try {
                  const data =
                        await apiFetch(
                              "/task/list"
                        );
                  setTasks(data);
            } catch (error) {
                  console.error(
                        "Error fetching tasks:",
                        error
                  );
            } finally {
                  setLoading(false);
            }
      };
      // =========================================
      // INITIAL LOAD + WEBSOCKET
      // =========================================
      useEffect(() => {
            loadTasks();
            socket.onmessage = (event) => {
                  const data =
                        JSON.parse(
                              event.data
                        );
                  console.log(
                        "Realtime Event:",
                        data
                  );
                  // HANDLE ONLY TASK EVENT
                  if (
                        !data.event_type ||
                        !data.event_type.startsWith(
                              "warehouse.task"
                        )
                  ) {
                        return;
                  }
                  setTasks((prev) => {
                        // CHECK EXISTING TASK
                        const existingTask =
                              prev.find(
                                    (task) =>
                                          task.task_code ===
                                          data.task_code
                              );
                        // =================================
                        // UPDATE EXISTING TASK
                        // =================================
                        if (existingTask) {
                              return prev.map((task) => {
                                    if (
                                          task.task_code ===
                                          data.task_code
                                    ) {
                                          return {
                                                ...task,
                                                task_type:
                                                      data.task_type ||
                                                      task.task_type,
                                                status:
                                                      data.status ||
                                                      task.status,
                                                assigned_to:
                                                      data.operator ||
                                                      task.assigned_to
                                          };
                                    }
                                    return task;
                              });
                        }
                        // =================================
                        // ADD NEW TASK
                        // =================================
                        return [
                              ...prev,
                              {
                                    task_code:
                                          data.task_code,
                                    task_type:
                                          data.task_type || "-",
                                    status:
                                          data.status || "WAITING",
                                    assigned_to:
                                          data.operator || "-"
                              }
                        ];
                  });
            };
            return () => {
                  socket.onmessage = null;
            };
      }, []);
      // =========================================
      // STATUS BADGE
      // =========================================
      const getStatusVariant = (status) => {
            switch (status) {
                  case "WAITING":
                        return "secondary";
                  case "ASSIGNED":
                        return "default";
                  case "IN_PROGRESS":
                        return "outline";
                  case "COMPLETED":
                        return "secondary";
                  default:
                        return "secondary";
            }
      };
      // =========================================
      // LOADING SKELETON
      // =========================================
      if (loading) {
            return (
                  <Card className="p-6">
                        <div className="mb-6">
                              <Skeleton
                                    height={30}
                                    width={280}
                              />
                              <div className="mt-2">
                                    <Skeleton
                                          height={20}
                                          width={200}
                                    />
                              </div>
                        </div>
                        <div className="space-y-3">
                              <Skeleton height={40} />
                              <Skeleton height={40} />
                              <Skeleton height={40} />
                              <Skeleton height={40} />
                        </div>
                  </Card>
            );
      }
      // =========================================
      // MAIN UI
      // =========================================
      return (
            <Card className="
                  p-6
                  shadow-sm
                  border-zinc-200
            ">
                  {/* HEADER */}
                  <div className="
                        mb-6
                        flex
                        items-center
                        justify-between
                  ">
                        <div>
                              <h2 className="
                                    text-xl
                                    font-bold
                              ">
                                    Realtime Warehouse Tasks
                              </h2>
                              <p className="
                                    text-zinc-500
                                    text-sm
                              ">
                                    Live task orchestration
                              </p>
                        </div>
                        {/* REALTIME STATUS */}
                        <div className="
                              flex
                              items-center
                              gap-2
                        ">
                              <div className="
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-green-500
                                    animate-pulse
                              " />
                              <span className="
                                    text-sm
                                    text-zinc-500
                              ">
                                    Realtime Connected
                              </span>
                        </div>
                  </div>
                  {/* TABLE */}
                  <Table>
                        <TableHeader>
                              <TableRow>
                                    <TableHead>
                                          Task
                                    </TableHead>
                                    <TableHead>
                                          Type
                                    </TableHead>
                                    <TableHead>
                                          Status
                                    </TableHead>
                                    <TableHead>
                                          Operator
                                    </TableHead>
                              </TableRow>
                        </TableHeader>
                        <TableBody>
                              {
                                    tasks.map((task) => (
                                          <TableRow
                                                key={task.task_code}
                                          >
                                                <TableCell>
                                                      {task.task_code}
                                                </TableCell>
                                                <TableCell>
                                                      {task.task_type}
                                                </TableCell>
                                                <TableCell>
                                                      <Badge
                                                            variant={
                                                                  getStatusVariant(
                                                                        task.status
                                                                  )
                                                            }
                                                      >
                                                            {task.status}
                                                      </Badge>
                                                </TableCell>
                                                <TableCell>
                                                      {task.assigned_to}
                                                </TableCell>
                                          </TableRow>
                                    ))
                              }
                        </TableBody>
                  </Table>
            </Card>
      );
}