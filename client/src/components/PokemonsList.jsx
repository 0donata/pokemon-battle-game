import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPokemonsQuery } from "../redux/services/pokemonApi";
import Pagination from "./Pagination";
import PokemonCard from "./PokemonCard";
import css from "./PokemonsList.module.scss";

const PokemonsList = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasActiveBattle, setHasActiveBattle] = useState(false);
  const navigate = useNavigate();

  const limit = 12;
  const { data, error, isLoading } = useGetPokemonsQuery({
    page: currentPage,
    limit,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStartBattle = () => {
    if (selectedPokemon) {
      navigate("/battle", {
        state: { playerPokemon: selectedPokemon },
      });
    } else {
      alert("Please select a Pokémon.");
    }
  };

  useEffect(() => {
    const activeBattleId = localStorage.getItem("battleId");
    setHasActiveBattle(Boolean(activeBattleId));
  }, []);

  const handleContinueBattle = () => {
    navigate("/battle");
  };

  return (
    <div className={css.PokemonsList}>
      <button
        className={css.startButton}
        onClick={handleStartBattle}
        disabled={!selectedPokemon || hasActiveBattle}
      >
        Start Battle
      </button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading data</p>}
      {hasActiveBattle && (
        <div className={css.activeBattleAlert}>
          <p>You have an unfinished battle!</p>
          <p>You cannot start a new battle until you finish the previous one</p>
          <button onClick={handleContinueBattle}>Return to Battle</button>
        </div>
      )}
      <div className={css.list}>
        {data &&
          data.data?.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isSelected={selectedPokemon?.id === pokemon.id}
              onSelect={setSelectedPokemon}
            />
          ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={data?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PokemonsList;
