import { ActionIcon, Avatar, Table } from "@mantine/core";
import {
  IconChartHistogram,
  IconPremiumRights,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { updateLikeCrypto } from "../../services/crypto.api";
import ICrypto from "../../types/ICrypto";

interface ICryptoItemProps {
  crypto: ICrypto;
  index: number;
  isPrivate: boolean;
  onClick: (index: number) => void;
  loadData: () => void;
}

const CryptoItem: React.FC<ICryptoItemProps> = ({
  crypto,
  index,
  isPrivate,
  onClick,
  loadData,
}) => {
  const updateLike = () => {
    updateLikeCrypto(crypto.id).then(() => loadData());
  };

  return (
    <>
      <Table.Tr
        key={crypto.name}
        className="relative mt-10"
        onClick={() => onClick(index)}
      >
        {isPrivate && (
          <Table.Td className="rounded-tl-xl">
            <ActionIcon
              variant="transparent"
              c={"gold"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateLike();
              }}
            >
              {crypto.isLiked ? <IconStarFilled /> : <IconStar />}
            </ActionIcon>
            {crypto.isLiked}
          </Table.Td>
        )}
        <Table.Td className={isPrivate ? "" : "rounded-tl-xl"}>
          {index + 1}
        </Table.Td>
        <Table.Td>
          <Avatar src={crypto.image}>
            <IconPremiumRights />
          </Avatar>
        </Table.Td>
        <Table.Td>{crypto.name}</Table.Td>
        <Table.Td>{"$ " + crypto.opening_price}</Table.Td>
        <Table.Td>{"$ " + crypto.highest_price}</Table.Td>
        <Table.Td>{"$ " + crypto.current_price}</Table.Td>
        <Table.Td>{"$ " + crypto.lowest_price}</Table.Td>
        <Table.Td className="rounded-tr-xl">
          <ActionIcon radius={"xl"} size={"lg"}>
            <IconChartHistogram />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
      {/* {isOpen && ()} */}
    </>
  );
};

export default CryptoItem;
