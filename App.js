import {NativeRouter, Route, Routes} from "react-router-native";
import CryptoList from "./components/CryptoList";
import CryptoDetail from "./components/CryptoDetail";

export default function App() {
    return (<NativeRouter>
        <Routes>
            <Route exact path="/" element={<CryptoList/>}/>
            <Route exact path="/crypto/:name" element={<CryptoDetail/>}/>
        </Routes>
    </NativeRouter>);
}
