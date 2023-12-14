import { Button, Card, Group, Image, Text } from "@mantine/core";
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
			className="w-96 h-full justify-between pt-0"
		>
			<div>
				<Card.Section>
					<Image
						src={news.image_url}
						height={160}
						alt={news.title}
						className={
							news.image_url === "" ? "object-contain" : ""
						}
						fallbackSrc={bitcoinImg}
					/>
				</Card.Section>

				<Group justify="space-between" mt="md" mb="xs">
					<Text fw={500}>{news.title}</Text>
				</Group>

				<Text size="sm" c="dimmed">
					{news.content}
				</Text>
			</div>

			<Group justify="space-between">
				<Text size="sm" c="dimmed">
					{new Date(news.date).toDateString()}
				</Text>
				<Button
					component={Link}
					to={news.url}
					target="_blank"
					variant="light"
					color="blue"
					mt="md"
					radius="md"
				>
					Read
				</Button>
			</Group>
		</Card>
	);
};

export default News;
