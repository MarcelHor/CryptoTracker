import {Modal, View, Text, TextInput, TouchableOpacity, ScrollView} from "react-native";
import {useEffect, useRef, useState} from "react";
import Icon from "react-native-vector-icons/Ionicons";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import storage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
});
export default function AlertModal(props) {
    const [alerts, setAlerts] = useState([]);
    const alertName = props.name;
    const currentPrice = props.price;
    const [alertPriceAbove, setAlertPriceAbove] = useState();
    const [alertPriceBelow, setAlertPriceBelow] = useState();

    const addAlert = (alertType, price) => {
        if (!price || !alertType) {
            return;
        }
        const newAlert = {
            id: alerts.length + 1, name: alertName, price: price, type: alertType
        };
        setAlerts([...alerts, newAlert]);
        if (alertType === "Above") {
            setAlertPriceAbove('');
        } else {
            setAlertPriceBelow('');
        }
    }

    const removeAlert = (id) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    }

    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        const getPermission = async () => {
            if (Constants.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Enable push notifications to use the app!');
                    await storage.setItem('expopushtoken', "");
                    return;
                }
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                await storage.setItem('expopushtoken', token);
            } else {
                alert('Must use physical device for Push Notifications');
            }

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        }

        getPermission();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const sendNotification = (alert) => {
        Notifications.scheduleNotificationAsync({
            content: {
                title: `${alert.name} is now ${alert.type} ${alert.price}`,
                body: `Current price is ${currentPrice}`,
                data: {data: 'goes here'},
                vibrate: true,
                sound: true,
            },
            trigger: null,
        });
        removeAlert(alert.id);
    }

    useEffect(() => {
        // check if any alerts are triggered and send notification
        alerts.forEach((alert) => {
            if (alert.type === "Above" && currentPrice >= alert.price) {
                sendNotification(alert);
            } else if (alert.type === "Below" && currentPrice <= alert.price) {
                sendNotification(alert);
            }
        });

    }, [currentPrice, alerts]);
    const storeAlerts = async () => {
        try {
            const jsonAlerts = JSON.stringify(alerts);
            await storage.setItem(`alerts_${alertName}`, jsonAlerts);
        } catch (e) {
            console.log(e);
        }
    }

    const getAlerts = async () => {
        try {
            const jsonAlerts = await storage.getItem(`alerts_${alertName}`);
            return jsonAlerts != null ? JSON.parse(jsonAlerts) : null;
        } catch (e) {
            console.log(e);
        }
    }


    useEffect(() => {
        getAlerts().then((alerts) => {
            if (alerts) {
                setAlerts(alerts);
            }
        });
    }, []);

    useEffect(() => {
        storeAlerts();
    }, [alerts]);


    return (<Modal
        animationType="slide"
        visible={props.visible}
        onRequestClose={() => props.setVisible(!props.visible)}
    >
        <View className={"bg-gray-50 h-full"}>
            <TouchableOpacity className={"mx-4"} onPress={() => props.setVisible(!props.visible)}><Icon name={"close"}
                                                                                                        size={30}/></TouchableOpacity>
            <Text className={"text-center text-2xl p-2 font-bold"}> Alerts</Text>
            <Text className={"text-center text-xl p-2"}> Price: {currentPrice}</Text>
            <View className={"mx-4"}>
                <Text className={"text-xl font-semibold"}>Above</Text>
                <View className={"flex flex-row w-full justify-between items-center"}>
                    <TextInput
                        placeholder="Alert Price..."
                        value={alertPriceAbove}
                        onChangeText={setAlertPriceAbove}
                        keyboardType="numeric"
                        className={"border border-gray-400 rounded-lg w-2/3 h-12"}
                    />
                    <TouchableOpacity onPress={() => addAlert("Above", alertPriceAbove)}
                                      className={"bg-lime-400 rounded-md w-24 p-4 my-5 mx-4"}><Text
                        className={"text-white"}>Add</Text></TouchableOpacity>
                </View>
            </View>

            <View className={"mx-4"}>
                <Text className={"text-xl font-semibold"}>Below</Text>
                <View className={"flex flex-row w-full justify-between items-center"}>
                    <TextInput
                        placeholder="Alert Price..."
                        value={alertPriceBelow}
                        onChangeText={setAlertPriceBelow}
                        keyboardType="numeric"
                        className={"border border-gray-400 rounded-lg w-2/3 h-12"}
                    />
                    <TouchableOpacity onPress={() => addAlert("Below", alertPriceBelow)}
                                      className={"bg-lime-400 rounded-md w-24 p-4 my-5 mx-4"}><Text
                        className={"text-white"}>Add</Text></TouchableOpacity>
                </View>
            </View>

            <View className={"mt-4"}>
                <Text className={"text-center text-2xl p-2 font-bold"}> Current Alerts</Text>
                <ScrollView>
                    {alerts.map((cryptoAlert, index) => (<View key={index}
                                                               className={"flex flex-row justify-between items-centermy-2 mx-4 my-2 p-3 bg-white rounded-lg shadow-sm shadow-black"}>
                        <Text className={"text-xl"}>{cryptoAlert.type} {cryptoAlert.price} {cryptoAlert.name}</Text>
                        <TouchableOpacity className={"bg-red-400 rounded-md p-2"}
                                          onPress={() => removeAlert(cryptoAlert.id)}><Text
                            className={"text-white"}>Remove</Text></TouchableOpacity>
                    </View>))}
                </ScrollView>
            </View>
        </View>
    </Modal>);
}