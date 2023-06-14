import {Button, Modal, View, Text, TextInput, TouchableOpacity, ScrollView} from "react-native";
import {useState} from "react";
import {Picker} from "react-native-web";
import Icon from "react-native-vector-icons/Ionicons";

export default function AlertModal(props) {
    const [alerts, setAlerts] = useState([]);
    const alertName = props.crypto.FROMSYMBOL;
    const [alertPrice, setAlertPrice] = useState('');

    const addAlert = (alertType) => {
        if (!alertPrice || !alertType) {
            return;
        }
        const newAlert = {
            id: alerts.length + 1, name: alertName, price: alertPrice, type: alertType
        };
        setAlerts([...alerts, newAlert]);
        setAlertPrice('');
    }

    const removeAlert = (id) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    }

    return (<Modal
        animationType="slide"
        visible={props.visible}
        onRequestClose={() => props.setVisible(!props.visible)}
    >
        <View className={"bg-gray-50 h-full"}>
            <TouchableOpacity className={"mx-4"} onPress={() => props.setVisible(!props.visible)}><Icon name={"close"}
                                                                                                        size={30}/></TouchableOpacity>
            <Text className={"text-center text-2xl p-2"}> Alerts</Text>

            <View className={"mx-4"}>
                <Text className={"text-xl"}>Above</Text>
                <View className={"flex flex-row w-full justify-between items-center"}>
                    <TextInput
                        placeholder="Alert Price..."
                        value={alertPrice}
                        onChangeText={setAlertPrice}
                        keyboardType="numeric"
                        className={"border border-gray-400 rounded-lg w-2/3 h-12"}
                    />
                    <TouchableOpacity onPress={() => addAlert("above")}
                                      className={"bg-sky-400 rounded-md w-24 p-4 my-5 mx-4"}><Text
                        className={"text-white"}>Add</Text></TouchableOpacity>
                </View>
            </View>

            <View className={"mx-4"}>
                <Text className={"text-xl"}>Below</Text>
                <View className={"flex flex-row w-full justify-between items-center"}>
                    <TextInput
                        placeholder="Alert Price..."
                        value={alertPrice}
                        onChangeText={setAlertPrice}
                        keyboardType="numeric"
                        className={"border border-gray-400 rounded-lg w-2/3 h-12"}
                    />
                    <TouchableOpacity onPress={() => addAlert("below")}
                                      className={"bg-sky-400 rounded-md w-24 p-4 my-5 mx-4"}><Text
                        className={"text-white"}>Add</Text></TouchableOpacity>
                </View>
            </View>

            <View className={"mt-4"}>
                <Text className={"text-center text-2xl p-2"}> Current Alerts</Text>
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
