import {
      useEffect,
      useState
} from "react";

import socket
      from "@/services/websocket";

import {
      Card
} from "@/components/ui/card";

import {
      motion
} from "framer-motion";

import {
      Clock3
} from "lucide-react";


export default function
      ActivityTimeline() {

      const [activities,
            setActivities] =
            useState([]);

      useEffect(() => {

            socket.onmessage =
                  (event) => {

                        const data =
                              JSON.parse(
                                    event.data
                              );

                        if (
                              !data.event_type
                        ) {

                              return;
                        }

                        const activity = {

                              id:
                                    Date.now(),

                              time:
                                    new Date()
                                          .toLocaleTimeString(),

                              message:
                                    generateMessage(
                                          data
                                    )
                        };

                        setActivities(
                              (prev) => [

                                    activity,

                                    ...prev
                              ].slice(0, 10)
                        );
                  };

            return () => {

                  socket.onmessage =
                        null;
            };

      }, []);

      // =====================================
      // GENERATE MESSAGE
      // =====================================

      const generateMessage =
            (data) => {

                  switch (
                  data.event_type
                  ) {

                        case
                              "warehouse.task.assigned":

                              return `
                    ${data.task_code}
                    assigned to
                    ${data.operator}
                `;

                        case
                              "warehouse.task.started":

                              return `
                    ${data.task_code}
                    started by
                    ${data.operator}
                `;

                        case
                              "warehouse.task.completed":

                              return `
                    ${data.task_code}
                    completed by
                    ${data.operator}
                `;

                        case
                              "warehouse.task.created":

                              return `
                    ${data.task_code}
                    created
                `;

                        default:

                              return `
                    ${data.event_type}
                `;
                  }
            };

      // =====================================
      // UI
      // =====================================

      return (

            <Card className="
            p-6
            mt-6
        ">

                  <div className="
                flex
                items-center
                gap-2
                mb-6
            ">

                        <Clock3
                              size={20}
                        />

                        <h2 className="
                    text-xl
                    font-bold
                ">

                              Realtime Activity

                        </h2>

                  </div>

                  <div className="
                space-y-4
            ">

                        {

                              activities.length === 0 && (

                                    <div className="
                            text-sm
                            text-zinc-500
                        ">

                                          Waiting for
                                          realtime activity...

                                    </div>
                              )
                        }

                        {

                              activities.map(
                                    (activity) => (

                                          <motion.div

                                                key={
                                                      activity.id
                                                }

                                                initial={{
                                                      opacity: 0,
                                                      x: -10
                                                }}

                                                animate={{
                                                      opacity: 1,
                                                      x: 0
                                                }}

                                                transition={{
                                                      duration: 0.2
                                                }}

                                                className="
                                flex
                                items-start
                                gap-3
                                border-l-2
                                border-lime-400
                                pl-4
                            "
                                          >

                                                <div className="
                                mt-1
                                w-2
                                h-2
                                rounded-full
                                bg-lime-500
                                animate-pulse
                            " />

                                                <div>

                                                      <div className="
                                    text-sm
                                    font-medium
                                ">

                                                            {
                                                                  activity.message
                                                            }

                                                      </div>

                                                      <div className="
                                    text-xs
                                    text-zinc-500
                                    mt-1
                                ">

                                                            {
                                                                  activity.time
                                                            }

                                                      </div>

                                                </div>

                                          </motion.div>
                                    ))
                        }

                  </div>

            </Card>
      );
}