import React, {useEffect, useState} from 'react';
import {Image, View, Text} from 'react-native';
import axios from 'axios';
import {Link, useParams} from 'react-router-native';
import {CRYPTO_API} from "@env";

const CryptoDetail = () => {
    const [crypto, setCrypto] = useState(null);
    const [price, setPrice] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        const fetchCryptoInfo = async () => {
            const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${id}`, {
                headers: {
                    'X-CMC_PRO_API_KEY': CRYPTO_API,
                }
            });
            setCrypto(response.data.data[id]);
        }

        const fetchCryptoPrice = async () => {
            const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}`, {
                headers: {
                    'X-CMC_PRO_API_KEY': CRYPTO_API,
                }
            });
            setPrice(response.data.data[id]);
        }

        fetchCryptoInfo();
        fetchCryptoPrice();
    }, [id]);

    if (!crypto || !price) {
        return <View>
            <Text>Loading...</Text>
        </View>
    }

    return (
        <View className={"flex flex-col items-center justify-center h-full"}>
            <Link to={"/"} className={"m-4 p-4 border-2 border-gray-300 rounded-lg"}>
                <Text>Back</Text>
            </Link>
            <Image source={{ uri: crypto.logo }} style={{width: 100, height: 100}}/>
            <Text>{crypto.name}</Text>
            <Text>{crypto.symbol}</Text>
            <Text>${price.quote.USD.price.toFixed(2)}</Text>
            <Text>{price.quote.USD.percent_change_24h.toFixed(2)}%</Text>
        </View>
    );
}

export default CryptoDetail;
