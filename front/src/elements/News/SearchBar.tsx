import { Group, TagsInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface ISearchBarProps {
  onChange: (search: string[]) => void;
  data?: string[];
}

const SearchBar: React.FC<ISearchBarProps> = ({ onChange, data = [] }) => {
  const [value, setValue] = useState<string[]>(data);

  useEffect(() => {
    setValue(data);
  }, [data]);

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <Group>
      <TagsInput
        className="w-full"
        radius="xl"
        size="md"
        placeholder="Search by keywords"
        leftSection={<IconSearch size={14} />}
        data={[]}
        value={value}
        onChange={(e) => setValue(e)}
      />
    </Group>
  );
};

export default SearchBar;
