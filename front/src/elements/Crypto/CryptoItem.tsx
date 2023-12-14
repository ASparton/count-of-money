import { ActionIcon, Avatar, Box, Table } from "@mantine/core";
import {
  IconEye,
  IconHeart,
  IconHeartFilled,
  IconPremiumRights,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import TradeViewChart from "react-crypto-chart";
import { updateLikeCrypto } from "../../services/crypto.api";
import ICrypto from "../../types/ICrypto";

interface ICryptoItemProps {
  crypto: ICrypto;
  index: number;
  isPrivate: boolean;
  isOpen: boolean;
  onClick: (index: number) => void;
  loadData: () => void;
}

const COLOR = "gray.9";

const CryptoItem: React.FC<ICryptoItemProps> = ({
  crypto,
  index,
  isPrivate,
  onClick,
  isOpen,
  loadData,
}) => {
  const [color, setColor] = useState("");

  const updateLike = () => {
    updateLikeCrypto(crypto.id).then(() => loadData());
  };

  useEffect(() => {
    setColor(isOpen ? COLOR : "");
  }, [isOpen]);

  const tdProps = {
    bg: color,
  };

  return (
    <>
      <Table.Tr
        key={crypto.name}
        className="relative mt-10"
        onClick={() => onClick(index)}
      >
        {isPrivate && (
          <Table.Td className="rounded-tl-xl" {...tdProps}>
            <ActionIcon
              variant="transparent"
              c={"red"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateLike();
              }}
            >
              {crypto.isLiked ? <IconHeartFilled /> : <IconHeart />}
            </ActionIcon>
            {crypto.isLiked}
          </Table.Td>
        )}
        <Table.Td className={isPrivate ? "" : "rounded-tl-xl"} {...tdProps}>
          {index + 1}
        </Table.Td>
        <Table.Td {...tdProps}>
          <Avatar src={crypto.logo_url}>
            <IconPremiumRights />
          </Avatar>
        </Table.Td>
        <Table.Td {...tdProps}>{crypto.name}</Table.Td>
        <Table.Td {...tdProps}>{"$ " + crypto.current_price}</Table.Td>
        <Table.Td {...tdProps}>{"$ " + crypto.opening_price}</Table.Td>
        <Table.Td {...tdProps}>{"$ " + crypto.lowest_price}</Table.Td>
        <Table.Td {...tdProps}>{"$ " + crypto.highest_price}</Table.Td>
        <Table.Td className="rounded-tr-xl" {...tdProps}>
          <ActionIcon radius={"xl"} size={"lg"}>
            <IconEye />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
      {isOpen && (
        <Table.Tr className="w-full h-[500px] relative">
          <Box
            className="absolute h-[500px] w-full px-5 pb-5 rounded-b-xl"
            bg={"gray.9"}
          >
            <TradeViewChart
              pair={crypto.trigram + "USDT"}
              candleStickConfig={{
                upColor: "#00c176",
                downColor: "#cf304a",
                borderDownColor: "#cf304a",
                borderUpColor: "#00c176",
                wickDownColor: "#838ca1",
                wickUpColor: "#838ca1",
              }}
              chartLayout={{
                layout: {
                  backgroundColor: "black",
                  textColor: "white",
                },
                priceScale: {
                  borderColor: "#485c7b",
                },
                timeScale: {
                  borderColor: "#485c7b",
                  timeVisible: true,
                  secondsVisible: false,
                },
              }}
              interval="5m"
              containerStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              histogramConfig={{
                base: 0,
                lineWidth: 2,
                priceFormat: {
                  type: "volume",
                },
                overlay: true,
                scaleMargins: {
                  top: 0.8,
                  bottom: 0,
                },
              }}
            />
          </Box>
        </Table.Tr>
      )}
    </>
  );
};

export default CryptoItem;

/**


  

 */
