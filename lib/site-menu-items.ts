export interface FlowingMenuItem {
  link: string
  text: string
  image: string
}

/** Curated Unsplash images matched to each section theme */
export const siteMenuItems: FlowingMenuItem[] = [
  {
    link: "/about",
    text: "About",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  },
  {
    link: "/skills",
    text: "Skills",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80",
  },
  {
    link: "/projects",
    text: "Projects",
    image:
      "https://images.unsplash.com/photo-1555066931-436f8abb32?auto=format&fit=crop&w=800&q=80",
  },
  {
    link: "/experience",
    text: "Experience",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  },
  {
    link: "/blogs",
    text: "Writing",
    image:
      "https://images.unsplash.com/photo-1455390582240-0447851f2f93?auto=format&fit=crop&w=800&q=80",
  },
  {
    link: "/contact",
    text: "Contact",
    image:
      "https://images.unsplash.com/photo-1423666639042-f5600c500688?auto=format&fit=crop&w=800&q=80",
  },
]

export const projectFallbackImages: Record<string, string> = {
  soloscale:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
  more: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
}
