import { Markdown } from '@/components/markdown-loader';
import { TableOfContent } from "markdown-table-of-content";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Chapter } from '@/type'; // tipe Chapter
import axios from 'axios';

interface ChapterPageProps {
  params: Promise<{ chapters: string,book:string }>;
}

const ChapterPage = async ({ params }: ChapterPageProps) => {
  const resolvedParams = await params; // tunggu promise selesai
  const url = `${process.env.API_URL}/books/${resolvedParams.book}/${resolvedParams.chapters}`
  const res = await axios.get(`${process.env.API_URL}/books/${resolvedParams.book}/${resolvedParams.chapters}`);


  if (res.status !== 200) {
    return <p className="text-center mt-10 text-red-500">Gagal memuat Materi.</p>;
  }

  const data: Chapter = res.data;

  if (!data) {
    return <p className="text-center mt-10 text-red-500">Data bab kosong.</p>;
  }

  
  return (
    <main className="bg-background mx-auto p-4 grid grid-cols-1 md:grid-cols-4 grid-flow-row-dense gap-10">

      <Card className="p-0 col-span-3">
        <CardContent className="p-4 md:px-10">
          <h1 className="text-2xl text-center md:text-left mb-4  mt-10 md:text-4xl font-bold">
            {data.title}
          </h1>


          {/* TOC Mobile */}
          <div className="md:hidden">
            <Separator className="my-10" />
            <h4 className="font-bold text-xl indent-5">Daftar Isi</h4>
            {data.content && (
              <div className="text-white/90">
                <TableOfContent markdownText={data.content} />
              </div>
            )}
          </div>
          <Separator className="mb-20" />

          <div>
            <Markdown content={data.content} />
          </div>
        </CardContent>
      </Card>

      {/* Desktop TOC */}
      <div className="hidden md:block md:col-span-1 relative">
        <Card className="sticky top-0 p-2">
          <CardHeader>
            <CardTitle className="text-lg text-center">Daftar Isi</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="pb-8 text-sm px-0">
            {data.content && <TableOfContent markdownText={data.content} />}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ChapterPage;
