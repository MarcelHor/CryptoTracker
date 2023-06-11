import CryptoList from "./components/CryptoList";
import {NativeRouter, Route, Routes} from "react-router-native";
import CryptoDetail from "./components/CryptoDetail";

export default function App() {
    return (<NativeRouter>
            <Routes>
                <Route exact path="/" element={<CryptoList/>}/>
                <Route exact path="/crypto/:id" element={<CryptoDetail/>}/>
            </Routes>
        </NativeRouter>);
}
