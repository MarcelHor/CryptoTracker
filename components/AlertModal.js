import {Button, Modal, View, Text, TextInput, TouchableOpacity} from "react-native";
import {useState} from "react";
import {Picker} from "react-native-web";

export default function AlertModal(props) {
    const [alerts, setAlerts] = useState([]);
    const alertName = props.crypto.FROMSYMBOL;
    const [alertPrice, setAlertPrice] = useState('');
    const [alertTypes, setAlertTypes] = useState(['above', 'below']);
    const [alertType, setAlertType] = useState('');

    const addAlert = () => {
        if (!alertPrice || !alertType) {
            return;
        }
        const newAlert = {
            id: alerts.length + 1, name: alertName, price: alertPrice, type: alertType
        };
        setAlerts([...alerts, newAlert]);
        setAlertPrice('');
        setAlertType('');
    }

    const removeAlert = (id) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    }

    return (<Modal
        animationType="slide"
        visible={props.visible}
        onRequestClose={() => props.setVisible(!props.visible)}
    >
        <Text className={"text-center text-2xl p-2"}> Alerts</Text>

        <View className={"flex flex-row w-full justify-between"}>
            <TextInput
                placeholder="Alert Price"
                value={alertPrice}
                onChangeText={setAlertPrice}
                keyboardType="numeric"
                className={"border border-gray-400 rounded-lg w-1/2 p-2"}
            />
            <View className={"flex flex-col"}>
                <TouchableOpacity onPress={() => setAlertType('above')}
                                  className={"bg-green-400 rounded-t-lg py-3 px-5"}><Text
                    className={"font-bold"}>Above</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setAlertType('below')}
                                  className={"bg-red-400 rounded-b-lg py-3 px-5"}><Text
                    className={"font-bold"}>Below</Text></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={addAlert} className={"bg-blue-400 rounded-lg"}><Text className={"font-bold"}>Add</Text></TouchableOpacity>
        </View>

        <View>
            <Text>Alerts</Text>
            {alerts.map((cryptoAlert, index) => (<View key={index}>
                <Text>{cryptoAlert.name} {cryptoAlert.price} {cryptoAlert.type}</Text>
                <Button title="Remove" onPress={() => removeAlert(cryptoAlert.id)}/>
            </View>))}
        </View>
    </Modal>);
}
