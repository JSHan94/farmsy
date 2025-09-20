import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "./ui/sidebar"
import { Home, Compass, Settings, BarChart3 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import styles from './AppSidebar.module.css'

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
  },
  {
    title: "Explore",
    icon: Compass,
    url: "/explore",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className={styles.sidebar}>
      <SidebarContent className={styles.sidebarContent}>
        {/* TossInvest-style Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.brandContainer}>
            <div className={styles.brandIcon}>
              <img src="/suimming.png" alt="Suimming" className="h-6 w-6" />
            </div>
            <h2 className={styles.brandTitle}>Suimming</h2>
          </div>
        </div>

        <SidebarGroup className={styles.menuGroup}>
          <SidebarGroupContent>
            <SidebarMenu className={styles.menu}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title} className={styles.menuItem}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`}
                      >
                        <div className={`${styles.menuIconWrapper} ${isActive ? styles.menuIconWrapperActive : ''}`}>
                          <item.icon className={styles.menuIcon} />
                        </div>
                        <span className={styles.menuText}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}