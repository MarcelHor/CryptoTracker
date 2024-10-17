import { Image, View, Text } from "react-native";
import { Link } from "react-router-native";

const CryptoItem = ({ crypto }) => {
  return (
    <Link
      to={`/crypto/${crypto.CoinInfo.Name}`}
      underlayColor={"#d5d5d5"}
      className={"my-2 mx-4 p-3 bg-white rounded-lg shadow-sm shadow-black"}
    >
      <View className={"flex flex-row items-center justify-between"}>
        <View className={"flex flex-row items-center"}>
          <Image
            source={{
              uri: `https://cryptocompare.com/${crypto.CoinInfo.ImageUrl}`,
            }}
            style={{ width: 50, height: 50 }}
          />
          <View className={"ml-2"}>
            <Text className={"text-xl font-bold"}>
              {crypto.CoinInfo.FullName}
            </Text>
            <Text className={"text-gray-500"}>{crypto.CoinInfo.Name}</Text>
          </View>
        </View>
        <View className={"flex flex-col items-start justify-between w-24"}>
          <Text className={"text-xl font-bold"}>
            ${crypto.RAW.USD.PRICE.toFixed(1)}
          </Text>
          <Text
            className={`${
              crypto.RAW.USD.CHANGEPCT24HOUR < 0
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {crypto.RAW.USD.CHANGEPCT24HOUR.toFixed(1)}%
          </Text>
        </View>
      </View>
    </Link>
  );
};
export default CryptoItem;
