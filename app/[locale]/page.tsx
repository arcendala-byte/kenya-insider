export default function LocalePage({ params }: { params: { locale: string } }) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-warmIvory font-body">
      <h1 className="text-4xl font-heading text-forestGreen">
        Welcome to Kenya Insider ({params.locale})
      </h1>
    </section>
  );
}
