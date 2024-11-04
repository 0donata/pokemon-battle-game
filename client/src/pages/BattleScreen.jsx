import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import versusImg from "../assets/versus.png";
import BattleControls from "../components/BattleControls";
import BattleLogs from "../components/BattleLogs";
import HPBar from "../components/HPBar";
import PokemonCard from "../components/PokemonCard";
import {
  useGetBattleQuery,
  useProcessTurnMutation,
  useStartBattleMutation,
  useSurrenderMutation,
} from "../redux/services/pokemonApi";
import css from "./BattleScreen.module.scss";

const BattleScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playerPokemon } = location.state || {};
  const [battleState, setBattleState] = useState(null);
  const [actionLog, setActionLog] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [battleStarted, setBattleStarted] = useState(
    JSON.parse(localStorage.getItem("battleStarted")) || false
  );
  const [battleFinished, setBattleFinished] = useState(
    JSON.parse(localStorage.getItem("battleFinished")) || false
  );
  const battleId = localStorage.getItem("battleId");

  const [startBattle] = useStartBattleMutation();
  const [processTurn] = useProcessTurnMutation();
  const [surrender] = useSurrenderMutation();
  const { refetch, error } = useGetBattleQuery(battleId, {
    skip: !battleId,
  });

  useEffect(() => {
    if (error && (error.status === 401 || error.status === 403)) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [error, navigate]);

  useEffect(() => {
    const initializeBattle = async () => {
      if (battleFinished && battleId) {
        const response = await refetch();
        setBattleState(response.data);
        setActionLog(response.data.log);
      } else if (battleId && !battleFinished) {
        const response = await refetch();
        setBattleState(response.data);
        setActionLog(response.data.log);

        if (response.data.battleEnded) {
          setBattleFinished(true);
          localStorage.setItem("battleFinished", true);
        }
      } else if (!battleId) {
        const response = await startBattle(playerPokemon);
        setBattleState(response.data);
        setActionLog(response.data.log);
        localStorage.setItem("battleId", response.data._id);
      }
    };
    initializeBattle();
  }, [playerPokemon, battleId, battleFinished, refetch, startBattle]);

  const startBattleHandler = async () => {
    setBattleStarted(true);
    localStorage.setItem("battleStarted", true);

    if (
      battleState.opponentPokemon.base.Speed >
      battleState.playerPokemon.base.Speed
    ) {
      await handleAttack(false);
    }
  };

  const handleAttack = async (isPlayerAttack = true) => {
    if (battleState?.battleEnded || battleFinished) return;

    setIsProcessing(true);
    const response = await processTurn({
      battleId: battleState._id,
      isPlayerTurn: isPlayerAttack,
    });
    setBattleState(response.data);
    setActionLog(response.data.log);

    if (response.data.battleEnded) {
      setBattleFinished(true);
      localStorage.setItem("battleFinished", true);
    } else if (!response.data.isPlayerTurn) {
      setTimeout(() => handleAttack(false), 1000);
    }
    setIsProcessing(false);
  };

  const handleSurrender = async () => {
    try {
      await surrender(battleState._id);
      setBattleFinished(true);
      localStorage.setItem("battleFinished", true);
    } catch (error) {
      console.error("Помилка при здачі:", error);
    }
  };

  const handleFinishBattle = () => {
    localStorage.removeItem("battleId");
    localStorage.removeItem("battleFinished");
    localStorage.removeItem("battleStarted");
    navigate("/");
  };

  if (!battleState) return <p>Loading...</p>;

  return (
    <div className={css.BattleScreen}>
      <h2>Round: {battleState.roundNumber}</h2>
      <div className={css.versusContainer}>
        <div className={css.item}>
          {battleState.winner === battleState?.playerPokemon.name.english && (
            <h3>Winner</h3>
          )}
          <PokemonCard
            pokemon={battleState?.playerPokemon}
            selectable={false}
          />
          <HPBar
            currentHP={battleState?.playerHP}
            maxHP={battleState?.playerPokemon.base.HP}
            color="green"
          />
        </div>
        <img className={css.versusImg} src={versusImg} alt="versus" />
        <div className={css.item}>
          {battleState.winner === battleState?.opponentPokemon.name.english && (
            <h3>Winner</h3>
          )}
          <PokemonCard
            pokemon={battleState?.opponentPokemon}
            selectable={false}
          />
          <HPBar
            currentHP={battleState?.opponentHP}
            maxHP={battleState?.opponentPokemon.base.HP}
            color="red"
          />
        </div>
      </div>

      <BattleControls
        onAttack={() => handleAttack(true)}
        onSurrender={handleSurrender}
        onFinish={handleFinishBattle}
        isProcessing={isProcessing}
        isPlayerTurn={battleState.isPlayerTurn}
        battleFinished={battleFinished}
        battleStarted={battleStarted}
        startBattleHandler={startBattleHandler}
      />

      <BattleLogs logs={actionLog} />
    </div>
  );
};

export default BattleScreen;
