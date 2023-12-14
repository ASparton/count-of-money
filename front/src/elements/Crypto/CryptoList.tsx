import {
  Box,
  Group,
  MultiSelect,
  Switch,
  Table,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconHeart, IconHeartFilled, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getCryptoList } from "../../services/crypto.api";
import { getLikedCrypto } from "../../services/user.api";
import ECryptoID from "../../types/ECryptoID";
import ICrypto from "../../types/ICrypto";
import CryptoItem from "./CryptoItem";

interface ICryptoListProps {}

const CryptoList: React.FC<ICryptoListProps> = ({}) => {
  const [openedAccordions, setOpenedAccordions] = useState<number[]>([]);
  const [cryptoList, setCryptoList] = useState<ICrypto[]>([]);
  const [filters, setFilters] = useState<{
    ids: ECryptoID[];
    onlyLiked: boolean;
  }>({ ids: [], onlyLiked: false });
  const [filteredCryptos, setFilteredCryptos] = useState<ICrypto[]>([]);

  const isPrivate = location.pathname.includes("auth");

  const loadData = () => {
    getCryptoList().then((res) => {
      if (isPrivate) {
        getLikedCrypto()
          .then((resLiked) => ({
            ...resLiked,
            data: res.data.map((c) => ({
              ...c,
              isLiked: resLiked.data.includes(c.trigram),
            })),
          }))
          .then((finalData) => setCryptoList(finalData.data));
      } else setCryptoList(res.data);
    });
  };

  const updateAccordion = (index: number) => {
    if (openedAccordions.includes(index))
      setOpenedAccordions((o) => o.filter((i) => i !== index));
    else setOpenedAccordions([index]);
  };

  useEffect(() => {
    setOpenedAccordions([]);
    setFilteredCryptos(
      cryptoList.filter((c) => {
        let toShow = false;

        if (filters.ids.length !== 0) toShow = filters.ids.includes(c.trigram);
        else toShow = true;
        if (filters.onlyLiked === true) toShow = c.isLiked === true;

        return toShow;
      })
    );
  }, [filters, cryptoList]);

  useEffect(() => {
    console.log("filteredCryptos", filteredCryptos);
  }, [filteredCryptos]);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box>
      <Title>Cryptocurrency Details</Title>

      <Group className="justify-center">
        {isPrivate && (
          <Switch
            size="lg"
            onLabel={
              <ThemeIcon variant="transparent" c={"red"}>
                <IconHeartFilled />
              </ThemeIcon>
            }
            offLabel={
              <ThemeIcon variant="transparent" c={"red"}>
                <IconHeart />
              </ThemeIcon>
            }
            labelPosition="left"
            onChange={(e) =>
              setFilters((o) => ({ ...o, onlyLiked: e.currentTarget.checked }))
            }
          />
        )}
        <MultiSelect
          leftSection={<IconSearch size={14} />}
          size="md"
          radius={"xl"}
          my={10}
          placeholder="Ethereum"
          data={cryptoList.map((l) => ({ label: l.name, value: l.trigram }))}
          hidePickedOptions
          searchable
          onChange={(values) => {
            const ids = values as ECryptoID[];

            setFilters((o) => ({ ...o, ids }));
          }}
        />
      </Group>

      <Table highlightOnHover withRowBorders={false}>
        <Table.Thead>
          <Table.Tr>
            {isPrivate && <Table.Th></Table.Th>}
            <Table.Th>#</Table.Th>
            <Table.Th>Picture</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Open price</Table.Th>
            <Table.Th>Lowest price</Table.Th>
            <Table.Th>Highest price</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredCryptos.map((crypto, index) => (
            <CryptoItem
              key={index}
              crypto={crypto}
              index={index}
              isPrivate={isPrivate}
              onClick={updateAccordion}
              isOpen={openedAccordions.includes(index)}
              loadData={loadData}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default CryptoList;
