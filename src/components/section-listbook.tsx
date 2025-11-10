import { FocusCards } from "@/components/ui/focus-cards";
import { useFetchData } from "@/hooks/useFetchData";

export default function BookListSection() {
  const {data} = useFetchData('/books','book')

 
  if (!data) return null
  return <FocusCards data={data} />;
}
