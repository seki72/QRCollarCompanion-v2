export default function Header({ title }: { title: string }) {
  return (
    <header className="fixed left-0 top-0 w-full border-b border-gray-200 bg-white px-4 py-2 shadow sm:left-20 sm:p-6">
      <h1 className="text-xl font-medium leading-tight text-gray-800">{title}</h1>
    </header>
  );
}
