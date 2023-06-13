import React, {useEffect, useState} from 'react';
import {Image, View, Text, Dimensions, Button, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {Link, useParams} from 'react-router-native';
import {CRYPTO_API} from "@env";
import {LineChart} from 'react-native-wagmi-charts';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import * as haptics from 'expo-haptics';
import Icon from 'react-native-vector-icons/Ionicons';

const CryptoDetail = () => {
    const [crypto, setCrypto] = useState(null);
    const [history, setHistory] = useState([]);
    const {name} = useParams();
    const [interval, setInterval] = useState('day');

    function invokeHaptic() {
        haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    }

    useEffect(() => {

        const fetchCryptoInfo = async () => {
            await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull`, {
                params: {
                    fsyms: name, tsyms: 'USD',
                }, headers: {
                    authorization: `Apikey ${CRYPTO_API}`,
                },
            }).then((response) => {
                console.log(response.data.RAW[name].USD);
                setCrypto(response.data.RAW[name].USD);
            }).catch((err) => {
                console.error(err);
            });
        }

        const fetchCryptoHistory = async (interval) => {
            let endpoint;
            let limit;
            switch (interval) {
                case 'hour':
                    endpoint = 'histominute';
                    limit = 60;
                    break;
                case 'day':
                    endpoint = 'histohour';
                    limit = 24;
                    break;
                case 'week':
                    endpoint = 'histohour';
                    limit = 24 * 7; // 7 days
                    break;
                case 'month':
                    endpoint = 'histoday';
                    limit = 30; // 30 days
                    break;
                case 'year':
                    endpoint = 'histoday';
                    limit = 365;
                    break;
                default:
                    endpoint = 'histohour';
                    limit = 24;
            }


            await axios.get(`https://min-api.cryptocompare.com/data/v2/${endpoint}`, {
                params: {
                    fsym: name, tsym: 'USD', limit: limit,
                }, headers: {
                    authorization: `Apikey ${CRYPTO_API}`,
                }
            }).then((response) => {
                const prices = response.data.Data.Data.map(item => ({
                    value: item.close, date: new Date(item.time * 1000)
                }));
                setHistory(prices);
            }).catch((err) => {
                console.error(err);
            });
        }

        fetchCryptoHistory(interval);
        fetchCryptoInfo();
    }, [name, interval]);


    if (!crypto) {
        return <View><Text>Loading...</Text></View>;
    }


    return (<View className={"bg-gray-50 h-full"}>
        <View>
            <View className={"flex flex-row items-center justify-between w-full mt-8 mx-4"}>
                <Link to={"/"} underlayColor={"#d5d5d5"}
                      className={"my-2 mx-2"}>
                    <Icon name="arrow-back"
                          size={32}
                          color="black"/>
                </Link>
            </View>
            <View className={"flex flex-col items-center"}>
                <Image source={{uri: `https://cryptocompare.com/${crypto.IMAGEURL}`}}
                       style={{width: 64, height: 64}}/>
                <Text className={"text-lg"}>{crypto.FROMSYMBOL}</Text>
                <Text className={"text-3xl font-bold"}>${crypto.PRICE.toFixed(2)}</Text>
                <Text
                    className={`${crypto.CHANGEPCT24HOUR < 0 ? "text-red-500 bg-red-200 font-semibold p-1.5" : "text-green-500 bg-green-200 font-semibold p-1.5"}`}>
                    {crypto.CHANGEPCT24HOUR.toFixed(2)}%</Text>
            </View>
            <View className={"flex flex-row items-center mb-28"}>
                {history ? (<GestureHandlerRootView style={{height: 300, width: Dimensions.get('window').width}}>
                    <LineChart.Provider data={history}>
                        <LineChart>
                            <LineChart.Path/>
                            <LineChart.CursorCrosshair onActivated={invokeHaptic} onEnded={invokeHaptic}>
                                <LineChart.Tooltip/>
                            </LineChart.CursorCrosshair>
                        </LineChart>
                    </LineChart.Provider>
                </GestureHandlerRootView>) : (<Text>Loading history...</Text>)}
            </View>

            <View className={"flex flex-row items-center justify-between mx-4 mb-8"}>
                <TouchableOpacity onPress={() => setInterval('hour')} className={"bg-gray-200 rounded-lg py-3 px-5"}><Text className={"font-bold"}>1h</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setInterval('day')} className={"bg-gray-200 rounded-lg py-3 px-5"}><Text className={"font-bold"}>1d</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setInterval('week')} className={"bg-gray-200 rounded-lg py-3 px-5"}><Text className={"font-bold"}>1w</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setInterval('month')} className={"bg-gray-200 rounded-lg py-3 px-5"}><Text className={"font-bold"}>1m</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setInterval('year')} className={"bg-gray-200 rounded-lg py-3 px-5"}><Text className={"font-bold"}>1y</Text></TouchableOpacity>
            </View>
        </View>
        <View className={"my-2 mx-4 p-3 bg-white rounded-lg shadow-sm shadow-black"}>
            <View className={"flex flex-row items-center justify-between"}>
                <View className={"flex flex-col"}>
                    <Text className={"text-xl font-bold"}>Market Cap</Text>
                    <Text className={"text-gray-500"}>${crypto.MKTCAP.toFixed(2)}</Text>
                </View>
                <View className={"flex flex-col"}>
                    <Text className={"text-xl font-bold"}>Volume (24h)</Text>
                    <Text className={"text-gray-500"}>${crypto.TOTALVOLUME24HTO.toFixed(2)}</Text>
                </View>
                <View className={"flex flex-col"}>
                    <Text className={"text-xl font-bold"}>Supply</Text>
                    <Text className={"text-gray-500"}>{crypto.SUPPLY.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    </View>);
}

export default CryptoDetail;
