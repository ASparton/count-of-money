import { ActionIcon, Card, Group, Image, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { INews } from "../../types/INews";
import bitcoinImg from "./bitcoin.png";

interface INewsProps {
  news: INews;
}

const News: React.FC<INewsProps> = ({ news }) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="h-full justify-between pt-0"
    >
      <div>
        <Card.Section>
          <Image
            src={news.image_url}
            height={160}
            alt={news.title}
            className={news.image_url === "" ? "object-contain" : ""}
            fallbackSrc={bitcoinImg}
          />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500} lineClamp={4}>
            {news.title}
          </Text>
        </Group>
      </div>

      <Group justify="end">
        <ActionIcon
          component={Link}
          to={news.url}
          target="_blank"
          mt="md"
          size="lg"
          radius={"xl"}
        >
          <IconPlus />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default News;
