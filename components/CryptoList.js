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
                const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
                    params: {
                        start: 1, limit: 10, convert: 'USD',
                    }, headers: {
                        'X-CMC_PRO_API_KEY': CRYPTO_API,
                    }
                });
                setCryptos(response.data.data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchCrypto();
    }, []);



    return (<View>
        <Text className={"text-4xl font-bold text-center m-4 mt-12"}>Crypto</Text>
        <ScrollView className={""}>
            {cryptos.map((crypto) => (<CryptoItem key={crypto.id} crypto={crypto}/>))}
        </ScrollView>
    </View>);
}

export default CryptoList;
