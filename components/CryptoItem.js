import React from 'react';
import {Image,View, Text} from 'react-native';
import {Link} from "react-router-native";

const CryptoItem = ({crypto}) => {

    return (
        <Link to={`/crypto/${crypto.CoinInfo.Name}`} underlayColor={"#d5d5d5"} className={"m-4 p-4 border-2 border-gray-300 rounded-lg"}>
           <View className={"flex flex-row items-center justify-between"}>
            <View className={"flex"}>
                <Image source={{ uri: `https://cryptocompare.com/${crypto.CoinInfo.ImageUrl}` }} style={{width: 50, height: 50}}/>
                <Text className={"text-xl font-bold"}>{crypto.CoinInfo.FullName}</Text>
                <Text className={"text-gray-500"}>{crypto.CoinInfo.Name}</Text>

            </View>
            <View className={"flex flex-col"}>
                <Text className={"text-xl font-bold"}>${crypto.RAW.USD.PRICE.toFixed(2)}</Text>
                <Text className={"text-gray-500"}>{crypto.RAW.USD.CHANGEPCT24HOUR.toFixed(2)}%</Text>
            </View>
           </View>
        </Link>
);
}
export default CryptoItem;
