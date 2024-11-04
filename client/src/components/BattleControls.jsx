import css from "./BattleControls.module.scss";

const BattleControls = ({
  onAttack,
  onSurrender,
  onFinish,
  isProcessing,
  isPlayerTurn,
  battleFinished,
  battleStarted,
  startBattleHandler,
}) => (
  <div className={css.buttons}>
    {battleStarted && !battleFinished ? (
      <button
        className={css.attackButton}
        onClick={onAttack}
        disabled={battleFinished || isProcessing || !isPlayerTurn}
      >
        Attack
      </button>
    ) : (
      !battleFinished && (
        <button className={css.startButton} onClick={startBattleHandler}>
          Start a battle
        </button>
      )
    )}

    <button
      onClick={onSurrender}
      disabled={battleFinished}
      className={css.surrenderButton}
    >
      Surrender
    </button>

    {battleFinished && (
      <button className={css.endButton} onClick={onFinish}>
        End the battle
      </button>
    )}
  </div>
);

export default BattleControls;
