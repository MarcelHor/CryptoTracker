import React, {useEffect, useState} from 'react';
import {
    Image, View, Text, Dimensions, Button, TouchableOpacity, TextInput, Modal, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import {Link, useParams} from 'react-router-native';
import {CRYPTO_API} from "@env";
import {LineChart} from 'react-native-wagmi-charts';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import * as haptics from 'expo-haptics';
import Icon from 'react-native-vector-icons/Ionicons';
import AlertModal from "./AlertModal";

const CryptoDetail = () => {
    const [crypto, setCrypto] = useState(null);
    const [history, setHistory] = useState([]);

    const {name} = useParams();
    const [interval, setInterval] = useState('day');

    const [alertModalVisible, setAlertModalVisible] = useState(false);

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
        return <ActivityIndicator size="large" color="#0000ff"/>;
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
                {history && history.length > 0 ? (
                    <GestureHandlerRootView style={{height: 300, width: Dimensions.get('window').width}}>
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
                <TouchableOpacity onPress={() => setInterval('hour')}
                                  className={"bg-sky-400  rounded-lg py-3 px-5"}><Text className={"font-bold text-white"}>1h</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setInterval('day')}
                                  className={"bg-sky-400  rounded-lg py-3 px-5"}><Text className={"font-bold text-white"}>1d</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setInterval('week')}
                                  className={"bg-sky-400  rounded-lg py-3 px-5"}><Text className={"font-bold text-white"}>1w</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setInterval('month')}
                                  className={"bg-sky-400  rounded-lg py-3 px-5"}><Text className={"font-bold text-white"}>1m</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setInterval('year')}
                                  className={"bg-sky-400  rounded-lg py-3 px-5"}><Text className={"font-bold text-white"}>1y</Text></TouchableOpacity>
            </View>
        </View>
        <View className={"mb-4 mx-4 p-3 bg-white rounded-lg shadow-sm shadow-black"}>
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

        <TouchableOpacity onPress={() => setAlertModalVisible(true)}
                          className={" bg-sky-400 flex items-center justify-center absolute bottom-0 w-full py-3"}>
            <Text className={"text-xl font-semibold text-white"}>Add Alert</Text>
        </TouchableOpacity>

        <AlertModal visible={alertModalVisible} setVisible={setAlertModalVisible} crypto={crypto}/>
    </View>);
}

export default CryptoDetail;
