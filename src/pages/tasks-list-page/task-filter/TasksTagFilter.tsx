import { useGetTagsQuery } from "@/entities/tag/api/tag-api";
import { MUISelect } from "@/shared/components/mui-select/MUISelect";

type TaskTagFilterProps = {
  tagId: string;
  setTagId: (value: string) => void;
};

export const TaskTagFilter = ({ tagId, setTagId }: TaskTagFilterProps) => {
  const { data: tags = [], isLoading } = useGetTagsQuery();

  const items = tags.map(({ id, name }) => ({ id, title: name }));

  return (
    <MUISelect<string, true>
      value={tagId}
      setValue={setTagId}
      items={items}
      selectProps={{ label: "Выберите тег" }}
      formControlProps={{ disabled: isLoading }}
    />
  );
};
