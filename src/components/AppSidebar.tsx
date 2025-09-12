import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "./ui/sidebar"
import { Home, CheckSquare, Settings, BarChart3 } from "lucide-react"
import styles from './AppSidebar.module.css'

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "#",
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    url: "#",
    isActive: true,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "#",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#",
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className={styles.sidebarHeader}>
          <h2>TaskTracker</h2>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.url} className={styles.menuLink}>
                      <item.icon className={styles.menuIcon} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}