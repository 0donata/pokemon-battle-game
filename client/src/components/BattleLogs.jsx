import css from "./BattleLogs.module.scss";

const BattleLogs = ({ logs }) => (
  <div className={css.battleLogs}>
    <h3>Battle logs:</h3>
    <div className={css.logContainer}>
      <ul>
        {logs.map((entry, index) => (
          <li key={index} style={{ color: entry.color }}>
            {entry.message}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default BattleLogs;
