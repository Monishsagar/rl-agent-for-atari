"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface GameCardProps {
  name: string
  description: string
  difficulty: string
  actionSpace: string[]
  image: string
  delay?: number
}

export function GameCard({ name, description, difficulty, actionSpace, image, delay = 0 }: GameCardProps) {
  const difficultyColor = {
    Easy: "bg-accent text-accent-foreground",
    Medium: "bg-chart-3 text-background",
    Hard: "bg-destructive text-destructive-foreground",
  }[difficulty] || "bg-secondary text-secondary-foreground"

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="group relative overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="aspect-video w-full overflow-hidden bg-secondary">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{name}</CardTitle>
            <Badge className={difficultyColor}>{difficulty}</Badge>
          </div>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Action Space</p>
            <div className="flex flex-wrap gap-1">
              {actionSpace.map((action) => (
                <Badge key={action} variant="outline" className="text-xs">
                  {action}
                </Badge>
              ))}
            </div>
          </div>
          <Link href={`/train?game=${name.toLowerCase().replace(" ", "-")}`}>
            <Button className="w-full gap-2" variant="secondary">
              Configure Training
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
