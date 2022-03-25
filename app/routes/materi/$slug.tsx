import { LoaderFunction, useCatch } from "remix";
import { Link, json, useLoaderData } from "remix";
import type { Category } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = {
  category: Category;
};

export const loader: LoaderFunction = async ({ params }) => {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    throw json(
      { message: "Kategori tidak ditemukan" },
      {
        status: 404,
      }
    );
  }

  const data: LoaderData = {
    category: category,
  };

  return data;
};

export default function CategoryRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <div>
        <Link to={`/materi/`}>
          <button>Kembali</button>
        </Link>

        <h2>{data.category.title}</h2>
        <p>{data.category.desc}</p>

        <Link to={`/materi/edit/${data.category.slug}`}>
          <button>Edit Kategori</button>
        </Link>
      </div>
      <div>
        <h1>Artikel di kategori {data.category.title}</h1>
        <div>
          <Link to={`/materi/${data.category.slug}/artikel/add`}>Buat artikel di kategori ini</Link>
        </div>
      </div>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <>
      <div>{caught.status}</div>
      <div>{caught.data.message}</div>
    </>
  );
}
