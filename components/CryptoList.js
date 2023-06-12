import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import axios from 'axios';
import CryptoItem from './CryptoItem';
import {CRYPTO_API} from "@env";

const CryptoList = () => {
    const [cryptos, setCryptos] = useState([]);

    useEffect(() => {
        const fetchCrypto = async () => {
            try {
                const response = await axios.get('https://min-api.cryptocompare.com/data/top/totalvolfull', {
                    params: {
                        limit: 10,
                        tsym: 'USD',
                    },
                    headers: {
                        authorization: `Apikey ${CRYPTO_API}`,
                    }
                });
                setCryptos(response.data.Data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchCrypto();
    }, []);

    return (
        <View className={"bg-gray-50"}>
            <Text className={"text-4xl font-bold mx-4 mt-12"}>Crypto</Text>
            <ScrollView>
                {cryptos.map((crypto) => (<CryptoItem key={crypto.CoinInfo.Id} crypto={crypto}/>))}
            </ScrollView>
        </View>
    );
}

export default CryptoList;
