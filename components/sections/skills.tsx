"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Reveal } from "@/components/reveal"
import { Code, Server, Database, Layout, Loader2, AlertCircle } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface SkillCategory {
  id: string
  category: string
  skill_list: string[]
}

const categoryIcons: Record<string, typeof Code> = {
  Languages: Code,
  Frontend: Layout,
  Backend: Server,
  Database: Database,
}

export function SkillsSection() {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("/api/skills")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setSkillCategories(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load skills")
      } finally {
        setIsLoading(false)
      }
    }
    fetchSkills()
  }, [])

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-20 bg-background">
      <div className="max-w-[900px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-4 text-foreground">
              Skills
            </h1>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Expand each category to explore my technical toolkit.
            </p>
          </div>
        </Reveal>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 flex flex-col items-center gap-2">
            <AlertCircle />
            <span>{error}</span>
          </div>
        ) : skillCategories.length === 0 ? (
          <div className="text-center text-foreground-muted py-20">No skills added yet.</div>
        ) : (
          <Reveal delay={100}>
            <Accordion
              type="single"
              collapsible
              defaultValue={skillCategories[0]?.id}
              className="space-y-3"
            >
              {skillCategories.map((skillGroup, index) => {
                const Icon = categoryIcons[skillGroup.category] || Code
                return (
                  <motion.div
                    key={skillGroup.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                  >
                    <AccordionItem
                      value={skillGroup.id}
                      className="glass-card border border-primary/10 rounded-2xl px-6 overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-[0_0_30px_rgba(255,106,0,0.08)] transition-all duration-300"
                    >
                      <AccordionTrigger className="hover:no-underline py-5">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-foreground text-base">
                              {skillGroup.category}
                            </span>
                            <p className="text-xs text-foreground-muted mt-0.5">
                              {skillGroup.skill_list?.length ?? 0} skills
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-5">
                        <div className="flex flex-wrap gap-2 pt-2">
                          {skillGroup.skill_list?.map((skill, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.03 }}
                              className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                )
              })}
            </Accordion>
          </Reveal>
        )}
      </div>
    </section>
  )
}
