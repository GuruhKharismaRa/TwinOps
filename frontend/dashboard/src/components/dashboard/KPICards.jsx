import { Card } from "@/components/ui/card"
import {
  ClipboardList,
  CheckCircle2,
  Truck,
  AlertTriangle,
} from "lucide-react"

import { motion } from "framer-motion"

export default function KPICards() {

  const cards = [
    {
      title: "Active Tasks",
      value: "124",
      icon: ClipboardList,
    },
    {
      title: "Completed Today",
      value: "1,024",
      icon: CheckCircle2,
    },
    {
      title: "Forklifts Online",
      value: "8",
      icon: Truck,
    },
    {
      title: "Realtime Alerts",
      value: "3",
      icon: AlertTriangle,
    },
  ]

  return (

    <div
      className="
      grid grid-cols-4 gap-6 w-full
    "
    >

      {cards.map((card) => {

        const Icon = card.icon

        return (

          <Card
            key={card.title}
            className="
            flex
            flex-col
            gap-6
            rounded-xl
            border
            bg-card
            py-6
            text-card-foreground
            shadow-sm
            px-6
          "
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-[#7c7692]">
                  {card.title}
                </p>

                <h2 className="
                mt-4
                text-5xl
                font-semibold
                tracking-tight
                text-[#2f2b3d]
              ">
                  {card.value}
                </h2>

              </div>

              <div
                className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#f5f2fb]
                text-[#8a79ab]
              "
              >
                <Icon size={20} />
              </div>

            </div>

          </Card>

        )
      })}

    </div>
  )
}