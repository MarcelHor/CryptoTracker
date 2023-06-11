import React from 'react';
import {Image,View, Text} from 'react-native';
import {Link} from "react-router-native";

const CryptoItem = ({crypto}) => {

    return (
        <Link to={`/crypto/${crypto.id}`} underlayColor={"#d5d5d5"} className={"m-4 p-4 border-2 border-gray-300 rounded-lg"}>
           <View className={"flex flex-row items-center justify-between"}>
            <View className={"flex flex-col"}>
                <Image source={{ uri: crypto.logo }} />
                <Text className={"text-xl font-bold"}>{crypto.name}</Text>
                <Text className={"text-gray-500"}>{crypto.symbol}</Text>
            </View>
            <View className={"flex flex-col"}>
                <Text className={"text-xl font-bold"}>${crypto.quote.USD.price.toFixed(2)}</Text>
                <Text className={"text-gray-500"}>{crypto.quote.USD.percent_change_24h.toFixed(2)}%</Text>
            </View>
           </View>
        </Link>
);
}
export default CryptoItem;
