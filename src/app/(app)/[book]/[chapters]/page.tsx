import { Markdown } from '@/components/markdown-loader'
import { TableOfContent } from "markdown-table-of-content";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const  ChapterPage=async({params:paramsPromise})=> {
  const params = await paramsPromise
  const res = await  fetch(`${process.env.API_URL}/chapters/${params.chapters}`, {
    cache: "no-store",
  });
  const data = await res.json()
  // const {data} = useFetchData(`chapters/${chapters}`, `/chapters/${chapters}`)
   
  if (!data) {
    return <p className="text-center mt-10 text-red-500">Gagal memuat data bab.</p>
  }
  return (
    <main className="bg-background mx-auto p-4 grid grid-cols-1 md:grid-cols-4 grid-flow-row-dense  gap-10">
    <Card className='p-0 col-span-3'>
      <CardContent className='p-4 md:px-10'>

      <h1 className='text-2xl text-center md:text-left mb-4 md:mb-20 mt-10 md:text-4xl font-bold '>{data?.title}</h1>
        {/* TOC Mobile */}
      <div className='md:hidden '>
        <Separator className='my-10' />
        <h4 className='font-bold text-xl indent-5'>Daftar Isi</h4>
        {data?.content && (
          <div className='text-white/90'>

          <TableOfContent markdownText={data.content}></TableOfContent>
          </div>
        )}
      </div>
        <Separator className='mb-20'/>

        <div>
          <Markdown content= {data?.content}></Markdown>
        </div>
   
          </CardContent>
        </Card>
      
      {/* Mobile ToC di atas */}
      <div className='hidden md:block md:cols-span-1 relative'>
        
           <Card className='sticky top-0 p-2'>
            <CardHeader>
              <CardTitle className='text-lg text-center'>Daftar Isi</CardTitle>
              <Separator/>
            </CardHeader>
            <CardContent className='pb-8 text-sm px-0'>
              {data?.content && (
            <TableOfContent markdownText={data.content}></TableOfContent>
          )}
            </CardContent>
          </Card>
      </div>
    </main>
  )
}


export default ChapterPage