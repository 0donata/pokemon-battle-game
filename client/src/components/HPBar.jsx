import css from "./HPBar.module.scss";

const HPBar = ({ currentHP, maxHP, color }) => {
  const hpPercent = (currentHP / maxHP) * 100;

  return (
    <>
      <p>{`HP: ${currentHP}/${maxHP}`}</p>
      <div className={css.hpBar}>
        <div
          className={css.hpBarFill}
          style={{ width: `${hpPercent}%`, backgroundColor: color }}
        />
        <p>{`HP: ${currentHP}/${maxHP}`}</p>
      </div>
    </>
  );
};

export default HPBar;
