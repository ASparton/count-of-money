import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { IconEye, IconEyeOff, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  addCrypto,
  deleteCrypto,
  getLightCryptoList,
  setVisible,
} from "../../services/crypto.api";
import { ICryptoLight } from "../../types/ICrypto";

const AdminCryptos: React.FC = () => {
  const [cryptos, setCryptos] = useState<ICryptoLight[]>([]);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      name: "Ethereum",
      image:
        "https://cdn0.iconfinder.com/data/icons/blockchain-classic/256/Ethereum-512.png",
      api_id: "ETH",
    },

    validate: {
      name: (value: string) => (value ? null : "Name cannot be null"),
      image: (value: string) => (value ? null : "Logo cannot be null"),
      api_id: (value: string) => (value ? null : "Api Id cannot be null"),
    },
  });

  useEffect(() => {
    getCryptos();
  }, []);

  const getCryptos = () => {
    getLightCryptoList().then((response) => {
      setCryptos(response.data);
    });
  };

  const addNewCrypto = (crypto: any) => {
    addCrypto({
      ...crypto,
      logoUrl: crypto.logo_url,
      apiId: crypto.api_id,
    }).then((result) => {
      setCryptos((old) => [...old, result.data]);
      setModalOpened(false);
    });
  };
  const toggleCryptoVisibility = (crypto: ICryptoLight) => {
    setVisible(crypto);
    setCryptos((old) =>
      old.map((c) =>
        c.id === crypto.id ? { ...c, is_visible: !c.is_visible } : c
      )
    );
  };

  const _deleteCrypto = (id: number) => {
    deleteCrypto(id);
    setCryptos((old) => old.filter((crypto) => crypto.id !== id));
  };

  return (
    <div>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Add a crypto"
      >
        <Form
          className="flex flex-col justify-center"
          form={form}
          onSubmit={(values) => addNewCrypto({ ...values, is_visible: true })}
        >
          <Text>Name</Text>
          <TextInput {...form.getInputProps("name")} />
          <Text>Logo url</Text>
          <TextInput {...form.getInputProps("logo_url")} />
          <Text>API id</Text>
          <TextInput {...form.getInputProps("api_id")} />
          <Button className="mt-5" type="submit">
            Add
          </Button>
        </Form>
      </Modal>
      <Title className="text-center mt-5" order={1}>
        Cryptos
      </Title>
      <Stack align="center" className="my-5">
        {cryptos.map((crypto) => {
          console.log("name", crypto.name);

          return (
            <Group key={crypto.id!} w="100%" className="justify-between">
              <Avatar src={crypto.image} w="10%" />
              <Text>{crypto.name}</Text>
              <Group className="gap-3">
                <ActionIcon bg="red" onClick={() => _deleteCrypto(crypto.id!)}>
                  <IconTrash />
                </ActionIcon>
                <ActionIcon onClick={() => toggleCryptoVisibility(crypto)}>
                  {crypto.is_visible ? <IconEye /> : <IconEyeOff />}
                </ActionIcon>
              </Group>
            </Group>
          );
        })}
        <div>
          <Button
            leftSection={<IconPlus />}
            onClick={() => setModalOpened(true)}
          >
            Add a new crypto
          </Button>
        </div>
      </Stack>
    </div>
  );
};

export default AdminCryptos;
