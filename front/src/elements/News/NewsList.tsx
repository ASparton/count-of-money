import { Container, Grid, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getNews } from "../../services/news.api";
import { useUser } from "../../stores/User.store";
import { INews } from "../../types/INews";
import News from "./News";
import SearchBar from "./SearchBar";

const NewsList: React.FC = () => {
	const user = useUser();
	const [searchKeyWords, setSearchKeyWords] = useState<string[]>([]);
	const [news, setNews] = useState<INews[]>([]);

	useEffect(() => {
		updateNews();
	}, []);

	const [debounced] = useDebouncedValue(searchKeyWords, 1000);

	useEffect(() => {
		if (debounced && debounced.length) {
			updateNews();
		}
	}, [debounced]);

	const updateNews = () => {
		getNews(user.isAuth ? searchKeyWords : []).then((res) => {
			if (res.ok) {
				setNews(res.data);
			}
		});
	};

	const renderNews = () => {
		return news.map((news, index) => (
      <Grid.Col span={3} key={index}>
        <News news={news} />
      </Grid.Col>
    ));
	};

	return (
    <Container className="my-10">
      <Title>News</Title>
      <div className="flex my-5 justify-center">
        <SearchBar onChange={setSearchKeyWords} />
      </div>
      <Grid className="flex flex-wrap justify-center gap-6">
        {renderNews()}
      </Grid>
    </Container>
  );
};

export default NewsList;
