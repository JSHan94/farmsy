import { CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, QrCode } from "lucide-react"
import { TransactionHeatmap } from "../components/TransactionHeatmap"
import styles from "./Analytics.module.css"

interface AccountItem {
  id: string
  title: string
  description?: string
  balance: string
  type: "savings" | "checking" | "investment" | "debt"
}

interface TransactionItem {
  id: string
  title: string
  description: string
  amount: string
  date: string
  type: "income" | "expense"
  timestamp: Date
}

const ACCOUNTS: AccountItem[] = [
  {
    id: "1",
    title: "Main Savings",
    description: "Personal savings",
    balance: "$8,459.45",
    type: "savings",
  },
  {
    id: "2",
    title: "Checking Account",
    description: "Daily expenses",
    balance: "$2,850.00",
    type: "checking",
  },
  {
    id: "3",
    title: "Investment Portfolio",
    description: "Stock & ETFs",
    balance: "$15,230.80",
    type: "investment",
  },
  {
    id: "4",
    title: "Credit Card",
    description: "Pending charges",
    balance: "$1,200.00",
    type: "debt",
  },
]

const TRANSACTIONS: TransactionItem[] = [
  {
    id: "1",
    title: "Salary Deposit",
    description: "Monthly salary",
    amount: "+$4,500.00",
    date: "Dec 15",
    type: "income",
    timestamp: new Date(2024, 11, 15),
  },
  {
    id: "2",
    title: "Grocery Shopping",
    description: "Whole Foods Market",
    amount: "-$127.50",
    date: "Dec 14",
    type: "expense",
    timestamp: new Date(2024, 11, 14),
  },
  {
    id: "3",
    title: "Investment Return",
    description: "Stock dividends",
    amount: "+$230.80",
    date: "Dec 13",
    type: "income",
    timestamp: new Date(2024, 11, 13),
  },
  {
    id: "4",
    title: "Utility Bill",
    description: "Electric & Gas",
    amount: "-$89.25",
    date: "Dec 12",
    type: "expense",
    timestamp: new Date(2024, 11, 12),
  },
  {
    id: "5",
    title: "Freelance Payment",
    description: "Web design project",
    amount: "+$850.00",
    date: "Dec 11",
    type: "income",
    timestamp: new Date(2024, 11, 11),
  },
  // Additional sample data for heatmap
  ...Array.from({ length: 300 }, (_, i) => ({
    id: `sample-${i}`,
    title: `Transaction ${i}`,
    description: "Sample transaction",
    amount: Math.random() > 0.5 ? `+$${(Math.random() * 500).toFixed(2)}` : `-$${(Math.random() * 200).toFixed(2)}`,
    date: new Date(2024, 0, 1 + i).toLocaleDateString(),
    type: Math.random() > 0.5 ? "income" : ("expense" as "income" | "expense"),
    timestamp: new Date(2024, 0, 1 + i),
  })),
]


export function Analytics() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Financial Analytics</h1>
        <p className={styles.subtitle}>Comprehensive view of your financial data and transaction patterns</p>
      </div>

      <div className={styles.grid}>
        {/* Accounts Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Wallet className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Accounts Overview</h2>
          </div>
          <div
            className={styles.totalBalance}
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "white",
            }}
          >
            <p className={styles.totalBalanceLabel} style={{ color: "white", opacity: 0.9 }}>
              Total Balance
            </p>
            <h1 className={styles.totalBalanceAmount} style={{ color: "white" }}>
              $26,540.25
            </h1>
          </div>
          <div className={styles.accountsList}>
            {ACCOUNTS.map((account) => (
              <div key={account.id} className={styles.accountItem}>
                <div className={styles.accountInfo}>
                  <div className={`${styles.accountIcon} ${styles[account.type]}`}>
                    {account.type === "savings" && <Wallet className={styles.accountIconSvg} />}
                    {account.type === "checking" && <QrCode className={styles.accountIconSvg} />}
                    {account.type === "investment" && <ArrowUpRight className={styles.accountIconSvg} />}
                    {account.type === "debt" && <CreditCard className={styles.accountIconSvg} />}
                  </div>
                  <div className={styles.accountDetails}>
                    <h3>{account.title}</h3>
                    {account.description && <p>{account.description}</p>}
                  </div>
                </div>
                <div className={styles.accountBalance}>{account.balance}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <CreditCard className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Recent Transactions</h2>
          </div>
          <div className={styles.transactionsList}>
            {TRANSACTIONS.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <div className={`${styles.transactionIcon} ${styles[transaction.type]}`}>
                    {transaction.type === "income" ? (
                      <ArrowUpRight className={styles.transactionIconSvg} />
                    ) : (
                      <ArrowDownLeft className={styles.transactionIconSvg} />
                    )}
                  </div>
                  <div className={styles.transactionDetails}>
                    <h3>{transaction.title}</h3>
                    <p>{transaction.description}</p>
                  </div>
                </div>
                <div className={styles.transactionAmount}>
                  <p className={`${styles.amount} ${styles[transaction.type]}`}>{transaction.amount}</p>
                  <p className={styles.date}>{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Heatmap */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <TransactionHeatmap transactions={TRANSACTIONS} />
        </div>
      </div>
    </div>
  )
}
