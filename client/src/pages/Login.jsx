import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import logo from "../assets/logo.svg";
import {
  useGetNonceMutation,
  useLoginMutation,
} from "../redux/services/authApi";
import css from "./Login.module.scss";

const Login = () => {
  const navigate = useNavigate();
  const [getNonce] = useGetNonceMutation();
  const [login] = useLoginMutation();

  const connectMetamask = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();

        const nonce = await getNonce(accounts[0]).unwrap();

        const signature = await web3.eth.personal.sign(
          `Authorization: ${nonce}`,
          accounts[0],
          ""
        );

        const response = await login({
          address: accounts[0],
          signature,
          nonce,
        }).unwrap();

        localStorage.setItem("token", response.token);
        navigate("/");
      } else {
        alert("Metamask not found");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className={css.Login}>
      <h2>Pokemon Battle Game</h2>
      <img src={logo} alt="Logo" />
      <button onClick={connectMetamask}>Login with Metamask</button>
    </div>
  );
};

export default Login;
