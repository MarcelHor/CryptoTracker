import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Vibration,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import storage from "@react-native-async-storage/async-storage";
import * as haptics from "expo-haptics";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function AlertModal(props) {
  const [alerts, setAlerts] = useState([]);
  const alertName = props.name;
  const currentPrice = props.price;
  const [alertPriceAbove, setAlertPriceAbove] = useState("");
  const [alertPriceBelow, setAlertPriceBelow] = useState("");

  useEffect(() => {
    const loadAlerts = async () => {
      const storedAlerts = await storage.getItem("alerts");
      if (storedAlerts) {
        setAlerts(JSON.parse(storedAlerts));
      }
    };
    loadAlerts();
  }, []);

  useEffect(() => {
    storage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = (alertType, price) => {
    if (!price || !alertType) return;

    const newAlert = {
      id: alerts.length + 1,
      name: alertName,
      price: parseFloat(price),
      type: alertType,
    };
    setAlerts([...alerts, newAlert]);

    if (alertType === "Above") {
      setAlertPriceAbove("");
    } else {
      setAlertPriceBelow("");
    }
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const getPermission = async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Enable push notifications to use the app!");
          await storage.setItem("expopushtoken", "");
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Push Token:", token);
        await storage.setItem("expopushtoken", token);
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      if (Platform.OS === "ios") {
        await Notifications.setNotificationCategoryAsync("priceAlert", [
          {
            identifier: "priceAlert",
            actions: [
              {
                actionId: "priceAlert",
                buttonTitle: "View",
              },
            ],
          },
        ]);
      }
    };

    getPermission();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const sendNotification = (alert) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: `${alert.name} is now ${alert.type} ${alert.price}`,
        body: `Current price is ${currentPrice}`,
        data: { data: "goes here" },
        sound: true,
      },
      trigger: null,
    });
    Vibration.vibrate([1000, 1000, 1000], false);
    removeAlert(alert.id);
  };

  useEffect(() => {
    alerts.forEach((alert) => {
      if (alert.type === "Above" && currentPrice >= alert.price) {
        sendNotification(alert);
      } else if (alert.type === "Below" && currentPrice <= alert.price) {
        sendNotification(alert);
      }
    });
  }, [currentPrice, alerts]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      onRequestClose={() => props.setVisible(!props.visible)}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className={"bg-gray-50 h-full"}>
          <View className={"mt-12"}>
            <TouchableOpacity
              className={"mx-4"}
              onPress={() => props.setVisible(!props.visible)}
            >
              <Icon name={"close"} size={30} />
            </TouchableOpacity>
            <Text className={"text-center text-2xl p-2 font-bold"}>Alerts</Text>
            <Text className={"text-center text-xl p-2"}>
              Price: {currentPrice.toFixed(1)}
            </Text>
            <View className={"mx-4"}>
              <Text className={"text-xl font-semibold"}>Above</Text>
              <View
                className={"flex flex-row w-full justify-between items-center"}
              >
                <TextInput
                  placeholder="Alert Price..."
                  value={alertPriceAbove}
                  onChangeText={setAlertPriceAbove}
                  keyboardType="numeric"
                  className={
                    "border border-gray-400 rounded-lg w-2/3 h-10 px-5 text-sm focus:outline-none"
                  }
                />
                <TouchableOpacity
                  onPress={() => addAlert("Above", alertPriceAbove)}
                  className={"bg-lime-400 rounded-md w-24 p-4 my-5 mx-4"}
                >
                  <Text className={"text-white"}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className={"mx-4"}>
              <Text className={"text-xl font-semibold"}>Below</Text>
              <View
                className={"flex flex-row w-full justify-between items-center"}
              >
                <TextInput
                  placeholder="Alert Price..."
                  value={alertPriceBelow}
                  onChangeText={setAlertPriceBelow}
                  keyboardType="numeric"
                  className={
                    "border border-gray-400 rounded-lg w-2/3 h-10 px-5 text-sm focus:outline-none"
                  }
                />
                <TouchableOpacity
                  onPress={() => addAlert("Below", alertPriceBelow)}
                  className={"bg-lime-400 rounded-md w-24 p-4 my-5 mx-4"}
                >
                  <Text className={"text-white"}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className={"mt-4"}>
              <Text className={"text-center text-2xl p-2 font-bold"}>
                Current Alerts
              </Text>
              <ScrollView>
                {alerts.map((cryptoAlert, index) => (
                  <View
                    key={index}
                    className={
                      "flex flex-row justify-between items-centermy-2 mx-4 my-2 p-3 bg-white rounded-lg shadow-sm shadow-black"
                    }
                  >
                    <Text className={"text-xl"}>
                      {cryptoAlert.type} {cryptoAlert.price} {cryptoAlert.name}
                    </Text>
                    <TouchableOpacity
                      className={"bg-red-400 rounded-md p-2"}
                      onPress={() => removeAlert(cryptoAlert.id)}
                    >
                      <Text className={"text-white"}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
