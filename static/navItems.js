import { AiOutlinePieChart, AiOutlinePlusCircle } from "react-icons/ai";
import { BiTrendingUp } from "react-icons/bi";
import { RiCoinsLine } from "react-icons/ri";
import { FaFaucet } from "react-icons/fa";

export const navItems = [
  {
    title: "Assets",
    icon: <AiOutlinePieChart />,
    as: "portfolio",
    path: "/Portfolio",
  },
  {
    title: "Trade",
    icon: <BiTrendingUp />,
    as: "trade",
    path: "/Trade",
  },
  {
    title: "Stake and Earn",
    icon: <RiCoinsLine />,
    as: "stake",
    path: "/Staking",
  },
  {
    title: "Faucet",
    icon: <FaFaucet />,
    as: "faucet",
    path: "/Faucet",
  },
  {
    title: "Quick Guide",
    icon: <AiOutlinePlusCircle />,
    as: "guide",
    path: "/Guide",
  },
];
