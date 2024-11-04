import checkImg from "../assets/check.svg";
import css from "./PokemonCard.module.scss";

const PokemonCard = ({ pokemon, isSelected, onSelect, selectable = true }) => {
  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(pokemon);
    }
  };

  return (
    <div
      className={`${css.card} ${isSelected ? css.selected : ""} ${
        !selectable ? css.nonSelectable : ""
      }`}
      onClick={handleClick}
    >
      <h2>{pokemon.name?.english}</h2>
      <p>{pokemon.name?.japanese}</p>
      <div className={css.imageContainer}>
        <img src={pokemon.image?.thumbnail} alt={pokemon.name?.english} />
      </div>
      {isSelected && <img className={css.check} src={checkImg} alt="check" />}
      <p>Types: {pokemon.type?.join(", ")}</p>
      <hr />
      <p>HP: {pokemon.base?.HP}</p>
      <p>Attack: {pokemon.base?.Attack}</p>
      <p>Defense: {pokemon.base?.Defense}</p>
      <p>Speed: {pokemon.base?.Speed}</p>
    </div>
  );
};

export default PokemonCard;
