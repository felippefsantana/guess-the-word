import { BrowserRouter, Routes, Route } from "react-router-dom";

import StartScreen from './pages/StartScreen/StartScreen';
import Game from './pages/Game/Game';
import GameOver from './pages/GameOver/GameOver';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<StartScreen />} path="/"></Route>
        <Route element={<Game />} path="/game"></Route>
        <Route element={<GameOver />} path="/gameover"></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router;