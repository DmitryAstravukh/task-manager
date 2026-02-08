import { baseApi } from "@/shared/api/baseApi.ts";
import type { Tag } from "@/entities/tag/types/tag-types.ts";

export const tagApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTags: build.query<Tag[], void>({
      query: () => "/tags",
      providesTags: (result) =>
        result
          ? [
              { type: "Tag" as const, id: "LIST" },
              ...result.map((t) => ({ type: "Tag" as const, id: t.id })),
            ]
          : [{ type: "Tag" as const, id: "LIST" }],
    }),

    createTag: build.mutation<Tag, Tag>({
      query: (body) => ({
        url: "/tags",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tag", id: "LIST" }],
    }),
  }),
});

export const { useGetTagsQuery, useCreateTagMutation } = tagApi;
