import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PokemonsList from "../components/PokemonsList";
import { logout } from "../utils/auth";
import css from "./Home.module.scss";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className={css.home}>
      <button onClick={logout}>Log out</button>
      <PokemonsList />
    </div>
  );
};

export default Home;
