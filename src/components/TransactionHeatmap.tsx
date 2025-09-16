import styles from "./TransactionHeatmap.module.css"

interface TransactionItem {
  id: string
  title: string
  description: string
  amount: string
  date: string
  type: "income" | "expense"
  timestamp: Date
}

interface TransactionHeatmapProps {
  transactions: TransactionItem[]
}

function generateHeatmapData(transactions: TransactionItem[]) {
  const today = new Date()
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate() + 1)
  const heatmapData: { [key: string]: number } = {}

  // Initialize all dates with 0 for exactly one year
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]
    heatmapData[dateStr] = 0
  }

  // Count transactions per day
  transactions.forEach((transaction) => {
    const dateStr = transaction.timestamp.toISOString().split("T")[0]
    if (heatmapData[dateStr] !== undefined) {
      heatmapData[dateStr]++
    }
  })

  return heatmapData
}

export function TransactionHeatmap({ transactions }: TransactionHeatmapProps) {
  const heatmapData = generateHeatmapData(transactions)
  const today = new Date()
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate() + 1)

  // Start from Sunday of the week containing oneYearAgo
  const startDate = new Date(oneYearAgo)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  // End on Saturday of the week containing today
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  // Generate weeks array (Sunday to Saturday)
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    currentWeek.push(new Date(d))

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  const getIntensity = (count: number) => {
    if (count === 0) return 0
    if (count <= 2) return 1
    if (count <= 4) return 2
    if (count <= 6) return 3
    return 4
  }

  // Generate month labels - only show at month boundaries
  const generateMonthLabels = () => {
    const labels: { text: string; weekIndex: number }[] = []
    let currentMonth = -1

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0]
      if (firstDay && firstDay.getMonth() !== currentMonth) {
        currentMonth = firstDay.getMonth()
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        labels.push({
          text: monthNames[currentMonth],
          weekIndex
        })
      }
    })

    return labels
  }

  const monthLabels = generateMonthLabels()

  return (
    <div className={styles.heatmapContainer}>
      <h3 className={styles.heatmapTitle}>Transaction Activity</h3>
      <div className={styles.heatmap}>
        <div className={styles.heatmapGrid}>
          <div className={styles.dayLabels}>
            {["Mon", "Wed", "Fri"].map((day) => (
              <span key={day} className={styles.dayLabel}>
                {day}
              </span>
            ))}
          </div>
          <div className={styles.heatmapContent}>
            <div className={styles.monthLabelsRow}>
              {weeks.map((_, weekIndex) => {
                const label = monthLabels.find(l => l.weekIndex === weekIndex)
                return (
                  <div key={weekIndex} className={styles.monthLabelCell}>
                    {label ? label.text : ''}
                  </div>
                )
              })}
            </div>
            <div className={styles.heatmapWeeks}>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className={styles.week}>
                  {week.map((date, dayIndex) => {
                    const dateStr = date.toISOString().split("T")[0]
                    const count = heatmapData[dateStr] || 0
                    const intensity = getIntensity(count)
                    const isInRange = date >= oneYearAgo && date <= today

                    return (
                      <div
                        key={dayIndex}
                        className={`${styles.day} ${isInRange ? styles[`intensity${intensity}`] : styles.emptyDay}`}
                        title={isInRange ? `${date.toLocaleDateString()}: ${count} transactions` : ''}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.heatmapLegend}>
          <span className={styles.legendText}>Less</span>
          <div className={styles.legendColors}>
            {[0, 1, 2, 3, 4].map((intensity) => (
              <div key={intensity} className={`${styles.legendColor} ${styles[`intensity${intensity}`]}`} />
            ))}
          </div>
          <span className={styles.legendText}>More</span>
        </div>
      </div>
    </div>
  )
}