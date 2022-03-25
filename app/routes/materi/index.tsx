import { Link, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import type { Category } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = {
  categories: Array<Category>;
};

export let loader: LoaderFunction = async () => {
  const data: LoaderData = {
    categories: await db.category.findMany(),
  };

  return data;
};

export default function MateriIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Materi page</h1>
      <Link to={`/artikel/add`}>
        <button>Buat Artikel</button>
      </Link>
      <div>
        <ul>
          {data.categories.map((cat: Category) => (
            <li key={cat.title}>
              <div>
                <Link to={cat.slug}>
                  <h2>{cat.title}</h2>
                </Link>
                <p>{cat.desc}</p>
                <div>{cat.updatedAt}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button>
        <Link to="/materi/add">Tambah Kategori</Link>
      </button>
    </>
  );
}
