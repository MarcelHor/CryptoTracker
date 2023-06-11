import React, { useEffect, useState } from 'react';
import { Image, View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { Link, useParams } from 'react-router-native';
import { CRYPTO_API } from "@env";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5
};

const CryptoDetail = () => {
    const [crypto, setCrypto] = useState(null);
    const [history, setHistory] = useState([]);
    const { name } = useParams();

    useEffect(() => {

        const fetchCryptoInfo = async () => {
            const response = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull`, {
                params: {
                    fsyms: name,
                    tsyms: 'USD',
                },
                headers: {
                    authorization: `Apikey ${CRYPTO_API}`,
                },
            });
            setCrypto(response.data.RAW[name].USD);
        }

        const fetchCryptoHistory = async () => {
            const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday`, {
                params: {
                    fsym: name,
                    tsym: 'USD',
                    limit: 30,
                },
                headers: {
                    authorization: `Apikey ${CRYPTO_API}`,
                },
            });
            const prices = response.data.Data.Data.map(item => item.close);
            setHistory(prices);
        }

        fetchCryptoHistory();
        fetchCryptoInfo();
    }, [name]);

    if (!crypto || !history) {
        return <View><Text>Loading...</Text></View>;
    }

    const data = {
        labels: ["-30d", "Today"],
        datasets: [
            {
                data: history
            }
        ]
    };

    return (
        <View>
            <Link to={"/"} underlayColor={"#d5d5d5"} className={"m-4 p-4 border-2 border-gray-300 rounded-lg"}>
                <Text className={"text-xl font-bold"}>Back</Text>
            </Link>
            <View className={"flex flex-row items-center justify-between"}>
                <View className={"flex"}>
                    <Image source={{uri: `https://cryptocompare.com/${crypto.IMAGEURL}`}} style={{width: 50, height: 50}}/>
                    <Text className={"text-xl font-bold"}>{crypto.FROMSYMBOL}</Text>
                    <Text className={"text-gray-500"}>{crypto.TOSYMBOL}</Text>
                </View>
                <View className={"flex flex-col"}>
                    <Text className={"text-xl font-bold"}>${crypto.PRICE.toFixed(2)}</Text>
                    <Text className={"text-gray-500"}>{crypto.CHANGEPCT24HOUR.toFixed(2)}%</Text>
                </View>
            </View>
            <View className={"flex flex-col items-center"}>
                <Text className={"text-2xl font-bold"}>30 Day History</Text>
                <LineChart
                    data={data}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                />
            </View>
        </View>
    );
}

export default CryptoDetail;
