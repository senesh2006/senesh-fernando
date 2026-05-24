export interface FlowingMenuItem {
  link: string
  text: string
  image: string
}

export const siteMenuItems: FlowingMenuItem[] = [
  { link: "/about", text: "About", image: "https://picsum.photos/seed/senesh-about/600/400" },
  { link: "/skills", text: "Skills", image: "https://picsum.photos/seed/senesh-skills/600/400" },
  { link: "/projects", text: "Projects", image: "https://picsum.photos/seed/senesh-projects/600/400" },
  { link: "/experience", text: "Experience", image: "https://picsum.photos/seed/senesh-exp/600/400" },
  { link: "/blogs", text: "Writing", image: "https://picsum.photos/seed/senesh-blog/600/400" },
  { link: "/contact", text: "Contact", image: "https://picsum.photos/seed/senesh-contact/600/400" },
]
