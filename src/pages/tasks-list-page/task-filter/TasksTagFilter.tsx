import { useGetTagsQuery } from "@/entities/tag/api/tag-api";
import { MUISelect } from "@/shared/components/mui-select/MUISelect";

type TaskTagFilterProps = {
  tagId: string;
  setTagId: (value: string) => void;
  isLoading: boolean;
};

export const TaskTagFilter = ({ tagId, setTagId, isLoading }: TaskTagFilterProps) => {
  const { data: tags = [], isLoading: isTagLoading } = useGetTagsQuery();

  const items = tags.map(({ id, name }) => ({ id, title: name }));

  return (
    <MUISelect<string, true>
      value={tagId}
      setValue={setTagId}
      items={items}
      selectProps={{ label: "Выберите тег" }}
      formControlProps={{ disabled: isLoading || isTagLoading }}
    />
  );
};
