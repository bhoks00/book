"use client"
import BookHero from '@/components/book-hero'
import ChapterList from '@/components/chapter-list'
import { useFetchData } from '@/hooks/useFetchData'
import { useParams } from 'next/navigation'

export default function BookPage() {
  const {book} = useParams()
  const {data, isLoading} = useFetchData(`/books/${book}`,`/books/${book}`)
  return (
    <div className='container mx-auto md:max-w-[80vw]'>
      {!isLoading&&(
        <BookHero data={data}/>
      )}
      <section className="max-w-7xl flex flex-col gap-4 mt-12 mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold ">Daftar Materi</h2>
        <div className='mt-10'>
        <ChapterList data={data} />
        </div>
      </section>
    </div>
  )
}
