import React from "react";
import { useUser } from "../contexts/UserContext";

const Home = () => {
  const { user } = useUser();
  console.log(user);

  return (
    <div>
      Welcome to the Home Page user are you connected ? Else how are you been
      getting this page ?
    </div>
  );
};

export default Home;
