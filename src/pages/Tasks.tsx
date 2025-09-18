import { CheckSquare, Plus, Search, Filter, Settings, Target, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useTaskManager } from "../hooks/useTaskManager"

export function Tasks() {
  const { tasks, getTaskStatistics } = useTaskManager()
  const stats = getTaskStatistics()

  // Get recent tasks (last 5)
  const recentTasks = tasks
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .slice(0, 5)

  // Get tasks by difficulty
  const easyTasks = tasks.filter(task => task.difficulty === 'easy').length
  const mediumTasks = tasks.filter(task => task.difficulty === 'medium').length
  const hardTasks = tasks.filter(task => task.difficulty === 'hard').length

  // Get tasks by protocol (top 5)
  const protocolStats = tasks.reduce((acc, task) => {
    acc[task.protocol] = (acc[task.protocol] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topProtocols = Object.entries(protocolStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">
            Advanced task analytics and management tools
          </p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Quick Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks, protocols, or categories..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filter
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'done').reduce((sum, t) => sum + t.xpReward, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.completed} completed tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} of {stats.total} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Task Difficulty Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Task Difficulty Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Easy</span>
                </div>
                <span className="text-sm font-medium">{easyTasks} tasks</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Medium</span>
                </div>
                <span className="text-sm font-medium">{mediumTasks} tasks</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Hard</span>
                </div>
                <span className="text-sm font-medium">{hardTasks} tasks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Protocols */}
        <Card>
          <CardHeader>
            <CardTitle>Most Active Protocols</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProtocols.map(([protocol, count], index) => (
                <div key={protocol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <span className="text-sm">{protocol}</span>
                  </div>
                  <span className="text-sm font-medium">{count} tasks</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'done' ? 'bg-green-500' :
                    task.status === 'doing' ? 'bg-yellow-500' :
                    task.status === 'todo' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {task.protocol} • {task.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'done' ? 'bg-green-100 text-green-800' :
                    task.status === 'doing' ? 'bg-yellow-100 text-yellow-800' :
                    task.status === 'todo' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                  <span className="text-sm text-muted-foreground">+{task.xpReward} XP</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}