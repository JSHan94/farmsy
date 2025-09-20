import { useState, useMemo } from "react"
import { BarChart3, TrendingUp, Target, Clock, Award, Calendar, Activity, Star, Zap, Shield, Coins, Heart, Users2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useTaskManager } from "../hooks/useTaskManager"
import { useXPSystem } from "../components/XPProgressBar"
import { getAllProtocols } from "../utils/blockchain"
import styles from './Analytics.module.css'

const protocolConfig = getAllProtocols()

export function Analytics() {
  const { tasks, getTaskStatistics } = useTaskManager()
  const { currentXP, currentLevel, xpForNextLevel } = useXPSystem(150, 2)
  const [timeRange, setTimeRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('overview')

  const stats = getTaskStatistics()

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const protocolStats = Object.keys(protocolConfig).reduce((acc, protocol) => {
      const protocolTasks = tasks.filter(task => task.protocol === protocol)
      const completed = protocolTasks.filter(task => task.status === 'done').length
      acc[protocol] = {
        total: protocolTasks.length,
        completed,
        completionRate: protocolTasks.length > 0 ? Math.round((completed / protocolTasks.length) * 100) : 0,
        xpEarned: protocolTasks
          .filter(task => task.status === 'done')
          .reduce((sum, task) => sum + (task.xpReward || 0), 0)
      }
      return acc
    }, {} as Record<string, any>)

    const categoryStats = tasks.reduce((acc, task) => {
      const category = task.category || 'other'
      if (!acc[category]) {
        acc[category] = { total: 0, completed: 0, xpEarned: 0 }
      }
      acc[category].total++
      if (task.status === 'done') {
        acc[category].completed++
        acc[category].xpEarned += task.xpReward || 0
      }
      return acc
    }, {} as Record<string, any>)

    const difficultyStats = {
      easy: tasks.filter(task => task.difficulty === 'easy'),
      medium: tasks.filter(task => task.difficulty === 'medium'),
      hard: tasks.filter(task => task.difficulty === 'hard')
    }

    const recentCompletions = tasks
      .filter(task => task.status === 'done')
      .slice(-10)
      .reverse()

    const totalXpEarned = tasks
      .filter(task => task.status === 'done')
      .reduce((sum, task) => sum + (task.xpReward || 0), 0)

    // Activity breakdown for pie charts
    const protocolXP = Object.values(protocolStats).reduce((sum: number, stats: any) => sum + stats.xpEarned, 0)
    const irlXP = Math.floor(totalXpEarned * 0.2) // Placeholder for IRL activities
    const socialXP = Math.floor(totalXpEarned * 0.15) // Placeholder for Social activities

    const activityStats = {
      protocol: Math.max(protocolXP, totalXpEarned * 0.65), // Ensure some protocol activity for demo
      irl: Math.max(irlXP, totalXpEarned * 0.2),
      social: Math.max(socialXP, totalXpEarned * 0.15)
    }

    return {
      protocolStats,
      categoryStats,
      difficultyStats,
      recentCompletions,
      totalXpEarned,
      activityStats
    }
  }, [tasks])

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Time Range Filter */}
        <div className={styles.controlsSection}>
          <div className={styles.filterContainer}>
            <span className={styles.filterLabel}>Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className={styles.filterSelect}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className={styles.tabsContainer}>
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="overview" className={styles.tabTrigger}>
              <BarChart3 className={styles.tabIcon} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="protocols" className={styles.tabTrigger}>
              <Target className={styles.tabIcon} />
              Protocols
            </TabsTrigger>
            <TabsTrigger value="progress" className={styles.tabTrigger}>
              <TrendingUp className={styles.tabIcon} />
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className={styles.tabContent}>
            <div className={styles.contentWrapper}>
              {/* Top Row: Task History & Character Evolution */}
              <div className={styles.topRowGrid}>
                {/* Task History by Category */}
                <Card className={styles.historyCard}>
                  <CardHeader className={styles.historyHeader}>
                    <div className={styles.historyHeaderContent}>
                      <div className={styles.historyIconWrapper}>
                        <Activity className={styles.historyIcon} />
                      </div>
                      <div>
                        <CardTitle className={styles.historyTitle}>Task History</CardTitle>
                        <p className={styles.historySubtitle}>Completed tasks by category</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={styles.historyContent}>
                    <div className={styles.categoryGrid}>
                      {Object.entries(analyticsData.categoryStats).map(([category, stats]) => {
                        const categoryIcon = {
                          lending: Coins,
                          dex: TrendingUp,
                          staking: Shield,
                          farming: Star,
                          trading: BarChart3,
                          other: Target
                        }[category] || Target
                        const IconComponent = categoryIcon

                        return (
                          <div key={category} className={styles.categoryItem}>
                            <div className={styles.categoryHeader}>
                              <div className={styles.categoryIconWrapper}>
                                <IconComponent className={styles.categoryIcon} />
                              </div>
                              <div className={styles.categoryInfo}>
                                <h4 className={styles.categoryName}>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                                <p className={styles.categorySubtext}>{stats.completed} / {stats.total} completed</p>
                              </div>
                            </div>
                            <div className={styles.categoryStats}>
                              <div className={styles.categoryXp}>
                                <Award className={styles.categoryXpIcon} />
                                <span>{stats.xpEarned} XP</span>
                              </div>
                              <div className={styles.categoryProgress}>
                                <div
                                  className={styles.categoryProgressBar}
                                  style={{ width: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Character Evolution Card */}
                <Card className={styles.characterCard}>
                  <CardHeader className={styles.characterHeader}>
                    <div className={styles.characterHeaderContent}>
                      <div className={styles.characterIconWrapper}>
                        <Star className={styles.characterIcon} />
                      </div>
                      <div>
                        <CardTitle className={styles.characterTitle}>Your Character</CardTitle>
                        <p className={styles.characterSubtitle}>Level {currentLevel} Adventurer</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={styles.characterContent}>
                    <div className={styles.characterImage}>
                      {/* Placeholder image - user will replace with custom slime */}
                      <div className={styles.slimePlaceholder}>
                        <div className={styles.slimeBody}>
                          <div className={styles.slimeEyes}>
                            <div className={styles.slimeEye}></div>
                            <div className={styles.slimeEye}></div>
                          </div>
                          <div className={styles.slimeMouth}></div>
                        </div>
                        <div className={styles.slimeShine}></div>
                      </div>
                      <div className={styles.levelBadgeContainer}>
                        <div className={styles.levelBadgeOverlay}>Lv. {currentLevel}</div>
                      </div>
                    </div>
                    <div className={styles.characterProgress}>
                      <div className={styles.xpDisplay}>
                        <Zap className={styles.xpIcon} />
                        <span className={styles.xpText}>{currentXP} / {currentXP + xpForNextLevel} XP</span>
                      </div>
                      <div className={styles.xpProgressBar}>
                        <div
                          className={styles.xpProgressFill}
                          style={{
                            width: `${Math.max(0, Math.min(100, (currentXP / (currentXP + xpForNextLevel)) * 100))}%`
                          }}
                        />
                      </div>
                      <p className={styles.nextLevelText}>{xpForNextLevel} XP to level {currentLevel + 1}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Analytics - Interactive Pie Charts */}
              <Card className={styles.analyticsCard}>
                <CardHeader className={styles.analyticsHeader}>
                  <div className={styles.analyticsHeaderContent}>
                    <div className={styles.analyticsIconWrapper}>
                      <BarChart3 className={styles.analyticsIcon} />
                    </div>
                    <div>
                      <CardTitle className={styles.analyticsTitle}>Activity Analytics</CardTitle>
                      <p className={styles.analyticsSubtitle}>Your engagement across different activities</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className={styles.analyticsContent}>
                  <div className={styles.chartsContainer}>
                    <h4 className={styles.chartTitle}>Activity Distribution</h4>
                    <p className={styles.chartSubtitle}>Hover over "Protocol" to see detailed breakdown</p>
                    <div className={styles.pieChartContainer}>
                      <ActivityPieChart data={analyticsData.activityStats} protocolStats={analyticsData.protocolStats} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Key Metrics Cards */}
              <div className={styles.metricsGrid}>
                <Card className={styles.metricCard}>
                  <CardContent className={styles.metricContent}>
                    <div className={styles.metricHeader}>
                      <div className={styles.metricIconWrapper}>
                        <Target className={styles.metricIcon} />
                      </div>
                      <TrendingUp className={styles.trendIcon} />
                    </div>
                    <div className={styles.metricData}>
                      <p className={styles.metricLabel}>Total Tasks</p>
                      <p className={styles.metricValue}>{stats.total}</p>
                      <p className={styles.metricSubtext}>Across all protocols</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className={styles.metricCard}>
                  <CardContent className={styles.metricContent}>
                    <div className={styles.metricHeader}>
                      <div className={styles.metricIconWrapper}>
                        <Activity className={styles.metricIcon} />
                      </div>
                      <span className={styles.successBadge}>+{stats.completed}</span>
                    </div>
                    <div className={styles.metricData}>
                      <p className={styles.metricLabel}>Completed</p>
                      <p className={styles.metricValue}>{stats.completed}</p>
                      <p className={styles.metricSubtext}>{stats.completionRate}% completion rate</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className={styles.metricCard}>
                  <CardContent className={styles.metricContent}>
                    <div className={styles.metricHeader}>
                      <div className={styles.metricIconWrapper}>
                        <Clock className={styles.metricIcon} />
                      </div>
                      <span className={styles.warningBadge}>{stats.inProgress}</span>
                    </div>
                    <div className={styles.metricData}>
                      <p className={styles.metricLabel}>In Progress</p>
                      <p className={styles.metricValue}>{stats.inProgress}</p>
                      <p className={styles.metricSubtext}>Active tasks</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className={styles.metricCard}>
                  <CardContent className={styles.metricContent}>
                    <div className={styles.metricHeader}>
                      <div className={styles.metricIconWrapper}>
                        <Award className={styles.metricIcon} />
                      </div>
                      <span className={styles.levelBadge}>Lv.{currentLevel}</span>
                    </div>
                    <div className={styles.metricData}>
                      <p className={styles.metricLabel}>Current XP</p>
                      <p className={styles.metricValue}>{currentXP}</p>
                      <p className={styles.metricSubtext}>{xpForNextLevel} to next level</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Task Difficulty Breakdown */}
              <div className={styles.sectionGrid}>
                <Card className={styles.sectionCard}>
                  <CardHeader className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderContent}>
                      <div className={styles.sectionIconWrapper}>
                        <BarChart3 className={styles.sectionIcon} />
                      </div>
                      <div>
                        <CardTitle className={styles.sectionTitle}>Task Difficulty</CardTitle>
                        <p className={styles.sectionSubtitle}>Distribution by difficulty level</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={styles.difficultyContent}>
                    {Object.entries(analyticsData.difficultyStats).map(([difficulty, tasks]) => {
                      const completed = tasks.filter((task: any) => task.status === 'done').length
                      const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
                      return (
                        <div key={difficulty} className={styles.difficultyItem}>
                          <div className={styles.difficultyInfo}>
                            <div className={`${styles.difficultyDot} ${styles[`difficulty${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`]}`} />
                            <span className={styles.difficultyLabel}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                            <span className={styles.difficultyCount}>({tasks.length})</span>
                          </div>
                          <div className={styles.difficultyProgress}>
                            <div
                              className={`${styles.difficultyProgressBar} ${styles[`difficulty${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`]}`}
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <span className={styles.difficultyRate}>{completionRate}%</span>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Recent Completions */}
                <Card className={styles.sectionCard}>
                  <CardHeader className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderContent}>
                      <div className={styles.sectionIconWrapper}>
                        <Calendar className={styles.sectionIcon} />
                      </div>
                      <div>
                        <CardTitle className={styles.sectionTitle}>Recent Completions</CardTitle>
                        <p className={styles.sectionSubtitle}>Latest completed tasks</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={styles.completionsContent}>
                    {analyticsData.recentCompletions.length > 0 ? (
                      analyticsData.recentCompletions.slice(0, 5).map((task: any) => (
                        <div key={task.id} className={styles.completionItem}>
                          <div className={styles.completionInfo}>
                            <div
                              className={styles.completionDot}
                              style={{
                                backgroundColor: protocolConfig[task.protocol]?.brandColor || '#gray'
                              }}
                            />
                            <div>
                              <h3 className={styles.completionTitle}>{task.title}</h3>
                              <p className={styles.completionProtocol}>{task.protocol}</p>
                            </div>
                          </div>
                          <div className={styles.completionReward}>
                            <Award className={styles.completionXpIcon} />
                            <span>+{task.xpReward || 0}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>
                        <Activity className={styles.emptyIcon} />
                        <p>No completed tasks yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Protocols Tab */}
          <TabsContent value="protocols" className={styles.tabContent}>
            <div className={styles.contentWrapper}>
              <div className={styles.protocolsGrid}>
                {Object.entries(analyticsData.protocolStats).map(([protocol, stats]) => (
                  <Card key={protocol} className={styles.protocolCard}>
                    <CardContent className={styles.protocolContent}>
                      <div className={styles.protocolHeader}>
                        <div
                          className={styles.protocolIcon}
                          style={{
                            backgroundColor: protocolConfig[protocol]?.brandColor || '#gray'
                          }}
                        />
                        <div>
                          <h3 className={styles.protocolName}>{protocol}</h3>
                          <p className={styles.protocolCategory}>{protocolConfig[protocol]?.category || 'Protocol'}</p>
                        </div>
                      </div>
                      <div className={styles.protocolStats}>
                        <div className={styles.protocolStat}>
                          <span className={styles.protocolStatValue}>{stats.total}</span>
                          <span className={styles.protocolStatLabel}>Total Tasks</span>
                        </div>
                        <div className={styles.protocolStat}>
                          <span className={styles.protocolStatValue}>{stats.completed}</span>
                          <span className={styles.protocolStatLabel}>Completed</span>
                        </div>
                        <div className={styles.protocolStat}>
                          <span className={styles.protocolStatValue}>{stats.xpEarned}</span>
                          <span className={styles.protocolStatLabel}>XP Earned</span>
                        </div>
                      </div>
                      <div className={styles.protocolProgress}>
                        <div className={styles.protocolProgressTrack}>
                          <div
                            className={styles.protocolProgressBar}
                            style={{
                              width: `${stats.completionRate}%`,
                              backgroundColor: protocolConfig[protocol]?.brandColor || '#gray'
                            }}
                          />
                        </div>
                        <span className={styles.protocolProgressLabel}>{stats.completionRate}% complete</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className={styles.tabContent}>
            <div className={styles.contentWrapper}>
              <div className={styles.progressSection}>
                <Card className={styles.progressCard}>
                  <CardHeader className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderContent}>
                      <div className={styles.sectionIconWrapper}>
                        <TrendingUp className={styles.sectionIcon} />
                      </div>
                      <div>
                        <CardTitle className={styles.sectionTitle}>XP Progress</CardTitle>
                        <p className={styles.sectionSubtitle}>Your level advancement journey</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={styles.progressCardContent}>
                    <div className={styles.levelInfo}>
                      <div className={styles.currentLevel}>
                        <span className={styles.levelNumber}>{currentLevel}</span>
                        <span className={styles.levelLabel}>Current Level</span>
                      </div>
                      <div className={styles.xpInfo}>
                        <span className={styles.currentXp}>{currentXP} XP</span>
                        <span className={styles.nextLevelXp}>{xpForNextLevel} XP to next level</span>
                      </div>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${Math.max(0, Math.min(100, (currentXP / (currentXP + xpForNextLevel)) * 100))}%`
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Interactive Pie Chart Components
interface ActivityPieChartProps {
  data: {
    protocol: number
    irl: number
    social: number
  }
  protocolStats: Record<string, any>
}

function ActivityPieChart({ data, protocolStats }: ActivityPieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  const [showProtocolDetail, setShowProtocolDetail] = useState(false)

  const total = data.protocol + data.irl + data.social
  const segments = [
    { name: 'Protocol', value: data.protocol, color: '#3b82f6', percentage: Math.round((data.protocol / total) * 100) },
    { name: 'IRL', value: data.irl, color: '#10b981', percentage: Math.round((data.irl / total) * 100) },
    { name: 'Social', value: data.social, color: '#f59e0b', percentage: Math.round((data.social / total) * 100) }
  ]

  const handleMouseEnter = (segmentName: string) => {
    setHoveredSegment(segmentName)
    if (segmentName === 'Protocol') {
      setShowProtocolDetail(true)
    }
  }

  const handleMouseLeave = () => {
    setHoveredSegment(null)
    setShowProtocolDetail(false)
  }

  if (total === 0) {
    return (
      <div className={styles.emptyChart}>
        <Activity className={styles.emptyChartIcon} />
        <p>No activity data yet</p>
      </div>
    )
  }

  return (
    <div className={styles.chartsWrapper}>
      {/* Main Activity Chart */}
      <div className={styles.pieChart}>
        <svg viewBox="0 0 200 200" className={styles.pieSvg}>
          {segments.map((segment, index) => {
            const startAngle = segments.slice(0, index).reduce((sum, s) => sum + (s.value / total) * 360, 0)
            const endAngle = startAngle + (segment.value / total) * 360
            const isHovered = hoveredSegment === segment.name

            return (
              <PieSlice
                key={segment.name}
                startAngle={startAngle}
                endAngle={endAngle}
                color={segment.color}
                isHovered={isHovered}
                onMouseEnter={() => handleMouseEnter(segment.name)}
                onMouseLeave={handleMouseLeave}
              />
            )
          })}
        </svg>
        <div className={styles.chartLegend}>
          {segments.map((segment) => (
            <div
              key={segment.name}
              className={styles.legendItem}
              onMouseEnter={() => handleMouseEnter(segment.name)}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer' }}
            >
              <div
                className={styles.legendColor}
                style={{ backgroundColor: segment.color }}
              />
              <span className={styles.legendLabel}>{segment.name}</span>
              <span className={styles.legendValue}>{segment.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Detail Chart - Shows when Protocol is hovered */}
      {showProtocolDetail && (
        <div className={styles.protocolDetailChart}>
          <h4 className={styles.chartTitle}>Protocol Breakdown</h4>
          <ProtocolPieChart data={protocolStats} />
        </div>
      )}
    </div>
  )
}

interface ProtocolPieChartProps {
  data: Record<string, any>
}

function ProtocolPieChart({ data }: ProtocolPieChartProps) {
  const allProtocols = getAllProtocols()
  const protocolData = Object.entries(data)
    .filter(([_, stats]) => stats.xpEarned > 0)
    .map(([protocol, stats]) => ({
      name: protocol,
      value: stats.xpEarned,
      color: allProtocols[protocol]?.brandColor || '#6b7280'
    }))

  // Add demo data if no real data exists
  if (protocolData.length === 0) {
    const demoProtocols = ['Sui', 'DeepBook', 'Scallop']
    const demoData = demoProtocols.map((protocol, index) => ({
      name: protocol,
      value: 20 + (index * 15),
      color: allProtocols[protocol]?.brandColor || ['#3b82f6', '#10b981', '#f59e0b'][index]
    }))
    protocolData.push(...demoData)
  }

  const total = protocolData.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    return (
      <div className={styles.emptyChart}>
        <Target className={styles.emptyChartIcon} />
        <p>No protocol activity yet</p>
      </div>
    )
  }

  return (
    <div className={styles.pieChart}>
      <svg viewBox="0 0 200 200" className={styles.pieSvg}>
        {protocolData.map((protocol, index) => {
          const startAngle = protocolData.slice(0, index).reduce((sum, p) => sum + (p.value / total) * 360, 0)
          const endAngle = startAngle + (protocol.value / total) * 360

          return (
            <PieSlice
              key={protocol.name}
              startAngle={startAngle}
              endAngle={endAngle}
              color={protocol.color}
              isHovered={false}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            />
          )
        })}
      </svg>
      <div className={styles.chartLegend}>
        {protocolData.map((protocol) => (
          <div key={protocol.name} className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: protocol.color }}
            />
            <span className={styles.legendLabel}>{protocol.name}</span>
            <span className={styles.legendValue}>{Math.round((protocol.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface PieSliceProps {
  startAngle: number
  endAngle: number
  color: string
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function PieSlice({ startAngle, endAngle, color, isHovered, onMouseEnter, onMouseLeave }: PieSliceProps) {
  const centerX = 100
  const centerY = 100
  const radius = isHovered ? 85 : 80

  const startAngleRad = (startAngle - 90) * (Math.PI / 180)
  const endAngleRad = (endAngle - 90) * (Math.PI / 180)

  const x1 = centerX + radius * Math.cos(startAngleRad)
  const y1 = centerY + radius * Math.sin(startAngleRad)
  const x2 = centerX + radius * Math.cos(endAngleRad)
  const y2 = centerY + radius * Math.sin(endAngleRad)

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

  const pathData = [
    `M ${centerX} ${centerY}`,
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    'Z'
  ].join(' ')

  return (
    <path
      d={pathData}
      fill={color}
      stroke="white"
      strokeWidth="2"
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        filter: isHovered ? 'brightness(1.1)' : 'none'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
}