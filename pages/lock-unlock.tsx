import { useHasNamiExtension } from "hooks/use-has-nami-extension"
import { useLucid } from "hooks/use-lucid"
import { useTransactionSender } from "hooks/use-transaction"

import styles from "../styles/index.module.css"
import { useTransactionLockSender } from "hooks/use-transaction-lock"

const Index = () => {
  const hasNamiExtension = useHasNamiExtension()
  const { lucid, networkId } = useLucid()
  const tx = useTransactionLockSender(lucid)

  // strict equals to avoid undefined
  if (hasNamiExtension === false)
    return <div>This example only works with the Nami extension installed. Please install it.</div>

  // not initialized yet
  if (!lucid) return null

  const canTransact = tx.lovelace > 0 && tx.toAccount

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Processing lock unlock UTXO</h1>
      <div>
        <label>
          <span className={styles.label}>To Account</span>

          <input
            className={styles.input}
            type="text"
            placeholder="addr..."
            value={tx.toAccount}
            onChange={(e) => tx.setToAccount(e.target.value?.toString())}
          />
        </label>
      </div>
      <div>
        <label>
          <span className={styles.label}>Lovelace</span>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="1000"
            name="amount"
            value={tx.lovelace}
            onChange={(e) => tx.setLovelace(e.target.value?.toString())}
          />
        </label>
      </div>
      <div>
        <button disabled={!canTransact} className={styles.button} onClick={tx.sendTransactionLock}>
          Send transaction
        </button>

        {!tx.successMessage && !tx.error && !canTransact && (
          <p className={styles.info}>
            <small>specify a lovelace amount and account to send a transaction</small>
          </p>
        )}

        {tx.error && (
          <p className={styles.info}>
            <small>{tx.error.message}</small>
          </p>
        )}

        {tx.successMessage && (
          <p className={styles.info}>
            <small>{tx.successMessage}</small>
          </p>
        )}
      </div>
    </div>
  )
}

export default Index
