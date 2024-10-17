import { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { CRYPTO_API } from "@env";
import axios from "axios";
import CryptoItem from "./CryptoItem";

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCrypto = async () => {
    try {
      const response = await axios.get(
        "https://min-api.cryptocompare.com/data/top/totalvolfull",
        {
          params: {
            limit: 10,
            tsym: "USD",
          },
          headers: {
            authorization: `Apikey ${CRYPTO_API}`,
          },
        }
      );
      setCryptos(response.data.Data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCrypto();
  }, []);

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.CoinInfo.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className={"bg-gray-50"}>
      <ScrollView>
        <Text className={"text-4xl font-bold mx-4 mt-12"}>Coins</Text>
        <TextInput
          className={
            "bg-white border-2 border-gray-300 rounded w-11/12 h-10 px-5 pr-16 mx-4 my-4 text-sm focus:outline-none"
          }
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          placeholder={"Search"}
        />
        {filteredCryptos.map((crypto) => (
          <CryptoItem key={crypto.CoinInfo.Id} crypto={crypto} />
        ))}
      </ScrollView>
    </View>
  );
};

export default CryptoList;
