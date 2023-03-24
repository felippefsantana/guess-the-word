import { BrowserRouter, Route } from 'react';

import StartScreen from '../pages/StartScreen';
import Game from '../pages/Game';
import GameOver from '../pages/GameOver';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={StartScreen} path="/"/>
      <Route component={Game} path="/game"/>
      <Route component={GameOver} path="/gameover"/>
    </BrowserRouter>
  )
}

export default Routes;