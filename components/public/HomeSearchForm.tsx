import { searchBlogsAction } from "@/app/actions/homeSearch";

type HomeSearchFormProps = {
  initialQuery: string;
};

export default function HomeSearchForm({ initialQuery }: HomeSearchFormProps) {
  return (
    <form action={searchBlogsAction} className="mt-4 flex max-w-md gap-2">
      <input
        type="text"
        name="q"
        defaultValue={initialQuery}
        placeholder="Search blogs"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white">
        Recherche
      </button>
    </form>
  );
}
