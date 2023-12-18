import { Container, Grid, Pagination, Title } from "@mantine/core";
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
  const [filteredNews, setFilteredNews] = useState<INews[]>([]);
  const [page, setPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    updateNews();
  }, []);

  const [debounced] = useDebouncedValue(searchKeyWords, 1000);

  useEffect(() => {
    if (debounced && debounced.length) {
      updateNews();
    }
  }, [debounced]);

  useEffect(() => {
    setFilteredNews(
      news.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    );
  }, [page, news]);

  const updateNews = () => {
    getNews(user.isAuth ? searchKeyWords : []).then((res) => {
      if (res.ok) {
        setNews(res.data);
      }
    });
  };

  const renderNews = () => {
    return filteredNews.map((news, index) => (
      <Grid.Col span={3} key={index}>
        <News news={news} />
      </Grid.Col>
    ));
  };

  return (
    <Container className="my-10 flex flex-col justify-center">
      <Title>News</Title>
      <div className="flex my-5 justify-center">
        <SearchBar onChange={setSearchKeyWords} />
      </div>
      <div className="flex my-5 justify-center">
        <Pagination
          total={Math.ceil(news.length / ITEMS_PER_PAGE)}
          radius="xl"
          value={page}
          onChange={setPage}
        />
      </div>
      <Grid className="flex flex-wrap justify-center gap-6 mt-4">
        {renderNews()}
      </Grid>
    </Container>
  );
};

export default NewsList;
