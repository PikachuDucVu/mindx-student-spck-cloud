import { Route, Switch } from "wouter";
import HomeScreen from "./screens/HomeScreen";

function App() {
  return (
    <Switch>
      <Route path="/" component={HomeScreen} />
    </Switch>
  );
}

export default App;
