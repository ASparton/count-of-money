import {
  Box,
  Group,
  Modal,
  MultiSelect,
  Switch,
  Table,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconSearch, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import TradeViewChart from "react-crypto-chart";
import { getCryptoList } from "../../services/crypto.api";
import { getLikedCrypto } from "../../services/user.api";
import ECryptoID from "../../types/ECryptoID";
import ICrypto from "../../types/ICrypto";
import CryptoItem from "./CryptoItem";

interface ICryptoListProps {}

const CryptoList: React.FC<ICryptoListProps> = ({}) => {
  const [cryptoModal, setCryptoModal] = useState<ICrypto | undefined>(
    undefined
  );
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
    setCryptoModal(filteredCryptos[index]);
  };

  useEffect(() => {
    setCryptoModal(undefined);
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
    loadData();
  }, []);

  return (
    <Box>
      <Title>Cryptocurrency List</Title>

      <Group className="justify-center">
        {isPrivate && (
          <Switch
            size="lg"
            color="gray.8"
            onLabel={
              <ThemeIcon variant="transparent" c={"gold"}>
                <IconStarFilled />
              </ThemeIcon>
            }
            offLabel={
              <ThemeIcon variant="transparent" c={"gold"}>
                <IconStar />
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

      <Modal
        centered
        opened={cryptoModal !== undefined}
        onClose={() => setCryptoModal(undefined)}
        title={cryptoModal?.name + " chart"}
        styles={{
          content: {
            minWidth: 750,
          },
          body: {
            minHeight: 500,
            padding: 0,
          },
        }}
      >
        <Box className="absolute h-[500px] w-full">
          <TradeViewChart
            pair={cryptoModal?.trigram + "USDT"}
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
      </Modal>

      <Table highlightOnHover withRowBorders={false}>
        <Table.Thead>
          <Table.Tr>
            {isPrivate && <Table.Th></Table.Th>}
            <Table.Th>#</Table.Th>
            <Table.Th>Picture</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Open price</Table.Th>
            <Table.Th>Highest price</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Lowest price</Table.Th>
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
              loadData={loadData}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default CryptoList;
