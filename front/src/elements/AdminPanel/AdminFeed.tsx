import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import {
  IconDeviceFloppy,
  IconExternalLink,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addFeed,
  deleteFeed,
  getFeeds,
  updateLatestToExpose,
} from "../../services/feed.api.ts";

const AdminFeed: React.FC = () => {
  const [feeds, setFeeds] = useState<IFeed[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [latestToExpose, setLatestToExpose] = useState(0);

  const form = useForm({
    initialValues: {
      url: "https://cointelegraph.com/rss/tag/monero",
    },

    validate: {
      url: (value: string) => (value ? null : "URL cannot be null"),
    },
  });

  const getNewsFeeds = () => {
    getFeeds().then((response) => {
      setFeeds(response.data);
      setLatestToExpose(
        response.data.length && response.data[0]
          ? response.data[0].min_articles_count ?? 0
          : 0
      );
    });
  };

  const _setLatestToExpose = (amount: number) => {
    setLatestToExpose(amount);
  };

  const addNewFeed = (feed: IFeed) => {
    addFeed(feed).then((result) => {
      setFeeds((old) => [...old, result.data]);
      setModalOpened(false);
      form.reset();
    });
  };

  const deleteNewsFeed = (id: number) => {
    setFeeds((old) => old.filter((feed) => feed.id !== id));
    deleteFeed(id);
  };

  const loadData = () => {
    getNewsFeeds();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Add a news feed"
      >
        <Form
          className="flex flex-col justify-center"
          form={form}
          onSubmit={(values) => addNewFeed(values)}
        >
          <Text>Feed url</Text>
          <TextInput {...form.getInputProps("url")} />
          <Button className="mt-5" type="submit">
            Add
          </Button>
        </Form>
      </Modal>
      <Title className="text-center mt-5" order={1}>
        News feed
      </Title>
      <NumberInput
        label="Number of news"
        className="min-w-min"
        suffix=" news"
        placeholder="Number of news"
        clampBehavior="strict"
        value={latestToExpose}
        min={0}
        max={25}
        onChange={(value) => _setLatestToExpose(parseInt(value.toString()))}
        leftSection={
          <ActionIcon
            onClick={() => updateLatestToExpose(latestToExpose).then(loadData)}
          >
            <IconDeviceFloppy />
          </ActionIcon>
        }
      />
      <Stack align="center" className="my-5">
        {feeds.map((feed, index) => {
          return (
            <Group key={index} w="100%" className="justify-between">
              <Text>{feed.url}</Text>
              <Group className="gap-3">
                <ActionIcon bg="red" onClick={() => deleteNewsFeed(feed.id!)}>
                  <IconTrash />
                </ActionIcon>
                <ActionIcon
                  bg="blue"
                  component={Link}
                  to={feed.url}
                  target="_blank"
                >
                  <IconExternalLink />
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
            Add a new feed
          </Button>
        </div>
      </Stack>
    </div>
  );
};

export default AdminFeed;
