import "./App.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import SplashScreen from "./components/module/SplashScreen";
import AuthRegister from "./pages/Auth/Register";
import AuthLogin from "./pages/Auth/Login";
import AuthForgotPassword from "./pages/Auth/ForgotPassword";
import Verify from "./pages/Auth/verify";
import RoomChat from "./pages/RoomChat";
import { PrivateRoute, PublicRoute } from "./helper/CustomRoute";

function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute restricted={false} exact path="/" component={SplashScreen} />
        <PublicRoute restricted={false} exact path="/verify" component={Verify} />
        <PublicRoute restricted={true} exact path="/auth/login" component={AuthLogin} />
        <PublicRoute restricted={true} exact path="/auth/register" component={AuthRegister} />
        <PublicRoute restricted={true} exact path="/auth/forgot" component={AuthForgotPassword} />
        <PrivateRoute exact path="/home" component={RoomChat} />
      </Switch>
    </Router>
  );
}

export default App;
